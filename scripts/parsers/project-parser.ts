import path from 'path';
import fs from 'fs-extra';
import { CSVRecord, parseSemicolonArray, parseBoolean, parseNumber } from './csv-parser.js';
import { parseCategoriesCSV, CategoryConfig } from './category-parser.js';
import { fetchProjectsWithFallback, SheetRow } from './google-sheets-parser.js';

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
 * Check if R2 mode is enabled
 */
function isR2Mode(): boolean {
  return !!process.env.NEXT_PUBLIC_R2_BASE_URL && process.env.NEXT_PUBLIC_R2_BASE_URL !== 'https://pub-XXXXX.r2.dev';
}

/**
 * Construct media URL (R2 or local path)
 * @param projectId - Project ID
 * @param mediaType - Type of media (images, pdfs)
 * @param filename - File name
 * @returns Full URL (R2) or relative path (local)
 */
function constructMediaUrl(projectId: string, mediaType: 'images' | 'pdfs', filename: string): string {
  if (isR2Mode()) {
    const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_BASE_URL!;
    const R2_BASE_PATH = process.env.R2_BASE_PATH || 'projects';
    return `${R2_BASE_URL}/${R2_BASE_PATH}/${projectId}/${mediaType}/${filename}`;
  } else {
    // Local mode - return relative path (will be copied to public/)
    return `${projectId}/${mediaType}/${filename}`;
  }
}

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
 * Note: In R2 mode, filesystem auto-detection is skipped
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

  // In R2 mode, skip filesystem detection (images are in R2, not local)
  if (isR2Mode()) {
    if (csvImages.length === 0) {
      console.warn(
        `⚠️  Warning: Project "${projectId}" has no images specified in CSV/Sheets.\n` +
        `   In R2 mode, images must be listed in the images column.`
      );
    }
    return { images: [], heroImage: undefined };
  }

  // Local mode: scan filesystem for images
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
 * Convert SheetRow to CSVRecord format
 */
function sheetRowToCSVRecord(row: SheetRow): CSVRecord {
  return {
    id: row.id,
    title: row.title,
    client: row.client,
    category: row.category,
    year: row.year.toString(),
    location_name: row.location_name,
    location_district: row.location_district || '',
    coordinates_lat: row.coordinates_lat.toString(),
    coordinates_lng: row.coordinates_lng.toString(),
    scope: row.scope,
    images: row.images,
    pdfs: row.pdfs,
    hero_image: row.hero_image,
    featured: row.featured.toString(),
  };
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

  // Construct full media URLs/paths (R2 or local)
  const imagesPaths = images.map(img => constructMediaUrl(id, 'images', img));
  const pdfsPaths = pdfs.map(pdf => constructMediaUrl(id, 'pdfs', pdf));
  const heroImagePath = heroImage ? constructMediaUrl(id, 'images', heroImage) : undefined;

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
 * Parse all projects from Google Sheets or CSV (with fallback)
 * This is the main entry point for parsing projects
 */
export async function parseProjectsFromSource(): Promise<Project[]> {
  console.log('📦 Loading project data...');

  // Fetch from Google Sheets or CSV fallback
  const sheetRows = await fetchProjectsWithFallback();

  // Convert sheet rows to CSV record format
  const records = sheetRows.map(row => sheetRowToCSVRecord(row));

  // Parse using existing logic
  return parseProjects(records);
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

// Define default category colors
const DEFAULT_COLOR = '#9333ea';         // Purple-600
const DEFAULT_GRADIENT_FROM = 'purple-500';
const DEFAULT_GRADIENT_TO = 'purple-700';

/**
 * Extract unique categories from projects and generate metadata
 */
export async function extractCategories(projects: Project[]): Promise<CategoryMetadata[]> {
  // 1. Load category CSV (async)
  const categoryConfigs = await parseCategoriesCSV();

  // 2. Convert to lookup map for fast access
  const configMap = new Map<string, CategoryConfig>();
  categoryConfigs.forEach(config => {
    configMap.set(config.id, config);
  });

  // 3. Get unique categories actually used in projects
  const uniqueCategories = [...new Set(projects.map(p => p.category))].sort();

  // 4. Merge project categories with CSV config + defaults
  return uniqueCategories.map(cat => {
    const config = configMap.get(cat);

    return {
      id: cat,
      label: config?.label || formatCategoryLabel(cat),
      color: config?.color || DEFAULT_COLOR,
      gradientFrom: config?.gradientFrom || DEFAULT_GRADIENT_FROM,
      gradientTo: config?.gradientTo || DEFAULT_GRADIENT_TO,
      description: config?.description || '',
    };
  });
}
