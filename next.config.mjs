/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const SUB_APP_URL = process.env.SUB_APP_URL || 'http://localhost:3001';
    return [
      {
        source: '/iemminorcourse',
        destination: `${SUB_APP_URL}/iemminorcourse`,
      },
      {
        source: '/iemminorcourse/:path*',
        destination: `${SUB_APP_URL}/iemminorcourse/:path*`,
      },
    ];
  },
};

export default nextConfig;
