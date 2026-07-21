import { NextResponse } from 'next/server';
import type { ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

// Save as: src/app/api/elibrary/newsletters/route.ts
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(staticData.newsletters ?? []);
}