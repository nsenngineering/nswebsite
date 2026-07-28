import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import type { NextConfig } from "next";

/**
 * Next.js configuration for static export
 *
 * No basePath needed - using custom domain (stage.nsengineering.com)
 * which serves from root. GitHub Pages automatically handles the mapping
 * from the repository path to the custom domain root.
 */
const nextConfig = (phase: string): NextConfig => ({
  // Draft Mode needs a live Next.js server because it sets and reads
  // request cookies. Keep static export for production builds, but let
  // `next dev` run in server mode so Goal 6 can be tested locally.
  output: phase === PHASE_DEVELOPMENT_SERVER ? undefined : 'export',
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: phase === PHASE_DEVELOPMENT_SERVER ? 'false' : 'true',
  },
  basePath: '',
  assetPrefix: '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
});

export default nextConfig;
