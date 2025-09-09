import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      }
    ],
  },
  experimental: {
    serverActions: {
        bodySizeLimit: '50mb',
    }
  }
  /* config options here */
};

export default nextConfig;
