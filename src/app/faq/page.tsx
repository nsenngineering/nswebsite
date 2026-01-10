import FAQClient from './FAQClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateFAQPageSchema } from '@/lib/seo/schema-generators';
import { generateFAQMetadata } from '@/lib/seo/dynamic-metadata';
import faqData from '@/data/generated/faq.json';

export const metadata = generateFAQMetadata();

export default function FAQPage() {
  // Generate breadcrumb schema
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ]);

  // Generate FAQ schema from actual data
  const faqSchemaData = generateFAQPageSchema(
    faqData.faqs.map(faq => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  return (
    <>
      <JsonLd data={[breadcrumbData, faqSchemaData]} />
      <FAQClient />
    </>
  );
}
