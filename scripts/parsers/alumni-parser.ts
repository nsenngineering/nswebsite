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
const OUTPUT_DIR = path.join(process.cwd(), 'src/data/generated');
const PUBLIC_ALUMNI_DIR = path.join(process.cwd(), 'public/alumni');

/**
 * Auto-detect profile image for an alumnus
 * Returns URL or undefined if no image found
 */
async function autoDetectProfileImage(alumniId: string): Promise<string | undefined> {
  const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

  // In R2 mode, construct R2 URL for first extension found
  if (isR2Mode()) {
    // Check if any extension exists (assuming R2 sync handles this)
    // Return first possible URL (validation happens during R2 sync)
    for (const ext of IMAGE_EXTENSIONS) {
      const r2Url = constructR2Url(`alumni/${alumniId}`, `profile${ext}`, '');
      // In R2 mode, we assume the file exists if configured
      // Actual validation happens during rclone sync
      return r2Url;
    }
    return undefined;
  }

  // Local mode: check filesystem
  const alumniDir = path.join(CONTENT_DIR, alumniId);

  for (const ext of IMAGE_EXTENSIONS) {
    const imagePath = path.join(alumniDir, `profile${ext}`);
    if (await fs.pathExists(imagePath)) {
      return `/alumni/${alumniId}/profile${ext}`;
    }
  }

  // No image found
  console.warn(`⚠️  No profile image found for alumnus: ${alumniId}`);
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

  // Auto-detect profile image
  const profileImage = await autoDetectProfileImage(record.id);

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
  if (isR2Mode()) {
    console.log('⚠️  R2 Mode: Alumni images served from R2 CDN');
    return;
  }

  console.log('📁 Copying alumni media files...');

  let copiedCount = 0;

  for (const alumnus of alumni) {
    if (alumnus.profileImage) {
      const filename = path.basename(alumnus.profileImage);
      const sourcePath = path.join(CONTENT_DIR, alumnus.id, filename);
      const destPath = path.join(PUBLIC_ALUMNI_DIR, alumnus.id, filename);

      // Skip if source doesn't exist
      if (!(await fs.pathExists(sourcePath))) {
        console.warn(`⚠️  Source file not found: ${sourcePath}`);
        continue;
      }

      // Ensure destination directory exists
      await fs.ensureDir(path.dirname(destPath));

      // Copy file
      await fs.copy(sourcePath, destPath);
      copiedCount++;
    }
  }

  console.log(`✅ Copied ${copiedCount} profile images to public/alumni/`);
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
