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
export default async function ELibraryPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'eLibrary', path: '/elibrary' },
  ]);

  const initialData = await getAllELibrarySections();

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <ELibraryClient initialData={initialData} />
    </>
  );
}
