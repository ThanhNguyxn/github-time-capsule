# GitHub Time Capsule - Decryption Script (PowerShell)
# 
# 🎆 THE UNVEILING - January 1, 2035 🎆
#
# This script decrypts all sealed messages from the GitHub Time Capsule.
# Windows version using PowerShell.
#
# Prerequisites:
# - GPG installed (Gpg4win)
# - Private key imported
# - Passphrase available

param(
    [string]$SealedDir = "sealed",
    [string]$OutputDir = "decrypted-messages"
)

# Clear screen and show banner
Clear-Host
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║                                                                ║" -ForegroundColor Magenta
Write-Host "║          🕰️  THE GITHUB TIME CAPSULE UNVEILING 🕰️              ║" -ForegroundColor Magenta
Write-Host "║                                                                ║" -ForegroundColor Magenta
Write-Host "║                  January 1, 2035                               ║" -ForegroundColor Magenta
Write-Host "║                                                                ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""
Write-Host "Welcome to the future. Let's reveal the messages from the past." -ForegroundColor Cyan
Write-Host ""

# Check if GPG is installed
try {
    $gpgVersion = gpg --version 2>&1 | Select-Object -First 1
    Write-Host "✅ GPG is installed: $gpgVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: GPG is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Gpg4win from: https://www.gpg4win.org/"
    exit 1
}

# Check if private key is imported
$keyCheck = gpg --list-secret-keys 2>&1 | Select-String "time-capsule-2035"
if (-not $keyCheck) {
    Write-Host ""
    Write-Host "⚠️  Private key not found in GPG keyring" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please import the private key first:"
    Write-Host "  gpg --import private-key.asc"
    Write-Host ""
    Read-Host "Press Enter after importing the key, or Ctrl+C to exit"
    
    # Check again
    $keyCheck = gpg --list-secret-keys 2>&1 | Select-String "time-capsule-2035"
    if (-not $keyCheck) {
        Write-Host "❌ Private key still not found. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Private key found" -ForegroundColor Green
Write-Host ""

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

Write-Host "📂 Output directory: $OutputDir" -ForegroundColor Blue
Write-Host ""

# Check sealed directory
if (-not (Test-Path $SealedDir)) {
    Write-Host "❌ Error: Sealed directory not found!" -ForegroundColor Red
    Write-Host "Make sure you're running this script from the repository root."
    exit 1
}

# Count sealed messages
$sealedFiles = Get-ChildItem -Path $SealedDir -Filter "*.gpg"
$totalFiles = $sealedFiles.Count

if ($totalFiles -eq 0) {
    Write-Host "❌ No sealed messages found in $SealedDir" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Found $totalFiles sealed messages" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Beginning decryption process..." -ForegroundColor Yellow
Write-Host ""

# Counters
$successCount = 0
$failCount = 0

# Decrypt each file
foreach ($encryptedFile in $sealedFiles) {
    $filename = $encryptedFile.BaseName
    
    Write-Host "🔓 Decrypting: $filename" -ForegroundColor Blue
    
    $outputFile = Join-Path $OutputDir "$filename.txt"
    
    # Attempt decryption
    try {
        gpg --quiet --batch --yes --decrypt --output $outputFile $encryptedFile.FullName 2>&1 | Out-Null
        
        if (Test-Path $outputFile) {
            Write-Host "   ✅ Success" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "   ❌ Failed" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "   ❌ Failed: $_" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "                    DECRYPTION COMPLETE                        " -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "✅ Successfully decrypted: $successCount messages" -ForegroundColor Green

if ($failCount -gt 0) {
    Write-Host "❌ Failed to decrypt: $failCount messages" -ForegroundColor Red
}

Write-Host ""
Write-Host "📁 Decrypted messages are in: $OutputDir" -ForegroundColor Cyan
Write-Host ""

# Create index file
$indexFile = Join-Path $OutputDir "INDEX.md"
$indexContent = @"
# 🕰️ GitHub Time Capsule - Decrypted Messages

**Sealed:** October 17, 2025 - December 31, 2034
**Unveiled:** January 1, 2035

**Total Messages:** $successCount

---

## Messages

"@

# List all decrypted files
$decryptedFiles = Get-ChildItem -Path $OutputDir -Filter "*.txt" | Sort-Object Name
foreach ($file in $decryptedFiles) {
    $username = $file.BaseName
    $indexContent += "`n- [``$username``](./$($file.Name))"
}

$indexContent | Out-File -FilePath $indexFile -Encoding UTF8

Write-Host "✅ Created index file: $indexFile" -ForegroundColor Green
Write-Host ""

# Final message
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "🎉 The time capsule has been opened!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Messages from $successCount developers, frozen in time since 2025," -ForegroundColor Cyan
Write-Host "are now revealed. Welcome to the future we hoped for." -ForegroundColor Cyan
Write-Host ""
Write-Host "Take your time reading through these messages." -ForegroundColor Yellow
Write-Host "Each one is a window into who we were and what we believed." -ForegroundColor Yellow
Write-Host ""
Write-Host "Thank you for being part of this journey across time." -ForegroundColor Green
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

Write-Host "🌟 See you in another 10 years? 🌟" -ForegroundColor Cyan
Write-Host ""
