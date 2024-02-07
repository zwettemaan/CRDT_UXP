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

const cdtuxp = require("./cdtuxp");

entrypoints.setup({
  panels: {
    showPanel: {
      show({node} = {}) {}
    }
  }
});

oninput="base64encodeDemo();"

document.querySelector("#base64encode_in").oninput=() => base64encodeDemo();
document.querySelector("#base64decode_in").oninput=() => base64decodeDemo();
document.querySelector("#encrypt_plainText_in").oninput=() => encryptDemo();
document.querySelector("#encrypt_key_in").oninput=() => encryptDemo();
document.querySelector("#decrypt_encrypted_in").oninput=() => decryptDemo();
document.querySelector("#decrypt_key_in").oninput=() => decryptDemo();

async function base64encodeDemo() {

  var encoded = await cdtuxp.base64encode(document.getElementById("base64encode_in").value)
  document.getElementById("base64encode_out").textContent = encoded;
  document.getElementById("base64decode_in").value = encoded;

}

async function base64decodeDemo() {

  var plainText = await cdtuxp.base64decode(document.getElementById("base64decode_in").value)
  document.getElementById("base64decode_out").textContent = plainText;

}

async function encryptDemo() {

  var encrypted = 
    await cdtuxp.encrypt(
      document.getElementById("encrypt_plainText_in").value,
      document.getElementById("encrypt_key_in").value);

  document.getElementById("encrypt_out").textContent = encrypted;
  document.getElementById("decrypt_encrypted_in").value = encrypted;

}

async function decryptDemo() {

  var plainText = 
    await cdtuxp.decrypt(
      document.getElementById("decrypt_encrypted_in").value,
      document.getElementById("decrypt_key_in").value);

  document.getElementById("decrypt_out").textContent = plainText;

}
