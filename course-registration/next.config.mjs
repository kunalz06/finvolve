/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/iemminorcourse',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/iemminorcourse',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
