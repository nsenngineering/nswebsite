import { CSVRecord, parseSemicolonArray, parseBoolean, parseNumber } from './csv-parser.js';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'pile-testing' | 'tunnel-road' | 'hydropower' | 'transmission' | 'ndt';
  year: number;
  location: {
    name: string;
    district?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  scope: string[];
  media: {
    images: string[];
    pdfs: string[];
    heroImage?: string;
  };
  featured?: boolean;
}

const VALID_CATEGORIES = ['pile-testing', 'tunnel-road', 'hydropower', 'transmission', 'ndt'];

// Nepal coordinate bounds
const NEPAL_LAT_MIN = 26.3479;
const NEPAL_LAT_MAX = 30.4227;
const NEPAL_LNG_MIN = 80.0884;
const NEPAL_LNG_MAX = 88.2015;

/**
 * Validate required field exists
 */
function validateRequired(value: string | undefined, fieldName: string, projectId: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`❌ Missing required field "${fieldName}" for project: ${projectId}`);
  }
  return value.trim();
}

/**
 * Validate category is one of allowed values
 */
function validateCategory(category: string, projectId: string): 'pile-testing' | 'tunnel-road' | 'hydropower' | 'transmission' | 'ndt' {
  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error(
      `❌ Invalid category "${category}" for project: ${projectId}\n` +
      `   Valid categories: ${VALID_CATEGORIES.join(', ')}`
    );
  }
  return category as 'pile-testing' | 'tunnel-road' | 'hydropower' | 'transmission' | 'ndt';
}

/**
 * Validate coordinates are within Nepal
 */
function validateCoordinates(lat: number, lng: number, projectId: string): void {
  if (lat < NEPAL_LAT_MIN || lat > NEPAL_LAT_MAX) {
    throw new Error(
      `❌ Invalid latitude ${lat} for project: ${projectId}\n` +
      `   Valid range for Nepal: ${NEPAL_LAT_MIN}°N to ${NEPAL_LAT_MAX}°N`
    );
  }

  if (lng < NEPAL_LNG_MIN || lng > NEPAL_LNG_MAX) {
    throw new Error(
      `❌ Invalid longitude ${lng} for project: ${projectId}\n` +
      `   Valid range for Nepal: ${NEPAL_LNG_MIN}°E to ${NEPAL_LNG_MAX}°E`
    );
  }
}

/**
 * Validate project ID format (kebab-case)
 */
function validateProjectId(id: string): void {
  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!kebabCaseRegex.test(id)) {
    throw new Error(
      `❌ Invalid project ID format: "${id}"\n` +
      `   Project IDs must be lowercase, kebab-case (e.g., "ktft-fast-track")`
    );
  }
}

/**
 * Parse a single project from CSV record
 */
export function parseProject(record: CSVRecord): Project {
  const id = validateRequired(record.id, 'id', record.id || 'unknown');
  validateProjectId(id);

  const title = validateRequired(record.title, 'title', id);
  const client = validateRequired(record.client, 'client', id);
  const category = validateCategory(
    validateRequired(record.category, 'category', id),
    id
  );
  const year = parseNumber(record.year, 'year');
  const locationName = validateRequired(record.location_name, 'location_name', id);

  const lat = parseNumber(record.coordinates_lat, 'coordinates_lat');
  const lng = parseNumber(record.coordinates_lng, 'coordinates_lng');
  validateCoordinates(lat, lng, id);

  const scope = parseSemicolonArray(record.scope);
  if (scope.length === 0) {
    console.warn(`⚠️  Warning: Project "${id}" has no scope items`);
  }

  // Parse media files
  const images = parseSemicolonArray(record.images);
  const pdfs = parseSemicolonArray(record.pdfs);
  const heroImage = record.hero_image?.trim() || undefined;

  // Construct full media paths (projectId/images/filename)
  const imagesPaths = images.map(img => `${id}/images/${img}`);
  const pdfsPaths = pdfs.map(pdf => `${id}/pdfs/${pdf}`);
  const heroImagePath = heroImage ? `${id}/images/${heroImage}` : undefined;

  const featured = parseBoolean(record.featured);

  return {
    id,
    title,
    client,
    category,
    year,
    location: {
      name: locationName,
      district: record.location_district?.trim() || undefined,
      coordinates: { lat, lng }
    },
    scope,
    media: {
      images: imagesPaths,
      pdfs: pdfsPaths,
      heroImage: heroImagePath
    },
    featured
  };
}

/**
 * Parse all projects from CSV records
 */
export function parseProjects(records: CSVRecord[]): Project[] {
  const projects: Project[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    try {
      const project = parseProject(records[i]);

      // Check for duplicate IDs
      if (seenIds.has(project.id)) {
        throw new Error(`❌ Duplicate project ID: ${project.id}`);
      }
      seenIds.add(project.id);

      projects.push(project);
    } catch (error) {
      console.error(`\n❌ Error parsing project at row ${i + 2}:`);
      throw error;
    }
  }

  console.log(`✅ Successfully parsed ${projects.length} projects`);
  return projects;
}
