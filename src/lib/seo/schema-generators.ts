import { siteConfig } from '@/data/site-config';
import type { TeamMember } from '@/types/team';
import type { TechnicalTerm } from '@/data/schema/technical-terms';
import { getKnowsAboutArray } from './team-service-mapper';

const SITE_URL = 'https://www.nsengineering.com.np';

/**
 * Generate Organization schema for company information
 * Shows in Google Knowledge Graph with AI-optimized employee connections
 */
export function generateOrganizationSchema(options?: {
  featuredMembers?: TeamMember[];
}) {
  const baseSchema = {
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
    // Enhanced for AI SEO
    areaServed: {
      '@type': 'Country',
      name: 'Nepal',
      '@id': 'https://www.wikidata.org/wiki/Q837',
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 50,
      minValue: 50,
      maxValue: 100,
    },
    knowsAbout: [
      'Geotechnical Engineering',
      'Pile Testing',
      'Soil Laboratory Testing',
      'Rock Laboratory Testing',
      'Drilling Services',
      'Geophysical Surveys',
      'Non-Destructive Testing',
      'Foundation Investigation',
    ],
  };

  // Add employee references if team members provided
  if (options?.featuredMembers && options.featuredMembers.length > 0) {
    const employeeRefs = options.featuredMembers.map(member => {
      const nameParts = member.name.toLowerCase().split(' ');
      const personId = `${nameParts[0]}-${nameParts[nameParts.length - 1]}`;
      return { '@id': `${SITE_URL}/#person-${personId}` };
    });

    // Find Managing Director for founder reference
    const managingDirector = options.featuredMembers.find(
      m => m.role === 'Managing Director'
    );
    const founderRef = managingDirector
      ? (() => {
          const nameParts = managingDirector.name.toLowerCase().split(' ');
          const personId = `${nameParts[0]}-${nameParts[nameParts.length - 1]}`;
          return { '@id': `${SITE_URL}/#person-${personId}` };
        })()
      : undefined;

    return {
      ...baseSchema,
      employee: employeeRefs,
      ...(founderRef && { founder: founderRef }),
    };
  }

  return baseSchema;
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
 * Auto-generates from services array with AI-optimized geographic targeting
 */
export function generateServiceListSchema(services: Array<{
  id: string;
  name: string;
  shortDescription: string;
  category?: string;
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
        // Enhanced geographic targeting for AI SEO
        areaServed: {
          '@type': 'Country',
          name: 'Nepal',
          '@id': 'https://www.wikidata.org/wiki/Q837',
        },
        availableInLanguage: ['en', 'ne'],
        serviceType: service.category || 'Geotechnical Testing',
        url: `${SITE_URL}/services#${service.id}`,
      },
    })),
  };
}

/**
 * Generate Project/CreativeWork schema for projects with AI-optimized geographic data
 * Uses precise lat/lng coordinates for location-based AI queries
 */
export function generateProjectListSchema(projects: Array<{
  id: string;
  title: string;
  client: string;
  category: string;
  year: number;
  location?: {
    name: string;
    district?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => {
      const baseItem = {
        '@type': 'CreativeWork',
        '@id': `${SITE_URL}/projects#${project.id}`,
        name: project.title,
        author: {
          '@id': `${SITE_URL}/#organization`,
        },
        datePublished: `${project.year}-01-01`,
        about: project.category,
        client: project.client,
        // Enhanced for AI SEO - country-level location
        locationCreated: {
          '@type': 'Country',
          name: 'Nepal',
          '@id': 'https://www.wikidata.org/wiki/Q837',
        },
        inLanguage: ['en', 'ne'],
      };

      // Add precise geographic data if location exists
      if (project.location) {
        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            ...baseItem,
            // Precise geographic location for AI queries like "projects in Makwanpur"
            spatialCoverage: {
              '@type': 'Place',
              name: project.location.district
                ? `${project.location.name}, ${project.location.district}, Nepal`
                : `${project.location.name}, Nepal`,
              geo: {
                '@type': 'GeoCoordinates',
                latitude: project.location.coordinates.lat,
                longitude: project.location.coordinates.lng,
              },
              address: {
                '@type': 'PostalAddress',
                addressLocality: project.location.name,
                ...(project.location.district && {
                  addressRegion: project.location.district,
                }),
                addressCountry: 'NP',
              },
            },
          },
        };
      }

      // Fallback for projects without location data
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: baseItem,
      };
    }),
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

/**
 * Generate Person schema for team members (AI SEO optimization)
 * Enables AI assistants to cite individual experts
 *
 * @param member - Team member data from CMS
 * @returns schema.org Person markup
 */
export function generatePersonSchema(member: TeamMember) {
  // Generate unique @id from name (lowercase, hyphenated first-last)
  const nameParts = member.name.toLowerCase().split(' ');
  const personId = `${nameParts[0]}-${nameParts[nameParts.length - 1]}`;

  // Parse experience years (e.g., "19 Years" → 19)
  const experienceYears = parseInt(member.experience.replace(/\D/g, ''), 10);

  // Get knowsAbout array with both service @ids and specialization strings
  const knowsAbout = member.specializations
    ? getKnowsAboutArray(member.specializations)
    : member.specializations || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person-${personId}`,
    name: member.name,
    jobTitle: member.role,
    worksFor: {
      '@id': `${SITE_URL}/#organization`,
    },
    ...(knowsAbout.length > 0 && { knowsAbout }),
    ...(member.education && {
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: member.education,
      },
    }),
    ...(experienceYears && !isNaN(experienceYears) && {
      yearsOfExperience: experienceYears,
    }),
    ...(member.linkedinUrl && {
      sameAs: member.linkedinUrl,
    }),
  };
}

/**
 * Generate DefinedTerm schema for technical terminology (AI SEO optimization)
 * Helps AI assistants understand and explain geotechnical acronyms
 *
 * @param term - Technical term definition
 * @returns schema.org DefinedTerm markup
 */
export function generateDefinedTermSchema(term: TechnicalTerm) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${SITE_URL}/terms#${term.acronym.toLowerCase()}`,
    name: term.acronym,
    termCode: term.acronym,
    description: term.description,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${SITE_URL}/terms#geotechnical-terminology`,
      name: 'Geotechnical Engineering Terminology',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    // Link term to related service for knowledge graph connection
    isRelatedTo: {
      '@id': `${SITE_URL}/services#${term.relatedServiceId}`,
    },
  };
}
