'use client';

import { generateLocalBusinessSchema } from '@/lib/seo/schema-generators';

/**
 * LocalBusiness Schema Component
 * Improves local search visibility for Nepal-based searches
 * Add to root layout for site-wide coverage
 */
export default function LocalBusinessSchema() {
  const schema = generateLocalBusinessSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
