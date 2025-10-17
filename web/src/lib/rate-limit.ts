// Simple in-memory rate limiter
// For production, use Redis or external service

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const record = store[identifier];

  // Clean up old entries
  if (record && now > record.resetTime) {
    delete store[identifier];
  }

  if (!store[identifier]) {
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: store[identifier].resetTime,
    };
  }

  if (store[identifier].count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: store[identifier].resetTime,
    };
  }

  store[identifier].count++;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - store[identifier].count,
    reset: store[identifier].resetTime,
  };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  });
}, 60000); // Clean up every minute
