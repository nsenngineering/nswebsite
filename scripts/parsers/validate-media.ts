import fs from 'fs-extra';
import path from 'path';
import type { Project } from './project-parser.js';
import type { Equipment } from '../../src/types/equipment.js';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'projects');
const EQUIPMENT_CONTENT_ROOT = path.join(process.cwd(), 'content', 'equipment');

/**
 * Check if a media file exists
 */
async function checkFileExists(
  projectId: string,
  filePath: string,
  fileType: 'image' | 'pdf'
): Promise<boolean> {
  const fullPath = path.join(CONTENT_ROOT, filePath);
  const exists = await fs.pathExists(fullPath);

  if (!exists) {
    console.warn(
      `⚠️  Warning: ${fileType} file not found\n` +
      `   Project: ${projectId}\n` +
      `   File: ${fullPath}\n` +
      `   Expected location: content/projects/${filePath}`
    );
  }

  return exists;
}

/**
 * Validate all media files for a single project
 */
async function validateProjectMedia(project: Project): Promise<{
  missingImages: string[];
  missingPdfs: string[];
}> {
  const missingImages: string[] = [];
  const missingPdfs: string[] = [];

  // Check images
  for (const imagePath of project.media.images) {
    const exists = await checkFileExists(project.id, imagePath, 'image');
    if (!exists) {
      missingImages.push(imagePath);
    }
  }

  // Check hero image if specified
  if (project.media.heroImage) {
    const exists = await checkFileExists(project.id, project.media.heroImage, 'image');
    if (!exists && !missingImages.includes(project.media.heroImage)) {
      missingImages.push(project.media.heroImage);
    }
  }

  // Check PDFs
  for (const pdfPath of project.media.pdfs) {
    const exists = await checkFileExists(project.id, pdfPath, 'pdf');
    if (!exists) {
      missingPdfs.push(pdfPath);
    }
  }

  return { missingImages, missingPdfs };
}

/**
 * Validate media files for all projects
 */
export async function validateAllMedia(projects: Project[]): Promise<void> {
  console.log('\n📁 Validating media files...');

  let totalMissingImages = 0;
  let totalMissingPdfs = 0;

  for (const project of projects) {
    const { missingImages, missingPdfs } = await validateProjectMedia(project);
    totalMissingImages += missingImages.length;
    totalMissingPdfs += missingPdfs.length;
  }

  if (totalMissingImages > 0 || totalMissingPdfs > 0) {
    console.warn(
      `\n⚠️  Media validation warnings:\n` +
      `   Missing images: ${totalMissingImages}\n` +
      `   Missing PDFs: ${totalMissingPdfs}\n` +
      `   Note: This is a warning, not an error. Build will continue.`
    );
  } else {
    console.log('✅ All media files found');
  }
}

/**
 * Copy media files from content to public folder
 */
export async function copyProjectMedia(projects: Project[]): Promise<void> {
  console.log('\n📦 Copying media files to public folder...');

  const PUBLIC_ROOT = path.join(process.cwd(), 'public', 'projects');

  // Ensure public/projects directory exists
  await fs.ensureDir(PUBLIC_ROOT);

  let copiedCount = 0;

  for (const project of projects) {
    const contentProjectDir = path.join(CONTENT_ROOT, project.id);
    const publicProjectDir = path.join(PUBLIC_ROOT, project.id);

    // Check if project folder exists in content
    const projectDirExists = await fs.pathExists(contentProjectDir);

    if (!projectDirExists) {
      // No media folder for this project, skip
      continue;
    }

    // Copy images folder if it exists
    const imagesDir = path.join(contentProjectDir, 'images');
    if (await fs.pathExists(imagesDir)) {
      await fs.copy(imagesDir, path.join(publicProjectDir, 'images'), {
        overwrite: true
      });
      const imageFiles = await fs.readdir(imagesDir);
      copiedCount += imageFiles.length;
    }

    // Copy pdfs folder if it exists
    const pdfsDir = path.join(contentProjectDir, 'pdfs');
    if (await fs.pathExists(pdfsDir)) {
      await fs.copy(pdfsDir, path.join(publicProjectDir, 'pdfs'), {
        overwrite: true
      });
      const pdfFiles = await fs.readdir(pdfsDir);
      copiedCount += pdfFiles.length;
    }
  }

  console.log(`✅ Copied ${copiedCount} media files to public/projects/`);
}

// ==================== EQUIPMENT MEDIA VALIDATION ====================

/**
 * Check if an equipment file exists
 */
async function checkEquipmentFileExists(
  equipmentId: string,
  filePath: string,
  fileType: 'image' | 'spec-sheet'
): Promise<boolean> {
  const fullPath = path.join(EQUIPMENT_CONTENT_ROOT, filePath);
  const exists = await fs.pathExists(fullPath);

  if (!exists) {
    console.warn(
      `⚠️  Warning: ${fileType} file not found\n` +
      `   Equipment: ${equipmentId}\n` +
      `   File: ${fullPath}\n` +
      `   Expected location: content/equipment/${filePath}`
    );
  }

  return exists;
}

/**
 * Validate all media files for a single equipment item
 */
async function validateEquipmentMediaItem(equipment: Equipment): Promise<{
  missingImages: string[];
  missingSpecSheet: boolean;
}> {
  const missingImages: string[] = [];
  let missingSpecSheet = false;

  // Check images
  for (const imagePath of equipment.media.images) {
    const exists = await checkEquipmentFileExists(equipment.id, imagePath, 'image');
    if (!exists) {
      missingImages.push(imagePath);
    }
  }

  // Check hero image if specified
  if (equipment.media.heroImage) {
    const exists = await checkEquipmentFileExists(equipment.id, equipment.media.heroImage, 'image');
    if (!exists && !missingImages.includes(equipment.media.heroImage)) {
      missingImages.push(equipment.media.heroImage);
    }
  }

  // Check spec sheet
  if (equipment.media.specSheet) {
    const exists = await checkEquipmentFileExists(equipment.id, equipment.media.specSheet, 'spec-sheet');
    if (!exists) {
      missingSpecSheet = true;
    }
  }

  return { missingImages, missingSpecSheet };
}

/**
 * Validate media files for all equipment
 */
export async function validateAllEquipmentMedia(equipment: Equipment[]): Promise<void> {
  console.log('\n📁 Validating equipment media files...');

  let totalMissingImages = 0;
  let totalMissingSpecSheets = 0;

  for (const item of equipment) {
    const { missingImages, missingSpecSheet } = await validateEquipmentMediaItem(item);
    totalMissingImages += missingImages.length;
    if (missingSpecSheet) totalMissingSpecSheets++;
  }

  if (totalMissingImages > 0 || totalMissingSpecSheets > 0) {
    console.warn(
      `\n⚠️  Equipment media validation warnings:\n` +
      `   Missing images: ${totalMissingImages}\n` +
      `   Missing spec sheets: ${totalMissingSpecSheets}\n` +
      `   Note: This is a warning, not an error. Build will continue.`
    );
  } else {
    console.log('✅ All equipment media files found');
  }
}

/**
 * Copy equipment media files from content to public folder
 */
export async function copyEquipmentMedia(equipment: Equipment[]): Promise<void> {
  console.log('\n📦 Copying equipment media files to public folder...');

  const PUBLIC_ROOT = path.join(process.cwd(), 'public', 'equipment');

  // Ensure public/equipment directory exists
  await fs.ensureDir(PUBLIC_ROOT);

  let copiedCount = 0;

  for (const item of equipment) {
    const contentEquipmentDir = path.join(EQUIPMENT_CONTENT_ROOT, item.id);
    const publicEquipmentDir = path.join(PUBLIC_ROOT, item.id);

    // Check if equipment folder exists in content
    const equipmentDirExists = await fs.pathExists(contentEquipmentDir);

    if (!equipmentDirExists) {
      // No media folder for this equipment, skip
      continue;
    }

    // Copy images folder if it exists
    const imagesDir = path.join(contentEquipmentDir, 'images');
    if (await fs.pathExists(imagesDir)) {
      await fs.copy(imagesDir, path.join(publicEquipmentDir, 'images'), {
        overwrite: true
      });
      const imageFiles = await fs.readdir(imagesDir);
      copiedCount += imageFiles.length;
    }

    // Copy spec-sheet folder if it exists
    const specSheetDir = path.join(contentEquipmentDir, 'spec-sheet');
    if (await fs.pathExists(specSheetDir)) {
      await fs.copy(specSheetDir, path.join(publicEquipmentDir, 'spec-sheet'), {
        overwrite: true
      });
      const specFiles = await fs.readdir(specSheetDir);
      copiedCount += specFiles.length;
    }
  }

  console.log(`✅ Copied ${copiedCount} equipment media files to public/equipment/`);
}
