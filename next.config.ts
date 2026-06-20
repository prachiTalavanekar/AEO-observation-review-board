import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Vercel image optimization
  images: {
    unoptimized: false,
  },
  // Ensure trailing slashes are consistent
  trailingSlash: false,
  // Compress responses
  compress: true,
  // Power by header removal for security
  poweredByHeader: false,
};

export default nextConfig;
