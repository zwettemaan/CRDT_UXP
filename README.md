# Creative Developer Tools for UXP

This works by way of a daemon. Launching the daemon will start an HTTPS server on https://localhost.tgrg.net

This address resolves to 127.0.0.1

To start the daemon, you can run the License Manager, which will automatically start the daemon and leave it running even after you quit License Manager, until the next restart of your computer.

Alternatively, run the script `startDaemon.command` (Mac - script is double-clickable) or `startDaemon.bat` (Windows).

Once the daemon is running, you can call the entry points in the module 'cdtuxp.js' from your UXP Plugin or UXPScript.

