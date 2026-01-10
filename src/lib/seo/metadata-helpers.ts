/**
 * SEO Metadata Helper Functions
 *
 * Centralized metadata generation for all pages.
 * Supports: Open Graph, Twitter Cards, Canonical URLs
 */

import { Metadata } from 'next';
import { siteConfig } from '@/data/site-config';

// Base URL for canonical URLs and Open Graph
const BASE_URL = siteConfig.url; // https://www.nsengineering.com.np

// Default Open Graph image (logo)
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo/ns-logo.jpg`;

interface SEOConfig {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
}

/**
 * Generate complete metadata for a page
 *
 * Usage:
 * export const metadata = generatePageMetadata({
 *   title: 'About Us',
 *   description: 'Learn about NS Engineering...',
 *   path: '/about',
 *   keywords: ['geotechnical', 'engineering'],
 * });
 */
export function generatePageMetadata(config: SEOConfig): Metadata {
  const { title, description, path, image, type = 'website', keywords } = config;

  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.shortName}`;
  const canonicalUrl = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },

    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
