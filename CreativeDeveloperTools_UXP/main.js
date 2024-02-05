const { entrypoints } = require("uxp");
const { app } = require("indesign");
const cdtuxp = require("./cdtuxp");

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