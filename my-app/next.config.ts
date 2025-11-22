import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  webpack: (config) => {
    if (!process.env.NEXT_PRIVATE_TURBOPACK) {
      config.module?.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
        issuer: /\.[jt]sx?$/,
      })
    }
    return config
  },
}

export default nextConfig