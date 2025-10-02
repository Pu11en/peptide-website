/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Headers configuration - disabled for local development
  async headers() {
    // Only apply security headers in production
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin'
            },
            {
              key: 'Content-Security-Policy',
              value: "default-src https: 'self'; script-src https: 'self' 'unsafe-inline' 'unsafe-eval'; style-src https: 'self' 'unsafe-inline'; img-src https: 'self' data: blob:; font-src https: 'self'; connect-src https: 'self'; media-src https: 'self'; object-src 'none'; frame-ancestors 'none';"
            }
          ]
        }
      ];
    }
    return [];
  },
  // Simplified redirect configuration to avoid loops
  async redirects() {
    return [
      // Only redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.incrediblepeptide.com',
          }
        ],
        permanent: true,
        destination: 'https://incrediblepeptide.com/:path*',
      }
    ]
  },
  // Force HTTPS
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig