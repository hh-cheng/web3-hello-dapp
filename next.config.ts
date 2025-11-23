import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    LOGGER_CONTRACT: process.env.LOGGER_CONTRACT!,
    RED_PACKET_CONTRACT: process.env.RED_PACKET_CONTRACT!,
    WALLETCONNECT_PROJECT_ID: process.env.WALLETCONNECT_PROJECT_ID!,
  },
  // Turbopack configuration for development
  // Note: Most problematic imports are handled by dynamic imports in wallet provider
  // and webpack configuration for production builds
  turbopack: {},
  // Webpack configuration for production builds (Turbopack doesn't support production builds yet)
  webpack: (config, { isServer }) => {
    // Ignore test files and directories from dependencies
    config.plugins = config.plugins || []

    // Ignore all test directories and test files
    // biome-ignore lint/style/noCommonJs: webpack is only available as CommonJS in Next.js config
    const webpack = require('webpack')
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource: string) {
          // Ignore test directories
          if (resource.includes('/test/') || resource.includes('\\test\\')) {
            return true
          }
          // Ignore test files
          if (/\.test\.(js|ts|tsx)$/.test(resource)) {
            return true
          }
          return false
        },
      }),
    )

    // Ignore React Native modules that MetaMask SDK tries to import (not available in web)
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /@react-native-async-storage\/async-storage/,
      }),
    )

    // Ignore optional dependencies that aren't needed in production builds
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pino-pretty$/,
      }),
    )

    // Exclude Node.js built-in modules from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
    }

    // Handle indexedDB during SSR to prevent errors
    // The wallet provider now creates config only on client side, but we add extra safeguards here
    if (isServer) {
      // Provide a no-op polyfill for indexedDB during SSR
      config.resolve.alias = {
        ...config.resolve.alias,
        // Redirect any direct indexedDB imports to a no-op
        idb: path.resolve(__dirname, 'lib/empty-module.ts'),
      }
    }

    return config
  },
}

export default nextConfig
