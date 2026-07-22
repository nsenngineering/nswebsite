import { NextResponse } from 'next/server';
import type { ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

// Save as: src/app/api/elibrary/curated-papers/route.ts
//
// Route segment is kebab-case ("curated-papers") to match the folder name
// under src/app/api/elibrary/, but json-server's own resource is camelCase
// ("curatedPapers") — same split as the rest of loadSection()'s callers.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const jsonServerUrl = process.env.JSON_SERVER_URL;

  if (!jsonServerUrl) {
    console.error('JSON_SERVER_URL is not configured for this environment.');
    return NextResponse.json(staticData.curatedPapers ?? []);
  }

  try {
    const upstream = await fetch(`${jsonServerUrl}/curatedPapers`, {
      cache: 'no-store',
    });

    if (!upstream.ok) {
      console.error(`Upstream request failed: ${upstream.status} ${upstream.statusText}`);
      return NextResponse.json(staticData.curatedPapers ?? []);
    }

    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      const text = await upstream.text();
      console.error(
        `Upstream returned non-JSON content-type "${contentType}". First 120 chars: ${text.slice(0, 120)}`
      );
      return NextResponse.json(staticData.curatedPapers ?? []);
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to reach the eLibrary API for curated papers', error);
    return NextResponse.json(staticData.curatedPapers ?? []);
  }
}