import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Expose the API URL to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
};

export default nextConfig;
