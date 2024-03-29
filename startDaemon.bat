@ECHO off

SET PLUGIN_INSTALLER_ROOT=%~dp0

SET SYSTEM_DAEMON=%APPDATA%\net.tightener\SysConfig\Tightener.exe

IF NOT EXIST "%SYSTEM_DAEMON%" (

    SETLOCAL

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

    FOR /f "DELIMS=" %%i in ('PowerShell -Command "$content = Get-Content -Path '%MACHINE_INFO%'; if ($content -match '\"pluginInstallerPath\"\s*:\s*\"([^"]*)\"') { $matches[1] }"') do set "PLUGIN_INSTALLER=%%i"

    SET DAEMON_APP_ROOT=%PLUGIN_INSTALLER%\..\PluginInstaller Resources\
    IF "%PROCESSOR_ARCHITECTURE%" == "ARM64" (
        SET EMBEDDED_DAEMON=%DAEMON_APP_ROOT%Tightener_Windows_ARM64.exe
    ) ELSE (
        SET EMBEDDED_DAEMON=%DAEMON_APP_ROOT%Tightener_Windows.exe
    )

    IF NOT EXIST "%EMBEDDED_DAEMON%" (
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
    COPY "%EMBEDDED_DAEMON%" "%SYSTEM_DAEMON%" >NUL

    ENDLOCAL
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