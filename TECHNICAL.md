# 🔧 Technical Documentation
## GitHub Time Capsule - Architecture & Implementation

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Encryption System](#encryption-system)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Security Model](#security-model)
- [Data Flow](#data-flow)
- [API Reference](#api-reference)
- [Testing & Verification](#testing--verification)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Time Capsule                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │   Messages   │ ───> │  Encryption  │ ───> │  Sealed   │ │
│  │   (Plain)    │      │   (GPG/AES)  │      │  (.gpg)   │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│         │                      │                     │       │
│         │                      │                     │       │
│         v                      v                     v       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           GitHub Actions Automation                   │  │
│  │  • seal-the-capsule.yml (Triggered on PR)            │  │
│  │  • auto-unveiling.yml (Scheduled: Jan 1, 2035)       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Repository Structure

```
.
├── .github/
│   └── workflows/
│       ├── seal-the-capsule.yml      # Auto-encrypt on PR
│       └── auto-unveiling.yml        # Auto-decrypt in 2035
├── messages/                          # User-submitted messages
│   ├── EXAMPLE-MESSAGE.txt
│   └── <username>.txt
├── sealed/                            # Encrypted messages
│   └── <username>.txt.gpg
├── decrypted-messages/                # Created in 2035
├── scripts/
│   ├── decrypt-capsule.ps1           # Windows decryption
│   └── decrypt-capsule.sh            # Linux/Mac decryption
├── README.md                          # Simple user guide
├── TECHNICAL.md                       # This file
├── SETUP.md                           # Maintainer setup
└── AUTOMATION.md                      # Workflow details
```

---

## 🔐 Encryption System

### Encryption Algorithm

**Algorithm:** AES-256-GCM (Galois/Counter Mode)  
**Key Size:** 4096-bit RSA  
**Implementation:** GPG (GNU Privacy Guard) 2.x+

### Key Management

```yaml
GitHub Secrets:
  - GPG_PUBLIC_KEY      # Used for encryption (public)
  - GPG_PRIVATE_KEY     # Used for decryption (secret until 2035)
  - GPG_PASSPHRASE      # Protects private key
```

### Encryption Process

```bash
# 1. Import public key
echo "$GPG_PUBLIC_KEY" | gpg --import

# 2. Encrypt message
gpg --encrypt \
    --recipient "GitHub Time Capsule" \
    --armor \
    --trust-model always \
    --output "sealed/${USERNAME}.txt.gpg" \
    "messages/${USERNAME}.txt"

# 3. Verify encryption
gpg --list-packets "sealed/${USERNAME}.txt.gpg"
```

### Decryption Process (2035)

```bash
# 1. Import private key
echo "$GPG_PRIVATE_KEY" | gpg --batch --import

# 2. Import passphrase
echo "$GPG_PASSPHRASE" > passphrase.txt

# 3. Decrypt all messages
for file in sealed/*.gpg; do
    gpg --decrypt \
        --batch \
        --passphrase-file passphrase.txt \
        --output "decrypted-messages/$(basename $file .gpg)" \
        "$file"
done
```

---

## ⚙️ GitHub Actions Workflows

### 1. Seal the Capsule Workflow

**File:** `.github/workflows/seal-the-capsule.yml`  
**Trigger:** `pull_request` event (opened)  
**Purpose:** Automatically encrypt messages when PR is submitted

#### Workflow Steps:

```yaml
name: 🔒 Seal the Capsule

on:
  pull_request:
    types: [opened]

jobs:
  seal-message:
    runs-on: ubuntu-latest
    steps:
      # 1. Checkout code
      - uses: actions/checkout@v4
      
      # 2. Extract username from PR
      - name: Get username
        run: echo "USERNAME=${{ github.event.pull_request.user.login }}" >> $GITHUB_ENV
      
      # 3. Validate message file exists
      - name: Check message file
        run: |
          if [ ! -f "messages/${USERNAME}.txt" ]; then
            echo "Error: Message file not found"
            exit 1
          fi
      
      # 4. Import GPG public key
      - name: Import GPG key
        run: echo "${{ secrets.GPG_PUBLIC_KEY }}" | gpg --import
      
      # 5. Encrypt message
      - name: Encrypt message
        run: |
          gpg --encrypt \
              --recipient "GitHub Time Capsule" \
              --armor \
              --trust-model always \
              --output "sealed/${USERNAME}.txt.gpg" \
              "messages/${USERNAME}.txt"
      
      # 6. Save to temporary location (before checkout)
      - name: Save encrypted file
        run: cp "sealed/${USERNAME}.txt.gpg" "/tmp/${USERNAME}.txt.gpg"
      
      # 7. Checkout main branch
      - uses: actions/checkout@v4
        with:
          ref: main
          token: ${{ secrets.GITHUB_TOKEN }}
      
      # 8. Restore encrypted file
      - name: Restore encrypted file
        run: cp "/tmp/${USERNAME}.txt.gpg" "sealed/${USERNAME}.txt.gpg"
      
      # 9. Commit to main
      - name: Commit encrypted message
        run: |
          git config user.name "Time Capsule Bot"
          git config user.email "bot@timecapsule.dev"
          git add "sealed/${USERNAME}.txt.gpg"
          git commit -m "🔒 Seal message from @${USERNAME}"
          git push origin main
      
      # 10. Close PR with confirmation
      - name: Close PR
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `✅ Your message has been sealed! 🎉\n\n...`
            });
            await github.rest.pulls.update({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number,
              state: 'closed'
            });
```

#### Critical Implementation Detail: File Preservation

**Problem:** When checking out a different branch, uncommitted files are lost.

**Solution:** Copy encrypted file to `/tmp` before checkout, restore after:

```bash
# BEFORE checkout - save file
cp "sealed/${USERNAME}.txt.gpg" "/tmp/${USERNAME}.txt.gpg"

# Checkout main branch (this would normally lose the file)
git checkout main

# AFTER checkout - restore file
cp "/tmp/${USERNAME}.txt.gpg" "sealed/${USERNAME}.txt.gpg"
```

This ensures the encrypted file survives the branch switch.

---

### 2. Auto-Unveiling Workflow

**File:** `.github/workflows/auto-unveiling.yml`  
**Trigger:** Scheduled (cron) on January 1, 2035 at 00:00 UTC  
**Purpose:** Automatically decrypt all messages on the unlock date

#### Workflow Configuration:

```yaml
name: 🎆 Auto-Unveiling

on:
  schedule:
    - cron: '0 0 1 1 2035'  # January 1, 2035, 00:00 UTC
  workflow_dispatch:           # Manual trigger for testing

jobs:
  unveil-capsule:
    runs-on: ubuntu-latest
    steps:
      # 1-4: Setup and import keys
      # 5: Decrypt all messages
      - name: Decrypt all messages
        run: |
          mkdir -p decrypted-messages
          for encrypted_file in sealed/*.gpg; do
            filename=$(basename "$encrypted_file" .gpg)
            gpg --decrypt \
                --batch \
                --passphrase "${{ secrets.GPG_PASSPHRASE }}" \
                --output "decrypted-messages/$filename" \
                "$encrypted_file"
          done
      
      # 6: Generate statistics
      # 7: Create GitHub Release
      # 8: Publish decryption key
      # 9: Update README
      # 10: Create announcement issue
```

---

## 🔒 Security Model

### Threat Model

**Protected Against:**
- ✅ Unauthorized decryption before 2035
- ✅ Message tampering
- ✅ Key exposure during sealing
- ✅ Man-in-the-middle attacks
- ✅ Brute force attacks (4096-bit RSA)

**Not Protected Against:**
- ❌ GitHub account compromise
- ❌ GitHub Security breach
- ❌ Quantum computing (post-2030s)

### Security Best Practices

1. **Private key is NEVER exposed during sealing**
   - Only public key is used in `seal-the-capsule.yml`
   - Private key only used in 2035

2. **Secrets rotation**
   - Use GitHub Secrets (encrypted at rest)
   - Never commit secrets to repository

3. **Audit trail**
   - All actions logged in GitHub Actions
   - Commit history provides full audit trail

4. **Access control**
   - Only repository admins can access secrets
   - Workflow permissions restricted

---

## 📊 Data Flow

### Sealing Flow (User → Encrypted)

```
User Fork → PR Created → Workflow Triggered
    ↓
Extract username from PR
    ↓
Validate: messages/<username>.txt exists?
    ↓
Import GPG public key (from secrets)
    ↓
Encrypt: messages/<username>.txt → sealed/<username>.txt.gpg
    ↓
Save to /tmp (preserve file)
    ↓
Checkout main branch
    ↓
Restore from /tmp
    ↓
Commit & Push to main
    ↓
Post comment & Close PR
```

### Unveiling Flow (Encrypted → Decrypted)

```
January 1, 2035 00:00 UTC → Cron Trigger
    ↓
Import GPG private key (from secrets)
    ↓
For each sealed/*.gpg file:
    ├─> Decrypt with private key & passphrase
    └─> Save to decrypted-messages/
    ↓
Generate statistics (count, contributors, etc.)
    ↓
Create GitHub Release with all messages
    ↓
Publish private key & passphrase
    ↓
Update README with unveiling announcement
    ↓
Create announcement issue
```

---

## 🧪 Testing & Verification

### Manual Testing

```bash
# 1. Test encryption locally
echo "Test message" > messages/testuser.txt
gpg --encrypt \
    --recipient "GitHub Time Capsule" \
    --armor \
    --trust-model always \
    --output sealed/testuser.txt.gpg \
    messages/testuser.txt

# 2. Verify encrypted file
gpg --list-packets sealed/testuser.txt.gpg

# 3. Test decryption (requires private key)
gpg --decrypt \
    --batch \
    --passphrase "your-passphrase" \
    --output decrypted-messages/testuser.txt \
    sealed/testuser.txt.gpg

# 4. Compare original and decrypted
diff messages/testuser.txt decrypted-messages/testuser.txt
```

### Automated Testing via PR

```bash
# Create test branch
git checkout -b test-seal-$(date +%s)

# Create test message
echo "Test message at $(date)" > messages/$(git config user.name).txt

# Commit and push
git add messages/
git commit -m "Test seal workflow"
git push origin HEAD

# Create PR via GitHub CLI
gh pr create --title "Test: Seal workflow" --body "Testing automation"

# Wait 30 seconds for workflow
sleep 30

# Check workflow status
gh run list --limit 1

# Verify encrypted file exists
gh api repos/:owner/:repo/contents/sealed/$(git config user.name).txt.gpg
```

---

## 🔍 API Reference

### GitHub Actions Context

```javascript
// Available in workflow scripts
context.payload.pull_request.user.login  // PR author username
context.repo.owner                        // Repository owner
context.repo.repo                         // Repository name
context.issue.number                      // PR number
```

### GitHub REST API Endpoints Used

```bash
# Create comment on PR
POST /repos/{owner}/{repo}/issues/{issue_number}/comments

# Close PR
PATCH /repos/{owner}/{repo}/pulls/{pull_number}
Body: { "state": "closed" }

# Create release
POST /repos/{owner}/{repo}/releases
Body: { "tag_name", "name", "body" }

# Create issue
POST /repos/{owner}/{repo}/issues
Body: { "title", "body" }
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Workflow fails with "Message file not found"

**Cause:** Message file name doesn't match GitHub username

**Solution:**
```bash
# Verify your GitHub username
gh api user | jq -r '.login'

# Ensure file name matches exactly (case-sensitive)
messages/<exact-username>.txt
```

#### 2. GPG encryption fails

**Cause:** Public key not properly imported

**Solution:**
```bash
# Check if key is imported
gpg --list-keys "GitHub Time Capsule"

# Re-import if needed
echo "$GPG_PUBLIC_KEY" | gpg --import

# Verify trust model
gpg --edit-key "GitHub Time Capsule" trust
```

#### 3. File lost during checkout

**Cause:** Not saved to `/tmp` before branch switch

**Solution:** Use the file preservation pattern:
```bash
cp "sealed/${USERNAME}.txt.gpg" "/tmp/${USERNAME}.txt.gpg"
git checkout main
cp "/tmp/${USERNAME}.txt.gpg" "sealed/${USERNAME}.txt.gpg"
```

#### 4. PR not auto-closing

**Cause:** Insufficient permissions for GITHUB_TOKEN

**Solution:** Add permissions to workflow:
```yaml
permissions:
  contents: write
  pull-requests: write
  issues: write
```

---

## 📚 Additional Resources

- [GPG Documentation](https://gnupg.org/documentation/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AES-256-GCM Encryption](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [Cron Expression Syntax](https://crontab.guru/)

---

## 🤝 Contributing to Technical Infrastructure

Want to improve the automation or security? See [SETUP.md](SETUP.md) for maintainer guidelines.

---

<div align="center">

**Built with ❤️ and ☕ by developers, for developers**

[Back to README](README.md) | [Setup Guide](SETUP.md) | [Automation Details](AUTOMATION.md)

</div>
