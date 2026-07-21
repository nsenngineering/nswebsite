import type { NextConfig } from "next";
 
/**
 * Next.js configuration for Cloudflare Pages Functions.
 *
 * No `output: 'export'` — Route Handlers under src/app/api need to run as
 * real Cloudflare Pages Functions (Workers) so they can proxy to a live
 * backend on every request. The build is turned into Cloudflare's Worker
 * format by `@cloudflare/next-on-pages` (see package.json `pages:build`),
 * not by Next's own static exporter.
 */
const nextConfig: NextConfig = {
  images: {
    // Cloudflare's edge doesn't run Next's built-in Image Optimization
    // server; either wire up a custom loader against R2/Cloudflare Images,
    // or keep this on to skip optimization entirely.
    unoptimized: true,
  },
  trailingSlash: true,
 
  // @cloudflare/next-on-pages currently parses the Webpack build output
  // (Vercel Build Output API format) — build with `next build`, not
  // `next build --turbopack`, or the pages:build step below will fail to
  // find what it expects.
};
 
export default nextConfig;