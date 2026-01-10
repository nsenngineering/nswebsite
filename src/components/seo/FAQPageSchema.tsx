'use client';

import { generateFAQPageSchema } from '@/lib/seo/schema-generators';

/**
 * FAQPage Schema Component
 * Enables FAQ rich results in Google search
 * Pass FAQ data as props
 * Add to /faq page
 */
interface FAQPageSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export default function FAQPageSchema({ faqs }: FAQPageSchemaProps) {
  const schema = generateFAQPageSchema(faqs);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
