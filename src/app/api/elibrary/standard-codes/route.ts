import { NextResponse } from 'next/server';
import type { ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

// `output: 'export'` (the Cloudflare Pages build) needs every route to
// declare how it can be rendered without a runtime server. `force-static`
// tells Next.js: run this handler once, at build time, and freeze the
// result into a static file — there's no per-request execution once this
// ships as static HTML/JS on a CDN.
//
// IMPORTANT: this route must never contain a `fetch(..., { cache: 'no-store' })`
// call or any other "dynamic API usage" — even inside a branch that's dead
// code in production — because Next's export validator flags that signal
// before your runtime `if` ever runs, and it will fail the build even
// though `force-static` is declared. The json-server proxy for local
// development lives in next.config.js's `rewrites()` instead, which is
// only evaluated under `next dev` and is a no-op (ignored) for static
// export builds. See that file for the dev-only proxy.
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(staticData.standardCodes ?? []);
}