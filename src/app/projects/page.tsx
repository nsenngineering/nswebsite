import type { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

const siteUrl = 'https://www.nsengineering.com.np';

export const metadata: Metadata = {
  title: 'Projects - 100+ Infrastructure Projects Across Nepal | NS Engineering',
  description: '100+ completed geotechnical projects across Nepal. Roads, bridges, tunnels, hydropower, transmission lines. View our interactive project map showing work in all major districts.',
  keywords: [
    'geotechnical projects Nepal',
    'infrastructure projects Nepal',
    'pile testing projects',
    'hydropower geotechnical',
    'tunnel drilling Nepal',
    'road projects Nepal',
    'transmission line testing',
    'geotechnical investigation projects',
    'fast track expressway',
    'hydropower investigation',
  ],
  openGraph: {
    title: '100+ Infrastructure Projects | NS Engineering Nepal',
    description: 'Explore our portfolio of geotechnical projects across Nepal. Interactive map, detailed case studies, major highway and hydropower projects.',
    url: `${siteUrl}/projects`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/projects`,
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
