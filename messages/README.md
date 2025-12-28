# 📝 Messages Folder

This folder holds message files from contributors **before they are encrypted**.

---

## 📋 Quick Guide

### How to Submit Your Message

| Method | Steps |
|:-------|:------|
| 🌐 **Web App** | Visit [github-time-capsule.vercel.app](https://github-time-capsule.vercel.app) → Sign in → Write → Submit |
| 📝 **Manual PR** | Fork repo → Create `messages/YourUsername.txt` → Submit PR |

---

## 📁 File Naming Rules

### ⚠️ IMPORTANT: Filename = Your GitHub Username

Your filename is **automatically determined** by your GitHub username:

```
Your GitHub username: john123
Required filename: messages/john123.txt
```

| Rule | Example |
|:-----|:--------|
| ✅ Must match your username **exactly** | `@alice` → `messages/alice.txt` |
| ✅ Case-sensitive | `@Bob_2025` → `messages/Bob_2025.txt` |
| ❌ Cannot use custom names | You cannot choose a different name |
| ❌ Cannot create multiple files | One message per user |

### Why This Rule?

- 🛡️ **Prevents impersonation** - You can't pretend to be someone else
- 🔒 **Prevents duplicates** - GitHub usernames are globally unique
- ✅ **Ensures accountability** - Links message to your GitHub account

---

## 🔄 What Happens After You Submit

```
1. You create PR with messages/YourUsername.txt
       ↓
2. Bot validates the filename matches your username
       ↓
3. Bot encrypts your message with GPG (AES-256)
       ↓
4. Encrypted file saved to sealed/YourUsername/
       ↓
5. PR is automatically closed
       ↓
6. Original message is NEVER merged (stays private)
```

---

## 🛡️ Security Features

| Feature | Description |
|:--------|:------------|
| ✅ **Ownership validation** | You can only create YOUR file |
| ✅ **Duplicate prevention** | 1 message per username |
| ✅ **Rate limiting** | Max 3 PRs per day |
| ✅ **Auto-encryption** | GPG AES-256 + RSA-4096 |
| ✅ **Branch cleanup** | Original message never persists |

---

## ❓ FAQ

**Q: What if someone else has my username?**  
A: Impossible! GitHub usernames are unique platform-wide.

**Q: Can I edit after submitting?**  
A: Only within ~30 seconds. After encryption, it's permanent.

**Q: Can I see what others wrote?**  
A: No - all messages are encrypted until January 1, 2035.

**Q: What if I make a typo in my filename?**  
A: The workflow will fail and comment with instructions. Fix and push again.

---

## 💡 Example Message

See **[EXAMPLE-MESSAGE.txt](./EXAMPLE-MESSAGE.txt)** for inspiration!

---

<div align="center">

**Need help?** [Open an issue](../../issues/new) or [Join discussions](../../discussions)

</div>
