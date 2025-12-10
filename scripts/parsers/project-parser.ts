import path from 'path';
import fs from 'fs-extra';
import { CSVRecord, parseSemicolonArray, parseBoolean, parseNumber } from './csv-parser.js';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
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

export interface CategoryMetadata {
  id: string;
  label: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
}

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
 * Validate category format (kebab-case)
 */
function validateCategory(category: string, projectId: string): string {
  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!kebabCaseRegex.test(category)) {
    throw new Error(
      `❌ Invalid category format "${category}" for project: ${projectId}\n` +
      `   Categories must be lowercase, kebab-case (e.g., "pile-testing")`
    );
  }
  return category;
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
 * Auto-detect images from filesystem when CSV is empty
 */
async function autoDetectImages(
  projectId: string,
  csvImages: string[],
  csvHeroImage?: string
): Promise<{ images: string[]; heroImage?: string }> {
  // If CSV has images, use those (override mode)
  if (csvImages.length > 0) {
    return { images: csvImages, heroImage: csvHeroImage };
  }

  // Otherwise, scan filesystem
  const CONTENT_ROOT = path.join(process.cwd(), 'content', 'projects');
  const imagesDir = path.join(CONTENT_ROOT, projectId, 'images');

  // Check if directory exists
  const dirExists = await fs.pathExists(imagesDir);
  if (!dirExists) {
    return { images: [], heroImage: undefined };
  }

  try {
    // Read all files in directory
    const files = await fs.readdir(imagesDir);

    // Filter by image extensions
    const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
    const imageFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext);
      })
      .sort(); // Alphabetical order

    // Determine hero image
    let heroImage: string | undefined;
    if (csvHeroImage) {
      // CSV hero specified - validate it exists
      if (imageFiles.includes(csvHeroImage)) {
        heroImage = csvHeroImage;
      } else {
        console.warn(
          `⚠️  Warning: CSV hero_image "${csvHeroImage}" not found in ` +
          `${projectId}/images/ directory. Using first alphabetical image instead.`
        );
        heroImage = imageFiles.length > 0 ? imageFiles[0] : undefined;
      }
    } else {
      // No CSV hero - use first alphabetical
      heroImage = imageFiles.length > 0 ? imageFiles[0] : undefined;
    }

    return { images: imageFiles, heroImage };

  } catch (error) {
    console.error(
      `❌ Error reading images directory for project "${projectId}":`,
      error instanceof Error ? error.message : error
    );
    return { images: [], heroImage: undefined };
  }
}

/**
 * Parse a single project from CSV record
 */
export async function parseProject(record: CSVRecord): Promise<Project> {
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
  const csvImages = parseSemicolonArray(record.images);
  const pdfs = parseSemicolonArray(record.pdfs);
  const csvHeroImage = record.hero_image?.trim() || undefined;

  // Auto-detect images from filesystem if CSV is empty
  const { images, heroImage } = await autoDetectImages(id, csvImages, csvHeroImage);

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
export async function parseProjects(records: CSVRecord[]): Promise<Project[]> {
  const projects: Project[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    try {
      const project = await parseProject(records[i]);

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

/**
 * Format category slug to label (e.g., 'pile-testing' -> 'Pile Testing')
 */
function formatCategoryLabel(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Extract unique categories from projects and generate metadata
 */
export function extractCategories(projects: Project[]): CategoryMetadata[] {
  // Load category configuration
  const configPath = path.join(process.cwd(), 'content', 'categories', 'category-config.json');
  let categoryConfig: any = { categories: {}, defaults: {} };

  try {
    const configFile = fs.readFileSync(configPath, 'utf-8');
    categoryConfig = JSON.parse(configFile);
  } catch (error) {
    console.warn(`⚠️  Warning: Could not load category config from ${configPath}`);
    console.warn('   Using default category styling');
    categoryConfig = {
      categories: {},
      defaults: {
        color: '#9333ea',
        gradientFrom: 'purple-500',
        gradientTo: 'purple-700'
      }
    };
  }

  // Get unique categories from projects
  const uniqueCategories = [...new Set(projects.map(p => p.category))].sort();

  // Map to metadata
  return uniqueCategories.map(cat => ({
    id: cat,
    label: categoryConfig.categories[cat]?.label || formatCategoryLabel(cat),
    color: categoryConfig.categories[cat]?.color || categoryConfig.defaults.color,
    gradientFrom: categoryConfig.categories[cat]?.gradientFrom || categoryConfig.defaults.gradientFrom,
    gradientTo: categoryConfig.categories[cat]?.gradientTo || categoryConfig.defaults.gradientTo,
    description: categoryConfig.categories[cat]?.description || '',
  }));
}
