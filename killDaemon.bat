@ECHO off

ECHO.
ECHO.
ECHO ---------
ECHO.
ECHO Killing daemon
ECHO.
ECHO ---------
ECHO.
ECHO.

POWERSHELL -Command "Get-WmiObject Win32_Process -Filter \"Name = 'tightener.exe'\" | Where-Object { $_.CommandLine -like '* -N daemon *' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
