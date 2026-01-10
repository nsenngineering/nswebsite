import type { Metadata } from 'next';
import ELibraryClient from './ELibraryClient';

const siteUrl = 'https://www.nsengineering.com.np';

export const metadata: Metadata = {
  title: 'eLibrary - Technical Resources, Standards & Publications',
  description: 'Access our technical library: geotechnical standards (ASTM, IS, BS codes), research publications, curated papers, project downloads, and quarterly newsletters. Free geotechnical engineering resources.',
  keywords: [
    'geotechnical standards',
    'ASTM standards',
    'IS codes geotechnical',
    'BS codes Nepal',
    'geotechnical publications',
    'engineering research papers',
    'technical resources Nepal',
    'geotechnical library',
  ],
  openGraph: {
    title: 'eLibrary | Technical Standards & Publications',
    description: 'Free access to geotechnical standards, research publications, and technical resources from NS Engineering.',
    url: `${siteUrl}/elibrary`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/elibrary`,
  },
};

export default function ELibraryPage() {
  return <ELibraryClient />;
}
