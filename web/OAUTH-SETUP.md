# GitHub OAuth Setup Guide

## Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the form:

### Development (localhost):
```
Application name: GitHub Time Capsule (Dev)
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
Application description: (optional) Time capsule for messages to 2035
```

### Production (Vercel):
```
Application name: GitHub Time Capsule
Homepage URL: https://your-app.vercel.app
Authorization callback URL: https://your-app.vercel.app/api/auth/callback/github
Application description: (optional) Time capsule for messages to 2035
```

4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"**
7. Copy the **Client Secret** (won't be shown again!)

## Step 2: Update Environment Variables

### For Local Development:

Update `web/.env.local`:

```env
# Replace with your actual values
GITHUB_CLIENT_ID=your_actual_client_id_here
GITHUB_CLIENT_SECRET=your_actual_client_secret_here

# Leave these as-is for development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development_secret_key_replace_in_production_min_32_characters_long
```

### For Production (Vercel):

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the following:

```
GITHUB_CLIENT_ID = your_production_client_id
GITHUB_CLIENT_SECRET = your_production_client_secret
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = (generate with: openssl rand -base64 32)
GITHUB_REPO_OWNER = ThanhNguyxn
GITHUB_REPO_NAME = github-time-capsule
```

## Step 3: Generate Production Secret

```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Using Node.js (any platform):
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 4: Test OAuth Flow

### Development:
1. Restart your dev server: `npm run dev`
2. Go to: http://localhost:3000
3. Click "Sign in with GitHub"
4. Authorize the app
5. You should be redirected back and see your username

### Production:
1. Push your code to GitHub
2. Vercel will auto-deploy
3. Go to your production URL
4. Test the sign-in flow

## Troubleshooting

### Error: "The redirect_uri MUST match the registered callback URL"
- Make sure the callback URL in GitHub OAuth app settings matches exactly:
  - Dev: `http://localhost:3000/api/auth/callback/github`
  - Prod: `https://your-app.vercel.app/api/auth/callback/github`
- No trailing slash!

### Error: "Client authentication failed"
- Check GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are correct
- Make sure no extra spaces in .env.local
- Restart dev server after changing .env.local

### Error: "Invalid callback URL"
- Verify NEXTAUTH_URL matches your deployment URL
- In Vercel, it should be your production domain

### Sign in button not working
- Check browser console for errors
- Verify all environment variables are set
- Make sure NextAuth API route exists: `/api/auth/[...nextauth]/route.ts`

## Security Notes

⚠️ **NEVER commit** `.env.local` to Git (already in `.gitignore`)  
⚠️ **Use different OAuth apps** for development and production  
⚠️ **Regenerate secrets** if accidentally exposed  
⚠️ **Rotate secrets** periodically in production  

## What OAuth Permissions We Request

```
scope: "public_repo user:email"
```

- **public_repo**: Create forks, branches, files, and pull requests
- **user:email**: Get user's email for identification

We do NOT request:
- Private repo access
- Write access to user's repos (only forks)
- Access to organizations
- Admin permissions

## OAuth App Limits

GitHub OAuth apps have rate limits:
- **Authenticated requests**: 5,000 per hour per user
- **Unauthenticated**: 60 per hour per IP

Our app makes minimal API calls:
- 1 call on sign in (get user profile)
- ~5 calls when submitting message (fork, create branch, create file, create PR)

This is well within limits! 🚀
