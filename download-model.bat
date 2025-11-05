@echo off
REM Batch script to download TinyLlama model files from Hugging Face
REM This script uses PowerShell to run the download script

echo 🚀 Starting download of TinyLlama model...
echo.

REM Check if PowerShell is available
where powershell >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PowerShell not found. Please install PowerShell to continue.
    echo    Download from: https://github.com/PowerShell/PowerShell
    pause
    exit /b 1
)

REM Run the PowerShell script
echo 📥 Running PowerShell download script...
powershell -ExecutionPolicy Bypass -File "%~dp0download-model.ps1"

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Model download completed successfully!
    echo    The model files are now ready for use with the local AI implementation.
) else (
    echo.
    echo ❌ Model download failed. Please check the error messages above.
)

echo.
pause