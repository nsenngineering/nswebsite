import path from 'path';
import fs from 'fs-extra';
import { parseCSVFile } from './csv-parser.js';
import type { HeroCarouselImage, HeroCarouselConfig } from '../../src/types/hero-carousel.js';

const HERO_CSV_PATH = path.join(process.cwd(), 'content', 'homepage_hero', 'hero_carousel.csv');
const HERO_IMAGES_DIR = path.join(process.cwd(), 'content', 'homepage_hero', 'images');

interface HeroCSVRecord {
  alt_text: string;
}

/**
 * Auto-detect images from filesystem
 */
async function autoDetectImages(): Promise<string[]> {
  // Check if images directory exists
  if (!await fs.pathExists(HERO_IMAGES_DIR)) {
    console.warn(`⚠️  Images directory not found: ${HERO_IMAGES_DIR}`);
    return [];
  }

  // Read all files from images directory
  const files = await fs.readdir(HERO_IMAGES_DIR);

  // Filter for image files
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });

  // Sort alphabetically (natural sort)
  imageFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  return imageFiles;
}

/**
 * Generate default alt text from filename
 */
function generateAltText(filename: string, index: number): string {
  // Remove extension and clean up filename
  const nameWithoutExt = path.parse(filename).name;
  const cleanName = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\d+/g, '') // Remove numbers
    .trim();

  if (cleanName) {
    return `NS Engineering - ${cleanName}`;
  }

  return `NS Engineering organizational evolution - Image ${index + 1}`;
}

/**
 * Parse hero carousel with auto-detection
 */
export async function parseHeroCarousel(): Promise<HeroCarouselConfig> {
  console.log('📸 Auto-detecting hero carousel images...');

  // Auto-detect images from filesystem
  const imageFiles = await autoDetectImages();

  if (imageFiles.length === 0) {
    console.warn('⚠️  No images found in hero carousel directory');
    console.warn(`   Add images to: ${HERO_IMAGES_DIR}`);
    return { images: [] };
  }

  console.log(`   Found ${imageFiles.length} images in directory`);

  // Try to read CSV for alt text overrides
  let altTextOverrides: string[] = [];
  if (await fs.pathExists(HERO_CSV_PATH)) {
    try {
      const records = await parseCSVFile(HERO_CSV_PATH) as HeroCSVRecord[];
      altTextOverrides = records.map(r => r.alt_text).filter(Boolean);
      console.log(`   Found ${altTextOverrides.length} alt text overrides in CSV`);
    } catch (error) {
      console.warn('⚠️  Could not parse CSV, using auto-generated alt text');
    }
  } else {
    console.log('   No CSV found, using auto-generated alt text');
  }

  // Create image objects
  const images: HeroCarouselImage[] = imageFiles.map((filename, index) => {
    // Use CSV alt text if available, otherwise generate from filename
    const alt = altTextOverrides[index] || generateAltText(filename, index);

    return {
      order: index + 1,
      filename,
      alt,
      path: `/hero/${filename}`
    };
  });

  console.log(`✅ Configured ${images.length} hero carousel images`);

  return {
    images
  };
}

/**
 * Copy hero images to public folder
 */
export async function copyHeroImages(config: HeroCarouselConfig): Promise<void> {
  console.log('\n📂 Copying hero images to public folder...');

  const publicHeroDir = path.join(process.cwd(), 'public', 'hero');

  // Ensure public/hero directory exists
  await fs.ensureDir(publicHeroDir);

  let copiedCount = 0;
  let skippedCount = 0;

  for (const image of config.images) {
    const sourcePath = path.join(HERO_IMAGES_DIR, image.filename);
    const destPath = path.join(publicHeroDir, image.filename);

    // Check if source exists
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, destPath, { overwrite: true });
      copiedCount++;
    } else {
      console.warn(`⚠️  Skipped: ${image.filename} (not found)`);
      skippedCount++;
    }
  }

  console.log(`✅ Copied ${copiedCount} images`);
  if (skippedCount > 0) {
    console.log(`⚠️  Skipped ${skippedCount} images (not found)`);
  }
}
