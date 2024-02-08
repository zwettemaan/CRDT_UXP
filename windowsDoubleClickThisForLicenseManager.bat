@ECHO off

SET JSXGETURL_ROOT=%~dp0

IF "%PROCESSOR_ARCHITECTURE%" == "ARM64" (
    SET WINDOWS_DIR=Windows_arm64
) ELSE (
    SET WINDOWS_DIR=Windows_x64_64
)

START "%JSXGETURL_ROOT%\Helpers\%WINDOWS_DIR%\LicenseManager.exe"

ECHO.
ECHO ---------------
ECHO.
ECHO LicenseManager has been started
ECHO.
ECHO You can now close this window
ECHO.
ECHO ---------------
ECHO.

EXIT