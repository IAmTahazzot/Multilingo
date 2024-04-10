/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'ucarecdn.com',
        protocol: 'https',
      },
      {
        hostname: 'img.clerk.com',
        protocol: 'https',
      }
    ]
  }
};

export default nextConfig;
