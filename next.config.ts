import type { NextConfig } from "next";

/**
 * Next.js configuration for static export
 *
 * No basePath needed - using custom domain (stage.nsengineering.com)
 * which serves from root. GitHub Pages automatically handles the mapping
 * from the repository path to the custom domain root.
 */
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '',
  assetPrefix: '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
