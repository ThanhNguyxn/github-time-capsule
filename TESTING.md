# 🧪 Testing Guide

This guide covers how to test the GitHub Time Capsule workflows and web application.

---

## 📋 Table of Contents

- [Quick Test Commands](#-quick-test-commands)
- [Testing Workflows](#-testing-workflows)
- [Testing Web App](#-testing-web-app)
- [Cleanup After Testing](#-cleanup-after-testing)
- [Troubleshooting](#-troubleshooting)

---

## ⚡ Quick Test Commands

```bash
# Test workflow via PR
git checkout -b test-$(date +%s)
echo "Test message" > messages/$(gh api user -q .login).txt
git add . && git commit -m "Test: Workflow"
git push origin HEAD
gh pr create --title "Test: Workflow" --body "Testing"
gh run watch

# Cleanup
git checkout main && git branch -D test-*
```

---

## 🔄 Testing Workflows

### Test the Encryption Workflow

1. **Create a test branch:**
   ```bash
   git checkout -b test-encrypt-$(date +%s)
   ```

2. **Create a test message:**
   ```bash
   mkdir -p messages
   echo "Test message from $(date)" > messages/$(gh api user -q .login).txt
   ```

3. **Submit PR:**
   ```bash
   git add messages/
   git commit -m "Test: Encryption workflow"
   git push origin HEAD
   gh pr create --title "Test: Encryption" --body "Testing workflow"
   ```

4. **Watch the workflow:**
   ```bash
   gh run watch
   ```

5. **Verify results:**
   - ✅ Bot comments "Processing..."
   - ✅ Bot comments "Success!"
   - ✅ PR is automatically closed
   - ✅ Encrypted file appears in `sealed/` folder

### Test Rate Limiting

```bash
# Submit 4+ PRs in 24 hours to trigger rate limit
# The 4th PR should be closed with rate limit warning
```

---

## 🌐 Testing Web App

### Run Locally

```bash
cd web
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
# Open http://localhost:3000
```

### Test Checklist

| Feature | Test |
|:--------|:-----|
| ✅ Home page loads | Check countdown timer works |
| ✅ OAuth login | Sign in with GitHub |
| ✅ Submit page | Write and submit a message |
| ✅ Success page | Verify confirmation displays |
| ✅ Responsive design | Test on mobile viewport |

---

## 🧹 Cleanup After Testing

### Remove Test Files

```bash
# Delete test sealed files
rm -rf sealed/TestUser/ sealed/*test*/

# Delete test messages
rm -f messages/*test*.txt
```

### Delete Test Branches

```bash
# Local branches
git checkout main
git branch | grep -E 'test-|Test-' | xargs git branch -D

# Remote branches
gh pr list --state closed --json headRefName --jq '.[].headRefName' | \
  grep -E 'test-' | xargs -I {} git push origin --delete {}
```

### Cleanup Script

```bash
#!/bin/bash
echo "🧹 Cleaning up test files..."

# Remove test files
rm -rf sealed/TestUser/ sealed/*test*/
rm -f messages/*test*.txt

# Checkout main
git checkout main 2>/dev/null || true

# Remove local test branches
git branch | grep -E 'test-' | xargs -r git branch -D

echo "✅ Cleanup complete!"
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|:------|:---------|
| Workflow not triggering | Check trigger paths in `encrypt-msg.yml` |
| Bot comments not appearing | Verify `permissions: pull-requests: write` |
| Encryption fails | Check `GPG_PUBLIC_KEY` secret |
| PR not auto-closing | Enable "Read and write permissions" in Actions settings |

### View Workflow Logs

```bash
# List recent runs
gh run list --workflow "encrypt-msg.yml" --limit 5

# View specific run logs
gh run view <RUN_ID> --log

# Search for errors
gh run view <RUN_ID> --log | grep -i "error"
```

### Debug Mode

Add this to workflow for debugging:

```yaml
- name: Debug Info
  run: |
    echo "Username: ${{ github.event.pull_request.user.login }}"
    echo "PR Number: ${{ github.event.pull_request.number }}"
    ls -la messages/ || echo "No messages folder"
    ls -la sealed/ || echo "No sealed folder"
```

---

## 📊 Test Checklist

### Before Deploying

- [ ] Test encryption workflow with plaintext message
- [ ] Test rate limiting (4+ PRs)
- [ ] Verify bot comments are formatted correctly
- [ ] Confirm PR auto-closes
- [ ] Test web app OAuth login
- [ ] Test message submission via web
- [ ] Cleanup all test files

---

<div align="center">

**Need help?** [Open an issue](../../issues/new) or [Join discussions](../../discussions)

</div>
