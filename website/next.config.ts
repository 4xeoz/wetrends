import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow images from any domain (disable strict image domain checking)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // Disable React Strict Mode (optional, can cause double renders)
  reactStrictMode: false,
  // Suppress static generation errors for dynamic routes
  staticPageGenerationTimeout: 120,
  // Allow trailing slashes
  trailingSlash: true,
  // Dist directory
  distDir: ".next",
};

export default nextConfig;
