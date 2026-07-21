import { NextResponse } from 'next/server';
import type { ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

// Save as: src/app/api/elibrary/standard-codes/route.ts
//
// `runtime = 'edge'` is required by @cloudflare/next-on-pages — it's what
// turns this handler into a real Cloudflare Pages Function that runs on
// every request, instead of a Node.js-only handler it can't deploy.
//
// JSON_SERVER_URL is a server-side-only secret (set via
// `wrangler pages secret put JSON_SERVER_URL`), never exposed to the browser.
// The browser only ever talks to /api/elibrary/standard-codes on its own
// origin — this handler is still the one place that knows the real
// backend exists, same BFF boundary as Goal 4, just genuinely live now.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const jsonServerUrl = process.env.JSON_SERVER_URL;

  if (!jsonServerUrl) {
    console.error('JSON_SERVER_URL is not configured for this environment.');
    return NextResponse.json(staticData.standardCodes ?? []);
  }

  try {
    const upstream = await fetch(`${jsonServerUrl}/standardCodes`, {
      // Always hit the real backend fresh; this route is the one place
      // that's allowed to know it exists, so there's no reason to cache
      // stale data behind it.
      cache: 'no-store',
    });

    if (!upstream.ok) {
      console.error(`Upstream request failed: ${upstream.status} ${upstream.statusText}`);
      return NextResponse.json(staticData.standardCodes ?? []);
    }

    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      const text = await upstream.text();
      console.error(
        `Upstream returned non-JSON content-type "${contentType}". First 120 chars: ${text.slice(0, 120)}`
      );
      return NextResponse.json(staticData.standardCodes ?? []);
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (error) {
    // Network failure, timeout, DNS issue, etc. Fall back to bundled data
    // rather than breaking the page — the eLibrary should degrade
    // gracefully, not 500, if the backend has a bad moment.
    console.error('Failed to reach the eLibrary API for standard codes', error);
    return NextResponse.json(staticData.standardCodes ?? []);
  }
}