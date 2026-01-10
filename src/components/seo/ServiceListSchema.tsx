'use client';

import servicesData from '@/data/generated/services.json';
import { generateServiceListSchema } from '@/lib/seo/schema-generators';

/**
 * ServiceList Schema Component
 * Auto-generates Service schema for ALL services from JSON
 * When you add service #51, it automatically appears here!
 * Add to /services page
 */
export default function ServiceListSchema() {
  const services = servicesData.services || [];

  // Auto-generate schema from all services
  const schema = generateServiceListSchema(services.map(service => ({
    id: service.id,
    name: service.name,
    shortDescription: service.shortDescription,
  })));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
