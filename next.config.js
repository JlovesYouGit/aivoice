/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable typedRoutes for Vercel deployment (supports latest Next.js)
  typedRoutes: true,
  
  // Production optimizations for Vercel
  poweredByHeader: false,
  compress: true,
  
  // Only ignore TypeScript errors in development for faster iteration
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Enable XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Disable unnecessary browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // Force HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googleapis.com https://apis.google.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' data: https: blob:;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' https://*.firebase.com https://*.firebaseio.com https://*.googleapis.com https://api.stripe.com https://*.stripe.com wss://*.firebaseio.com;
              frame-src https://js.stripe.com https://*.firebaseapp.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim()
          },
        ],
      },
      // API routes specific headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
        ],
      },
    ];
  },

  // Image optimization for evalion.free.nf
  images: {
    domains: ['evalion.free.nf'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Disable X-Powered-By header
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Experimental features for security
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = nextConfig