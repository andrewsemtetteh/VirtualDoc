/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this to help prevent hydration issues with date inputs
  experimental: {
    // This helps with form handling and hydration
    serverActions: true,
  }
}

module.exports = nextConfig 