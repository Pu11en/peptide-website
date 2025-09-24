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
}

export default nextConfig
