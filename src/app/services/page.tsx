import ServicesClient from './ServicesClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateServiceListSchema } from '@/lib/seo/schema-generators';
import { generateServicesMetadata } from '@/lib/seo/dynamic-metadata';
import servicesData from '@/data/generated/services.json';

export const metadata = generateServicesMetadata();

export default function ServicesPage() {
  // Generate breadcrumb schema
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ]);

  // Generate ServiceList schema from actual data
  const serviceListSchema = generateServiceListSchema(
    servicesData.services.map(service => ({
      id: service.id,
      name: service.name,
      shortDescription: service.shortDescription,
    }))
  );

  return (
    <>
      <JsonLd data={[breadcrumbData, serviceListSchema]} />
      <ServicesClient />
    </>
  );
}
