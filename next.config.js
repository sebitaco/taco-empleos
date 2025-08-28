/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Disable X-Powered-By header for security
  images: {
    domains: [],
  },
  // Security headers are handled in middleware.js
}

export default nextConfig