const { entrypoints } = require("uxp");
const { app } = require("indesign");

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

async function foo() {
   var retVal = "ERR";
    try {
        const init = {
          method: "POST",
          body: "machineGUID()"
        }
        const response = await fetch("https://localhost.tgrg.net:18888", init);
        retVal = await response.text();

    } catch (e) {
        console.error(e);
    }
    return retVal;
}

async function showAlert() {
    const dialog = app.dialogs.add();
    const col = dialog.dialogColumns.add();
    const colText = col.staticTexts.add();
    colText.staticLabel = "Congratulations! " + await foo();

    dialog.canCancel = false;
    dialog.show();
    dialog.destroy();
    return;
}