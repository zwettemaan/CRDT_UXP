// Copyright (c) 2024–present Rorohiko Ltd. All rights reserved.
// SPDX-License-Identifier: Elastic-2.0
// https://github.com/zwettemaan/CRDT_UXP

//
// Photoshop panel version of the file throughput test. Runs the exact same
// benchmark as ../throughput-script/throughput_test.psjs - both call into
// ../shared/throughputTest.js, the host-agnostic core. `crdtuxp.js` and
// `throughputTest.js` here are local symlinks (see this folder's listing) -
// a packaged UXP plugin cannot require() outside its own folder, so the
// shared module and the library are linked in rather than referenced with a
// `../../` path.
//

const { entrypoints } = require("uxp");

const crdtuxp = require("./crdtuxp.js");
const throughputTest = require("./throughputTest.js");

entrypoints.setup({
    panels: {
        showPanel: {
            show({ node } = {}) {}
        }
    }
});

async function init() {
    crdtuxp.init();
}

function setStatus(text) {
    document.getElementById("status").textContent = text;
}

function setReport(text) {
    document.getElementById("report_out").value = text;
}

function setReportPath(text) {
    document.getElementById("report_path").textContent = text;
}

// The panel's own copy affordances (select+Cmd/Ctrl-C on the textarea, or
// the Copy Report button below) are not reliably available in every UXP
// host/panel context - so the full report always also goes to two places
// that ARE reliably copyable: the UDT devtools console (console.log - right
// click, "Copy" there always works), and a plain text file on disk.
async function saveReportToFile(reportText) {
    let savedPath;

    try {
        const uxpContext = crdtuxp.getUXPContext();
        const dir =
            (uxpContext && uxpContext.os && typeof uxpContext.os.homedir === "function") ?
                uxpContext.os.homedir() :
                await crdtuxp.getDir(crdtuxp.DESKTOP_DIR);

        const path = dir + crdtuxp.path.SEPARATOR + "crdtuxp_throughput_report.txt";
        await crdtuxp.fileDelete(path);

        const writeHandle = await crdtuxp.fileOpen(path, "w");
        if (writeHandle !== undefined) {
            await crdtuxp.fileWrite(writeHandle, reportText);
            await crdtuxp.fileClose(writeHandle);
            savedPath = path;
        }
    }
    catch (err) {
        console.log("saveReportToFile throws " + err);
    }

    return savedPath;
}

async function copyReportToClipboard() {
    const textarea = document.getElementById("report_out");
    let copied = false;

    // UXP's webview has no document.execCommand() - navigator.clipboard is
    // the only path, and it needs the "clipboard" requiredPermissions entry
    // in manifest.json (manifest version 5) or it throws rather than no-ops.
    try {
        await navigator.clipboard.writeText(textarea.value);
        copied = true;
    }
    catch (err) {
        console.log("navigator.clipboard.writeText throws " + err);
    }

    setStatus(copied ? "Report copied to clipboard" : "Could not copy - report is also in the console log and the saved file");
}

async function runThroughputTest() {
    const runButton = document.getElementById("run_button");
    const copyButton = document.getElementById("copy_button");
    runButton.disabled = true;
    copyButton.disabled = true;
    setStatus("Running...");
    setReport("");
    setReportPath("");

    try {
        const result = await throughputTest.run(crdtuxp);
        const reportText = throughputTest.formatReport(result);
        setReport(reportText);

        // Always dump the full report to the console too - copyable from
        // there even when the panel's own copy affordances don't work.
        console.log(reportText);

        const savedPath = await saveReportToFile(reportText);
        if (savedPath) {
            setReportPath("Report saved to: " + savedPath);
        }

        setStatus(
            result.error ? "Failed - see report" :
            (! result.daemon.daemonUp) ? "Done - daemon not reachable, direct-access only" :
            "Done"
        );
        copyButton.disabled = false;
    }
    catch (err) {
        setStatus("Error: " + err);
    }
    finally {
        runButton.disabled = false;
    }
}

document.querySelector("#run_button").onclick = () => runThroughputTest();
document.querySelector("#copy_button").onclick = () => copyReportToClipboard();

setTimeout(
    async function () {
        try {
            await init();
            crdtuxp.logNote("throughput test panel initialized");
        }
        catch (err) {
            console.log("throughput test panel init throws " + err);
        }
    },
    1000
);
