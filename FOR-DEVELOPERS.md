# 🔧 Developer Documentation

> Technical documentation for developers who want to understand the implementation, contribute, or fork this project.

---

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Technology Stack](#-technology-stack)
- [Workflow Details](#-workflow-details)
- [Encryption System](#-encryption-system)
- [Security Model](#-security-model)
- [Local Development](#-local-development)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architecture Overview

### System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Time Capsule System                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User submits message (Web App or PR)                           │
│         ↓                                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  GitHub Actions: encrypt-msg.yml                           │ │
│  │  Trigger: pull_request_target [opened]                     │ │
│  │  ├─ Extract username from PR author                        │ │
│  │  ├─ Validate message file exists                           │ │
│  │  ├─ Import GPG public key                                  │ │
│  │  ├─ Encrypt with GPG (AES-256)                             │ │
│  │  ├─ Commit encrypted file to main                          │ │
│  │  └─ Close PR with success comment                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│         ↓                                                        │
│  Encrypted message stored in: sealed/{username}/*.gpg           │
│         ↓                                                        │
│  [WAIT 10 YEARS - Message is locked]                            │
│         ↓                                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  GitHub Actions: auto-unveiling.yml                        │ │
│  │  Trigger: schedule (cron: '0 0 1 1 2035')                  │ │
│  │  ├─ Import GPG private key                                 │ │
│  │  ├─ Decrypt all sealed/*.gpg files                         │ │
│  │  ├─ Save to decrypted-messages/                            │ │
│  │  ├─ Create GitHub Release                                  │ │
│  │  └─ Create announcement issue                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│         ↓                                                        │
│  Decrypted messages available: decrypted-messages/*.txt         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Repository Structure

```
.
├── .github/
│   ├── workflows/
│   │   ├── encrypt-msg.yml        # 🔐 Encrypt on PR (main workflow)
│   │   ├── rate-limit.yml         # 🚦 Rate limit check
│   │   ├── auto-unveiling.yml     # 🎆 Decrypt on Jan 1, 2035
│   │   └── update-statistics.yml  # 📊 Update stats daily
│   └── dependabot.yml             # 🔄 Auto dependency updates
├── messages/                       # 📝 User-submitted (before encrypt)
│   ├── EXAMPLE-MESSAGE.txt
│   └── README.md
├── sealed/                         # 🔒 Encrypted messages
│   └── {username}/*.gpg
├── web/                            # 🌐 Next.js web application
├── README.md                       # 📖 User guide
├── FOR-DEVELOPERS.md               # 🔧 This file
├── HOW-TO-READ-2035.md            # 📬 Future reading guide
├── TESTING.md                      # 🧪 Testing guide
└── LICENSE                         # 📜 MIT License
```

---

## 💻 Technology Stack

| Component | Technology | Purpose |
|:----------|:-----------|:--------|
| **Encryption** | GPG 2.x + AES-256 | Military-grade message encryption |
| **Key Management** | RSA 4096-bit | Public/private key pair |
| **Automation** | GitHub Actions | 100% automated sealing & unveiling |
| **Web App** | Next.js 16 + NextAuth | User-friendly submission interface |
| **Deployment** | Vercel | Web app hosting |
| **Storage** | Git + GitHub | Version control & persistence |

---

## ⚙️ Workflow Details

### 1. Encrypt Message Workflow

**File:** `.github/workflows/encrypt-msg.yml`

| Property | Value |
|:---------|:------|
| **Trigger** | `pull_request_target` (opened, synchronize, reopened) |
| **Paths** | `messages/**`, `sealed/**` |
| **Duration** | ~15-30 seconds |

**Key Steps:**

1. 💬 Comment "Processing..." on PR
2. 📥 Checkout PR content
3. 👤 Extract username from PR author
4. 🔐 Import GPG public key & encrypt message
5. 💾 Commit encrypted file directly to main
6. ✅ Comment success message
7. 🚪 Close PR

### 2. Rate Limit Workflow

**File:** `.github/workflows/rate-limit.yml`

| Property | Value |
|:---------|:------|
| **Trigger** | `pull_request_target` (opened) |
| **Limit** | 3 PRs per user per 24 hours |
| **Action** | Close PR with warning if exceeded |

### 3. Auto-Unveiling Workflow

**File:** `.github/workflows/auto-unveiling.yml`

| Property | Value |
|:---------|:------|
| **Trigger** | Cron: `0 0 1 1 2035` (Jan 1, 2035 00:00 UTC) |
| **Action** | Decrypt all messages, create release |

---

## 🔐 Encryption System

### Algorithm Details

| Property | Value |
|:---------|:------|
| **Cipher** | AES-256-GCM (Galois/Counter Mode) |
| **Key Type** | RSA 4096-bit |
| **Tool** | GPG (GNU Privacy Guard) 2.x |
| **Security** | Military-grade |

### Encryption Process

```bash
# Import public key
echo "$GPG_PUBLIC_KEY" | gpg --import

# Encrypt message
gpg --encrypt \
    --recipient "time-capsule-2035" \
    --armor \
    --trust-model always \
    --output "sealed/${USERNAME}/${USERNAME}-${TIMESTAMP}.gpg" \
    "messages/${USERNAME}.txt"
```

### Decryption Process (2035)

```bash
# Import private key
echo "$GPG_PRIVATE_KEY" | gpg --batch --import

# Decrypt all messages
for file in sealed/*/*.gpg; do
    gpg --decrypt --batch \
        --passphrase "$GPG_PASSPHRASE" \
        --output "decrypted-messages/$(basename $file .gpg).txt" \
        "$file"
done
```

### GitHub Secrets Required

| Secret | Description |
|:-------|:------------|
| `GPG_PUBLIC_KEY` | Public key for encryption |
| `GPG_PRIVATE_KEY` | Private key for decryption (2035) |
| `GPG_PASSPHRASE` | Protects the private key |

---

## 🔒 Security Model

### Protected Against

| Threat | Protection |
|:-------|:-----------|
| ✅ Unauthorized decryption | RSA-4096 + AES-256 |
| ✅ Message tampering | GPG signatures |
| ✅ Spam/abuse | Rate limiting (3 PRs/day) |
| ✅ Impersonation | Username validation |

### Not Protected Against

| Threat | Mitigation |
|:-------|:-----------|
| ❌ GitHub account compromise | Use 2FA! |
| ❌ Quantum computing (post-2030s) | May break RSA-4096 |
| ❌ GitHub platform shutdown | Regular backups |

---

## 🧪 Local Development

### Prerequisites

```bash
# Install GPG
brew install gnupg  # macOS
sudo apt install gnupg  # Ubuntu

# Clone repository
git clone https://github.com/ThanhNguyxn/github-time-capsule.git
cd github-time-capsule
```

### Run Web App Locally

```bash
cd web
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
# Open http://localhost:3000
```

### Test Encryption Locally

```bash
# Create test message
echo "Test message" > messages/testuser.txt

# Import public key (from secrets)
echo "$GPG_PUBLIC_KEY" | gpg --import

# Encrypt
gpg --encrypt \
    --recipient "time-capsule-2035" \
    --armor \
    --trust-model always \
    --output sealed/testuser/test.gpg \
    messages/testuser.txt
```

---

## 🤝 Contributing

### How to Contribute

1. **Fork** the repository
2. **Create branch:** `git checkout -b feature/your-feature`
3. **Make changes** and test thoroughly
4. **Commit:** `git commit -m "feat: add feature"`
5. **Push:** `git push origin feature/your-feature`
6. **Create Pull Request**

### Commit Format

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
```

### Areas to Contribute

| Area | Description |
|:-----|:------------|
| 🔒 Security | Review & improve encryption |
| ⚙️ Workflows | Optimize GitHub Actions |
| 📖 Documentation | Improve guides |
| 🌐 Web App | Improve UI/UX |
| 🧪 Testing | Add test coverage |

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|:------|:---------|
| "Message file not found" | Filename must match your GitHub username exactly |
| "GPG encryption fails" | Check GPG_PUBLIC_KEY secret is correct |
| "PR doesn't auto-close" | Check workflow permissions in repo settings |
| "Workflow fails with permission denied" | Enable "Read and write permissions" in Actions settings |

### Get Help

- 📖 Check [TESTING.md](./TESTING.md) for testing guide
- 🐛 Open an [issue](../../issues/new)
- 💬 Join [discussions](../../discussions)

---

<div align="center">

**Happy coding!** 🚀

</div>
