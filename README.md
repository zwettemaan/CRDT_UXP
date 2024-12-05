# Creative Developer Tools for UXP

## What it does

Creative Developer Tools is a growing suite of tools aimed at script and plug-in developers
for the Adobe Creative Cloud eco-system.

Currently, it is at an beta stage: the feature set is frozen, and new features requests are 
added to a 'to do' list.

This is the UXP version. It enhances the UXP/UXPScript environments in
Adobe® Photoshop® and Adobe® InDesign.

Some more information on the feature set:

https://zwettemaan.github.io/CRDT_UXP/

## PluginInstaller

Before you can do anything you first need to download and install the _PluginInstaller_ app.

The _PluginInstaller_ is can be downloaded from 

https://store.tgrg.net

You may relocate it to a convenient location (e.g., `/Applications` or `C:\Program Files`).

After downloading, and each time you move the _PluginInstaller_ application to a different location
on your computer, you need to launch the app once, so it can reconfigure itself.

The _PluginInstaller_ folder on Windows contains a lot of icons, and you'll need to scroll around 
a bit to see `PluginInstaller.exe`

## How it works

This works by way of a daemon. 

Before you can start the daemon you need to have installed _PluginInstaller_ and you need a registered developer account in the _PluginInstaller_. 

The _PluginInstaller_ preferences screen has a checkbox to launch the daemon: make sure this 
checkbox is checked. If you run the demo and nothing seems to work, this is the first thing you
should check.

Launching the daemon will start an HTTPS server on https://localhost.tgrg.net. 
This DNS name resolves to `127.0.0.1`.

More info on _CRDT_:

https://www.rorohiko.com/crdt

## Demo

Make sure you've run the _PluginInstaller_ from its current location.

Make sure you've created and registered a developer account.

Start the Adobe UXP Developer Tool

Add a plugin. You then need a `manifest.json`: there is a `manifest.json` in the 
`CreativeDeveloperTools_UXP` folder.

You will see two apps. These are demo-apps which show how the _CRDT_UXP_ can be used. There is an 
app for Photoshop, and another for InDesign.

Load either app into its host application - you should see a rough panel come up that calculates
some data by way of the _CRDT_ functions.

Note that the `machineGUID` will probably show `NOT_ACTIVATED`: access to the machineGUID is a pay-for feature.

## Installing Creative Developer Tools for UXP

Copy the _CreativeDeveloperTools_UXP_ subfolder to reside in your project folder. 

Consult the file `crdtuxp_test.js` for sample code. Check out the `run` method - this is where
you need to call `crdtuxp.setIssuer()` in order to enable CRDT.
