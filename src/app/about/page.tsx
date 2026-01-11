import AboutClient from './AboutClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  generateBreadcrumbSchema,
  generatePersonSchema,
  generateOrganizationSchema,
} from '@/lib/seo/schema-generators';
import { generateAboutMetadata } from '@/lib/seo/dynamic-metadata';
import teamData from '@/data/generated/team.json';

export const metadata = generateAboutMetadata();

export default function AboutPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
  ]);

  // Get featured team members for schemas
  const featuredMembers = teamData.members.filter(m => m.featured);

  // Generate Person schemas for leadership team (AI SEO)
  const personSchemas = featuredMembers.map(member => generatePersonSchema(member));

  // Generate enhanced Organization schema with employee references
  const organizationSchema = generateOrganizationSchema({ featuredMembers });

  return (
    <>
      <JsonLd data={[breadcrumbData, organizationSchema, ...personSchemas]} />
      <AboutClient />
    </>
  );
}
