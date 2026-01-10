import { siteConfig } from '@/data/site-config';

const SITE_URL = 'https://www.nsengineering.com.np';

/**
 * Generate Organization schema for company information
 * Shows in Google Knowledge Graph
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName || 'NS Engineering',
    url: SITE_URL,
    logo: `${SITE_URL}/logo/ns-logo.jpg`,
    description: siteConfig.description,
    slogan: siteConfig.tagline || 'Constantly Evolving, Foundation You Can Trust',
    foundingDate: '2014',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bishal Niwash, 4th Cross, Jwagal',
      addressLocality: 'Lalitpur',
      addressRegion: 'Bagmati Province',
      postalCode: '44700',
      addressCountry: 'NP',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact?.phone || '+977-01-5260121',
      contactType: 'customer service',
      email: siteConfig.contact?.email || 'info@nsengineering.com.np',
      areaServed: 'NP',
      availableLanguage: ['en', 'ne'],
    },
    sameAs: [
      siteConfig.social?.facebook || '',
      siteConfig.social?.linkedin || '',
      siteConfig.social?.instagram || '',
    ].filter(Boolean),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'ISO Certification',
      name: siteConfig.certification?.iso || 'ISO 9001:2015',
    },
  };
}

/**
 * Generate LocalBusiness schema for Nepal-based services
 * Improves local search visibility
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#localbusiness`,
    name: siteConfig.name,
    image: `${SITE_URL}/images/lab-photo.jpg`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bishal Niwash, 4th Cross, Jwagal',
      addressLocality: 'Lalitpur',
      postalCode: '44700',
      addressCountry: 'NP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.6588,
      longitude: 85.3240,
    },
    url: SITE_URL,
    telephone: siteConfig.contact?.phone || '+977-01-5260121',
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Nepal',
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD structured data for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Generate Service schema for individual service
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    description: service.description,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nepal',
    },
    url: service.url || `${SITE_URL}/services`,
  };
}

/**
 * Generate ServiceList schema for all services
 * Auto-generates from services array
 */
export function generateServiceListSchema(services: Array<{
  id: string;
  name: string;
  shortDescription: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        '@id': `${SITE_URL}/services#${service.id}`,
        name: service.name,
        description: service.shortDescription,
        provider: {
          '@id': `${SITE_URL}/#organization`,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Nepal',
        },
        serviceType: 'Geotechnical Testing',
      },
    })),
  };
}

/**
 * Generate Project/CreativeWork schema for projects
 */
export function generateProjectListSchema(projects: Array<{
  id: string;
  title: string;
  client: string;
  category: string;
  year: number;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        '@id': `${SITE_URL}/projects#${project.id}`,
        name: project.title,
        author: {
          '@id': `${SITE_URL}/#organization`,
        },
        datePublished: `${project.year}-01-01`,
        about: project.category,
        client: project.client,
      },
    })),
  };
}

/**
 * Generate FAQPage schema for rich results in search
 */
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JobPosting schema for careers page
 */
export function generateJobPostingSchema(job: {
  title: string;
  description: string;
  employmentType: string;
  location: string;
  datePosted: string;
  validThrough?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    employmentType: job.employmentType,
    hiringOrganization: {
      '@id': `${SITE_URL}/#organization`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'NP',
      },
    },
    datePosted: job.datePosted,
    validThrough: job.validThrough || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  };
}
