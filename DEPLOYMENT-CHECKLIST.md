# 🚀 Deployment Checklist - GitHub Time Capsule

## ✅ Pre-Deployment (Completed)

- [x] Workflow fixed and working
- [x] GPG secrets configured
- [x] Rate limiting implemented (UTC-based)
- [x] Code pushed to GitHub

---

## 🌐 Web App Deployment (Vercel)

### Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `GitHub Time Capsule`
   - **Homepage URL:** `https://github-time-capsule.vercel.app`
   - **Authorization callback URL:** `https://github-time-capsule.vercel.app/api/auth/callback/github`
4. Click **"Register application"**
5. **Copy Client ID** and **Generate Client Secret**

### Step 2: Deploy to Vercel

1. Go to: https://vercel.com/new
2. Import repository: `ThanhNguyxn/github-time-capsule`
3. **Root Directory:** `web` (IMPORTANT!)
4. **Framework Preset:** Next.js
5. Click **"Deploy"**

### Step 3: Configure Environment Variables (Vercel Dashboard)

Add these in: **Settings → Environment Variables**

```env
# GitHub OAuth (from Step 1)
GITHUB_CLIENT_ID=your_oauth_client_id
GITHUB_CLIENT_SECRET=your_oauth_client_secret

# NextAuth (generate new secret)
NEXTAUTH_URL=https://github-time-capsule.vercel.app
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Repository
GITHUB_REPO_OWNER=ThanhNguyxn
GITHUB_REPO_NAME=github-time-capsule

# Rate Limiting (optional, defaults are fine)
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=60000
```

**Generate NEXTAUTH_SECRET:**
```powershell
# Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use online: https://generate-secret.vercel.app/32
```

### Step 4: Redeploy

After adding env variables:
1. Go to: **Deployments** tab
2. Find latest deployment
3. Click **"..."** → **"Redeploy"**
4. ✅ Done!

---

## 🧪 Testing Deployment

### Test 1: Homepage
- Visit: https://github-time-capsule.vercel.app/
- Should see beautiful landing page with countdown

### Test 2: Authentication
1. Click **"Sign in with GitHub"**
2. Should redirect to GitHub OAuth
3. After approval, should redirect back

### Test 3: Submit Message
1. Sign in
2. Go to: https://github-time-capsule.vercel.app/submit
3. Write test message
4. Click **"Seal My Message"**
5. Should create PR automatically
6. Check GitHub for new PR

### Test 4: Rate Limiting (Different User)
1. Submit message from user A → ✅ OK
2. Submit again same day (UTC) → ❌ Should fail
3. Wait until 00:00 UTC next day → ✅ OK again

---

## 📊 Current Status

### Repository
- ✅ Workflows: Active and working
- ✅ Secrets: Configured (3/3)
- ✅ Latest test: PR #36 (Success)

### Web App
- ⏳ Deployment: Check Vercel dashboard
- ⏳ OAuth: Needs GitHub OAuth app
- ⏳ Env vars: Needs configuration

---

## 🆘 Common Issues

### Issue: "Unauthorized - Please sign in"
**Fix:** Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in Vercel

### Issue: "Failed to encrypt message"
**Fix:** Check if `web/src/lib/gpg-public-key.ts` has the correct public key

### Issue: "Rate limit exceeded" immediately
**Fix:** Clear Vercel deployment cache and redeploy

### Issue: OAuth callback 404
**Fix:** Make sure callback URL in GitHub OAuth app matches exactly:
`https://github-time-capsule.vercel.app/api/auth/callback/github`

---

## ✅ Final Checklist

- [ ] GitHub OAuth app created
- [ ] Vercel deployment done (root: `web/`)
- [ ] Environment variables set in Vercel
- [ ] Redeployed after env var changes
- [ ] Tested: Homepage loads
- [ ] Tested: Sign in works
- [ ] Tested: Submit message works
- [ ] Tested: PR created automatically
- [ ] Tested: Workflow encrypts and seals

---

## 🎉 Once Deployed

### Share Your Project!
- Tweet: https://twitter.com/intent/tweet?text=Check%20out%20GitHub%20Time%20Capsule!
- Update README with live link
- Invite friends to submit messages

### Monitor
- Check Vercel logs for errors
- Monitor GitHub Actions for workflow issues
- Watch sealed/ folder for new messages

---

**Need help?** Check web/README.md and web/OAUTH-SETUP.md for detailed guides!

