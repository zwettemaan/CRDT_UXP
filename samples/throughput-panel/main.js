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
    document.getElementById("report_out").textContent = text;
}

async function runThroughputTest() {
    const button = document.getElementById("run_button");
    button.disabled = true;
    setStatus("Running...");
    setReport("");

    try {
        const result = await throughputTest.run(crdtuxp);
        const reportText = throughputTest.formatReport(result);
        setReport(reportText);
        setStatus(
            result.error ? "Failed - see report" :
            (! result.daemon.daemonUp) ? "Done - daemon not reachable, direct-access only" :
            "Done"
        );
    }
    catch (err) {
        setStatus("Error: " + err);
    }
    finally {
        button.disabled = false;
    }
}

document.querySelector("#run_button").onclick = () => runThroughputTest();

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
