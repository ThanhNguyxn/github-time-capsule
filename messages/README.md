# 📝 Messages Folder

This directory holds message files from contributors before they are sealed.

## 🔒 Important Rules:

### **1. File Naming (AUTOMATIC - NO CHOICE)**

⚠️ **YOU CANNOT CHOOSE YOUR FILENAME!**

The filename is **AUTOMATICALLY** determined by your GitHub username:

```
Your GitHub username: john123
Required filename: messages/john123.txt
```

**Rules:**
- ✅ File MUST be named: `messages/[YourGitHubUsername].txt`
- ✅ Must match your GitHub username EXACTLY (case-sensitive)
- ❌ You CANNOT use a different name
- ❌ You CANNOT choose a custom filename

**Examples:**
- GitHub user `@ThanhNguyxn` → MUST create `messages/ThanhNguyxn.txt`
- GitHub user `@alice` → MUST create `messages/alice.txt`
- GitHub user `@Bob_2025` → MUST create `messages/Bob_2025.txt`

**Why automatic?**
- Prevents impersonation (you can't pretend to be someone else)
- Prevents duplicate names (GitHub usernames are globally unique)
- Ensures one message per user
- Links message to GitHub account for accountability

### **2. Name Conflicts? IMPOSSIBLE!**

**❓ "What if two people have the same name?"**

**Answer: CANNOT HAPPEN!** GitHub usernames are unique worldwide.

**Proof:**
- ✅ GitHub has 100+ million users
- ✅ Each username is unique (enforced by GitHub)
- ✅ If `@john` exists, nobody else can register `@john`
- ✅ Second person must use: `@john123`, `@john_dev`, `@johnsmith`, etc.

**Your GitHub username IS your unique identifier!**

Think of it like:
- Email addresses: Only ONE person owns `john@gmail.com`
- Phone numbers: Only ONE person has `+1-555-1234`
- GitHub usernames: Only ONE person is `@john`

### **3. One File Per User**
- ✅ You can ONLY create/edit YOUR OWN file: `messages/[YourUsername].txt`
- ❌ You CANNOT modify other users' files
- ❌ You CANNOT create multiple files
- ❌ You CANNOT choose a different filename

### **4. Verification Process**

When you submit a PR, the workflow automatically:

```yaml
1. Get your GitHub username: $USERNAME
2. Check filename matches: messages/$USERNAME.txt
3. If NOT match → REJECT
4. If match → Continue encryption
```

**Example rejection:**
```
Your GitHub username: alice
Your file: messages/bob.txt
❌ ERROR: Filename must be messages/alice.txt
```

## 📋 How to Create Your Message:

1. **Fork this repository**
2. **Create new branch:** `git checkout -b my-message`
3. **Create file:** `messages/[YourUsername].txt`
4. **Write your message** (see EXAMPLE-MESSAGE.txt for inspiration)
5. **Commit & push**
6. **Create Pull Request**
7. **Automation handles the rest!** 🤖

## 🛡️ Security Features:

- ✅ **File ownership validation:** You can only edit YOUR file
- ✅ **Duplicate prevention:** Only 1 message per username
- ✅ **Rate limiting:** Max 3 PRs per day
- ✅ **Auto-encryption:** Your message is sealed immediately
- ✅ **Branch deletion:** Original message destroyed after sealing

## ❓ FAQ:

**Q: What if someone else has my username?**  
A: Impossible on GitHub - usernames are unique platform-wide.

**Q: Can I edit my message after submitting?**  
A: Only before the PR is processed (~30 seconds). After encryption, it's permanent.

**Q: Can I see other people's messages?**  
A: No - all messages are encrypted until January 1, 2035.

**Q: What if I make a typo in my filename?**  
A: The workflow will fail and comment with instructions. Fix and push again.

---

See `EXAMPLE-MESSAGE.txt` for inspiration!
