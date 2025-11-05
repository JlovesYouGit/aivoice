/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations for Vercel
  poweredByHeader: false,
  compress: true,
  
  // Only ignore TypeScript errors in development for faster iteration
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  async headers() {
    return [
      // API routes specific headers only; security headers are handled centrally in middleware.ts
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

  // Allow external host requests in development environment (Clacky)
  allowedDevOrigins: ['*.clackypaas.com', 'localhost', '127.0.0.1'],
}

module.exports = nextConfig