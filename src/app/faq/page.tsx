import type { Metadata } from 'next';
import FAQClient from './FAQClient';

const siteUrl = 'https://www.nsengineering.com.np';

export const metadata: Metadata = {
  title: 'FAQ - Geotechnical Testing Questions Answered | NS Engineering',
  description: 'Frequently asked questions about pile testing, geotechnical services, pricing, testing procedures, and project timelines. Get answers about PDA testing, static load tests, drilling, and laboratory analysis.',
  keywords: [
    'geotechnical testing FAQ',
    'pile testing questions',
    'PDA testing FAQ',
    'static load test questions',
    'geotechnical services pricing',
    'soil testing FAQ',
    'drilling services questions',
    'laboratory testing FAQ',
  ],
  openGraph: {
    title: 'Geotechnical Services FAQ | NS Engineering Nepal',
    description: '20+ answered questions about our geotechnical testing, pile analysis, drilling, and laboratory services in Nepal.',
    url: `${siteUrl}/faq`,
    type: 'website',
  },
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
