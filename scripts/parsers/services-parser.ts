/**
 * Services Parser
 *
 * Parses services.csv and service-categories.csv from Google Sheets or local files
 * to generate services.json for the website. Validates data and copies media files.
 */

import fs from 'fs-extra';
import path from 'path';
import { Service, ServiceCategory } from '../../src/types/service';
import { fetchDataWithFallback } from './data-source.js';
import { isR2Mode, constructR2Url } from './r2-utils.js';
import { parseSemicolonArray, parseBoolean } from './csv-parser.js';
import { isR2ApiConfigured, listServiceImages } from './r2-client.js';

interface ServiceCSVRow {
  id: string;
  category: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  processSteps: string;
  equipmentUsed: string;
  typicalDeliverables: string;
  images: string;
  hero_image: string;
  featured: string;
}

interface CategoryCSVRow {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ServicesOutput {
  services: Service[];
  categories: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

const CONTENT_DIR = path.join(process.cwd(), 'content/services');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data/generated');
const PUBLIC_SERVICES_DIR = path.join(process.cwd(), 'public/services');

const VALID_CATEGORIES: ServiceCategory[] = [
  'pile-testing',
  'soil-laboratory',
  'rock-laboratory',
  'drilling',
  'geophysical',
  'ndt'
];

/**
 * Construct media URL for service images
 */
function constructMediaUrl(serviceId: string, filename: string): string {
  if (isR2Mode()) {
    return constructR2Url(`services/${serviceId}`, filename, 'images');
  } else {
    // Local mode - return relative path (will be copied to public/)
    return `/services/${serviceId}/images/${filename}`;
  }
}

/**
 * Auto-detect images from filesystem or R2 when CSV is empty
 * Supports both local filesystem and R2 bucket auto-detection
 */
async function autoDetectImages(
  serviceId: string,
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
        const imageFiles = await listServiceImages(serviceId);

        if (imageFiles.length > 0) {
          const heroImage = csvHeroImage || (imageFiles.length > 0 ? imageFiles[0] : undefined);
          return { images: imageFiles, heroImage };
        } else {
          // No images found in R2 for this service
          return { images: [], heroImage: undefined };
        }
      } catch (error) {
        console.warn(
          `⚠️  Warning: Could not auto-detect images from R2 for service "${serviceId}".\n` +
          `   Error: ${error instanceof Error ? error.message : error}\n` +
          `   Falling back to CSV-only mode.`
        );
        return { images: [], heroImage: undefined };
      }
    } else {
      // R2 mode but no API credentials - require CSV listing
      if (csvImages.length === 0) {
        console.warn(
          `⚠️  Warning: Service "${serviceId}" has no images specified in CSV/Sheets.\n` +
          `   In R2 mode without API credentials, images must be listed in the images column.\n` +
          `   To enable auto-detection, set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY.`
        );
      }
      return { images: [], heroImage: undefined };
    }
  }

  // Local mode: scan filesystem for images
  const imagesDir = path.join(CONTENT_DIR, serviceId, 'images');

  // Check if directory exists
  const dirExists = await fs.pathExists(imagesDir);
  if (!dirExists) {
    console.warn(`⚠️  No images directory found for service: ${serviceId}`);
    return { images: [], heroImage: undefined };
  }

  try {
    // Read all files in directory
    const files = await fs.readdir(imagesDir);

    // Filter by image extensions
    const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
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
          `${serviceId}/images/ directory. Using first alphabetical image instead.`
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
      `❌ Error reading images directory for service "${serviceId}":`,
      error instanceof Error ? error.message : error
    );
    return { images: [], heroImage: undefined };
  }
}

/**
 * Parse services from Google Sheets or CSV file
 */
async function parseServicesCSV(): Promise<Service[]> {
  const csvPath = path.join(CONTENT_DIR, 'services.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error(`Services CSV not found at: ${csvPath}`);
  }

  // Fetch from Google Sheets with CSV fallback
  const rows = await fetchDataWithFallback(
    csvPath,
    'Services',
    'GOOGLE_SHEET_TAB_SERVICES'
  ) as unknown as ServiceCSVRow[];

  console.log(`📋 Parsing ${rows.length} services...`);

  const services: Service[] = [];

  for (const row of rows) {
    // Validate required fields
    if (!row.id || !row.category || !row.name) {
      throw new Error(
        `Service is missing required fields (id, category, or name)`
      );
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(row.category as ServiceCategory)) {
      throw new Error(
        `Invalid category "${row.category}" for service "${row.id}". ` +
        `Must be one of: ${VALID_CATEGORIES.join(', ')}`
      );
    }

    // Parse array fields (semicolon-separated)
    const processSteps = parseSemicolonArray(row.processSteps);
    const equipmentUsed = parseSemicolonArray(row.equipmentUsed);
    const typicalDeliverables = parseSemicolonArray(row.typicalDeliverables);

    // Parse images (semicolon-separated)
    const csvImages = parseSemicolonArray(row.images);
    const csvHeroImage = row.hero_image?.trim() || undefined;

    // Auto-detect images from filesystem if CSV empty
    const { images: detectedImages, heroImage: detectedHeroImage } = await autoDetectImages(
      row.id,
      csvImages,
      csvHeroImage
    );

    // Construct full URLs for images
    const imageUrls = detectedImages.map(filename => constructMediaUrl(row.id, filename));
    const heroImageUrl = detectedHeroImage ? constructMediaUrl(row.id, detectedHeroImage) : undefined;

    // Parse featured flag
    const featured = parseBoolean(row.featured);

    services.push({
      id: row.id,
      category: row.category as ServiceCategory,
      name: row.name,
      shortDescription: row.shortDescription || '',
      fullDescription: row.fullDescription || '',
      processSteps,
      equipmentUsed,
      typicalDeliverables,
      media: {
        images: imageUrls,
        heroImage: heroImageUrl
      },
      featured
    });
  }

  return services;
}

/**
 * Parse service categories from Google Sheets or CSV file
 */
async function parseCategoriesCSV() {
  const csvPath = path.join(CONTENT_DIR, 'service-categories.csv');

  if (!fs.existsSync(csvPath)) {
    console.warn(`⚠️  Categories CSV not found at: ${csvPath}. Using defaults.`);
    return [];
  }

  // Fetch from Google Sheets with CSV fallback
  const rows = await fetchDataWithFallback(
    csvPath,
    'ServiceCategories',
    'GOOGLE_SHEET_TAB_SERVICE_CATEGORIES'
  ) as unknown as CategoryCSVRow[];

  console.log(`📂 Parsing ${rows.length} service categories...`);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description || '',
    icon: row.icon || 'Circle'
  }));
}

/**
 * Copy media files (images) to public directory
 */
async function copyMediaFiles(services: Service[]): Promise<void> {
  console.log('📁 Copying service media files...');

  // Skip copying in R2 mode
  if (isR2Mode()) {
    console.log('⏭️  R2 Mode: Skipping services media copy (files served from R2)');
    return;
  }

  let imagesCopied = 0;
  let servicesProcessed = 0;

  for (const service of services) {
    if (service.media.images.length === 0) {
      continue;
    }

    servicesProcessed++;

    // Create service-specific directory in public
    const publicServiceDir = path.join(PUBLIC_SERVICES_DIR, service.id, 'images');
    await fs.ensureDir(publicServiceDir);

    // Copy each image
    for (const imageUrl of service.media.images) {
      const filename = path.basename(imageUrl);
      const sourcePath = path.join(CONTENT_DIR, service.id, 'images', filename);
      const destPath = path.join(publicServiceDir, filename);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, destPath);
        imagesCopied++;
      } else {
        console.warn(`⚠️  Image not found for ${service.id}: ${sourcePath}`);
      }
    }
  }

  console.log(`✅ Copied ${imagesCopied} images from ${servicesProcessed} services to public/services/`);
}

/**
 * Main parser function
 */
export async function parseServices(): Promise<void> {
  console.log('🔧 Parsing services data...\n');

  try {
    // Parse from Google Sheets or CSV files
    const services = await parseServicesCSV();
    const categories = await parseCategoriesCSV();

    // Validate that all categories referenced by services exist
    const categoryIds = new Set(categories.map(c => c.id));
    for (const service of services) {
      if (!categoryIds.has(service.category)) {
        console.warn(
          `⚠️  Service "${service.id}" references category "${service.category}" ` +
          `which is not defined in service-categories.csv`
        );
      }
    }

    // Copy media files
    await copyMediaFiles(services);

    // Prepare output
    const output: ServicesOutput = {
      services,
      categories
    };

    // Write JSON output
    await fs.ensureDir(OUTPUT_DIR);

    const outputPath = path.join(OUTPUT_DIR, 'services.json');
    await fs.writeJson(outputPath, output, { spaces: 2 });

    const featuredCount = services.filter(s => s.featured).length;

    console.log(`\n✅ Services data generated successfully!`);
    console.log(`   Services: ${services.length} (${featuredCount} featured)`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error parsing services:', error);
    throw error;
  }
}
