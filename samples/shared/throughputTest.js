// Copyright (c) 2024–present Rorohiko Ltd. All rights reserved.
// SPDX-License-Identifier: Elastic-2.0
// https://github.com/zwettemaan/CRDT_UXP

//
// File throughput benchmark - host-agnostic core. Does not require() or
// initialize crdtuxp itself, and has no bootstrap of its own: the caller
// (a standalone UXPScript, a UXP plugin panel, anything else) already has a
// ready `crdtuxp` and passes it in. This is what makes the same test logic
// runnable from either kind of host - see ../throughput-script/ (.psjs) and
// ../throughput-panel/ (a Photoshop panel) for the two current callers.
//
// Compares three file I/O paths, all writing+reading back the SAME payload
// sizes so the numbers are comparable:
//
//   1. direct       - crdtuxp's local-disk path (hasDirectFileAccess), no
//                      daemon involved at all.
//   2. daemon / old  - the daemon, with the escaped-string TQL transport
//                      forced on - what every daemon version, old or new,
//                      supports.
//   3. daemon / auto - the daemon, auto-negotiated - whatever the real
//                      running daemon actually supports. On an upgraded
//                      daemon this is the raw-byte setBinaryVar/getBinaryVar
//                      transport; against an old one it quietly falls back
//                      to the same path as #2, and says so in the report.
//
// A standalone UXPScript is not a UXP plugin, so it has no manifest granting
// network access - crdtuxp.getUXPContext() auto-detects hasNetworkAccess =
// false for that execution mode. That flag only reflects what the platform
// *told* crdtuxp; crdtuxp.testNetworkAccess() empirically checks whether the
// daemon is still reachable anyway (forcing the flag on and trying a real
// round trip) before attempting #2/#3. If the daemon isn't reachable at all,
// only #1 runs and the result says why.
//

if (! module.exports) {
    module.exports = {};
}

// Payload sizes to benchmark, in bytes.
const DEFAULT_TEST_SIZES = [4 * 1024, 64 * 1024, 512 * 1024, 2 * 1024 * 1024, 8 * 1024 * 1024 ];
module.exports.DEFAULT_TEST_SIZES = DEFAULT_TEST_SIZES;

// Deterministic pseudo-random fill (FNV-1a-ish, not crypto - just needs to
// not trivially compress/dedupe). Guaranteed to include NUL bytes somewhere
// in a large-enough buffer, which is exactly what the daemon's own raw-var
// capability probe deliberately tests for - that's the byte value the OLD
// escaped-string protocol has to work hardest to carry correctly.
function makePayload(size) {
    const bytes = new Uint8Array(size);
    let x = 2166136261;
    for (let i = 0; i < size; i++) {
        x = (x ^ i) >>> 0;
        x = Math.imul(x, 16777619) >>> 0;
        bytes[i] = x & 0xFF;
    }
    return bytes;
}
module.exports.makePayload = makePayload;

function checksum(bytes) {
    let sum = 0;
    for (let i = 0; i < bytes.length; i++) {
        sum = (sum + bytes[i]) >>> 0;
    }
    return sum;
}
module.exports.checksum = checksum;

function bytesEqual(a, b) {
    if (! a || ! b || a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
module.exports.bytesEqual = bytesEqual;

function formatThroughput(byteCount, ms) {
    if (! (ms > 0)) {
        return "n/a";
    }
    const mbPerSec = (byteCount / (1024 * 1024)) / (ms / 1000);
    return mbPerSec.toFixed(2) + " MB/s";
}
module.exports.formatThroughput = formatThroughput;

// One write + read-back cycle through whatever protocol crdtuxp.fileWrite() /
// fileRead() currently resolve to - governed entirely by the context flags
// the caller has already set (see run(), below). Returns
// { size, writeMs, readMs, ok } or { size, error }.
async function benchmarkOne(crdtuxp, path, payload) {
    let result = { size: payload.length };

    do {
        const writeHandle = await crdtuxp.fileOpen(path, "w");
        if (writeHandle === undefined) {
            result.error = "fileOpen(w) failed";
            break;
        }

        const writeStart = Date.now();
        const writeOk = await crdtuxp.fileWrite(writeHandle, payload);
        result.writeMs = Date.now() - writeStart;
        await crdtuxp.fileClose(writeHandle);

        if (! writeOk) {
            result.error = "fileWrite failed";
            break;
        }

        const readHandle = await crdtuxp.fileOpen(path, "r");
        if (readHandle === undefined) {
            result.error = "fileOpen(r) failed";
            break;
        }

        const readStart = Date.now();
        const readBack = await crdtuxp.fileRead(readHandle, { isBinary: true });
        result.readMs = Date.now() - readStart;
        await crdtuxp.fileClose(readHandle);

        if (! readBack) {
            result.error = "fileRead failed";
            break;
        }

        result.ok = bytesEqual(readBack, payload);
        if (! result.ok) {
            result.readChecksum = checksum(readBack);
            result.writeChecksum = checksum(payload);
        }
    }
    while (false);

    return result;
}
module.exports.benchmarkOne = benchmarkOne;

// Runs benchmarkOne() for every size in `sizes` (default DEFAULT_TEST_SIZES),
// best-effort deletes each scratch file afterwards. Returns one result row
// per size.
async function benchmarkSizes(crdtuxp, pathPrefix, sizes) {
    sizes = sizes || DEFAULT_TEST_SIZES;
    const rows = [];
    for (const size of sizes) {
        const path = pathPrefix + size + ".bin";
        const payload = makePayload(size);
        rows.push(await benchmarkOne(crdtuxp, path, payload));
        try {
            await crdtuxp.fileDelete(path);
        }
        catch (err) {
            // best-effort cleanup only - stale scratch files are harmless
        }
    }
    return rows;
}
module.exports.benchmarkSizes = benchmarkSizes;

function formatRows(label, rows) {
    const lines = [label + ":"];
    for (const row of rows) {
        if (row.error) {
            lines.push("  " + row.size + " bytes: ERROR - " + row.error);
            continue;
        }
        let line =
            "  " + row.size + " bytes: " +
            "write " + row.writeMs + "ms (" + formatThroughput(row.size, row.writeMs) + "), " +
            "read " + row.readMs + "ms (" + formatThroughput(row.size, row.readMs) + ")";
        if (! row.ok) {
            line += "  ** CONTENT MISMATCH ** (checksum wrote " + row.writeChecksum +
                ", read back " + row.readChecksum + ")";
        }
        lines.push(line);
    }
    return lines.join("\n");
}
module.exports.formatRows = formatRows;

// High-level orchestration - runs all three comparison paths and returns a
// plain, JSON-serializable result object (no formatting decisions baked in,
// so a caller with a nicer UI than a text report - e.g. the panel - can
// render the rows itself instead of going through formatReport()).
//
// @param {object} crdtuxp - an already-init()ed crdtuxp module reference.
// @param {object=} options - { sizes: number[], scratchDir: string }.
//        scratchDir defaults to the current user's home directory.
// @returns {Promise<object>} see the shape built up below.
async function run(crdtuxp, options) {
    options = options || {};
    const sizes = options.sizes || DEFAULT_TEST_SIZES;

    const result = {
        timestamp: new Date().toString(),
        scratchDir: undefined,
        direct: undefined,
        daemon: undefined
    };

    const uxpContext = crdtuxp.getUXPContext();
    const context = crdtuxp.getContext();

    let scratchDir = options.scratchDir;
    if (! scratchDir) {
        if (! uxpContext || ! uxpContext.os || typeof uxpContext.os.homedir !== "function") {
            result.error = "Could not resolve a scratch directory - no direct OS access in this execution context.";
            return result;
        }
        scratchDir = uxpContext.os.homedir();
    }
    result.scratchDir = scratchDir;

    const pathPrefix = scratchDir + crdtuxp.path.SEPARATOR + "crdtuxp_throughput_test_";

    // --- 1. direct local disk, no daemon ---
    result.direct = await benchmarkSizes(crdtuxp, pathPrefix + "direct_", sizes);

    // --- daemon reachability check, then #2 / #3 ---
    const savedForceUseDaemon = context.IS_FORCE_USE_DAEMON;
    const savedForceFileBasedAPI = context.IS_FORCE_DAEMON_FILE_BASED_API;
    const savedHasNetworkAccess = uxpContext.hasNetworkAccess;
    const savedIsOldDaemon = uxpContext.isOldDaemon;

    context.IS_FORCE_USE_DAEMON = true;
    context.IS_FORCE_DAEMON_FILE_BASED_API = false;

    // testNetworkAccess() forces hasNetworkAccess on internally and tries a
    // real round trip - it's the empirical answer, not just the platform's
    // (generally false, for a bare UXPScript) auto-detected flag.
    const networkReachable = !! (await crdtuxp.testNetworkAccess());
    if (networkReachable) {
        uxpContext.hasNetworkAccess = true;
    }

    const daemonUp = networkReachable && !! (await crdtuxp.isDaemonResponsive());

    result.daemon = {
        networkReachable: networkReachable,
        daemonUp: daemonUp,
        old: null,
        auto: null,
        autoUsedOldProtocol: null
    };

    if (daemonUp) {
        // --- 2. daemon, forced OLD (escaped-string) protocol - what every
        // daemon version, old or new, supports ---
        uxpContext.isOldDaemon = true;
        result.daemon.old = await benchmarkSizes(crdtuxp, pathPrefix + "daemon_old_", sizes);

        // --- 3. daemon, auto-negotiated - the real result for whatever
        // daemon is actually running right now ---
        uxpContext.isOldDaemon = undefined;
        result.daemon.auto = await benchmarkSizes(crdtuxp, pathPrefix + "daemon_auto_", sizes);
        result.daemon.autoUsedOldProtocol = !! uxpContext.isOldDaemon;
    }

    context.IS_FORCE_USE_DAEMON = savedForceUseDaemon;
    context.IS_FORCE_DAEMON_FILE_BASED_API = savedForceFileBasedAPI;
    uxpContext.hasNetworkAccess = savedHasNetworkAccess;
    uxpContext.isOldDaemon = savedIsOldDaemon;

    return result;
}
module.exports.run = run;

// Turns a run() result into a plain-text report - shared by any caller that
// just wants readable text (a .psjs console.log, a plugin's simple output
// pane). A caller building richer UI can walk `result.direct` /
// `result.daemon.old` / `result.daemon.auto` directly instead.
function formatReport(result) {
    const header = "crdtuxp file throughput test - " + result.timestamp;

    if (result.error) {
        return header + "\n\n" + result.error;
    }

    const report = [header, "Scratch directory: " + result.scratchDir];
    report.push(formatRows("Direct file access (no daemon)", result.direct));

    if (! result.daemon.daemonUp) {
        report.push(
            "Daemon not reachable from this execution context (network access: " +
            (result.daemon.networkReachable ? "yes, but daemon not responding" : "no") +
            ") - skipping the daemon benchmarks below."
        );
    }
    else {
        report.push(formatRows("Daemon - old (escaped-string) protocol, forced", result.daemon.old));
        report.push(
            formatRows(
                "Daemon - auto-negotiated (this daemon supports " +
                (result.daemon.autoUsedOldProtocol ? "the OLD protocol only - consider upgrading it" : "the NEW raw-byte protocol") +
                ")",
                result.daemon.auto
            )
        );
    }

    return report.join("\n\n");
}
module.exports.formatReport = formatReport;
