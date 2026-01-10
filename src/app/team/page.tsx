import type { Metadata } from 'next';
import TeamClient from './TeamClient';
import JsonLd from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema-generators';

const siteUrl = 'https://www.nsengineering.com.np';

export const metadata: Metadata = {
  title: 'Team - 50+ Expert Engineers & Geologists | NS Engineering',
  description: 'Meet our team of experienced engineers, geologists, and technicians. Leadership with 15-30 years of experience in geotechnical testing, pile analysis, and infrastructure projects across Nepal.',
  keywords: [
    'geotechnical engineers Nepal',
    'geologists Nepal',
    'pile testing experts',
    'geotechnical team',
    'engineering professionals Nepal',
    'experienced engineers Lalitpur',
    'geotechnical specialists',
    'infrastructure team',
  ],
  openGraph: {
    title: '50+ Expert Team Members | NS Engineering Nepal',
    description: 'Experienced engineers and geologists with decades of combined expertise in geotechnical testing and infrastructure development.',
    url: `${siteUrl}/team`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/team`,
  },
};

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
