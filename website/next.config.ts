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
  // Image optimization - using unoptimized for static export compatibility
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Add image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    // Optimize package imports for common libraries
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-icons",
      "gsap",
    ],
  },
  // Disable React Strict Mode for performance
  reactStrictMode: false,
  // Suppress static generation errors for dynamic routes
  staticPageGenerationTimeout: 120,
  // Allow trailing slashes
  trailingSlash: true,
  // Dist directory
  distDir: ".next",
  // Compression
  compress: true,
  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
        ],
      },
    ];
  },
  // Webpack configuration for additional optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize fonts
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });
    
    // Fix Prisma WASM issues
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });
    
    // Ignore Prisma WASM files in client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'fs': false,
        'net': false,
        'tls': false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
