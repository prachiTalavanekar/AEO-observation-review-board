import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint runs separately in CI — skip during next build to avoid circular JSON issue
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checking runs via tsc separately — keep false for strict Vercel deploys
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
