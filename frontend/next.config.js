/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Render deployment
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true
  },
  // Remove server-side features for static export
  experimental: {
    // Enable experimental features if needed
  }
}

module.exports = nextConfig