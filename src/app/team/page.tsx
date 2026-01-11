import TeamClient from './TeamClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generatePersonSchema } from '@/lib/seo/schema-generators';
import { generateTeamMetadata } from '@/lib/seo/dynamic-metadata';
import teamData from '@/data/generated/team.json';

export const metadata = generateTeamMetadata();

export default function TeamPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Team', path: '/team' },
  ]);

  // Generate Person schemas for featured team members (AI SEO)
  const personSchemas = teamData.members
    .filter(m => m.featured)
    .map(member => generatePersonSchema(member));

  return (
    <>
      <JsonLd data={[breadcrumbData, ...personSchemas]} />
      <TeamClient />
    </>
  );
}
