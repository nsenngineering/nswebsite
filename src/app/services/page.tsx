import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

const siteUrl = 'https://www.nsengineering.com.np';

export const metadata: Metadata = {
  title: 'Services - Pile Testing, Drilling, Laboratory Testing | NS Engineering',
  description: 'Comprehensive geotechnical testing and engineering services in Nepal. Pile testing (PDA, PIT, Static Load), drilling (up to 700m), soil & rock laboratory, geophysical surveys, NDT services. ISO 9001:2015 certified.',
  keywords: [
    'pile testing Nepal',
    'PDA testing Nepal',
    'geotechnical drilling',
    'soil laboratory testing',
    'rock laboratory Nepal',
    'geophysical survey',
    'NDT services Nepal',
    'static load test',
    'cross-hole sonic logging',
    'geotechnical services Lalitpur',
  ],
  openGraph: {
    title: 'Geotechnical Testing Services | NS Engineering Nepal',
    description: '50+ specialized services: Pile Testing, Drilling (700m capacity), Soil & Rock Laboratory, Geophysical Surveys, NDT. ISO 9001:2015 certified.',
    url: `${siteUrl}/services`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/services`,
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
