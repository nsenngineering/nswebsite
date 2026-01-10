import ELibraryClient from './ELibraryClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';
import { generateELibraryMetadata } from '@/lib/seo/dynamic-metadata';

export const metadata = generateELibraryMetadata();

export default function ELibraryPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'eLibrary', path: '/elibrary' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <ELibraryClient />
    </>
  );
}
