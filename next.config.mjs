/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/iemminorcourse',
        destination: 'http://localhost:3001/iemminorcourse',
      },
      {
        source: '/iemminorcourse/:path*',
        destination: 'http://localhost:3001/iemminorcourse/:path*',
      },
    ];
  },
};

export default nextConfig;
