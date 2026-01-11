import path from 'path';
import fs from 'fs-extra';
import { parseNumber, parseSemicolonArray, parseBoolean } from './csv-parser.js';
import { fetchDataWithFallback } from './data-source.js';
import { isR2Mode, constructR2Url } from './r2-utils.js';
import { listTeamPhotos, isR2ApiConfigured } from './r2-client.js';
import type { TeamMember, TeamConfig } from '../../src/types/team.js';

const TEAM_CSV_PATH = path.join(process.cwd(), 'content', 'team', 'team.csv');
const TEAM_IMAGES_DIR = path.join(process.cwd(), 'content', 'team', 'images');

interface TeamCSVRecord {
  name: string;
  role: string;
  education: string;
  experience: string;
  order: string;
  featured?: string; // Optional featured flag (TRUE/FALSE)
  linkedinUrl?: string; // Optional LinkedIn profile URL
  specializations?: string; // Optional semicolon-separated specializations
}

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
 * Construct image path for a team member
 */
function constructImagePath(filename: string): string {
  return isR2Mode()
    ? constructR2Url('team', filename)
    : `/team/${filename}`;
}

// Cache for R2 team photos (to avoid multiple API calls)
let r2TeamPhotosCache: string[] | null = null;

/**
 * Auto-detect image for a team member
 */
async function autoDetectImage(memberName: string): Promise<string | undefined> {
  const slug = generateSlug(memberName);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  // R2 Mode: List photos from R2 and match by slug
  if (isR2Mode()) {
    if (isR2ApiConfigured()) {
      try {
        // Load R2 photos once and cache
        if (r2TeamPhotosCache === null) {
          r2TeamPhotosCache = await listTeamPhotos();
        }

        // Try exact slug match first
        for (const ext of imageExtensions) {
          const filename = `${slug}${ext}`;
          if (r2TeamPhotosCache.includes(filename)) {
            return constructImagePath(filename);
          }
        }

        // Try fuzzy match (find any image containing the slug)
        const matchingFile = r2TeamPhotosCache.find(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext) && file.toLowerCase().includes(slug);
        });

        if (matchingFile) {
          return constructImagePath(matchingFile);
        }
      } catch (error) {
        console.warn(`⚠️  R2 auto-detection failed for ${memberName}:`, error instanceof Error ? error.message : error);
      }
    }
    // If R2 API not configured, return undefined (no fallback to local in R2 mode)
    return undefined;
  }

  // Local Mode: Check filesystem
  if (!await fs.pathExists(TEAM_IMAGES_DIR)) {
    return undefined;
  }

  // Try exact slug match first
  for (const ext of imageExtensions) {
    const filename = `${slug}${ext}`;
    const imagePath = path.join(TEAM_IMAGES_DIR, filename);
    if (await fs.pathExists(imagePath)) {
      return constructImagePath(filename);
    }
  }

  // Try fuzzy match (find any image containing the slug)
  try {
    const files = await fs.readdir(TEAM_IMAGES_DIR);
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
 * Parse team CSV and auto-detect images
 */
export async function parseTeam(): Promise<TeamConfig> {
  console.log('👥 Parsing team data...');

  // Fetch from Sheets or CSV
  const records = await fetchDataWithFallback(
    TEAM_CSV_PATH,
    'Team',
    'GOOGLE_SHEET_TAB_TEAM'
  ) as unknown as TeamCSVRecord[];

  if (records.length === 0) {
    throw new Error('Team CSV is empty');
  }

  // Validate and transform records
  const members: TeamMember[] = [];

  for (const record of records) {
    // Validate required fields
    if (!record.name) {
      throw new Error(`Missing 'name' field in team CSV`);
    }
    if (!record.role) {
      throw new Error(`Missing 'role' field for ${record.name}`);
    }
    if (!record.education) {
      throw new Error(`Missing 'education' field for ${record.name}`);
    }
    if (!record.experience) {
      throw new Error(`Missing 'experience' field for ${record.name}`);
    }
    if (!record.order) {
      throw new Error(`Missing 'order' field for ${record.name}`);
    }

    // Parse order as number
    const order = parseNumber(record.order, 'order');

    // Auto-detect image
    const image = await autoDetectImage(record.name);
    const hasImage = image !== undefined;

    if (hasImage) {
      console.log(`   ✓ Image found for ${record.name}`);
    }

    // Create member object
    members.push({
      name: record.name,
      role: record.role,
      education: record.education,
      experience: record.experience,
      order,
      image,
      hasImage,
      featured: parseBoolean(record.featured) ?? false,
      linkedinUrl: record.linkedinUrl?.trim() || undefined,
      specializations: parseSemicolonArray(record.specializations || '')
    });
  }

  // Sort by order
  members.sort((a, b) => a.order - b.order);

  const withImages = members.filter(m => m.hasImage).length;
  const withoutImages = members.filter(m => !m.hasImage).length;
  const featuredCount = members.filter(m => m.featured).length;

  console.log(`✅ Parsed ${members.length} team members`);
  console.log(`   👑 ${featuredCount} featured (leadership)`);
  console.log(`   📸 ${withImages} with images, ${withoutImages} without images`);

  return {
    members
  };
}

/**
 * Copy team images to public folder
 */
export async function copyTeamImages(config: TeamConfig): Promise<void> {
  console.log('\n📂 Copying team images to public folder...');

  // Skip copying in R2 mode
  if (isR2Mode()) {
    console.log('⏭️  R2 Mode: Skipping team image copy (images served from R2)');
    return;
  }

  const publicTeamDir = path.join(process.cwd(), 'public', 'team');

  // Ensure public/team directory exists
  await fs.ensureDir(publicTeamDir);

  let copiedCount = 0;

  for (const member of config.members) {
    if (member.image && member.hasImage) {
      const filename = path.basename(member.image);
      const sourcePath = path.join(TEAM_IMAGES_DIR, filename);
      const destPath = path.join(publicTeamDir, filename);

      // Check if source exists
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, destPath, { overwrite: true });
        copiedCount++;
      }
    }
  }

  if (copiedCount > 0) {
    console.log(`✅ Copied ${copiedCount} team images to public/team/`);
  } else {
    console.log(`ℹ️  No team images to copy (using fallback icons)`);
  }
}
