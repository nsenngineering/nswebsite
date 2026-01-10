import TermsClient from './TermsClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';
import { generateTermsMetadata } from '@/lib/seo/dynamic-metadata';

export const metadata = generateTermsMetadata();

export default function TermsPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Terms of Use', path: '/terms' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <TermsClient />
    </>
  );
}
