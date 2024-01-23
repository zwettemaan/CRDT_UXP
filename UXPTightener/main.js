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
    var decrypted = await tightener.decrypt(encrypted, password);
    const colText1 = col.staticTexts.add();
    colText1.staticLabel = "Encrypted =  " + encrypted;

    const colText2 = col.staticTexts.add();
    colText2.staticLabel = "Decrypted =  " + decrypted;

    dialog.canCancel = false;
    dialog.show();
    dialog.destroy();      
  }
  catch (e) {
    reT = e;
  }

    return;
}