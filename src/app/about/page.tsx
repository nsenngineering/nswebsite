import AboutClient from './AboutClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';
import { generateAboutMetadata } from '@/lib/seo/dynamic-metadata';

export const metadata = generateAboutMetadata();

export default function AboutPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <AboutClient />
    </>
  );
}
