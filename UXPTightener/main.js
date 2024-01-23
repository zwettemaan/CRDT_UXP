const { entrypoints } = require("uxp");
const { app } = require("indesign");
const tightener = require("./tightener");

entrypoints.setup({
  commands: {
    showAlert: () => showAlert()
  },
  panels: {
    showPanel: {
      show({node} = {}) {}
    }
  }
});

async function showAlert() {
  try {
    const dialog = app.dialogs.add();
    const col = dialog.dialogColumns.add();

    var input = "Hello world";
    var password = "password";
    var encrypted = await tightener.encrypt(input, password);
    const colText1 = col.staticTexts.add();
    colText1.staticLabel = "Encrypted =  " + encrypted;

    var decrypted = await tightener.decrypt(encrypted, password);
    const colText2 = col.staticTexts.add();
    colText2.staticLabel = "Decrypted =  " + decrypted;

    var dirExists = await tightener.dirExists("/Users/kris/Desktop");
    const colText3 = col.staticTexts.add();
    colText3.staticLabel = "/Users/kris/Desktop exists =  " + dirExists;

    var writeFileHandle = await tightener.fileOpen("/Users/kris/Desktop/t.txt", "w");
    await tightener.fileWrite(writeFileHandle, "Hello World");
    await tightener.fileClose(writeFileHandle)

    var readFileHandle = await tightener.fileOpen("/Users/kris/Desktop/t.txt", "r");
    var fileContent = await tightener.fileRead(readFileHandle);
    await tightener.fileClose(readFileHandle)
    const colText4 = col.staticTexts.add();
    colText4.staticLabel = "file read =  " + fileContent;

    var binaryData = [0x00, 0x01, 0xFF, 0x66, 0x65, 0x72];
    var writeBinaryFileHandle = await tightener.fileOpen("/Users/kris/Desktop/b.bin", "w");
    await tightener.fileWrite(writeBinaryFileHandle, binaryData);
    await tightener.fileClose(writeBinaryFileHandle)

    var readBinaryFileHandle = await tightener.fileOpen("/Users/kris/Desktop/b.bin");
    var readBinaryData = await tightener.fileRead(readBinaryFileHandle, true);
    await tightener.fileClose(readBinaryFileHandle)

    dialog.canCancel = false;
    dialog.show();
    dialog.destroy();      
  }
  catch (e) {
    reT = e;
  }

    return;
}