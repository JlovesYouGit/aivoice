# PowerShell script to download TinyLlama model files from Hugging Face
# This script uses the huggingface-hub CLI tool to download model files efficiently

param(
    [string]$ModelRepo = "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    [string]$ModelName = "TinyLlama-1.1B-Chat-v1.0",
    [string]$HfToken = $env:HF_TOKEN
)

Write-Host "🚀 Starting download of $ModelName model..." -ForegroundColor Green

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

# Set HF token as environment variable
$env:HF_TOKEN = $HfToken
Write-Host "🔐 HF token set for authentication" -ForegroundColor Green

# Download model files
Write-Host "📥 Downloading model files from $ModelRepo..." -ForegroundColor Yellow

try {
    # Download only the required files for inference
    $requiredFiles = @(
        "config.json",
        "tokenizer.json",
        "tokenizer_config.json",
        "special_tokens_map.json"
    )
    
    foreach ($file in $requiredFiles) {
        Write-Host "   ⬇️  Downloading $file..." -ForegroundColor Cyan
        huggingface-cli download $ModelRepo $file --local-dir . --local-dir-use-symlinks False
    }
    
    Write-Host "✅ Model files downloaded successfully!" -ForegroundColor Green
    Write-Host "📂 Files saved to: $modelsDir" -ForegroundColor Yellow
    
    # List downloaded files
    Write-Host "📋 Downloaded files:" -ForegroundColor Yellow
    Get-ChildItem -Path $modelsDir | ForEach-Object {
        Write-Host "   📄 $($_.Name)" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Error downloading model files: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create a info file with model details
$modelInfo = @"
Model Information
=================

Model: $ModelName
Repository: $ModelRepo
Download Date: $(Get-Date)
Files:
$($requiredFiles | ForEach-Object { "  - $_" } | Out-String)

This model is now ready for use with the local AI implementation.
"@

$modelInfoPath = Join-Path $modelsDir "MODEL_INFO.txt"
$modelInfo | Out-File -FilePath $modelInfoPath -Encoding UTF8

Write-Host "📝 Model information saved to: $modelInfoPath" -ForegroundColor Green

Write-Host "🎉 Model download completed successfully!" -ForegroundColor Green
Write-Host "   You can now use the local AI implementation with this model." -ForegroundColor Cyan