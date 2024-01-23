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
    const colText = col.staticTexts.add();
    colText.staticLabel = "MachineGUID =  " + await tightener.machineGUID();

    dialog.canCancel = false;
    dialog.show();
    dialog.destroy();      
  }
  catch (e) {
    reT = e;
  }

    return;
}