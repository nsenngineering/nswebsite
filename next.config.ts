import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/nswebsite',
  assetPrefix: '/nswebsite',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
