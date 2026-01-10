import type { Metadata } from 'next';
import ContactClient from './ContactClient';

const siteUrl = 'https://www.nsengineering.com.np';

export const metadata: Metadata = {
  title: 'Contact Us - Get Free Project Consultation | NS Engineering',
  description: 'Contact NS Engineering for geotechnical testing services. Located in Jwagal, Lalitpur. Call +977-01-5260121, email info@nsengineering.com.np. Request free project quotation for pile testing, drilling, laboratory services.',
  keywords: [
    'contact NS Engineering',
    'geotechnical services Lalitpur',
    'pile testing quotation',
    'geotechnical consultation Nepal',
    'engineering services contact',
    'Jwagal Lalitpur office',
    'geotechnical testing inquiry',
  ],
  openGraph: {
    title: 'Contact NS Engineering | Free Project Consultation',
    description: 'Get in touch for geotechnical testing services. Office in Jwagal, Lalitpur. Phone, email, or request a quote online.',
    url: `${siteUrl}/contact`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
