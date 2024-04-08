@ECHO off

SETLOCAL EnableDelayedExpansion

SET PLUGIN_INSTALLER_ROOT=%~dp0

SET SYSTEM_DAEMON=%APPDATA%\net.tightener\SysConfig\Tightener.exe

IF NOT EXIST "%SYSTEM_DAEMON%" (

    SET MACHINE_INFO=%APPDATA%\net.tightener\Licensing\Machine\machineInfo.json

    IF NOT EXIST "%MACHINE_INFO%" (
        ECHO.
        ECHO.
        ECHO ---------
        ECHO.
        ECHO Cannot access embedded daemon; make sure to run the PluginInstaller after moving it
        ECHO.
        ECHO ---------
        ECHO.
        ECHO.
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
        ECHO.
        ECHO.
        ECHO ---------
        ECHO.
        ECHO Cannot access embedded daemon; make sure to run the PluginInstaller after moving it
        ECHO.
        ECHO ---------
        ECHO.
        ECHO.
        GOTO DONE
    )

    ECHO.
    ECHO.
    ECHO ---------
    ECHO.
    ECHO Installing daemon as %SYSTEM_DAEMON%
    ECHO.
    ECHO ---------
    ECHO.
    ECHO.
    COPY "!EMBEDDED_DAEMON!" "%SYSTEM_DAEMON%" >NUL
)

IF EXIST "%SYSTEM_DAEMON%" (
    ECHO.
    ECHO.
    ECHO ---------
    ECHO.
    ECHO Starting daemon
    ECHO.
    ECHO ---------
    ECHO.
    ECHO.

    START /MIN CMD /C "%SYSTEM_DAEMON%" -t n -N daemon -s -l 18888
)

:DONE