#!/bin/bash
# Cleanup script for GitHub Time Capsule test files
# Usage: ./cleanup-tests.sh

echo "🧹 GitHub Time Capsule - Test Cleanup Script"
echo "=============================================="
echo ""

# Function to remove test files
cleanup_files() {
    echo "📁 Cleaning up test files..."
    
    # Remove test sealed folders
    if [ -d "sealed/TestUser" ]; then
        rm -rf sealed/TestUser/
        echo "  ✓ Removed sealed/TestUser/"
    fi
    
    if [ -d "sealed/UITest" ]; then
        rm -rf sealed/UITest/
        echo "  ✓ Removed sealed/UITest/"
    fi
    
    # Remove any other test folders
    find sealed/ -type d -name "*Test*" -exec rm -rf {} + 2>/dev/null
    
    # Remove test message files
    if [ -f "messages/TestUser.txt" ]; then
        rm -f messages/TestUser.txt
        echo "  ✓ Removed messages/TestUser.txt"
    fi
    
    find messages/ -type f -name "*Test*.txt" -exec rm -f {} + 2>/dev/null
    
    echo ""
}

# Function to remove local test branches
cleanup_local_branches() {
    echo "🌿 Cleaning up local test branches..."
    
    # Ensure we're on main
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        echo "  ⚠️  Switching to main branch..."
        git checkout main
    fi
    
    # Delete test branches
    test_branches=$(git branch | grep -E 'test-|Test-' | xargs)
    
    if [ -n "$test_branches" ]; then
        echo "$test_branches" | xargs git branch -D
        echo "  ✓ Removed local test branches"
    else
        echo "  ℹ️  No local test branches found"
    fi
    
    echo ""
}

# Function to remove remote test branches
cleanup_remote_branches() {
    echo "☁️  Cleaning up remote test branches..."
    
    # Check if gh CLI is installed
    if ! command -v gh &> /dev/null; then
        echo "  ⚠️  gh CLI not found, skipping remote cleanup"
        echo "     Install: https://cli.github.com/"
        return
    fi
    
    # Get closed test PRs
    test_prs=$(gh pr list --state closed --limit 50 --json headRefName --jq '.[].headRefName' | grep -E 'test-|Test-' || true)
    
    if [ -n "$test_prs" ]; then
        echo "  Found test branches to delete:"
        echo "$test_prs" | sed 's/^/    - /'
        echo ""
        read -p "  Delete these remote branches? (y/N) " -n 1 -r
        echo ""
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "$test_prs" | while read branch; do
                git push origin --delete "$branch" 2>/dev/null && echo "  ✓ Deleted $branch" || true
            done
        else
            echo "  ℹ️  Skipped remote branch deletion"
        fi
    else
        echo "  ℹ️  No remote test branches found"
    fi
    
    echo ""
}

# Function to check for uncommitted changes
check_status() {
    echo "📊 Checking repository status..."
    
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        echo "  ⚠️  You have uncommitted changes!"
        echo ""
        git status --short
        echo ""
        read -p "  Continue cleanup? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "  ❌ Cleanup cancelled"
            exit 1
        fi
    else
        echo "  ✓ Working directory is clean"
    fi
    
    echo ""
}

# Main execution
main() {
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo "❌ Error: Not a git repository"
        exit 1
    fi
    
    # Check status
    check_status
    
    # Cleanup files
    cleanup_files
    
    # Cleanup local branches
    cleanup_local_branches
    
    # Ask about remote branches
    if command -v gh &> /dev/null; then
        read -p "🌐 Clean up remote test branches? (y/N) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cleanup_remote_branches
        fi
    fi
    
    # Show final status
    echo "📋 Final Status:"
    echo "  Test files:"
    test_files_count=$(find sealed/ messages/ -name "*Test*" 2>/dev/null | wc -l)
    if [ "$test_files_count" -eq 0 ]; then
        echo "    ✓ No test files remaining"
    else
        echo "    ⚠️  $test_files_count test files still exist"
    fi
    
    test_branches_count=$(git branch | grep -E 'test-|Test-' | wc -l)
    echo "  Test branches: $test_branches_count"
    
    echo ""
    echo "✅ Cleanup completed!"
    echo ""
    echo "💡 Tips:"
    echo "  - Run 'git status' to see if any files need committing"
    echo "  - Run 'git push origin main' if you committed deletions"
    echo "  - Use './cleanup-tests.sh' anytime after testing"
}

# Run main function
main

