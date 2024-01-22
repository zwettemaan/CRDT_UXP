# UXPTightener

Integrating Tightener into UXP

This works by way of a daemon. Launching the daemon will start an HTTPS server on https://localhost.tgrg.net

This address resolves to 127.0.0.1

To start the daemon, run the script `startDaemon.command` (Mac - script is double-clickable), `startDaemon.sh` (Linux), or `startDaemon.bat` (Windows).

Once the daemon is running, you can call the entry points in the module 'tightener.js' from your UXP Plugin or UXPScript.

