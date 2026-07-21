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
  turbopack: {
    root: process.cwd(),
  },

  // Dev-only proxy to json-server for the eLibrary Route Handlers.
  //
  // `output: 'export'` means `next build` ignores rewrites entirely (with a
  // harmless console warning) — the exported route.ts files just serve
  // their static JSON directly. This block only ever has an effect under
  // `next dev`, where it does what the Goal 4 Route Handlers used to do
  // with a `fetch()` call: forward same-origin browser requests to
  // json-server server-side, so the browser never talks cross-origin and
  // never sees a CORS error.
  //
  // Keeping this logic here (rather than inside route.ts) is what lets the
  // route handlers stay `force-static` and export cleanly — see the
  // comment at the top of each src/app/api/elibrary/*/route.ts.
  async rewrites() {
    if (process.env.NODE_ENV !== 'development' || !process.env.JSON_SERVER_URL) {
      return [];
    }

    const base = process.env.JSON_SERVER_URL;

    return [
      { source: '/api/elibrary/standard-codes', destination: `${base}/standardCodes` },
      { source: '/api/elibrary/publications', destination: `${base}/publications` },
      { source: '/api/elibrary/newsletters', destination: `${base}/newsletters` },
      { source: '/api/elibrary/curated-papers', destination: `${base}/curatedPapers` },
      { source: '/api/elibrary/downloads', destination: `${base}/downloads` },
    ];
  },
};

export default nextConfig;
