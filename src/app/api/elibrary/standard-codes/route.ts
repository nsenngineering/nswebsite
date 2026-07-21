import { NextResponse } from 'next/server';
import type { ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const jsonServerUrl = process.env.JSON_SERVER_URL;   // ← your Render URL, set as a Pages secret

  if (!jsonServerUrl) {
    return NextResponse.json(staticData.standardCodes ?? []);   // safety fallback only
  }

  try {
    const upstream = await fetch(`${jsonServerUrl}/standardCodes`, {
      cache: 'no-store',   // ← always hits json-server fresh, never cached
    });
    // ...content-type / status checks...
    const data = await upstream.json();
    return NextResponse.json(data);   // ← this is what the browser actually receives
  } catch (error) {
    return NextResponse.json(staticData.standardCodes ?? []);
  }
}