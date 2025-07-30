/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'drive.google.com', 'www.instagram.com' ,'plus.unsplash.com'],
  },
}

module.exports = nextConfig 