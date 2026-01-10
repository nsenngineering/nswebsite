import PrivacyClient from './PrivacyClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';
import { generatePrivacyMetadata } from '@/lib/seo/dynamic-metadata';

export const metadata = generatePrivacyMetadata();

export default function PrivacyPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <PrivacyClient />
    </>
  );
}
