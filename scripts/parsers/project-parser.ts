import path from 'path';
import fs from 'fs-extra';
import { CSVRecord, parseSemicolonArray, parseBoolean, parseNumber } from './csv-parser.js';
import { parseCategoriesCSV, CategoryConfig } from './category-parser.js';
import { fetchDataWithFallback } from './data-source.js';
import { isR2Mode, constructR2Url } from './r2-utils.js';
import { isR2ApiConfigured, listProjectImages, listProjectPDFs } from './r2-client.js';

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
 * Construct media URL (R2 or local path)
 * @param projectId - Project ID
 * @param mediaType - Type of media (images, pdfs)
 * @param filename - File name
 * @returns Full URL (R2) or relative path (local)
 */
function constructMediaUrl(projectId: string, mediaType: 'images' | 'pdfs', filename: string): string {
  if (isR2Mode()) {
    // Use shared R2 utility to construct URL
    return constructR2Url(`projects/${projectId}`, filename, mediaType);
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
 * Auto-detect images from filesystem or R2 when CSV is empty
 * Supports both local filesystem and R2 bucket auto-detection
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

  // R2 Mode: Try to list files from R2 bucket
  if (isR2Mode()) {
    // If R2 API is configured, auto-detect from R2
    if (isR2ApiConfigured()) {
      try {
        const imageFiles = await listProjectImages(projectId);

        if (imageFiles.length > 0) {
          const heroImage = csvHeroImage || (imageFiles.length > 0 ? imageFiles[0] : undefined);
          return { images: imageFiles, heroImage };
        } else {
          // No images found in R2 for this project
          return { images: [], heroImage: undefined };
        }
      } catch (error) {
        console.warn(
          `⚠️  Warning: Could not auto-detect images from R2 for project "${projectId}".\n` +
          `   Error: ${error instanceof Error ? error.message : error}\n` +
          `   Falling back to CSV-only mode.`
        );
        return { images: [], heroImage: undefined };
      }
    } else {
      // R2 mode but no API credentials - require CSV listing
      if (csvImages.length === 0) {
        console.warn(
          `⚠️  Warning: Project "${projectId}" has no images specified in CSV/Sheets.\n` +
          `   In R2 mode without API credentials, images must be listed in the images column.\n` +
          `   To enable auto-detection, set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY.`
        );
      }
      return { images: [], heroImage: undefined };
    }
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
 * Auto-detect PDFs from filesystem or R2 when CSV is empty
 * Supports both local filesystem and R2 bucket auto-detection
 */
async function autoDetectPDFs(
  projectId: string,
  csvPdfs: string[]
): Promise<string[]> {
  // If CSV has PDFs, use those (override mode)
  if (csvPdfs.length > 0) {
    return csvPdfs;
  }

  // R2 Mode: Try to list files from R2 bucket
  if (isR2Mode()) {
    if (isR2ApiConfigured()) {
      try {
        const pdfFiles = await listProjectPDFs(projectId);
        return pdfFiles;
      } catch (error) {
        console.warn(
          `⚠️  Warning: Could not auto-detect PDFs from R2 for project "${projectId}".\n` +
          `   Falling back to CSV-only mode.`
        );
        return [];
      }
    } else {
      // R2 mode but no API credentials - require CSV listing
      return [];
    }
  }

  // Local mode: scan filesystem for PDFs
  const CONTENT_ROOT = path.join(process.cwd(), 'content', 'projects');
  const pdfsDir = path.join(CONTENT_ROOT, projectId, 'pdfs');

  // Check if directory exists
  const dirExists = await fs.pathExists(pdfsDir);
  if (!dirExists) {
    return [];
  }

  try {
    // Read all files in directory
    const files = await fs.readdir(pdfsDir);

    // Filter by PDF extension
    const pdfFiles = files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .sort(); // Alphabetical order

    return pdfFiles;

  } catch (error) {
    console.error(
      `❌ Error reading PDFs directory for project "${projectId}":`,
      error instanceof Error ? error.message : error
    );
    return [];
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

  // Parse media files from CSV
  const csvImages = parseSemicolonArray(record.images);
  const csvPdfs = parseSemicolonArray(record.pdfs);
  const csvHeroImage = record.hero_image?.trim() || undefined;

  // Auto-detect images and PDFs from filesystem/R2 if CSV is empty
  const { images, heroImage } = await autoDetectImages(id, csvImages, csvHeroImage);
  const pdfs = await autoDetectPDFs(id, csvPdfs);

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

  const PROJECTS_CSV_PATH = path.join(process.cwd(), 'content', 'projects', 'projects.csv');

  // Fetch from Google Sheets or CSV fallback
  const records = await fetchDataWithFallback(
    PROJECTS_CSV_PATH,
    'Projects',
    'GOOGLE_SHEET_TAB_PROJECTS'
  );

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
