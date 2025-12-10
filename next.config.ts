import type { NextConfig } from "next";

// Use basePath only in production for GitHub Pages deployment
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProduction ? '/nswebsite' : '',
  assetPrefix: isProduction ? '/nswebsite' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
