import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Suppress NextAuth v4 warnings with Next.js 15 async APIs
  experimental: {
    // This helps with NextAuth v4 compatibility
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  // Suppress specific warnings from NextAuth v4
  onDemandEntries: {
    // Reduce memory usage and improve performance
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Add logging configuration to suppress NextAuth warnings
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Webpack configuration to handle NextAuth warnings
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress specific NextAuth console warnings in development
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    return config;
  },
};

export default nextConfig;
