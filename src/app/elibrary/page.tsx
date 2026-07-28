import { draftMode } from 'next/headers';
import ELibraryClient from './ELibraryClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';
import { generateELibraryMetadata } from '@/lib/seo/dynamic-metadata';
import { getAllELibrarySections } from '@/lib/data/elibrary-server';

export const metadata = generateELibraryMetadata();

// page.tsx is now an async Server Component. The data fetch below runs
// as the page renders on the server — under `output: 'export'` that
// means once, at `next build` time (see elibrary-server.ts for why).
// ELibraryClient no longer fetches anything on mount; it only receives
// already-resolved data as props and handles UI state (active tab,
// search query, selected item).
//
// Goal 6 (Draft Mode): `draftMode()` reads whether the incoming request
// carried the __prerender_bypass cookie set by /api/draft. This check
// only means anything on a live Next.js server (`next dev`, or a real
// server runtime in prod) — under the current `output: 'export'`
// deploy, this page is rendered once at build time with no request to
// inspect, so isEnabled will always read false there. That's expected:
// this feature is real and working in `next dev` today, and would need
// the site to move off static export (see the note in elibrary-server.ts)
// before a real editor could use it in production.
export default async function ELibraryPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'eLibrary', path: '/elibrary' },
  ]);

  const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
  const isPreview = isStaticExport ? false : (await draftMode()).isEnabled;
  const initialData = await getAllELibrarySections({ includeUnpublished: isPreview });

  return (
    <>
      <JsonLd data={breadcrumbData} />
      {isPreview && (
        <div className="bg-amber-500 text-amber-950 text-sm font-medium text-center py-2">
          Draft preview mode — showing unpublished standard codes.{' '}
          <a href="/api/draft/disable" className="underline">Exit preview</a>
        </div>
      )}
      <ELibraryClient initialData={initialData} />
    </>
  );
}
