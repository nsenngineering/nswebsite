/**
 * SEO Auto-Generator
 *
 * Automatically generates SEO metadata from existing service and project data
 * Zero manual SEO work required!
 *
 * When you add service #51 → SEO auto-generates on build
 * When you add project #50 → SEO auto-generates on build
 */

/**
 * Truncate text to specified length, adding ellipsis if needed
 */
function truncate(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}

/**
 * Extract keywords from an array of strings, removing duplicates
 * Returns lowercase, unique keywords
 */
function extractKeywords(words: string[]): string[] {
  const normalized = words
    .filter(w => w && typeof w === 'string') // Filter out null/undefined
    .map(w => w.toLowerCase().trim())
    .filter(w => w.length > 2) // Remove very short words
    .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  return normalized.slice(0, 15); // Max 15 keywords for SEO best practice
}

/**
 * Auto-generate SEO metadata for a service
 *
 * Extracts SEO from existing fields:
 * - metaTitle: from name
 * - metaDescription: from shortDescription (truncated to 155 chars)
 * - keywords: from name + category + equipmentUsed
 * - OG metadata: from service fields
 */
export function generateServiceSEO(service: {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  equipmentUsed?: string[];
}) {
  const keywords = extractKeywords([
    service.name,
    service.category,
    ...(service.equipmentUsed || []),
    'Nepal',
    'geotechnical testing',
    'ISO 9001:2015',
    'NS Engineering',
  ]);

  return {
    seo: {
      metaTitle: `${service.name} - Professional Geotechnical Testing Nepal`,
      metaDescription: truncate(service.shortDescription, 155),
      keywords,
      ogTitle: `${service.name} | NS Engineering`,
      ogDescription: truncate(service.shortDescription, 200),
      ogUrl: `https://www.nsengineering.com.np/services#${service.id}`,
    },
  };
}

/**
 * Auto-generate SEO metadata for a project
 *
 * Extracts SEO from existing fields:
 * - metaTitle: from title
 * - metaDescription: from title + client + scope (truncated to 155 chars)
 * - keywords: from category + location + year + scope
 * - OG metadata: from project fields
 */
export function generateProjectSEO(project: {
  id: string;
  title: string;
  client: string;
  category: string;
  year: number;
  location: {
    name: string;
    district?: string;
  };
  scope?: string[];
}) {
  // Create description from title, client, and first 2 scope items
  const scopeText = project.scope && project.scope.length > 0
    ? project.scope.slice(0, 2).join(', ')
    : '';
  const description = scopeText
    ? `${project.title} - ${project.client} (${project.year}). ${scopeText}`
    : `${project.title} - ${project.client} (${project.year})`;

  const keywords = extractKeywords([
    project.category,
    project.location.name,
    project.location.district || '',
    ...(project.scope || []),
    'Nepal',
    'geotechnical',
    project.year.toString(),
    project.client,
    'NS Engineering',
  ]);

  return {
    seo: {
      metaTitle: `${project.title} | NS Engineering Projects`,
      metaDescription: truncate(description, 155),
      keywords,
      ogTitle: project.title,
      ogDescription: `${project.client} project in ${project.location.name}, Nepal (${project.year})`,
      ogUrl: `https://www.nsengineering.com.np/projects#${project.id}`,
    },
  };
}
