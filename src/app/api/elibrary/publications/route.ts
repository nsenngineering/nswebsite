import { NextResponse } from 'next/server';
import type { ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

// Save as: src/app/api/elibrary/publications/route.ts
// See src/app/api/elibrary/standard-codes/route.ts for why this must stay
// free of any fetch()/dynamic-API usage — the dev proxy to json-server
// lives in next.config.ts's rewrites() instead.
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(staticData.publications ?? []);
}