// Input validation and sanitization utilities

export const validation = {
  // Validate message content
  validateMessage(content: string): { valid: boolean; error?: string } {
    if (!content || content.trim().length === 0) {
      return { valid: false, error: 'Message cannot be empty' };
    }

    if (content.length > 10000) {
      return { valid: false, error: 'Message too long (max 10,000 characters)' };
    }

    if (content.length < 10) {
      return { valid: false, error: 'Message too short (min 10 characters)' };
    }

    // Check for spam patterns
    const spamPatterns = [
      /https?:\/\/[^\s]{50,}/gi, // Long URLs (potential spam)
      /(.)\1{20,}/g, // Repeated characters
      /(?:click here|buy now|limited offer)/gi, // Spam keywords
    ];

    for (const pattern of spamPatterns) {
      if (pattern.test(content)) {
        return { valid: false, error: 'Message contains suspicious content' };
      }
    }

    return { valid: true };
  },

  // Sanitize message (remove dangerous content)
  sanitizeMessage(content: string): string {
    return content
      .trim()
      // Remove null bytes
      .replace(/\0/g, '')
      // Limit consecutive newlines
      .replace(/\n{5,}/g, '\n\n\n\n')
      // Remove scripts (extra safety)
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '');
  },

  // Validate GitHub username format
  validateUsername(username: string): { valid: boolean; error?: string } {
    if (!username || username.trim().length === 0) {
      return { valid: false, error: 'Username cannot be empty' };
    }

    // GitHub username rules
    const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    
    if (!githubUsernameRegex.test(username)) {
      return { valid: false, error: 'Invalid GitHub username format' };
    }

    if (username.length > 39) {
      return { valid: false, error: 'Username too long' };
    }

    return { valid: true };
  },
};

// Security headers for API routes
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};
