import { NextResponse } from 'next/server';
import type { StandardCode } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

// Required so this route can be included in a static export build
// (output: 'export'). In `next dev` this has no effect — the handler
// still runs fresh on every request. In a static build it is executed
// once at build time and its response is baked into the output.
export const dynamic = 'force-static';

const staticFallback = ((elibraryData as unknown as { standardCodes?: StandardCode[] })
  .standardCodes ?? []);

// Server-only. No NEXT_PUBLIC_ prefix, so this never gets inlined into
// client JS. Set it in .env.local for local dev; leave it unset in cloud
// builds, which have no live json-server to reach anyway.
const JSON_SERVER_URL = process.env.JSON_SERVER_URL ?? '';

export async function GET() {
  if (!JSON_SERVER_URL) {
    return NextResponse.json(staticFallback);
  }

  try {
    const res = await fetch(`${JSON_SERVER_URL}/standardCodes`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : staticFallback);
  } catch (error) {
    console.error('standard-codes proxy failed, falling back to static data', error);
    return NextResponse.json(staticFallback);
  }
}