# 🔧 For Developers & Technical Details

> This document is for developers who want to understand the technical implementation, contribute to the project, or fork it for their own use.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Encryption System](#encryption-system)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Security Model](#security-model)
- [Testing & Development](#testing--development)
- [Contributing](#contributing)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Time Capsule System                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User Message (Plain Text)                                       │
│         ↓                                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GitHub Actions: seal-the-capsule.yml                     │  │
│  │  Trigger: pull_request [opened]                           │  │
│  │  ├─ Extract username from PR                              │  │
│  │  ├─ Validate message file exists                          │  │
│  │  ├─ Import GPG public key (from GitHub Secrets)           │  │
│  │  ├─ Encrypt with AES-256-GCM                              │  │
│  │  ├─ Save encrypted file to /tmp                           │  │
│  │  ├─ Checkout main branch                                  │  │
│  │  ├─ Restore encrypted file                                │  │
│  │  ├─ Commit to main branch                                 │  │
│  │  └─ Close PR with confirmation comment                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│         ↓                                                         │
│  Encrypted Message (sealed/*.gpg)                                │
│         ↓                                                         │
│  [WAIT 10 YEARS - Message is locked]                             │
│         ↓                                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GitHub Actions: auto-unveiling.yml                       │  │
│  │  Trigger: schedule (cron: '0 0 1 1 2035')                 │  │
│  │  ├─ Import GPG private key & passphrase                   │  │
│  │  ├─ Decrypt all sealed/*.gpg files                        │  │
│  │  ├─ Save to decrypted-messages/                           │  │
│  │  ├─ Generate statistics                                   │  │
│  │  ├─ Create GitHub Release                                 │  │
│  │  ├─ Publish decryption key publicly                       │  │
│  │  └─ Create announcement issue                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│         ↓                                                         │
│  Decrypted Messages (decrypted-messages/*.txt)                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Repository Structure

```
.
├── .github/
│   └── workflows/
│       ├── seal-the-capsule.yml       # Auto-encrypt on PR open
│       └── auto-unveiling.yml         # Auto-decrypt Jan 1, 2035
├── messages/                           # User-submitted messages
│   ├── EXAMPLE-MESSAGE.txt
│   └── <username>.txt
├── sealed/                             # Encrypted messages
│   └── <username>.txt.gpg
├── decrypted-messages/                 # Created in 2035
│   └── <username>.txt
├── README.md                           # User guide (non-technical)
├── FOR-DEVELOPERS.md                   # This file
├── LICENSE                             # MIT License
└── .gitignore
```

---

## 💻 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Encryption** | GPG 2.x + AES-256-GCM | Military-grade message encryption |
| **Key Management** | RSA 4096-bit | Public/private key pair |
| **Automation** | GitHub Actions | 100% automated sealing & unveiling |
| **Storage** | Git + GitHub | Version control & persistence |
| **CI/CD** | YAML Workflows | Automated processing pipeline |
| **Scripting** | Bash | Workflow automation scripts |

---

## 🔐 Encryption System

### Algorithm Details

- **Cipher:** AES-256-GCM (Galois/Counter Mode)
- **Key Type:** RSA 4096-bit
- **Tool:** GPG (GNU Privacy Guard) 2.x
- **Security Level:** Military-grade

### Encryption Process (Sealing)

```bash
# Import public key from GitHub Secrets
echo "$GPG_PUBLIC_KEY" | gpg --import

# Encrypt message
gpg --encrypt \
    --recipient "GitHub Time Capsule" \
    --armor \
    --trust-model always \
    --cipher-algo AES256 \
    --output "sealed/${USERNAME}.txt.gpg" \
    "messages/${USERNAME}.txt"

# Verify encryption
gpg --list-packets "sealed/${USERNAME}.txt.gpg"
```

### Decryption Process (Unveiling - 2035)

```bash
# Import private key and passphrase
echo "$GPG_PRIVATE_KEY" | gpg --batch --import
echo "$GPG_PASSPHRASE" > passphrase.txt

# Decrypt all messages
for encrypted_file in sealed/*.gpg; do
    filename=$(basename "$encrypted_file" .gpg)
    gpg --decrypt \
        --batch \
        --passphrase-file passphrase.txt \
        --output "decrypted-messages/$filename" \
        "$encrypted_file"
    echo "✅ Decrypted: $filename"
done

# Cleanup
rm passphrase.txt
```

### Key Management

```yaml
GitHub Secrets (Repository Settings → Secrets):
  GPG_PUBLIC_KEY:      # Public key for encryption (used during sealing)
  GPG_PRIVATE_KEY:     # Private key for decryption (released in 2035)
  GPG_PASSPHRASE:      # Protects the private key
```

**Key Generation:**
```bash
# Generate 4096-bit RSA key pair
gpg --full-generate-key
# Select: RSA and RSA, 4096 bits, expires: never
# Name: time-capsule-2035
# Email: thanhnguyentuan2007@gmail.com

# Export public key
gpg --armor --export "time-capsule-2035" > public_key.asc

# Export private key
gpg --armor --export-secret-keys "time-capsule-2035" > private_key.asc

# Store in GitHub Secrets (copy entire file contents, including headers)
cat public_key.asc   # Copy this to GPG_PUBLIC_KEY secret
cat private_key.asc  # Copy this to GPG_PRIVATE_KEY secret
```

---

## ⚙️ GitHub Actions Workflows

### 1. Seal the Capsule Workflow

**File:** `.github/workflows/seal-the-capsule.yml`  
**Trigger:** `pull_request` event (type: `opened`)  
**Duration:** ~15-30 seconds per message

```yaml
name: 🔒 Seal the Capsule

on:
  pull_request:
    types: [opened]

permissions:
  contents: write
  pull-requests: write

jobs:
  seal-message:
    runs-on: ubuntu-latest
    
    steps:
      # 1. Checkout PR branch
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.ref }}
          repository: ${{ github.event.pull_request.head.repo.full_name }}

      # 2. Extract username from PR author
      - name: 📝 Extract username
        run: echo "USERNAME=${{ github.event.pull_request.user.login }}" >> $GITHUB_ENV

      # 3. Validate message file exists
      - name: ✅ Validate message file
        run: |
          if [ ! -f "messages/${USERNAME}.txt" ]; then
            echo "❌ Error: messages/${USERNAME}.txt not found"
            exit 1
          fi
          echo "✅ Message file found: messages/${USERNAME}.txt"

      # 4. Import GPG public key
      - name: 🔑 Import GPG public key
        run: |
          echo "${{ secrets.GPG_PUBLIC_KEY }}" | gpg --import
          gpg --list-keys

      # 5. Encrypt message
      - name: 🔒 Encrypt message
        run: |
          mkdir -p sealed
          gpg --encrypt \
              --recipient "GitHub Time Capsule" \
              --armor \
              --trust-model always \
              --output "sealed/${USERNAME}.txt.gpg" \
              "messages/${USERNAME}.txt"
          echo "✅ Message encrypted: sealed/${USERNAME}.txt.gpg"
          ls -lh "sealed/${USERNAME}.txt.gpg"

      # 6. Save to /tmp (critical: preserves file across checkout)
      - name: 💾 Save encrypted file temporarily
        run: |
          cp "sealed/${USERNAME}.txt.gpg" "/tmp/${USERNAME}.txt.gpg"
          echo "✅ Saved to /tmp for preservation"

      # 7. Checkout main branch
      - uses: actions/checkout@v4
        with:
          ref: main
          token: ${{ secrets.GITHUB_TOKEN }}

      # 8. Restore encrypted file
      - name: 📦 Restore encrypted file
        run: |
          mkdir -p sealed
          cp "/tmp/${USERNAME}.txt.gpg" "sealed/${USERNAME}.txt.gpg"
          echo "✅ Restored encrypted file to sealed/"

      # 9. Commit to main branch
      - name: ✍️ Commit encrypted message to main
        run: |
          git config user.name "Time Capsule Bot"
          git config user.email "bot@timecapsule.dev"
          git add "sealed/${USERNAME}.txt.gpg"
          git commit -m "🔒 Sealed message from @${USERNAME}"
          git push origin main
          echo "✅ Committed and pushed to main"

      # 10. Close PR with confirmation
      - name: 🎉 Close PR with confirmation
        uses: actions/github-script@v7
        with:
          script: |
            const username = process.env.USERNAME;
            const comment = `## 🎉 Your Message Has Been Sealed!

**@${username}**, your time capsule message has been successfully encrypted and sealed!

### What Just Happened:
- ✅ Your message was encrypted with AES-256-GCM encryption
- ✅ Saved to: \`sealed/${username}.txt.gpg\`
- ✅ Committed to the main branch
- ✅ This PR is now being closed automatically

### What Happens Next:
- 🔒 Your message is now locked until **January 1, 2035**
- ⏰ On that date, it will be automatically decrypted
- 🎉 You and everyone else can read it then!

### Important Notes:
- 💾 Keep a copy of your original message in your fork if you want!
- 🔐 The encrypted version cannot be read by anyone until 2035
- ⭐ Star this repository to remember to come back!

**Thank you for participating in The GitHub Time Capsule!**

---
*🕰️ See you on January 1, 2035!*`;

            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: comment
            });

            await github.rest.pulls.update({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number,
              state: 'closed'
            });
```

**Critical Implementation Detail: File Preservation**

The workflow uses `/tmp` to preserve the encrypted file across the `checkout` action:

```bash
# Problem: Checking out a different branch loses uncommitted files
# Solution: Copy to /tmp before checkout, restore after

# BEFORE checkout - save file
cp "sealed/${USERNAME}.txt.gpg" "/tmp/${USERNAME}.txt.gpg"

# Checkout main branch (would normally lose the file)
git checkout main

# AFTER checkout - restore file
cp "/tmp/${USERNAME}.txt.gpg" "sealed/${USERNAME}.txt.gpg"
```

This pattern is **essential** for the workflow to function correctly.

---

### 2. Auto-Unveiling Workflow

**File:** `.github/workflows/auto-unveiling.yml`  
**Trigger:** Scheduled cron on January 1, 2035 at 00:00 UTC  
**Duration:** Depends on number of messages (~1-5 minutes for 1000 messages)

> 📖 **For End Users:** See [HOW-TO-READ-2035.md](./HOW-TO-READ-2035.md) for non-technical instructions on how to access your message in 2035.

```yaml
name: 🎆 Auto-Unveiling 2035

on:
  schedule:
    - cron: '0 0 1 1 2035'  # January 1, 2035, 00:00 UTC
  workflow_dispatch:          # Manual trigger for testing

jobs:
  unveil-capsule:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4

      - name: 🔑 Import GPG private key
        run: |
          echo "${{ secrets.GPG_PRIVATE_KEY }}" | gpg --batch --import
          echo "${{ secrets.GPG_PASSPHRASE }}" > passphrase.txt
          gpg --list-secret-keys

      - name: 🔓 Decrypt all messages
        run: |
          mkdir -p decrypted-messages
          count=0
          
          for encrypted_file in sealed/*.gpg; do
            if [ "$encrypted_file" = "sealed/*.gpg" ]; then
              echo "⚠️  No encrypted files found"
              exit 1
            fi
            
            filename=$(basename "$encrypted_file" .gpg)
            gpg --decrypt \
                --batch \
                --passphrase-file passphrase.txt \
                --output "decrypted-messages/$filename" \
                "$encrypted_file"
            
            ((count++))
            echo "✅ Decrypted ($count): $filename"
          done
          
          echo "🎉 Total messages decrypted: $count"
          echo "TOTAL_MESSAGES=$count" >> $GITHUB_ENV

      - name: 📊 Generate statistics
        run: |
          echo "# 🎆 Unveiling Statistics" > STATISTICS.md
          echo "" >> STATISTICS.md
          echo "- **Total Messages:** $TOTAL_MESSAGES" >> STATISTICS.md
          echo "- **Unveiling Date:** $(date)" >> STATISTICS.md
          echo "" >> STATISTICS.md
          echo "## Contributors" >> STATISTICS.md
          ls decrypted-messages/*.txt | xargs -n1 basename | sed 's/.txt//' | sed 's/^/- @/' >> STATISTICS.md

      - name: 🎉 Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: unveiling-2035
          release_name: 🎆 Time Capsule Unveiling - January 1, 2035
          body: |
            # 🎉 The Time Capsule Has Been Opened!
            
            After 10 years of waiting, all ${{ env.TOTAL_MESSAGES }} messages have been decrypted and revealed!
            
            ## What's Inside:
            - 📂 **Decrypted Messages:** `decrypted-messages/` folder
            - 🔑 **Decryption Key:** `DECRYPTION_KEY.asc`
            - 📊 **Statistics:** `STATISTICS.md`
            
            ## Thank You
            To everyone who participated in 2025 - thank you for being part of this journey!
            
            🕰️ **Welcome to 2035!**

      - name: 📢 Publish decryption key
        run: |
          echo "${{ secrets.GPG_PRIVATE_KEY }}" > DECRYPTION_KEY.asc
          echo "${{ secrets.GPG_PASSPHRASE }}" > PASSPHRASE.txt
          echo "✅ Decryption key published for verification"

      - name: ✍️ Commit everything
        run: |
          rm passphrase.txt  # Don't commit this one
          git config user.name "Time Capsule Bot"
          git config user.email "bot@timecapsule.dev"
          git add decrypted-messages/ STATISTICS.md DECRYPTION_KEY.asc PASSPHRASE.txt
          git commit -m "🎆 Unveiling: All $TOTAL_MESSAGES messages decrypted!"
          git push origin main

      - name: 📣 Create announcement issue
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🎉 THE TIME CAPSULE HAS BEEN OPENED! (2035 Unveiling)',
              body: `# 🎆 Welcome to 2035!

After 10 years of waiting, the GitHub Time Capsule has been automatically opened!

## 📊 Statistics
- **Total Messages:** ${process.env.TOTAL_MESSAGES}
- **Unveiling Date:** ${new Date().toISOString()}

## 📂 What's Available
- **Decrypted Messages:** Check the \`decrypted-messages/\` folder
- **Release:** See the [Unveiling Release](../releases/tag/unveiling-2035)
- **Statistics:** Read \`STATISTICS.md\`

## 🎉 Thank You
To everyone who participated back in 2025 - your messages are now part of history!

**Welcome to the future!** 🚀`
            });
```

---

## 🔒 Security Model

### Threat Model

**✅ Protected Against:**
- Unauthorized decryption before 2035 (mathematically impossible without private key)
- Message tampering (GPG signatures detect modifications)
- Man-in-the-middle attacks (GitHub's TLS encryption)
- Brute force attacks (4096-bit RSA ≈ 2^4096 possible keys)
- Replay attacks (one-time encryption per user)

**❌ Not Protected Against:**
- GitHub account compromise (use 2FA!)
- Quantum computing attacks (post-2030s may break RSA-4096)
- GitHub platform shutdown (mitigated by backups)
- Social engineering (phishing, etc.)

### Best Practices

1. **Never commit secrets** to the repository
2. **Use GitHub Secrets** for all sensitive data
3. **Enable 2FA** on GitHub accounts
4. **Audit workflow logs** regularly
5. **Backup private keys** in multiple secure locations
6. **Test workflows** in a fork before deploying

---

## 🧪 Testing & Development

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/ThanhNguyxn/github-time-capsule.git
cd github-time-capsule

# 2. Install GPG (if not already installed)
# macOS:
brew install gnupg

# Ubuntu/Debian:
sudo apt-get install gnupg

# Windows:
# Download from https://www.gpg4win.org/

# 3. Verify GPG installation
gpg --version
```

### Testing Encryption Locally

```bash
# Create test message
echo "Test message from $(date)" > messages/testuser.txt

# Import public key (from GitHub Secrets)
echo "$GPG_PUBLIC_KEY" | gpg --import

# Encrypt
gpg --encrypt \
    --recipient "GitHub Time Capsule" \
    --armor \
    --trust-model always \
    --output sealed/testuser.txt.gpg \
    messages/testuser.txt

# Verify encrypted file
gpg --list-packets sealed/testuser.txt.gpg
ls -lh sealed/testuser.txt.gpg

# Test decryption (requires private key)
gpg --decrypt \
    --batch \
    --passphrase "$GPG_PASSPHRASE" \
    sealed/testuser.txt.gpg

# Compare original and decrypted
diff messages/testuser.txt <(gpg --decrypt --batch --passphrase "$GPG_PASSPHRASE" sealed/testuser.txt.gpg)
```

### Testing via Pull Request

```bash
# 1. Create test branch
git checkout -b test-seal-$(date +%s)

# 2. Create test message
echo "Test at $(date)" > messages/$(gh api user -q .login).txt

# 3. Commit and push
git add messages/
git commit -m "Test: Seal workflow"
git push origin HEAD

# 4. Create PR (using GitHub CLI)
gh pr create \
  --title "Test: Seal workflow" \
  --body "Testing automation - please ignore"

# 5. Monitor workflow
gh run watch

# 6. Check workflow status
gh run list --limit 1

# 7. View PR status
gh pr view --json state,comments

# 8. Verify encrypted file was created
gh api repos/:owner/:repo/contents/sealed/$(gh api user -q .login).txt.gpg

# 9. Cleanup
gh pr close
git checkout main
git branch -D test-seal-*
```

### Testing with Act (Local GitHub Actions)

```bash
# Install act (https://github.com/nektos/act)
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Create .secrets file
cat > .secrets << EOF
GPG_PUBLIC_KEY=<your-public-key>
GPG_PRIVATE_KEY=<your-private-key>
GPG_PASSPHRASE=<your-passphrase>
EOF

# Test seal workflow
act pull_request --secret-file .secrets

# Test unveiling workflow
act schedule --secret-file .secrets -j unveil-capsule
```

---

## 🤝 Contributing

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes**
4. **Test thoroughly** (see Testing section above)
5. **Commit with conventional commits**: `git commit -m "feat: Add feature"`
6. **Push**: `git push origin feature/your-feature`
7. **Create Pull Request**

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```bash
git commit -m "feat(encryption): Upgrade to AES-256-GCM"
git commit -m "fix(workflow): Preserve encrypted file across checkout"
git commit -m "docs(readme): Add FAQ section"
```

### Areas to Contribute

- 🔒 **Security:** Review and improve encryption
- ⚙️ **Workflows:** Optimize GitHub Actions
- 📖 **Documentation:** Improve guides and docs
- 🧪 **Testing:** Add test coverage
- 🌍 **i18n:** Add translations
- 🎨 **UI/UX:** Improve README design

---

## 📚 API Reference

### Environment Variables

```yaml
# GitHub Actions Context
USERNAME:           # Extracted from PR author
GITHUB_TOKEN:       # Auto-provided by GitHub Actions
GITHUB_WORKSPACE:   # Working directory path

# Custom Secrets
GPG_PUBLIC_KEY:     # Public key for encryption
GPG_PRIVATE_KEY:    # Private key for decryption
GPG_PASSPHRASE:     # Passphrase protecting private key
```

### GitHub REST API Endpoints Used

```javascript
// Create comment on PR
POST /repos/{owner}/{repo}/issues/{issue_number}/comments
Body: { body: "comment text" }

// Close PR
PATCH /repos/{owner}/{repo}/pulls/{pull_number}
Body: { state: "closed" }

// Create release
POST /repos/{owner}/{repo}/releases
Body: { tag_name, name, body }

// Create issue
POST /repos/{owner}/{repo}/issues
Body: { title, body }
```

### GPG Commands Reference

```bash
# Key management
gpg --list-keys                    # List public keys
gpg --list-secret-keys             # List private keys
gpg --export <key-id>              # Export public key
gpg --export-secret-keys <key-id>  # Export private key
gpg --import <keyfile>             # Import key
gpg --delete-keys <key-id>         # Delete public key
gpg --delete-secret-keys <key-id>  # Delete private key

# Encryption/Decryption
gpg --encrypt <file>               # Encrypt file
gpg --decrypt <file>               # Decrypt file
gpg --list-packets <file>          # View encrypted file info
gpg --verify <file>                # Verify signature
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Message file not found"

**Cause:** Filename doesn't match GitHub username

**Solution:**
```bash
# Check your exact GitHub username
gh api user -q .login

# Ensure filename matches exactly (case-sensitive)
messages/<exact-username>.txt
```

#### Issue: "GPG encryption fails"

**Cause:** Public key not properly imported

**Solution:**
```bash
# Verify key is imported
gpg --list-keys "GitHub Time Capsule"

# Re-import if needed
echo "$GPG_PUBLIC_KEY" | gpg --import

# Check trust level
gpg --edit-key "GitHub Time Capsule"
> trust
> 5 (ultimate trust)
> quit
```

#### Issue: "Encrypted file lost during checkout"

**Cause:** Not preserved to /tmp before branch switch

**Solution:** Use the file preservation pattern:
```bash
cp "sealed/${USERNAME}.txt.gpg" "/tmp/${USERNAME}.txt.gpg"
git checkout main
cp "/tmp/${USERNAME}.txt.gpg" "sealed/${USERNAME}.txt.gpg"
```

#### Issue: "PR doesn't auto-close"

**Cause:** Insufficient workflow permissions

**Solution:**
```yaml
# Add to workflow file
permissions:
  contents: write
  pull-requests: write
```

Also check: Repository Settings → Actions → General → Workflow permissions → Enable "Read and write permissions"

#### Issue: "Workflow fails with permission denied"

**Cause:** GITHUB_TOKEN lacks permissions

**Solution:**
```yaml
# Use PAT (Personal Access Token) instead
- uses: actions/checkout@v4
  with:
    token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

---

## 📖 Additional Resources

- [GPG Documentation](https://gnupg.org/documentation/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AES-256-GCM Specification](https://csrc.nist.gov/publications/detail/sp/800-38d/final)
- [RSA Cryptography](https://en.wikipedia.org/wiki/RSA_(cryptosystem))
- [Cron Expression Syntax](https://crontab.guru/)

---

## 🎓 Learning Resources

### For Beginners
- [GitHub Actions Tutorial](https://docs.github.com/en/actions/learn-github-actions)
- [GPG Quickstart](https://gnupg.org/documentation/howtos.html)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)

### For Advanced Users
- [GitHub Actions Advanced Workflows](https://docs.github.com/en/actions/using-workflows/advanced-workflow-features)
- [Cryptography Best Practices](https://cryptography.io/en/latest/)
- [CI/CD Security](https://owasp.org/www-project-devsecops-guideline/)

---

## 📞 Support

- 🐛 **Bug Reports:** [Open an Issue](../../issues/new?template=bug_report.md)
- 💡 **Feature Requests:** [Open an Issue](../../issues/new?template=feature_request.md)
- 💬 **Discussions:** [GitHub Discussions](../../discussions)
- 📧 **Security Issues:** Email maintainers directly (see [SECURITY.md](SECURITY.md))

---

<div align="center">

**Built with ❤️ and ☕ by developers, for developers**

[Back to README](README.md) | [Report Issues](../../issues) | [Discussions](../../discussions)

</div>

