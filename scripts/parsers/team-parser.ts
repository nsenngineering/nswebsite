import path from 'path';
import fs from 'fs-extra';
import { parseCSVFile, parseNumber } from './csv-parser.js';
import type { TeamMember, TeamConfig } from '../../src/types/team.js';

const TEAM_CSV_PATH = path.join(process.cwd(), 'content', 'team', 'team.csv');
const TEAM_IMAGES_DIR = path.join(process.cwd(), 'content', 'team', 'images');

interface TeamCSVRecord {
  name: string;
  role: string;
  education: string;
  experience: string;
  order: string;
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
 * Auto-detect image for a team member
 */
async function autoDetectImage(memberName: string): Promise<string | undefined> {
  if (!await fs.pathExists(TEAM_IMAGES_DIR)) {
    return undefined;
  }

  const slug = generateSlug(memberName);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  // Try exact slug match first
  for (const ext of imageExtensions) {
    const filename = `${slug}${ext}`;
    const imagePath = path.join(TEAM_IMAGES_DIR, filename);
    if (await fs.pathExists(imagePath)) {
      return `/team/${filename}`;
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
      return `/team/${matchingFile}`;
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
  console.log('👥 Parsing team CSV...');

  // Read CSV file
  const records = await parseCSVFile(TEAM_CSV_PATH) as TeamCSVRecord[];

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
      hasImage
    });
  }

  // Sort by order
  members.sort((a, b) => a.order - b.order);

  const withImages = members.filter(m => m.hasImage).length;
  const withoutImages = members.filter(m => !m.hasImage).length;

  console.log(`✅ Parsed ${members.length} team members`);
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
    console.log(`✅ Copied ${copiedCount} team images`);
  } else {
    console.log(`ℹ️  No team images to copy (using fallback icons)`);
  }
}
