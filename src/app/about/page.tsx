import type { Metadata } from 'next';
import AboutClient from './AboutClient';

const siteUrl = 'https://www.nsengineering.com.np';

export const metadata: Metadata = {
  title: 'About Us - ISO 9001:2015 Certified Geotechnical Services',
  description: 'NS Engineering & Geotechnical Services - Nepal\'s trusted partner in geotechnical investigation, pile testing, and material analysis since 2014. ISO 9001:2015 certified laboratory in Lalitpur.',
  keywords: [
    'about NS Engineering',
    'geotechnical company Nepal',
    'ISO certified laboratory Nepal',
    'geotechnical testing Lalitpur',
    'pile testing company',
    'engineering services Nepal',
    'infrastructure testing Nepal',
  ],
  openGraph: {
    title: 'About NS Engineering - Leading Geotechnical Services in Nepal',
    description: 'Learn about our 10+ years of excellence in geotechnical engineering. ISO 9001:2015 certified, 50+ team members, 100+ projects completed.',
    url: `${siteUrl}/about`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
