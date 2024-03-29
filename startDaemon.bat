@ECHO off

SET PLUGIN_INSTALLER_ROOT=%~dp0

SET DAEMON_APP_ROOT=%PLUGIN_INSTALLER_ROOT%PluginInstaller\PluginInstaller Resources\
IF "%PROCESSOR_ARCHITECTURE%" == "ARM64" (
    SET EMBEDDED_DAEMON=%DAEMON_APP_ROOT%Tightener_Windows_ARM64.exe
) ELSE (
    SET EMBEDDED_DAEMON=%DAEMON_APP_ROOT%Tightener_Windows.exe
)

SET SYSTEM_DAEMON=%APPDATA%\net.tightener\SysConfig\Tightener.exe

IF NOT EXIST "%SYSTEM_DAEMON%" (
    IF NOT EXIST "%EMBEDDED_DAEMON%" (
        ECHO.
        ECHO.
        ECHO ---------
        ECHO.
        ECHO Cannot access PluginInstaller; make sure this script is not moved from being alongside the 'PluginInstaller' folder 
        ECHO.
        ECHO ---------
        ECHO.
        ECHO.
    ) ELSE (
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
    )
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