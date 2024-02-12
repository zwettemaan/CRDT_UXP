@ECHO off

SET CRDT_ROOT=%~dp0

IF "%PROCESSOR_ARCHITECTURE%" == "ARM64" (
    SET WINDOWS_DIR=Windows_arm64
) ELSE (
    SET WINDOWS_DIR=Windows_x86_64
)

START "" "%CRDT_ROOT%Helpers\%WINDOWS_DIR%\LicenseManager\LicenseManager.exe"
