/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add this to help prevent hydration issues with date inputs
  experimental: {
    // This helps with form handling and hydration
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    },
  }
}

module.exports = nextConfig