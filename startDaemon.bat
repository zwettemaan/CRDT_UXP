@ECHO off

SETLOCAL EnableDelayedExpansion

SET PLUGIN_INSTALLER_ROOT=%~dp0

REM App-data folder name: appDataName from the prefs file, else net.tightener
REM (same rule as Dirs::getAppDataFolderName() in the Tightener source;
REM [\x22] is a double quote)
SET "APP_DATA_NAME=net.tightener"
FOR /F "usebackq delims=" %%A IN (`POWERSHELL -NoProfile -Command "$p = Join-Path $env:APPDATA 'net.tightener.preferences.json'; if (Test-Path -LiteralPath $p) { if ((Get-Content -Raw -LiteralPath $p) -match 'appDataName[\x22]\s*:\s*[\x22]([A-Za-z0-9._-]+)[\x22]') { $Matches[1] } }"`) DO SET "APP_DATA_NAME=%%A"

SET SYSTEM_DAEMON=%APPDATA%\%APP_DATA_NAME%\SysConfig\PluginInstallerDaemon.exe

IF NOT EXIST "%SYSTEM_DAEMON%" (

    SET MACHINE_INFO=%APPDATA%\%APP_DATA_NAME%\Licensing\Machine\machineInfo.json

    IF NOT EXIST "%MACHINE_INFO%" (
        ECHO(
        ECHO(
        ECHO ---------
        ECHO(
        ECHO Cannot access embedded daemon; make sure to run the PluginInstaller after moving it
        ECHO(
        ECHO ---------
        ECHO(
        ECHO(
        GOTO DONE
    )

    SET cmd="$machineInfo = (Get-Content -Path '%MACHINE_INFO%' | ConvertFrom-Json) ; ($machineInfo.pluginInstallerPath | out-file -encoding ASCII '%TEMP%\pluginInstallerPath.txt')"    
    PowerShell %cmd%
    SET /P PLUGIN_INSTALLER=<%TEMP%\pluginInstallerPath.txt

    SET DAEMON_APP_ROOT=!PLUGIN_INSTALLER!\..\PluginInstaller Resources\
    IF "%PROCESSOR_ARCHITECTURE%" == "ARM64" (
        SET EMBEDDED_DAEMON=!DAEMON_APP_ROOT!Tightener_Windows_ARM64.exe
    ) ELSE (
        SET EMBEDDED_DAEMON=!DAEMON_APP_ROOT!Tightener_Windows.exe
    )

    IF NOT EXIST "!EMBEDDED_DAEMON!" (
        ECHO(
        ECHO(
        ECHO ---------
        ECHO(
        ECHO Cannot access embedded daemon; make sure to run the PluginInstaller after moving it
        ECHO(
        ECHO ---------
        ECHO(
        ECHO(
        GOTO DONE
    )

    ECHO(
    ECHO(
    ECHO ---------
    ECHO(
    ECHO Installing daemon as %SYSTEM_DAEMON%
    ECHO(
    ECHO ---------
    ECHO(
    ECHO(
    COPY "!EMBEDDED_DAEMON!" "%SYSTEM_DAEMON%" >NUL
)

IF EXIST "%SYSTEM_DAEMON%" (
    ECHO(
    ECHO(
    ECHO ---------
    ECHO(
    ECHO Starting daemon
    ECHO(
    ECHO ---------
    ECHO(
    ECHO(

    START /MIN CMD /C "%SYSTEM_DAEMON%" -t n -N daemon -s -l 18888
)

:DONE