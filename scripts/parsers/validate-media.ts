import fs from 'fs-extra';
import path from 'path';
import type { Project } from './project-parser.js';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'projects');

/**
 * Check if R2 mode is enabled
 */
function isR2Mode(): boolean {
  return !!process.env.NEXT_PUBLIC_R2_BASE_URL &&
         process.env.NEXT_PUBLIC_R2_BASE_URL !== 'https://pub-XXXXX.r2.dev';
}

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
 * Validate R2 configuration
 */
export function validateR2Config(): void {
  console.log('\n🌩️  Validating R2 configuration...');

  const r2BaseUrl = process.env.NEXT_PUBLIC_R2_BASE_URL;
  const r2BucketName = process.env.R2_BUCKET_NAME;
  const r2BasePath = process.env.R2_BASE_PATH;

  if (!r2BaseUrl) {
    console.warn('⚠️  Warning: NEXT_PUBLIC_R2_BASE_URL not set.');
  } else if (r2BaseUrl === 'https://pub-XXXXX.r2.dev') {
    console.warn(
      '⚠️  Warning: NEXT_PUBLIC_R2_BASE_URL is set to placeholder value.\n' +
      '   Please update with your actual R2 public URL.'
    );
  } else {
    console.log(`✅ R2 Base URL configured: ${r2BaseUrl}`);
  }

  if (!r2BucketName) {
    console.warn('⚠️  Warning: R2_BUCKET_NAME not set (using default: ns-engineering-projects)');
  } else {
    console.log(`✅ R2 Bucket Name: ${r2BucketName}`);
  }

  if (!r2BasePath) {
    console.log('ℹ️  R2 Base Path not set (using default: projects)');
  } else {
    console.log(`✅ R2 Base Path: ${r2BasePath}`);
  }
}

/**
 * Copy media files from content to public folder
 * Note: Skipped in R2 mode (images served from R2 CDN)
 */
export async function copyProjectMedia(projects: Project[]): Promise<void> {
  // Skip copying in R2 mode
  if (isR2Mode()) {
    console.log('\n📦 R2 Mode: Skipping local media copy');
    console.log('ℹ️  Images will be served from:', process.env.NEXT_PUBLIC_R2_BASE_URL);
    validateR2Config();
    return;
  }

  // Local mode: Copy files to public folder
  console.log('\n📦 Local Mode: Copying media files to public folder...');

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
