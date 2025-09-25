/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Render deployment
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  // Set workspace root to silence warnings
  outputFileTracingRoot: '/home/runner/work/Online-tictoctoe/Online-tictoctoe',
}

module.exports = nextConfig