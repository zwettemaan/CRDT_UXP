const { entrypoints } = require("uxp");

var app;
try {
    app = require("indesign").app;
}
catch (err) {};

try {
    app = require("photoshop").app;
}
catch (err) {};

const crdtuxp = require("./crdtuxp");

const crdtuxp_test = require("./crdtuxp_test");

let devAcct;
try {

/* pluginInstallerDevAccount.js is something like:

// Do not commit this file to git repo
const ISSUER_GUID   = "123456789abcdef98799987645a7eade";
module.exports.ISSUER_GUID = ISSUER_GUID;

const ISSUER_EMAIL  = "someEmail@mail.com";
module.exports.ISSUER_EMAIL = ISSUER_EMAIL;

*/
    devAcct = require("./pluginInstallerDevAccount.js");
}
catch (err) {    
}

async function init() {

    //
    // To embed a license and enable the optional features of CRDT you need to 
    // provide your developer GUID and email.
    //
    // These can be obtained by registering for a Developer account in PluginInstaller. 
    // Once you have a developer account, you can add your GUID and email here, 
    // and enable the optional features in CRDT_UXP.
    //
    // Developer/Publisher accounts are free for small software companies. More info: dev@rorohiko.com
    //

    var initContext = {};
    if (devAcct) {
        initContext.ISSUER_GUID = devAcct.ISSUER_GUID;
        initContext.ISSUER_EMAIL = devAcct.ISSUER_EMAIL;
    }

    crdtuxp.init(initContext);
}

async function initUI() {

    document.getElementById("machineGUID_out").textContent = await crdtuxp.machineGUID();

}

// Set to false in production code
const RUN_CRDT_UXP_TESTS = true;

entrypoints.setup({
    panels: {
        showPanel: {
            show({node} = {}) {}
        }
    }
});

document.querySelector("#evalTQL_in").oninput=()           => evalTQLDemo();
document.querySelector("#dQ_in").oninput=()                => dQDemo();
document.querySelector("#base64encode_in").oninput=()      => base64encodeDemo();
document.querySelector("#base64decode_in").oninput=()      => base64decodeDemo();
document.querySelector("#copybase64encoded").onclick=()    => copyBase64Encoded();
document.querySelector("#copyencrypted").onclick=()        => copyEncrypted();
document.querySelector("#encrypt_plainText_in").oninput=() => encryptDemo();
document.querySelector("#encrypt_key_in").oninput=()       => encryptDemo();
document.querySelector("#decrypt_encrypted_in").oninput=() => decryptDemo();
document.querySelector("#decrypt_key_in").oninput=()       => decryptDemo();

async function base64encodeDemo() {

    var encoded = await crdtuxp.base64encode(document.getElementById("base64encode_in").value)
    document.getElementById("base64encode_out").textContent = encoded;

}

async function base64decodeDemo() {

    var plainText = await crdtuxp.base64decode(document.getElementById("base64decode_in").value)
    document.getElementById("base64decode_out").textContent = plainText;

}

async function copyBase64Encoded() {

    document.getElementById("base64decode_in").value = document.getElementById("base64encode_out").textContent;
    await base64decodeDemo();

}

async function copyEncrypted() {

    document.getElementById("decrypt_encrypted_in").value = document.getElementById("encrypt_out").textContent;
    document.getElementById("decrypt_key_in").value = document.getElementById("encrypt_key_in").value;
    await decryptDemo();

}

async function decryptDemo() {

    var plainText = 
        await crdtuxp.decrypt(
            document.getElementById("decrypt_encrypted_in").value,
            document.getElementById("decrypt_key_in").value);

    document.getElementById("decrypt_out").textContent = plainText;

}

async function evalTQLDemo() {

    var result = "APID ToolAssistant not installed";

    var uxpContext = crdtuxp.getUXPContext();
    if (uxpContext.hasAPIDToolAssistant) {
        result = uxpContext.app.evalTQL(document.getElementById("evalTQL_in").value);
    }

    document.getElementById("evalTQL_out").textContent = result;
}

async function dQDemo() {

    var quotedText = 
        crdtuxp.dQ(
            document.getElementById("dQ_in").value);

    document.getElementById("dQ_out").textContent = quotedText;
}

async function encryptDemo() {

    var encrypted = 
        await crdtuxp.encrypt(
            document.getElementById("encrypt_plainText_in").value,
            document.getElementById("encrypt_key_in").value);

    document.getElementById("encrypt_out").textContent = encrypted;

}

setTimeout(

    async function() {
        try {

            await init();

            if (RUN_CRDT_UXP_TESTS) {
                await crdtuxp_test.run();
            }

            await initUI();

            crdtuxp.logNote('CRDT sample initialized');
        }
        catch (err) {
            console.log("CRDT sample throws " + err);
        }
    },
    1000
);

