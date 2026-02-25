/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@pantry-pilot/core'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
