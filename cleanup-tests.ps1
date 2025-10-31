# Cleanup script for GitHub Time Capsule test files (PowerShell)
# Usage: .\cleanup-tests.ps1

Write-Host "🧹 GitHub Time Capsule - Test Cleanup Script" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Function to remove test files
function Cleanup-Files {
    Write-Host "📁 Cleaning up test files..." -ForegroundColor Yellow
    
    # Remove test sealed folders
    if (Test-Path "sealed\TestUser") {
        Remove-Item -Recurse -Force "sealed\TestUser"
        Write-Host "  ✓ Removed sealed\TestUser\" -ForegroundColor Green
    }
    
    if (Test-Path "sealed\UITest") {
        Remove-Item -Recurse -Force "sealed\UITest"
        Write-Host "  ✓ Removed sealed\UITest\" -ForegroundColor Green
    }
    
    # Remove any other test folders
    Get-ChildItem -Path "sealed" -Directory -Filter "*Test*" -ErrorAction SilentlyContinue | 
        ForEach-Object { 
            Remove-Item -Recurse -Force $_.FullName
            Write-Host "  ✓ Removed $($_.FullName)" -ForegroundColor Green
        }
    
    # Remove test message files
    if (Test-Path "messages\TestUser.txt") {
        Remove-Item -Force "messages\TestUser.txt"
        Write-Host "  ✓ Removed messages\TestUser.txt" -ForegroundColor Green
    }
    
    Get-ChildItem -Path "messages" -File -Filter "*Test*.txt" -ErrorAction SilentlyContinue | 
        ForEach-Object { 
            Remove-Item -Force $_.FullName
            Write-Host "  ✓ Removed $($_.FullName)" -ForegroundColor Green
        }
    
    Write-Host ""
}

# Function to remove local test branches
function Cleanup-LocalBranches {
    Write-Host "🌿 Cleaning up local test branches..." -ForegroundColor Yellow
    
    # Ensure we're on main
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "main") {
        Write-Host "  ⚠️  Switching to main branch..." -ForegroundColor Yellow
        git checkout main
    }
    
    # Get test branches
    $testBranches = git branch | Where-Object { $_ -match 'test-|Test-' } | ForEach-Object { $_.Trim() }
    
    if ($testBranches) {
        foreach ($branch in $testBranches) {
            git branch -D $branch 2>$null
            Write-Host "  ✓ Removed $branch" -ForegroundColor Green
        }
    } else {
        Write-Host "  ℹ️  No local test branches found" -ForegroundColor Gray
    }
    
    Write-Host ""
}

# Function to remove remote test branches
function Cleanup-RemoteBranches {
    Write-Host "☁️  Cleaning up remote test branches..." -ForegroundColor Yellow
    
    # Check if gh CLI is installed
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        Write-Host "  ⚠️  gh CLI not found, skipping remote cleanup" -ForegroundColor Yellow
        Write-Host "     Install: https://cli.github.com/" -ForegroundColor Gray
        return
    }
    
    # Get closed test PRs
    $testPRs = gh pr list --state closed --limit 50 --json headRefName --jq '.[].headRefName' 2>$null | 
        Where-Object { $_ -match 'test-|Test-' }
    
    if ($testPRs) {
        Write-Host "  Found test branches to delete:" -ForegroundColor Cyan
        $testPRs | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
        Write-Host ""
        
        $response = Read-Host "  Delete these remote branches? (y/N)"
        
        if ($response -match '^[Yy]$') {
            foreach ($branch in $testPRs) {
                git push origin --delete $branch 2>$null
                if ($?) {
                    Write-Host "  ✓ Deleted $branch" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "  ℹ️  Skipped remote branch deletion" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ℹ️  No remote test branches found" -ForegroundColor Gray
    }
    
    Write-Host ""
}

# Function to check for uncommitted changes
function Check-Status {
    Write-Host "📊 Checking repository status..." -ForegroundColor Yellow
    
    $status = git status --porcelain
    if ($status) {
        Write-Host "  ⚠️  You have uncommitted changes!" -ForegroundColor Yellow
        Write-Host ""
        git status --short
        Write-Host ""
        
        $response = Read-Host "  Continue cleanup? (y/N)"
        if ($response -notmatch '^[Yy]$') {
            Write-Host "  ❌ Cleanup cancelled" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "  ✓ Working directory is clean" -ForegroundColor Green
    }
    
    Write-Host ""
}

# Main execution
function Main {
    # Check if we're in a git repository
    git rev-parse --git-dir 2>$null | Out-Null
    if (-not $?) {
        Write-Host "❌ Error: Not a git repository" -ForegroundColor Red
        exit 1
    }
    
    # Check status
    Check-Status
    
    # Cleanup files
    Cleanup-Files
    
    # Cleanup local branches
    Cleanup-LocalBranches
    
    # Ask about remote branches
    if (Get-Command gh -ErrorAction SilentlyContinue) {
        $response = Read-Host "🌐 Clean up remote test branches? (y/N)"
        if ($response -match '^[Yy]$') {
            Cleanup-RemoteBranches
        }
    }
    
    # Show final status
    Write-Host "📋 Final Status:" -ForegroundColor Cyan
    
    $testFilesCount = (Get-ChildItem -Path "sealed", "messages" -Recurse -Filter "*Test*" -ErrorAction SilentlyContinue).Count
    Write-Host "  Test files:" -NoNewline
    if ($testFilesCount -eq 0) {
        Write-Host " ✓ No test files remaining" -ForegroundColor Green
    } else {
        Write-Host " ⚠️  $testFilesCount test files still exist" -ForegroundColor Yellow
    }
    
    $testBranchesCount = (git branch | Where-Object { $_ -match 'test-|Test-' }).Count
    Write-Host "  Test branches: $testBranchesCount"
    
    Write-Host ""
    Write-Host "✅ Cleanup completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Tips:" -ForegroundColor Cyan
    Write-Host "  - Run 'git status' to see if any files need committing"
    Write-Host "  - Run 'git push origin main' if you committed deletions"
    Write-Host "  - Use '.\cleanup-tests.ps1' anytime after testing"
}

# Run main function
Main

