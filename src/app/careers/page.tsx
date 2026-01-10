import type { Metadata } from 'next';
import CareersClient from './CareersClient';

const siteUrl = 'https://www.nsengineering.com.np';

export const metadata: Metadata = {
  title: 'Careers - Join Nepal\'s Leading Geotechnical Engineering Team',
  description: 'Join NS Engineering & Geotechnical Services. Career opportunities for geotechnical engineers, geologists, field technicians, and laboratory specialists. Competitive salary, professional development, and ISO 9001:2015 certified workplace.',
  keywords: [
    'geotechnical engineering jobs Nepal',
    'geotechnical engineer careers',
    'geologist jobs Nepal',
    'field technician jobs',
    'laboratory jobs Lalitpur',
    'engineering careers Nepal',
    'pile testing jobs',
    'drilling engineer jobs',
  ],
  openGraph: {
    title: 'Join Our Team | NS Engineering Careers',
    description: 'Career opportunities in Nepal\'s leading geotechnical services company. Competitive benefits, professional growth, cutting-edge projects.',
    url: `${siteUrl}/careers`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/careers`,
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
