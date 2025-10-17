# 🔐 Setup Guide for Maintainers

This guide is for repository maintainers who need to set up the encryption infrastructure for The GitHub Time Capsule.

---

## Overview

The time capsule uses **GPG (GNU Privacy Guard)** encryption to seal messages. The process requires:

1. A GPG key pair (public and private keys)
2. The public key stored as a GitHub Secret
3. The private key stored securely offline until 2035
4. GitHub Actions configured to use the public key

---

## 🚀 Initial Setup

### Step 1: Install GPG

**On Linux:**
```bash
sudo apt-get install gnupg
```

**On macOS:**
```bash
brew install gnupg
```

**On Windows:**
Download and install [Gpg4win](https://www.gpg4win.org/)

Verify installation:
```bash
gpg --version
```

---

### Step 2: Generate the Key Pair

Run the key generation command:

```bash
gpg --full-generate-key
```

Follow the prompts:

1. **Key type**: Select `(1) RSA and RSA` (default)
2. **Key size**: Enter `4096` (maximum security)
3. **Expiration**: Enter `0` (key does not expire)
   - Confirm with `y`
4. **Name**: Enter `Time Capsule 2035`
5. **Email**: Enter `time-capsule-2035@users.noreply.github.com` (or your project email)
6. **Comment**: Enter `GitHub Time Capsule - Unlock Date: Jan 1, 2035`
7. **Passphrase**: **IMPORTANT** - Create a strong passphrase and store it securely

This will generate:
- **Public Key**: Used to encrypt messages (stored in GitHub Secrets)
- **Private Key**: Used to decrypt in 2035 (stored offline securely)

---

### Step 3: Export the Public Key

First, list your keys to get the Key ID:

```bash
gpg --list-keys
```

You'll see output like:
```
pub   rsa4096 2025-10-17 [SC]
      ABCD1234EFGH5678IJKL9012MNOP3456QRST7890
uid           [ultimate] Time Capsule 2035 <time-capsule-2035@users.noreply.github.com>
sub   rsa4096 2025-10-17 [E]
```

The long string is your Key ID. Export the public key:

```bash
gpg --armor --export time-capsule-2035@users.noreply.github.com > public-key.asc
```

Or using the Key ID:
```bash
gpg --armor --export ABCD1234EFGH5678 > public-key.asc
```

---

### Step 4: Add Public Key to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GPG_PUBLIC_KEY`
5. Value: Copy the entire contents of `public-key.asc` (including `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----`)
6. Click **Add secret**

---

### Step 5: Secure the Private Key

**This is CRITICAL for the 2035 unveiling!**

Export the private key:

```bash
gpg --armor --export-secret-keys time-capsule-2035@users.noreply.github.com > private-key.asc
```

**You will be prompted for the passphrase you created earlier.**

Now secure this key:

#### Option A: Multiple Offline Backups (Recommended)
1. Save to encrypted USB drives (at least 3 copies)
2. Store in different physical locations (bank safe deposit box, trusted family members, etc.)
3. Print a paper backup (store in fireproof safe)
4. Store in encrypted cloud storage (as additional backup)

#### Option B: Secret Sharing (Advanced)
Use [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing) to split the key:
```bash
# Install ssss (Shamir's Secret Sharing Scheme)
sudo apt-get install ssss

# Split the key into 5 shares, requiring 3 to reconstruct
cat private-key.asc | ssss-split -t 3 -n 5
```

Distribute shares to trusted maintainers.

#### Option C: Scheduled Release Service
Consider services like:
- **Dead Man's Switch**: Automated email delivery
- **Time-locked Cryptocurrency Wallet**: Store key with time-lock
- **Legal Trust**: Include in a time-released legal document

---

### Step 6: Store the Passphrase Securely

The passphrase is needed to use the private key in 2035. Store it:

1. Password manager with 2035 reminder
2. Sealed envelope in safe deposit box
3. Encrypted note with trusted executor
4. Split using secret sharing (like the key)

**Never store the passphrase with the private key!**

---

### Step 7: Document Everything

Create a `UNVEILING-INSTRUCTIONS.md` file (store offline) with:

```markdown
# Time Capsule Unveiling Instructions - January 1, 2035

## Key Information
- Public Key ID: [Your Key ID]
- Creation Date: October 17, 2025
- Purpose: Decrypt GitHub Time Capsule messages

## Location of Private Key
1. USB Drive #1: [Location]
2. USB Drive #2: [Location]
3. USB Drive #3: [Location]
4. Paper Backup: [Location]
5. Cloud Backup: [Service and account]

## Passphrase Recovery
[Instructions for recovering passphrase]

## Decryption Process
1. Install GPG on your system
2. Import private key: `gpg --import private-key.asc`
3. Use decryption script in repository
4. Publish decrypted messages and decryption key

## Emergency Contacts
- Maintainer 1: [Name, Email]
- Maintainer 2: [Name, Email]
- Backup Maintainer: [Name, Email]
```

---

## 🔄 Testing the Setup

### Test Encryption

Create a test file:
```bash
echo "Test message for time capsule" > test-message.txt
```

Encrypt it:
```bash
gpg --trust-model always --encrypt --recipient time-capsule-2035 \
    --output test-message.txt.gpg test-message.txt
```

Verify encrypted file was created:
```bash
ls -lh test-message.txt.gpg
```

### Test Decryption

Decrypt to verify the key pair works:
```bash
gpg --decrypt test-message.txt.gpg
```

You should see: `Test message for time capsule`

If successful, your keys are working correctly! 🎉

---

## 🔒 Security Best Practices

### For the Public Key
- ✅ Safe to commit to repository
- ✅ Safe to share publicly
- ✅ Store in GitHub Secrets
- ✅ No need to encrypt

### For the Private Key
- ❌ **NEVER** commit to repository
- ❌ **NEVER** store in GitHub Secrets
- ❌ **NEVER** share publicly
- ✅ Encrypt before storing anywhere online
- ✅ Keep multiple offline backups
- ✅ Store in physically secure locations

### Passphrase Guidelines
- Use a strong, memorable passphrase (not password)
- Minimum 20 characters recommended
- Include mix of words, numbers, symbols
- Store separately from private key
- Consider using Diceware method

---

## 📅 Maintenance Schedule

### Annually (Until 2035)
- [ ] Verify private key backups are still accessible
- [ ] Test one backup by attempting decryption
- [ ] Update maintainer contact information
- [ ] Review and refresh storage locations if needed
- [ ] Check that GitHub Actions workflow still functions

### Every 5 Years
- [ ] Migrate keys to new storage media (USB drives degrade)
- [ ] Update encryption if GPG algorithms are deprecated
- [ ] Review and update unveiling procedures

---

## 🚨 Emergency Procedures

### If Private Key is Lost
**This is catastrophic** - messages cannot be decrypted!

Immediate actions:
1. Check all backup locations immediately
2. Attempt recovery from secret sharing shares
3. Contact all maintainers to search for backups
4. If truly lost, update community transparently

### If Private Key is Compromised
If the private key is accidentally exposed publicly:

1. Generate new key pair immediately
2. Re-encrypt all existing messages with new public key
3. Secure new private key properly
4. Announce to community (optional, depending on situation)

---

## 🎆 The Unveiling (January 1, 2035)

When the time comes:

1. Retrieve private key from secure storage
2. Import into GPG: `gpg --import private-key.asc`
3. Enter passphrase when prompted
4. Run decryption script (see `scripts/decrypt-capsule.sh`)
5. Publish decrypted messages to repository
6. Publish private key and passphrase publicly (the secret is revealed!)
7. Celebrate with the community! 🎉

---

## 📞 Support

If you have questions about this setup:

1. Check GPG documentation: https://gnupg.org/documentation/
2. Review GitHub Actions encryption examples
3. Contact current maintainers
4. Open a discussion (without revealing sensitive info)

---

## ✅ Setup Checklist

Use this checklist to ensure everything is configured:

- [ ] GPG installed and working
- [ ] Key pair generated (4096-bit RSA)
- [ ] Public key exported to file
- [ ] Public key added to GitHub Secrets (`GPG_PUBLIC_KEY`)
- [ ] Private key exported and encrypted
- [ ] Private key stored in at least 3 locations
- [ ] Passphrase stored securely (separate from key)
- [ ] Unveiling instructions documented
- [ ] Test encryption successful
- [ ] Test decryption successful
- [ ] Cleanup: Delete local copies of keys
- [ ] GitHub Action tested with real PR
- [ ] Emergency procedures documented
- [ ] Calendar reminders set for annual checks

---

**Once complete, delete `public-key.asc` and `private-key.asc` from your local machine!**

---

## 🌟 Thank You

By setting up this infrastructure properly, you're ensuring that thousands of messages will be preserved and revealed in 2035. Your attention to security and detail makes this project possible.

**See you in the future!** 🕰️

---

*Last Updated: October 17, 2025*
*Next Review: October 17, 2026*
