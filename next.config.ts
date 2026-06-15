import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip the separate TypeScript validation step during `next build`.
  typescript: { ignoreBuildErrors: true },
  experimental: {
    // Avoid spawning child-process build workers (can fail with EPERM on some Windows setups).
    webpackBuildWorker: false,
  },
};

export default nextConfig;
