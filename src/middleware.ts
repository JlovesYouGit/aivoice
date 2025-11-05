import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, rateLimiters } from '@/lib/rate-limit';

// Vercel Edge Runtime Configuration
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
  runtime: 'edge', // Use Vercel Edge Runtime for optimal performance
};

// CORS configuration for evalion.free.nf
const CORS_ORIGINS = [
  'https://evalion.free.nf',
  'https://www.evalion.free.nf', // If www redirect is set up
  // Add development origins for local testing
  ...(process.env.NODE_ENV === 'development' 
    ? ['http://localhost:3000', 'http://127.0.0.1:3000'] 
    : []
  )
];

const CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const CORS_HEADERS = [
  'Accept',
  'Authorization',
  'Content-Type',
  'X-CSRF-Token',
  'X-Requested-With',
];

// Helper function to check if origin is allowed
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return true;
    }
  }
  
  return CORS_ORIGINS.includes(origin);
}

// Rate limiting configuration for different routes
const RATE_LIMIT_CONFIG: Record<string, keyof typeof rateLimiters> = {
  '/api/chat': 'chat',
  '/api/voice': 'voice',
  '/api/auth/login': 'authLogin',
  '/api/auth/signup': 'authSignup',
  '/api/payment': 'payment',
};

// Get rate limiter for a given path
function getRateLimiterType(pathname: string): keyof typeof rateLimiters {
  for (const [path, limiterType] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(path)) {
      return limiterType;
    }
  }
  return 'general';
}

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const requestOrigin = request.headers.get('origin');
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    if (!isOriginAllowed(requestOrigin)) {
      return new NextResponse(null, { status: 403 });
    }
    
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': requestOrigin || '*',
        'Access-Control-Allow-Methods': CORS_METHODS.join(', '),
        'Access-Control-Allow-Headers': CORS_HEADERS.join(', '),
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400', // 24 hours
        'Vary': 'Origin',
      },
    });
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    try {
      const rateLimiterType = getRateLimiterType(pathname);
      
      // Extract user ID from Authorization header if present
      const authHeader = request.headers.get('authorization');
      const userId = authHeader ? extractUserIdFromAuth(authHeader) : undefined;
      
      const rateLimitResult = await applyRateLimit(request, rateLimiterType, userId);
      
      // Continue with the request
      const response = NextResponse.next();
      
      // Add CORS headers to API responses
      if (isOriginAllowed(requestOrigin)) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin || '*');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Vary', 'Origin');
      }
      
      // Add rate limit headers
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      // Add security headers for API routes
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      
      return response;
      
    } catch (error: any) {
      // Rate limit exceeded
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      };
      
      // Add rate limit headers if available
      if (error.headers) {
        Object.assign(headers, error.headers);
      }
      
      // Add CORS headers even for rate limit errors
      if (isOriginAllowed(requestOrigin)) {
        headers['Access-Control-Allow-Origin'] = requestOrigin || '*';
        headers['Access-Control-Allow-Credentials'] = 'true';
        headers['Vary'] = 'Origin';
      }
      
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers,
        }
      );
    }
  }
  
  // For non-API routes, just add basic CORS headers if needed
  const response = NextResponse.next();
  
  if (isOriginAllowed(requestOrigin)) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin || '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
  }
  
  return response;
}

// Helper function to extract user ID from Authorization header
function extractUserIdFromAuth(authHeader: string): string | undefined {
  // This is a placeholder implementation
  // You should implement this based on your authentication system
  try {
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Decode JWT token and extract user ID
      // For Firebase, you might use the Firebase Admin SDK
      // const decodedToken = await admin.auth().verifyIdToken(token);
      // return decodedToken.uid;
      
      // For now, return undefined to use IP-based rate limiting
      return undefined;
    }
  } catch (error) {
    console.error('Error extracting user ID from auth header:', error);
  }
  
  return undefined;
}

// Config is exported at the top of the file for Vercel Edge Runtime