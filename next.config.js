/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Disable X-Powered-By header for security
  images: {
    domains: [],
  },
  // Security headers are now handled in middleware.js for better control
}

export default nextConfig