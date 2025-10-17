// Environment variables with type safety

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // GitHub OAuth
      GITHUB_CLIENT_ID?: string;
      GITHUB_CLIENT_SECRET?: string;
      
      // GitHub Repository
      GITHUB_REPO_OWNER?: string;
      GITHUB_REPO_NAME?: string;
      
      // Rate Limiting
      RATE_LIMIT_MAX_REQUESTS?: string;
      RATE_LIMIT_WINDOW_MS?: string;
    }
  }
}

// Validate required environment variables
export function validateEnv() {
  const required = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GITHUB_REPO_OWNER',
    'GITHUB_REPO_NAME',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Export safely typed config
export const config = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    repoOwner: process.env.GITHUB_REPO_OWNER || 'ThanhNguyxn',
    repoName: process.env.GITHUB_REPO_NAME || 'github-time-capsule',
  },
  nextAuth: {
    url: process.env.NEXTAUTH_URL || '',
    secret: process.env.NEXTAUTH_SECRET || '',
  },
  rateLimit: {
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5'),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  },
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

export default config;
