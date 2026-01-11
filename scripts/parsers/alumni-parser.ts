/**
 * Alumni Parser
 *
 * Parses alumni.csv from Google Sheets or local files
 * to generate alumni.json for the website. Validates data and copies profile images.
 */

import fs from 'fs-extra';
import path from 'path';
import type { Alumni } from '../../src/types/alumni.js';
import { fetchDataWithFallback } from './data-source.js';
import { isR2Mode, constructR2Url } from './r2-utils.js';
import { listAlumniPhotos, isR2ApiConfigured } from './r2-client.js';
import { parseSemicolonArray, parseBoolean } from './csv-parser.js';

interface AlumniCSVRow {
  id: string;
  name: string;
  yearFrom: string;
  yearTo: string;
  achievements: string;
  linkedinUrl: string;
  testimonial: string;
  featured: string;
}

interface AlumniOutput {
  alumni: Alumni[];
}

const CONTENT_DIR = path.join(process.cwd(), 'content/alumni');
const ALUMNI_IMAGES_DIR = path.join(process.cwd(), 'content/alumni/images');
const OUTPUT_DIR = path.join(process.cwd(), 'src/data/generated');
const PUBLIC_ALUMNI_DIR = path.join(process.cwd(), 'public/alumni');

// Cache for R2 alumni photos (to avoid multiple API calls)
let r2AlumniPhotosCache: string[] | null = null;

/**
 * Generate slug from name for image matching
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Construct image path for an alumnus
 */
function constructImagePath(filename: string): string {
  return isR2Mode()
    ? constructR2Url('alumni', filename, 'images')
    : `/alumni/${filename}`;
}

/**
 * Auto-detect profile image for an alumnus
 * Returns URL or undefined if no image found
 */
async function autoDetectProfileImage(alumniName: string): Promise<string | undefined> {
  const slug = generateSlug(alumniName);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  // R2 Mode: List photos from R2 and match by slug
  if (isR2Mode()) {
    if (isR2ApiConfigured()) {
      try {
        // Load R2 photos once and cache
        if (r2AlumniPhotosCache === null) {
          r2AlumniPhotosCache = await listAlumniPhotos();
        }

        // Try exact slug match first
        for (const ext of imageExtensions) {
          const filename = `${slug}${ext}`;
          if (r2AlumniPhotosCache.includes(filename)) {
            return constructImagePath(filename);
          }
        }

        // Try fuzzy match (find any image containing the slug)
        const matchingFile = r2AlumniPhotosCache.find(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext) && file.toLowerCase().includes(slug);
        });

        if (matchingFile) {
          return constructImagePath(matchingFile);
        }
      } catch (error) {
        console.warn(`⚠️  R2 auto-detection failed for ${alumniName}:`, error instanceof Error ? error.message : error);
      }
    }
    // If R2 API not configured, return undefined (no fallback to local in R2 mode)
    return undefined;
  }

  // Local Mode: Check filesystem
  if (!await fs.pathExists(ALUMNI_IMAGES_DIR)) {
    return undefined;
  }

  // Try exact slug match first
  for (const ext of imageExtensions) {
    const filename = `${slug}${ext}`;
    const imagePath = path.join(ALUMNI_IMAGES_DIR, filename);
    if (await fs.pathExists(imagePath)) {
      return constructImagePath(filename);
    }
  }

  // Try fuzzy match (find any image containing the slug)
  try {
    const files = await fs.readdir(ALUMNI_IMAGES_DIR);
    const matchingFile = files.find(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext) && file.toLowerCase().includes(slug);
    });

    if (matchingFile) {
      return constructImagePath(matchingFile);
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return undefined;
}

/**
 * Parse a single alumni record from CSV
 */
async function parseAlumniRecord(record: AlumniCSVRow): Promise<Alumni> {
  const yearFrom = parseInt(record.yearFrom);
  const yearToStr = record.yearTo.trim();
  const yearTo = yearToStr === 'Present' ? new Date().getFullYear() : parseInt(yearToStr);

  // Validate years
  if (isNaN(yearFrom)) {
    throw new Error(`Invalid yearFrom for alumnus ${record.id}: ${record.yearFrom}`);
  }
  if (yearToStr !== 'Present' && isNaN(yearTo)) {
    throw new Error(`Invalid yearTo for alumnus ${record.id}: ${record.yearTo}`);
  }

  // Parse achievements (semicolon-separated)
  const achievements = parseSemicolonArray(record.achievements);

  // Auto-detect profile image (using name for slug matching)
  const profileImage = await autoDetectProfileImage(record.name);

  return {
    id: record.id,
    name: record.name,
    yearFrom,
    yearTo,
    yearsWorked: `${record.yearFrom} - ${record.yearTo}`,
    achievements,
    linkedinUrl: record.linkedinUrl || undefined,
    testimonial: record.testimonial,
    profileImage,
    featured: parseBoolean(record.featured)
  };
}

/**
 * Parse all alumni data
 */
async function parseAlumni(): Promise<AlumniOutput> {
  console.log('👔 Parsing alumni data...');

  // Fetch CSV data with fallback
  const records = await fetchDataWithFallback(
    'content/alumni/alumni.csv',
    'Alumni',
    'GOOGLE_SHEET_TAB_ALUMNI'
  );

  console.log(`📋 Parsing ${records.length} alumni...`);

  // Parse each alumnus
  const alumni: Alumni[] = [];
  for (const record of records) {
    try {
      const alumnus = await parseAlumniRecord(record as unknown as AlumniCSVRow);
      alumni.push(alumnus);
    } catch (error) {
      console.error(`❌ Error parsing alumnus ${record.id}:`, error);
      throw error;
    }
  }

  return { alumni };
}

/**
 * Copy alumni profile images to public directory
 */
async function copyAlumniMedia(alumni: Alumni[]): Promise<void> {
  console.log('\n📂 Copying alumni images to public folder...');

  // Skip copying in R2 mode
  if (isR2Mode()) {
    console.log('⏭️  R2 Mode: Skipping alumni image copy (images served from R2)');
    return;
  }

  // Ensure public/alumni directory exists
  await fs.ensureDir(PUBLIC_ALUMNI_DIR);

  let copiedCount = 0;

  for (const alumnus of alumni) {
    if (alumnus.profileImage) {
      const filename = path.basename(alumnus.profileImage);
      const sourcePath = path.join(ALUMNI_IMAGES_DIR, filename);
      const destPath = path.join(PUBLIC_ALUMNI_DIR, filename);

      // Check if source exists
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, destPath, { overwrite: true });
        copiedCount++;
      }
    }
  }

  if (copiedCount > 0) {
    console.log(`✅ Copied ${copiedCount} alumni images to public/alumni/`);
  } else {
    console.log(`ℹ️  No alumni images to copy`);
  }
}

/**
 * Main build function for alumni data
 */
export async function buildAlumni(): Promise<void> {
  console.log('👔 Building alumni...');

  try {
    // Parse alumni data
    const { alumni } = await parseAlumni();

    // Copy media files (local mode only)
    await copyAlumniMedia(alumni);

    // Generate JSON output
    const outputPath = path.join(OUTPUT_DIR, 'alumni.json');
    await fs.ensureDir(OUTPUT_DIR);
    await fs.writeJson(outputPath, { alumni }, { spaces: 2 });

    // Summary
    const featuredCount = alumni.filter(a => a.featured).length;
    console.log(`✅ Alumni data generated successfully!`);
    console.log(`   Alumni: ${alumni.length} (${featuredCount} featured)`);
    console.log(`   Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error building alumni:', error);
    throw error;
  }
}
