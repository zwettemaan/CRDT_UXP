// Copyright (c) 2024–present Rorohiko Ltd. All rights reserved.
// SPDX-License-Identifier: Elastic-2.0
// https://github.com/zwettemaan/CRDT_UXP

//
// evalTQL() round-trip test - host-agnostic core, same shape as
// ../shared/throughputTest.js: takes an already-init()ed `crdtuxp` and does
// NOT force any protocol - whatever crdtuxp.evalTQL() auto-negotiates for
// the real execution context is exactly what gets exercised.
//
// The case this is built to catch: a standalone UXPScript (.psjs/.idjs, run
// via File > Scripts or a Scripts panel double-click) has
// hasDirectFileAccess = true but hasNetworkAccess = false - no manifest, no
// network permission. crdtuxp.js's evalTQL() already auto-falls-back to the
// daemon's file-drop transport (DAEMON_LISTEN_LOCAL_FILE - request/response
// JSON files polled from ~/Library/Application Support/net.tightener/
// Licensing/EvalTQL/, or the Windows equivalent) whenever
// ! uxpContext.hasNetworkAccess. This sample is the first thing that calls
// it unforced, from that exact context, against a real running daemon.
//
// Requires PluginInstaller running with its daemon enabled (default: yes -
// launched with -m 3 = DAEMON_LISTEN_HTTPS | DAEMON_LISTEN_LOCAL_FILE, so
// the file-drop side is already being polled with no extra setup).
//

if (! module.exports) {
    module.exports = {};
}

async function run(crdtuxp) {
    const uxpContext = crdtuxp.getUXPContext();
    const context = crdtuxp.getContext();

    const result = {
        timestamp: new Date().toString(),
        hasNetworkAccess: !! uxpContext.hasNetworkAccess,
        hasDirectFileAccess: !! uxpContext.hasDirectFileAccess,
        pathEvalTQL: context.PATH_EVAL_TQL,
        expectedTransport: uxpContext.hasNetworkAccess ? "HTTPS" : "local file (DAEMON_LISTEN_LOCAL_FILE)"
    };

    // isDaemonResponsive() is just evalTQL("'OK'") under the hood - already
    // in crdtuxp.js, unforced, so it takes whichever transport this context
    // auto-negotiates.
    const pingStart = Date.now();
    result.daemonResponsive = !! (await crdtuxp.isDaemonResponsive());
    result.pingMs = Date.now() - pingStart;

    if (result.daemonResponsive) {
        const evalStart = Date.now();
        const response = await crdtuxp.evalTQL("6 * 7");
        result.evalMs = Date.now() - evalStart;
        result.evalResponse = response ? response.text : undefined;
        result.evalOk = result.evalResponse == "42";
    }

    return result;
}
module.exports.run = run;

// Turns a run() result into a plain-text report - shared by any caller that
// just wants readable text (a .psjs console.log, a plugin's simple output
// pane).
function formatReport(result) {
    const lines = [
        "crdtuxp evalTQL round-trip test - " + result.timestamp,
        "hasNetworkAccess: " + result.hasNetworkAccess,
        "hasDirectFileAccess: " + result.hasDirectFileAccess,
        "PATH_EVAL_TQL: " + result.pathEvalTQL,
        "expected transport: " + result.expectedTransport,
        "daemon responsive: " + result.daemonResponsive + " (" + result.pingMs + "ms)"
    ];

    if (! result.daemonResponsive) {
        lines.push("");
        lines.push(
            "Daemon did not respond within the timeout - is PluginInstaller " +
            "running with the daemon enabled? On the local-file transport this " +
            "also means: check " + result.pathEvalTQL + " exists and is " +
            "writable, and that the daemon process is actually polling it " +
            "(DAEMON_LISTEN_LOCAL_FILE bit set - default)."
        );
    }
    else {
        lines.push(
            "evalTQL(\"6 * 7\") -> " + result.evalResponse +
            " (" + result.evalMs + "ms) " +
            (result.evalOk ? "OK" : "** MISMATCH **")
        );
    }

    return lines.join("\n");
}
module.exports.formatReport = formatReport;
