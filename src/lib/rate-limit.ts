import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

// Create Redis instance with fallback to memory-based rate limiting
let redis: Redis | null = null;
let useRedis = false;

// Try to initialize Redis only if environment variables are set
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = Redis.fromEnv();
    useRedis = true;
  } catch (error) {
    console.warn('Failed to initialize Upstash Redis, falling back to in-memory rate limiting:', error);
    useRedis = false;
  }
}

// Create different rate limiters for different endpoints
export const rateLimiters = {
  // Chat endpoint: 20 requests per minute
  chat: useRedis ? new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix: 'ratelimit:chat',
  }) : null,

  // Voice endpoint: 10 requests per minute  
  voice: useRedis ? new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit:voice',
  }) : null,

  // Auth login: 5 requests per 5 minutes
  authLogin: useRedis ? new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(5, '5 m'),
    analytics: true,
    prefix: 'ratelimit:auth:login',
  }) : null,

  // Auth signup: 3 requests per 10 minutes
  authSignup: useRedis ? new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(3, '10 m'),
    analytics: true,
    prefix: 'ratelimit:auth:signup',
  }) : null,

  // Payment: 3 requests per minute
  payment: useRedis ? new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
    prefix: 'ratelimit:payment',
  }) : null,

  // General API: 60 requests per minute (fallback)
  general: useRedis ? new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    analytics: true,
    prefix: 'ratelimit:general',
  }) : null,
};

// Simple in-memory rate limiter as fallback
class MemoryRateLimiter {
  private requestLimit: number;
  private windowMs: number;
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(
    limit: number,
    windowMs: number
  ) {
    this.requestLimit = limit;
    this.windowMs = windowMs;
  }
  
  async checkLimit(identifier: string): Promise<{ 
    success: boolean; 
    limit: number; 
    remaining: number; 
    reset: number;
  }> {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    let record = this.requests.get(identifier);
    
    // Clean up old records
    if (record && record.resetTime < windowStart) {
      record = undefined;
    }
    
    if (!record) {
      record = { count: 0, resetTime: now + this.windowMs };
      this.requests.set(identifier, record);
    }
    
    record.count++;
    
    const remaining = Math.max(0, this.requestLimit - record.count);
    const success = record.count <= this.requestLimit;
    
    return {
      success,
      limit: this.requestLimit,
      remaining,
      reset: record.resetTime,
    };
  }
}

// Create memory-based fallback rate limiters
const memoryRateLimiters = {
  chat: new MemoryRateLimiter(20, 60 * 1000), // 20 requests per minute
  voice: new MemoryRateLimiter(10, 60 * 1000), // 10 requests per minute
  authLogin: new MemoryRateLimiter(5, 5 * 60 * 1000), // 5 requests per 5 minutes
  authSignup: new MemoryRateLimiter(3, 10 * 60 * 1000), // 3 requests per 10 minutes
  payment: new MemoryRateLimiter(3, 60 * 1000), // 3 requests per minute
  general: new MemoryRateLimiter(60, 60 * 1000), // 60 requests per minute
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
  endpoint: keyof typeof rateLimiters,
  identifier: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
  error?: string;
}> {
  try {
    // Use Redis-based rate limiting if available, otherwise fall back to memory
    if (useRedis && rateLimiters[endpoint]) {
      const result = await rateLimiters[endpoint]!.limit(identifier);
      
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset),
      };
    } else {
      // Use memory-based rate limiting
      const result = await memoryRateLimiters[endpoint].checkLimit(identifier);
      
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset),
      };
    }
  } catch (error) {
    console.error('Rate limiting error:', error);
    
    // If rate limiting fails completely, allow the request but log the error
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
  const identifier = getUserIdentifier(request, userId);
  
  const result = await checkRateLimit(endpoint, identifier);
  
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