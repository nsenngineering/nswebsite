import ServicesClient from './ServicesClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  generateBreadcrumbSchema,
  generateServiceListSchema,
  generateDefinedTermSchema,
} from '@/lib/seo/schema-generators';
import { generateServicesMetadata } from '@/lib/seo/dynamic-metadata';
import servicesData from '@/data/generated/services.json';
import { technicalTerms } from '@/data/schema/technical-terms';

export const metadata = generateServicesMetadata();

export default function ServicesPage() {
  // Generate breadcrumb schema
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  // Generate ServiceList schema from actual data with category for AI SEO
  const serviceListSchema = generateServiceListSchema(
    servicesData.services.map(service => ({
      id: service.id,
      name: service.name,
      shortDescription: service.shortDescription,
      category: service.category,
    }))
  );

  // Generate DefinedTerm schemas for geotechnical terminology (AI SEO)
  const termSchemas = technicalTerms.map(term => generateDefinedTermSchema(term));

  return (
    <>
      <JsonLd data={[breadcrumbData, serviceListSchema, ...termSchemas]} />
      <ServicesClient />
    </>
  );
}
