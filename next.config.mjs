/** @type {import('next').NextConfig} */
const nextConfig = {
  // 파이어베이스 이미지 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
};

export default nextConfig;
