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

/*
async function showAlert() {
  try {
    const dialog = app.dialogs.add();
    const col = dialog.dialogColumns.add();

    var input = "Hello world";
    var password = "password";
    var encrypted = await cdtuxp.encrypt(input, password);
    const colText1 = col.staticTexts.add();
    colText1.staticLabel = "Encrypted =  " + encrypted;

    var decrypted = await cdtuxp.decrypt(encrypted, password);
    const colText2 = col.staticTexts.add();
    colText2.staticLabel = "Decrypted =  " + decrypted;

    var dirExists = await cdtuxp.dirExists("/Users/kris/Desktop");
    const colText3 = col.staticTexts.add();
    colText3.staticLabel = "/Users/kris/Desktop exists =  " + dirExists;

    var writeFileHandle = await cdtuxp.fileOpen("/Users/kris/Desktop/t.txt", "w");
    await cdtuxp.fileWrite(writeFileHandle, "Hello World");
    await cdtuxp.fileClose(writeFileHandle)

    var readFileHandle = await cdtuxp.fileOpen("/Users/kris/Desktop/t.txt", "r");
    var fileContent = await cdtuxp.fileRead(readFileHandle);
    await cdtuxp.fileClose(readFileHandle)
    const colText4 = col.staticTexts.add();
    colText4.staticLabel = "file read =  " + fileContent;

    var binaryData = [0x00, 0x01, 0xFF, 0x66, 0x65, 0x72];
    var writeBinaryFileHandle = await cdtuxp.fileOpen("/Users/kris/Desktop/b.bin", "w");
    await cdtuxp.fileWrite(writeBinaryFileHandle, binaryData);
    await cdtuxp.fileClose(writeBinaryFileHandle)

    var readBinaryFileHandle = await cdtuxp.fileOpen("/Users/kris/Desktop/b.bin");
    var readBinaryData = await cdtuxp.fileRead(readBinaryFileHandle, true);
    await cdtuxp.fileClose(readBinaryFileHandle)

    dialog.canCancel = false;
    dialog.show();
    dialog.destroy();      
  }
  catch (e) {
    reT = e;
  }

    return;
}
*/