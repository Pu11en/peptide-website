import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force HTTPS for all environments
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ];
  },
  // Redirect HTTP to HTTPS
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'incrediblepeptide.com',
          }
        ],
        permanent: true,
        destination: 'https://incrediblepeptide.com/:path*',
      },
      // Redirect www to non-www
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
}

export default nextConfig
