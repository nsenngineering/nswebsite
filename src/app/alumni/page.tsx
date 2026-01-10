import AlumniClient from './AlumniClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';
import { generateAlumniMetadata } from '@/lib/seo/dynamic-metadata';

export const metadata = generateAlumniMetadata();

export default function AlumniPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Alumni', path: '/alumni' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <AlumniClient />
    </>
  );
}
