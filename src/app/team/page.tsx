import TeamClient from './TeamClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';
import { generateTeamMetadata } from '@/lib/seo/dynamic-metadata';

export const metadata = generateTeamMetadata();

export default function TeamPage() {
  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Team', path: '/team' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <TeamClient />
    </>
  );
}
