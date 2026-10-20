import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Firebase Hosting: output sebagai static HTML/CSS/JS
  output: "export",
  // Firebase Hosting: tambahkan trailing slash agar URL routing kompatibel
  trailingSlash: true,
  transpilePackages: ["three", "gsap", "lenis"],
  images: {
    // Next.js Image Optimization tidak tersedia di static export
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: false,
    staticGenerationMaxConcurrency: 1,
    staticGenerationRetryCount: 3,
    prerenderEarlyExit: false,
  },
};

export default nextConfig;
