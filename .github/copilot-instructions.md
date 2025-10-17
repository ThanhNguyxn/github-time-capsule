# GitHub Time Capsule - Web Interface Project

## Project Overview
This is a Next.js 14 web application that provides a beautiful, user-friendly interface for the GitHub Time Capsule project. The web app allows non-technical users to submit messages to a time capsule that will automatically open on January 1, 2035.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom animations
- **Authentication**: NextAuth.js with GitHub OAuth
- **API Integration**: Octokit (GitHub REST API)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Form Management**: React Hook Form

## Project Structure
```
web/
├── app/                 # Next.js App Router
│   ├── api/            # API routes (NextAuth, GitHub API)
│   ├── submit/         # Message submission page
│   └── page.tsx        # Landing page
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── LandingHero.tsx
│   ├── CountdownTimer.tsx
│   ├── MessageForm.tsx
│   └── Statistics.tsx
├── lib/                # Utilities and helpers
│   ├── github.ts       # GitHub API functions
│   └── utils.ts
└── public/             # Static assets
```

## Key Features
1. **GitHub OAuth Login** - Seamless authentication
2. **Landing Page** - Hero section with countdown to 2035
3. **Message Form** - Rich text editor with markdown support
4. **GitHub Integration** - Auto fork, branch, file creation, PR submission
5. **Statistics Dashboard** - Real-time message count and contributors
6. **Modern UI** - Animations, gradients, glassmorphism effects
7. **Responsive Design** - Works on all devices

## Integration with Main Repository
The web app integrates with `ThanhNguyxn/github-time-capsule` by:
- Using GitHub API to fork the repository
- Creating files in `messages/{username}.txt`
- Triggering the existing GitHub Actions workflows
- No changes needed to the main repository

## Development Guidelines
- Use TypeScript strictly for type safety
- Follow Next.js 14 App Router conventions
- Implement proper error handling and loading states
- Use TailwindCSS utility classes
- Keep components modular and reusable
- Add proper TypeScript types for all API responses
