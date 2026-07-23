import { NextResponse } from 'next/server';
import type { Publication } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

export const dynamic = 'force-static';

const staticFallback = ((elibraryData as unknown as { publications?: Publication[] })
  .publications ?? []);

const JSON_SERVER_URL = process.env.JSON_SERVER_URL ?? '';

export async function GET() {
  if (!JSON_SERVER_URL) {
    return NextResponse.json(staticFallback);
  }

  try {
    const res = await fetch(`${JSON_SERVER_URL}/publications`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : staticFallback);
  } catch (error) {
    console.error('publications proxy failed, falling back to static data', error);
    return NextResponse.json(staticFallback);
  }
}