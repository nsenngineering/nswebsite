/**
 * Team Specialization to Service Mapper
 *
 * Maps team member specializations (free-text strings) to service @id references.
 * Uses fuzzy matching to link expertise areas to actual services.
 */

const SITE_URL = 'https://www.nsengineering.com.np';

/**
 * Mapping of specialization keywords to service IDs
 * This allows flexible matching without exact string matches
 */
const SPECIALIZATION_TO_SERVICE_MAP: Record<string, string[]> = {
  // Pile Testing specializations
  'pile testing': ['pda-testing', 'pit-testing', 'static-load-test', 'crosshole-sonic-logging'],
  'pile': ['pda-testing', 'pit-testing', 'static-load-test'],
  'foundation design': ['pda-testing', 'static-load-test'],
  'foundation': ['pda-testing', 'static-load-test'],

  // Geotechnical Investigation
  'geotechnical investigation': ['spt', 'drilling', 'masw', 'ert'],
  'geotechnical engineering': ['spt', 'drilling', 'soil-lab', 'rock-lab'],
  'geotechnical': ['spt', 'drilling', 'soil-lab'],
  'site investigation': ['spt', 'drilling'],

  // Soil & Laboratory
  'soil mechanics': ['soil-lab', 'spt'],
  'soil': ['soil-lab', 'spt'],
  'laboratory testing': ['soil-lab', 'rock-lab'],
  'laboratory': ['soil-lab', 'rock-lab'],

  // Rock Testing
  'rock': ['rock-lab', 'drilling'],

  // Drilling
  'drilling': ['drilling'],

  // Geophysical
  'geophysical': ['masw', 'ert', 'seismic-refraction'],

  // NDT Testing
  'ndt': ['ndt-testing'],
  'concrete': ['ndt-testing'],
  'structural assessment': ['ndt-testing'],

  // Transportation & Infrastructure
  'transportation engineering': ['soil-lab'],
  'road design': ['soil-lab'],
  'infrastructure planning': ['soil-lab'],
  'highway engineering': ['soil-lab'],

  // Construction Management
  'construction management': ['spt', 'drilling'],
  'quality control': ['soil-lab', 'rock-lab'],
  'site supervision': ['spt', 'drilling'],

  // Project Management
  'project management': ['pda-testing', 'drilling', 'soil-lab'],

  // Risk & Disaster
  'disaster risk management': ['ndt-testing'],
  'risk analysis': ['ndt-testing'],
  'emergency planning': ['ndt-testing'],
};

/**
 * Map team member specializations to service @id references
 *
 * @param specializations - Array of specialization strings from team member
 * @returns Array of service @id URLs for schema.org Person.knowsAbout
 */
export function mapSpecializationsToServices(specializations: string[]): string[] {
  const serviceIds = new Set<string>();

  for (const specialization of specializations) {
    const normalized = specialization.toLowerCase().trim();

    // Try to find matching services
    let found = false;
    for (const [keyword, services] of Object.entries(SPECIALIZATION_TO_SERVICE_MAP)) {
      if (normalized.includes(keyword)) {
        services.forEach(serviceId => serviceIds.add(serviceId));
        found = true;
      }
    }

    // If no match found, we still want to include the specialization as a string
    // This is handled in generatePersonSchema by including both service @ids and string literals
  }

  // Convert service IDs to @id references
  return Array.from(serviceIds).map(id => `${SITE_URL}/services#${id}`);
}

/**
 * Get combined knowledge areas for Person schema
 * Returns both service @id references and original specialization strings
 *
 * @param specializations - Array of specialization strings
 * @returns Combined array of service @ids and specialization strings
 */
export function getKnowsAboutArray(specializations: string[]): (string | { '@id': string })[] {
  const serviceRefs = mapSpecializationsToServices(specializations);

  // Combine service @id objects with original specialization strings
  const serviceObjects = serviceRefs.map(ref => ({ '@id': ref }));
  const result = [...serviceObjects, ...specializations];

  return result;
}
