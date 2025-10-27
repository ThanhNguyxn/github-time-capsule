# 🌐 GitHub Time Capsule - Web Interface

A beautiful, user-friendly web interface for the GitHub Time Capsule project. This Next.js app allows non-technical users to easily submit messages to the time capsule without needing to understand Git or GitHub workflows.

## ✨ Features

- 🔐 **GitHub OAuth** - Secure one-click sign-in
- ✍️ **Message Form** - Simple, beautiful submission form
- 👀 **Live Preview** - See your message before sealing
- ⏱️ **Countdown Timer** - Real-time countdown to 2035
- 📊 **Statistics** - See how many messages have been sealed
- 🛡️ **Security** - Rate limiting, input validation, CSP headers
- 🎨 **Modern UI** - Gradient backgrounds, animations, responsive design
- 🤖 **Full Automation** - Auto fork, create PR, seal message

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Authentication**: NextAuth.js with GitHub OAuth
- **API Integration**: Octokit (GitHub REST API)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub account
- GitHub OAuth App (for authentication)

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up GitHub OAuth App

Follow the detailed guide in [OAUTH-SETUP.md](./OAUTH-SETUP.md) to create a GitHub OAuth app and get your credentials.

### 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your actual credentials:

```env
# GitHub OAuth (Get from https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_min_32_chars

# GitHub Repository
GITHUB_REPO_OWNER=ThanhNguyxn
GITHUB_REPO_NAME=github-time-capsule

# Rate Limiting (Optional)
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=60000
```

**Generate NEXTAUTH_SECRET:**
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   └── auth/           # NextAuth endpoints
│   │   ├── submit/             # Message submission page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   │   ├── AuthButton.tsx      # Sign in/out button
│   │   ├── AuthProvider.tsx    # Session provider
│   │   └── CountdownTimer.tsx  # Countdown component
│   ├── lib/                    # Utilities
│   │   ├── env.ts              # Environment config
│   │   ├── rate-limit.ts       # Rate limiter
│   │   └── validation.ts       # Input validation
│   ├── middleware.ts           # Security headers
│   └── types/                  # TypeScript types
├── public/                     # Static assets
├── .env.local                  # Environment variables (gitignored)
├── OAUTH-SETUP.md             # OAuth configuration guide
└── SECURITY.md                 # Security documentation
```

## 🔒 Security

This app implements multiple security layers:

- ✅ Rate limiting (5 requests/minute)
- ✅ Input validation & sanitization
- ✅ CSRF protection (NextAuth)
- ✅ Security headers (CSP, X-Frame-Options, etc.)
- ✅ Environment variables protection
- ✅ Origin validation

See [SECURITY.md](./SECURITY.md) for details.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Set **Root Directory** to `web/`
4. Add environment variables in Vercel settings
5. Deploy!

Detailed deployment guide: [OAUTH-SETUP.md](./OAUTH-SETUP.md#for-production-vercel)

### Deploy to Other Platforms

This is a standard Next.js app and can be deployed to:
- Vercel (recommended)
- Netlify
- Railway
- AWS Amplify
- Any Node.js hosting

## 📚 Documentation

- **[OAuth Setup Guide](./OAUTH-SETUP.md)** - Complete GitHub OAuth configuration
- **[Security Guide](./SECURITY.md)** - Security features and best practices
- **[Main Project README](../README.md)** - About the Time Capsule project

## 🎨 Features Roadmap

- [x] Landing page with countdown
- [x] GitHub OAuth authentication
- [x] Security protections
- [ ] Message submission form
- [ ] GitHub API integration (auto-fork, create PR)
- [ ] Statistics dashboard
- [ ] Animations & polish
- [ ] Email notifications
- [ ] Message templates
- [ ] Social sharing

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - See [LICENSE](../LICENSE) file

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/ThanhNguyxn/github-time-capsule/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ThanhNguyxn/github-time-capsule/discussions)

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) - React framework
- [NextAuth.js](https://next-auth.js.org) - Authentication
- [TailwindCSS](https://tailwindcss.com) - Styling
- [Octokit](https://github.com/octokit) - GitHub API
- [Vercel](https://vercel.com) - Deployment platform

---

**Made with ❤️ for the future | [View Main Project](../README.md)**
