/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // In production (Vercel), we don't want to rewrite to localhost.
    // Vercel will automatically route /api to our serverless functions.
    if (process.env.NODE_ENV === 'production') return [];
    
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
};

export default nextConfig;
