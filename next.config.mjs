/** @type {import('next').NextConfig} */
const isNetlifyStaticExport =
    process.env.NETLIFY === 'true' || process.env.NETLIFY_STATIC_EXPORT === 'true';

const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    ...(isNetlifyStaticExport
        ? {
            output: 'export',
            images: {
                unoptimized: true,
            },
        }
        : {}),
    ...(isNetlifyStaticExport
        ? {}
        : {
            async redirects() {
                return [
                    {
                        source: '/finvolve',
                        destination: '/dev',
                        permanent: true,
                    },
                    {
                        source: '/finvolve/:path*',
                        destination: '/dev/:path*',
                        permanent: true,
                    },
                ];
            },
            async headers() {
                return [
                    {
                        source: '/:path*',
                        headers: [
                            {
                                key: 'X-DNS-Prefetch-Control',
                                value: 'on'
                            },
                            {
                                key: 'Strict-Transport-Security',
                                value: 'max-age=63072000; includeSubDomains; preload'
                            },
                            {
                                key: 'X-Content-Type-Options',
                                value: 'nosniff'
                            },
                            {
                                key: 'X-Frame-Options',
                                value: 'SAMEORIGIN'
                            },
                            {
                                key: 'X-XSS-Protection',
                                value: '1; mode=block'
                            },
                            {
                                key: 'Referrer-Policy',
                                value: 'origin-when-cross-origin'
                            }
                        ]
                    }
                ];
            }
        })
};

export default nextConfig;
