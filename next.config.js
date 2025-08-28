import CopyWebpackPlugin from 'copy-webpack-plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Disable X-Powered-By header for security
  images: {
    domains: [],
  },
  // Security headers are now handled in middleware.js for better control
  
  // Configure webpack to handle Aikido's WASM file
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Use CopyWebpackPlugin to copy Aikido's WASM file during build
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'node_modules/@aikidosec/firewall/internals/zen_internals_bg.wasm',
              to: 'chunks/zen_internals_bg.wasm',
            },
          ],
        })
      )
    }
    
    return config
  }
}

export default nextConfig