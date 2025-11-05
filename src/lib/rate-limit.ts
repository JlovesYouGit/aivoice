import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

// Create Redis instance
const redis = Redis.fromEnv();

// Create different rate limiters for different endpoints
export const rateLimiters = {
  // Chat endpoint: 20 requests per minute
  chat: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix: 'ratelimit:chat',
  }),

  // Voice endpoint: 10 requests per minute  
  voice: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit:voice',
  }),

  // Auth login: 5 requests per 5 minutes
  authLogin: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '5 m'),
    analytics: true,
    prefix: 'ratelimit:auth:login',
  }),

  // Auth signup: 3 requests per 10 minutes
  authSignup: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '10 m'),
    analytics: true,
    prefix: 'ratelimit:auth:signup',
  }),

  // Payment: 3 requests per minute
  payment: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
    prefix: 'ratelimit:payment',
  }),

  // General API: 60 requests per minute (fallback)
  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    analytics: true,
    prefix: 'ratelimit:general',
  }),
};

// Helper function to get client IP address
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'anonymous';
}

// Helper function to get user identifier (IP or user ID)
export function getUserIdentifier(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  return `ip:${getClientIP(request)}`;
}

// Rate limit check function
export async function checkRateLimit(
  rateLimiter: Ratelimit,
  identifier: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
  error?: string;
}> {
  try {
    const result = await rateLimiter.limit(identifier);
    
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: new Date(result.reset),
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    
    // If Redis is down, allow the request but log the error
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: new Date(),
      error: 'Rate limiting service unavailable',
    };
  }
}

// Middleware function to apply rate limiting
export async function applyRateLimit(
  request: NextRequest,
  endpoint: keyof typeof rateLimiters,
  userId?: string
) {
  const rateLimiter = rateLimiters[endpoint];
  const identifier = getUserIdentifier(request, userId);
  
  const result = await checkRateLimit(rateLimiter, identifier);
  
  if (!result.success) {
    const error = new Error('Rate limit exceeded');
    (error as any).status = 429;
    (error as any).headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toISOString(),
      'Retry-After': Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString(),
    };
    throw error;
  }
  
  return {
    headers: {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toISOString(),
    },
  };
}