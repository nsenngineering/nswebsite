import { NextResponse } from 'next/server';
import type { ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

const JSON_SERVER_URL = process.env.JSON_SERVER_URL ?? '';

export const dynamic = 'force-static';

export async function GET() {
  if (process.env.NODE_ENV !== 'development' || !JSON_SERVER_URL) {
    return NextResponse.json(staticData.curatedPapers ?? []);
  }

  try {
    // Note: URL segment here is "curated-papers" (kebab-case, matches the
    // rest of our route naming) but json-server's own resource is
    // "curatedPapers" (camelCase) — this handler is exactly the seam where
    // that naming mismatch gets absorbed.
    const upstream = await fetch(`${JSON_SERVER_URL}/curatedPapers`, {
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
    console.error('Failed to reach json-server for curated papers', error);
    return NextResponse.json(
      { error: 'Could not reach the upstream data source.' },
      { status: 502 }
    );
  }
}