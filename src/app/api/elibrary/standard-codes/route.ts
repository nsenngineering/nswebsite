import { NextResponse } from 'next/server';
import type { ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

// Server-only env var — points at a local json-server instance during
// development. Not set (and not needed) for the Cloudflare Pages build.
const JSON_SERVER_URL = process.env.JSON_SERVER_URL ?? '';

// `output: 'export'` (the Cloudflare Pages build) needs every route to
// declare how it can be rendered without a runtime server. `force-static`
// tells Next.js: run this handler once, at build time, and freeze the
// result into a static file — there's no per-request execution to be had
// once this ships as static HTML/JS on a CDN.
export const dynamic = 'force-static';

export async function GET() {
  // The live json-server proxy — browser → this route → json-server,
  // same-origin, no CORS — is the actual Goal 4 lesson, and it only makes
  // sense against a real, reachable json-server: local development. In a
  // statically-exported build there's no server at request time anyway, and
  // JSON_SERVER_URL isn't configured for it, so we just serve the same
  // build-time data every other section of this site already uses.
  if (process.env.NODE_ENV !== 'development' || !JSON_SERVER_URL) {
    return NextResponse.json(staticData.standardCodes ?? []);
  }

  try {
    const upstream = await fetch(`${JSON_SERVER_URL}/standardCodes`, {
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream request failed: ${upstream.status} ${upstream.statusText}` },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      const text = await upstream.text();
      console.error(
        `Upstream returned non-JSON content-type "${contentType}". First 120 chars: ${text.slice(0, 120)}`
      );
      return NextResponse.json({ error: 'Upstream did not return JSON.' }, { status: 502 });
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to reach json-server for standard codes', error);
    return NextResponse.json(
      { error: 'Could not reach the upstream data source.' },
      { status: 502 }
    );
  }
}