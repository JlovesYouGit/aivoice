# PowerShell script to download TinyLlama ONNX model from Hugging Face
# This script downloads a quantized ONNX model for better performance

param(
    [string]$ModelRepo = "onnx-community/TinyLlama-1.1B-Chat-v1.0-fp32",
    [string]$ModelName = "TinyLlama-1.1B-Chat-v1.0-fp32",
    [string]$HfToken = $env:HF_TOKEN
)

Write-Host "🚀 Starting download of $ModelName ONNX model..." -ForegroundColor Green

# Create models directory if it doesn't exist
$modelsDir = Join-Path $PSScriptRoot "models"
if (!(Test-Path $modelsDir)) {
    New-Item -ItemType Directory -Path $modelsDir | Out-Null
    Write-Host "📁 Created models directory: $modelsDir" -ForegroundColor Yellow
}

# Change to models directory
Set-Location $modelsDir

# Check if huggingface-hub CLI is installed
try {
    $hfCli = Get-Command "huggingface-cli" -ErrorAction Stop
    Write-Host "✅ Hugging Face CLI found at: $($hfCli.Source)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Hugging Face CLI not found. Installing..." -ForegroundColor Yellow
    
    # Install huggingface-hub CLI
    try {
        pip install huggingface-hub --upgrade
        Write-Host "✅ Hugging Face CLI installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Hugging Face CLI. Please install it manually:" -ForegroundColor Red
        Write-Host "   pip install huggingface-hub" -ForegroundColor Cyan
        exit 1
    }
}

# Download model files
Write-Host "📥 Downloading ONNX model files from $ModelRepo..." -ForegroundColor Yellow

try {
    # Download the ONNX model file
    Write-Host "   ⬇️  Downloading model.onnx (this may take a few minutes)..." -ForegroundColor Cyan
    huggingface-cli download $ModelRepo model.onnx --local-dir . --local-dir-use-symlinks False
    
    Write-Host "✅ ONNX model downloaded successfully!" -ForegroundColor Green
    Write-Host "📂 Model saved to: $modelsDir\model.onnx" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error downloading ONNX model: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Note: Some models may require authentication. Set HF_TOKEN environment variable if needed." -ForegroundColor Yellow
    exit 1
}

# Create a info file with model details
$modelInfo = @"
ONNX Model Information
=====================

Model: $ModelName
Repository: $ModelRepo
Download Date: $(Get-Date)
Files:
  - model.onnx

This ONNX model is ready for use with the local AI implementation.
To enable full AI capabilities, update the chat service to load and use this model.
"@

$modelInfoPath = Join-Path $modelsDir "ONNX_MODEL_INFO.txt"
$modelInfo | Out-File -FilePath $modelInfoPath -Encoding UTF8

Write-Host "📝 Model information saved to: $modelInfoPath" -ForegroundColor Green

Write-Host "🎉 ONNX Model download completed successfully!" -ForegroundColor Green
Write-Host "   You can now enhance the local AI implementation with this ONNX model." -ForegroundColor Cyan