import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, rateLimiters } from '@/lib/rate-limit';

// Vercel Edge Runtime Configuration (src-level middleware)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
  runtime: 'experimental-edge',
};

// Global security headers and CSP
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': "camera=(), microphone=(), geolocation=()",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

const CSP = [
  "default-src 'self'",
  "connect-src 'self' https://api.stripe.com https://*.stripe.com https://evalion.free.nf",
  "script-src 'self' https://js.stripe.com 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
].join('; ')

// CORS configuration for evalion.free.nf
const CORS_ORIGINS = [
  'https://evalion.free.nf',
  'https://www.evalion.free.nf',
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

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (process.env.NODE_ENV === 'development') {
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return true;
    }
  }
  return CORS_ORIGINS.includes(origin);
}

const RATE_LIMIT_CONFIG: Record<string, keyof typeof rateLimiters> = {
  '/api/chat': 'chat',
  '/api/voice': 'voice',
  '/api/auth/login': 'authLogin',
  '/api/auth/signup': 'authSignup',
  '/api/payment': 'payment',
};

function getRateLimiterType(pathname: string): keyof typeof rateLimiters {
  for (const [path, limiterType] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(path)) {
      return limiterType;
    }
  }
  return 'general';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestOrigin = request.headers.get('origin');

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
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
        'Content-Security-Policy': CSP,
        ...SECURITY_HEADERS,
      },
    });
  }

  if (pathname.startsWith('/api/')) {
    try {
      const rateLimiterType = getRateLimiterType(pathname);
      const authHeader = request.headers.get('authorization');
      const userId = authHeader ? extractUserIdFromAuth(authHeader) : undefined;
      const rateLimitResult = await applyRateLimit(request, rateLimiterType, userId);

      const response = NextResponse.next();

      if (isOriginAllowed(requestOrigin)) {
        response.headers.set('Access-Control-Allow-Origin', requestOrigin || '*');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
        response.headers.set('Vary', 'Origin');
      }

      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      response.headers.set('Content-Security-Policy', CSP);
      Object.entries(SECURITY_HEADERS).forEach(([k, v]) => response.headers.set(k, v));

      return response;
    } catch (error: any) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Content-Security-Policy': CSP,
        ...SECURITY_HEADERS,
      };

      if (error.headers) Object.assign(headers, error.headers);
      if (isOriginAllowed(requestOrigin)) {
        headers['Access-Control-Allow-Origin'] = requestOrigin || '*';
        headers['Access-Control-Allow-Credentials'] = 'true';
        headers['Vary'] = 'Origin';
      }

      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded', message: 'Too many requests. Please try again later.' }),
        { status: 429, headers }
      );
    }
  }

  const response = NextResponse.next();
  if (isOriginAllowed(requestOrigin)) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin || '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
  }
  response.headers.set('Content-Security-Policy', CSP);
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => response.headers.set(k, v));

  return response;
}

function extractUserIdFromAuth(authHeader: string): string | undefined {
  try {
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      return undefined;
    }
  } catch (error) {
    console.error('Error extracting user ID from auth header:', error);
  }
  return undefined;
}
