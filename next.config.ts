import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'incrediblepeptide.com',
          },
        ],
        permanent: true,
        destination: 'https://incrediblepeptide.com/:path*',
      },
    ]
  },
}

export default nextConfig
