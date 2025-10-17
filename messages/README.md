# 📝 Messages Folder

This directory holds message files from contributors before they are sealed.

## 🔒 Important Rules:

### **1. File Naming (STRICT)**
- **Format:** `messages/[YourGitHubUsername].txt`
- **Example:** If your username is `john123`, file MUST be `messages/john123.txt`
- **Case-sensitive:** Must match your GitHub username EXACTLY

### **2. One File Per User**
- ✅ You can ONLY create/edit YOUR OWN file: `messages/[YourUsername].txt`
- ❌ You CANNOT modify other users' files
- ❌ You CANNOT create multiple files

### **3. Username Best Practices**

⚠️ **To avoid conflicts, choose a UNIQUE GitHub username!**

**Before creating your message:**
1. Check if your username is unique on GitHub
2. Avoid common names like: `john`, `admin`, `user`, `test`
3. Use numbers or special characters: `john_2025`, `admin_real`, `user123`

**Why?** If two people have the same GitHub username (impossible on GitHub, but if forks have different users):
- Only ONE person can seal a message with that username
- First person wins, second person gets blocked

**Recommendation:**
- Use your REAL GitHub username (automatically unique!)
- Don't try to impersonate others
- Check: https://github.com/[your-username] exists and is YOU

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
