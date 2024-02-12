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

entrypoints.setup({
  panels: {
    showPanel: {
      show({node} = {}) {}
    }
  }
});

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

async function encryptDemo() {

  var encrypted = 
    await crdtuxp.encrypt(
      document.getElementById("encrypt_plainText_in").value,
      document.getElementById("encrypt_key_in").value);

  document.getElementById("encrypt_out").textContent = encrypted;

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

