'use client';

import { generateOrganizationSchema } from '@/lib/seo/schema-generators';

/**
 * Organization Schema Component
 * Shows company information in Google Knowledge Graph
 * Add to root layout for site-wide coverage
 */
export default function OrganizationSchema() {
  const schema = generateOrganizationSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
