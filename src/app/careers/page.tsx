import CareersClient from './CareersClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';
import { generateCareersMetadata } from '@/lib/seo/dynamic-metadata';

export const metadata = generateCareersMetadata();

export default function CareersPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Careers', path: '/careers' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <CareersClient />
    </>
  );
}
