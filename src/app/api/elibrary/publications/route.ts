import { NextResponse } from 'next/server';
import type { ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

// Save as: src/app/api/elibrary/publications/route.ts
//
// Same BFF boundary as standard-codes/route.ts: JSON_SERVER_URL is a
// server-side-only secret, this handler is the only place that knows the
// real backend exists, and the browser only ever talks to
// /api/elibrary/publications on its own origin.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const jsonServerUrl = process.env.JSON_SERVER_URL;

  if (!jsonServerUrl) {
    console.error('JSON_SERVER_URL is not configured for this environment.');
    return NextResponse.json(staticData.publications ?? []);
  }

  try {
    const upstream = await fetch(`${jsonServerUrl}/publications`, {
      cache: 'no-store',
    });

    if (!upstream.ok) {
      console.error(`Upstream request failed: ${upstream.status} ${upstream.statusText}`);
      return NextResponse.json(staticData.publications ?? []);
    }

    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      const text = await upstream.text();
      console.error(
        `Upstream returned non-JSON content-type "${contentType}". First 120 chars: ${text.slice(0, 120)}`
      );
      return NextResponse.json(staticData.publications ?? []);
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to reach the eLibrary API for publications', error);
    return NextResponse.json(staticData.publications ?? []);
  }
}