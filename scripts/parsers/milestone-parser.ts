import path from 'path';
import fs from 'fs-extra';
import { fetchDataWithFallback } from './data-source.js';
import type { Milestone, MilestonesConfig } from '../../src/types/milestone.js';

const MILESTONES_CSV_PATH = path.join(process.cwd(), 'content', 'homepage_hero', 'milestones.csv');
const HERO_IMAGES_DIR = path.join(process.cwd(), 'content', 'homepage_hero', 'images');

interface MilestoneCSVRecord {
  year: string;
  title: string;
  description: string;
  image: string;
  featured: string;
}

/**
 * Validate milestone record
 */
function validateMilestone(record: MilestoneCSVRecord, index: number): void {
  const errors: string[] = [];

  // Validate year
  const year = parseInt(record.year, 10);
  if (isNaN(year) || year < 2000 || year > new Date().getFullYear() + 10) {
    errors.push(`Invalid year: ${record.year}`);
  }

  // Validate required fields
  if (!record.title || record.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!record.description || record.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!record.image || record.image.trim().length === 0) {
    errors.push('Image filename is required');
  }

  if (errors.length > 0) {
    throw new Error(`Milestone ${index + 1} validation failed:\n  - ${errors.join('\n  - ')}`);
  }
}

/**
 * Parse milestones CSV
 */
export async function parseMilestones(): Promise<MilestonesConfig> {
  console.log('🏛️  Parsing milestones data...');

  // Fetch from Sheets or CSV
  const records = await fetchDataWithFallback(
    MILESTONES_CSV_PATH,
    'HomepageHeroMilestones',
    'GOOGLE_SHEET_TAB_MILESTONES'
  ) as unknown as MilestoneCSVRecord[];

  if (records.length === 0) {
    console.warn('⚠️  No milestones found in CSV');
    return {
      milestones: [],
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear()
    };
  }

  // Validate and transform records
  const milestones: Milestone[] = records.map((record, index) => {
    // Validate
    validateMilestone(record, index);

    // Parse featured flag
    const featured = record.featured?.toLowerCase() === 'true';

    return {
      year: parseInt(record.year, 10),
      title: record.title.trim(),
      description: record.description.trim(),
      image: record.image.trim(),
      featured,
      path: `/hero/${record.image.trim()}`
    };
  });

  // Sort by year (ascending)
  milestones.sort((a, b) => a.year - b.year);

  // Calculate start and end years
  const startYear = milestones[0]?.year || new Date().getFullYear();
  const endYear = new Date().getFullYear();

  console.log(`✅ Parsed ${milestones.length} milestones (${startYear} - ${endYear})`);
  console.log(`   Featured: ${milestones.filter(m => m.featured).length}`);

  return {
    milestones,
    startYear,
    endYear
  };
}

/**
 * Copy milestone images to public folder
 */
export async function copyMilestoneImages(config: MilestonesConfig): Promise<void> {
  console.log('\n📂 Copying milestone images to public folder...');

  const publicHeroDir = path.join(process.cwd(), 'public', 'hero');

  // Ensure public/hero directory exists
  await fs.ensureDir(publicHeroDir);

  let copiedCount = 0;
  let skippedCount = 0;

  for (const milestone of config.milestones) {
    const sourcePath = path.join(HERO_IMAGES_DIR, milestone.image);
    const destPath = path.join(publicHeroDir, milestone.image);

    // Check if source exists
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, destPath, { overwrite: true });
      copiedCount++;
    } else {
      console.warn(`⚠️  Skipped: ${milestone.image} (not found)`);
      skippedCount++;
    }
  }

  console.log(`✅ Copied ${copiedCount} images`);
  if (skippedCount > 0) {
    console.log(`⚠️  Skipped ${skippedCount} images (not found)`);
  }
}
