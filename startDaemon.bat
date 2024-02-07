@ECHO off

SET LICENSE_MANAGER_ROOT=%~dp0

IF "%PROCESSOR_ARCHITECTURE%" == "ARM64" (
    SET DAEMON_APP_ROOT=%LICENSE_MANAGER_ROOT%Windows\ARM64\
    SET EMBEDDED_DAEMON=%DAEMON_APP_ROOT%LicenseManager\LicenseManager Resources\Tightener_Windows_ARM64.exe
) ELSE (
    SET DAEMON_APP_ROOT=%LICENSE_MANAGER_ROOT%Windows\
    SET EMBEDDED_DAEMON=%DAEMON_APP_ROOT%LicenseManager\LicenseManager Resources\Tightener_Windows.exe
)

SET SYSTEM_DAEMON=%APPDATA%\net.tightener\SysConfig\Tightener.exe
IF NOT EXIST "%SYSTEM_DAEMON%" (
    IF NOT EXIST "%EMBEDDED_DAEMON%" (
        ECHO Cannot access License Manager; make sure this script is not moved from being alongside the 'License Manager' folder 
    ) ELSE (
        ECHO Installing daemon as %SYSTEM_DAEMON%
        COPY "%EMBEDDED_DAEMON%" "%SYSTEM_DAEMON%"
    )
)

START /B CMD /C "%SYSTEM_DAEMON%" -t n -N daemon -s -l 18888
