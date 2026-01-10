import ContactClient from './ContactClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';
import { generateContactMetadata } from '@/lib/seo/dynamic-metadata';

export const metadata = generateContactMetadata();

export default function ContactPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <ContactClient />
    </>
  );
}
