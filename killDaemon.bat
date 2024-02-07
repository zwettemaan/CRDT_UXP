@ECHO off

powershell -Command "Get-WmiObject Win32_Process -Filter \"Name = 'tightener.exe'\" | Where-Object { $_.CommandLine -like '* -N daemon *' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
