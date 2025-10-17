# 🔒 Security Guide

## Security Features Implemented

### 1. **Environment Variables Protection**
- All secrets in `.env.local` (gitignored)
- Type-safe environment variables with validation
- Never commit secrets to Git

### 2. **Rate Limiting**
- In-memory rate limiter (5 requests per minute per IP)
- Prevents spam and abuse
- Upgradeable to Redis for production scale

### 3. **Input Validation & Sanitization**
- Message content validation (length, spam patterns)
- GitHub username format validation
- XSS protection (script removal)
- Null byte filtering

### 4. **Security Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: enabled
- Content-Security-Policy: strict
- Referrer-Policy: strict-origin

### 5. **CSRF Protection**
- NextAuth.js built-in CSRF tokens
- Origin/Referer validation on API routes
- Same-site cookies

### 6. **API Route Protection**
- Authentication required for sensitive endpoints
- Origin validation in production
- Rate limiting per user
- GitHub OAuth only (no password storage)

## Setup for Production

### 1. Generate Secure Secrets

```bash
# Generate NextAuth secret (32+ characters)
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```env
# GitHub OAuth (from GitHub Developer Settings)
GITHUB_CLIENT_ID=your_actual_client_id
GITHUB_CLIENT_SECRET=your_actual_client_secret

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_generated_secret_here

# Repository
GITHUB_REPO_OWNER=ThanhNguyxn
GITHUB_REPO_NAME=github-time-capsule

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=60000
```

### 3. GitHub OAuth App Setup

1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: `GitHub Time Capsule`
   - Homepage URL: `https://your-app.vercel.app`
   - Authorization callback URL: `https://your-app.vercel.app/api/auth/callback/github`
4. Copy Client ID and Client Secret
5. Add to Vercel environment variables

## Security Best Practices

### ✅ DO:
- Use environment variables for all secrets
- Validate all user inputs
- Rate limit all API endpoints
- Use HTTPS in production
- Keep dependencies updated
- Review code for vulnerabilities
- Monitor error logs

### ❌ DON'T:
- Commit secrets to Git
- Trust user input without validation
- Allow unlimited API calls
- Expose internal errors to users
- Use weak authentication
- Store passwords (use OAuth only)

## Reporting Security Issues

If you find a security vulnerability, please email: security@timecapsule.dev

**Do NOT** create public issues for security vulnerabilities.

## Security Checklist

Before deploying to production:

- [ ] All environment variables set in Vercel
- [ ] GitHub OAuth configured correctly
- [ ] Rate limiting tested
- [ ] Input validation working
- [ ] Security headers verified
- [ ] HTTPS enabled
- [ ] Error logging configured
- [ ] Secrets never committed to Git

## Additional Recommendations for Production

1. **Add Vercel Protection**: Enable Vercel's DDoS protection
2. **Use Redis for Rate Limiting**: Scale beyond in-memory storage
3. **Add Monitoring**: Sentry or similar for error tracking
4. **Add Analytics**: Track abuse patterns
5. **Add Cloudflare**: Extra layer of DDoS protection
6. **Regular Updates**: Keep Next.js and dependencies updated
7. **Security Audits**: Regular code reviews

## Contact

For security questions: @ThanhNguyxn on GitHub
