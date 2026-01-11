/**
 * Cloudflare R2 Client
 *
 * S3-compatible client for listing and accessing files in R2 bucket.
 * Used for auto-detecting media files during build without requiring
 * manual listing in Google Sheets.
 */

import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

interface R2File {
  key: string;
  size: number;
  lastModified: Date;
}

/**
 * Get R2 client instance
 * Returns null if credentials are not configured
 */
function getR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  // R2 endpoint format: https://<account_id>.r2.cloudflarestorage.com
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Check if R2 API access is configured
 */
export function isR2ApiConfigured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY
  );
}

/**
 * List files in R2 bucket with optional prefix filter
 *
 * @param prefix - Path prefix to filter (e.g., 'nsengineering/projects/hydro-kaligandaki/images/')
 * @returns Array of file objects with key, size, and lastModified
 *
 * @example
 * // List all images for a project
 * const files = await listR2Files('nsengineering/projects/hydro-kaligandaki/images/');
 * // Returns: [{ key: 'nsengineering/projects/hydro-kaligandaki/images/IMG_001.jpg', ... }]
 */
export async function listR2Files(prefix: string = ''): Promise<R2File[]> {
  const client = getR2Client();

  if (!client) {
    throw new Error(
      'R2 API credentials not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY.'
    );
  }

  const bucketName = process.env.R2_BUCKET_NAME || 'nsengineering';
  const files: R2File[] = [];
  let continuationToken: string | undefined;

  try {
    // R2/S3 may paginate results, so we need to loop
    do {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const response = await client.send(command);

      if (response.Contents) {
        for (const item of response.Contents) {
          if (item.Key && item.Size !== undefined && item.LastModified) {
            files.push({
              key: item.Key,
              size: item.Size,
              lastModified: item.LastModified,
            });
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return files;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to list R2 files: ${error.message}`);
    }
    throw error;
  }
}

/**
 * List image files for a specific project in R2
 *
 * @param projectId - Project ID (e.g., 'hydro-kaligandaki')
 * @returns Array of image filenames (without full path)
 *
 * @example
 * const images = await listProjectImages('hydro-kaligandaki');
 * // Returns: ['IMG_001.jpg', 'IMG_002.jpg']
 */
export async function listProjectImages(projectId: string): Promise<string[]> {
  const r2Prefix = process.env.R2_BASE_PATH || '';
  const basePath = r2Prefix ? `${r2Prefix}/` : '';
  const prefix = `${basePath}projects/${projectId}/images/`;

  try {
    const files = await listR2Files(prefix);

    // Filter for image extensions and extract filenames
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const images = files
      .filter(file => {
        const ext = file.key.toLowerCase().slice(file.key.lastIndexOf('.'));
        return imageExtensions.includes(ext);
      })
      .map(file => {
        // Extract just the filename from the full key
        const parts = file.key.split('/');
        return parts[parts.length - 1];
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    return images;
  } catch (error) {
    // If R2 listing fails, return empty array (fallback gracefully)
    console.warn(`⚠️  Could not list R2 images for project "${projectId}":`, error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * List PDF files for a specific project in R2
 *
 * @param projectId - Project ID (e.g., 'hydro-kaligandaki')
 * @returns Array of PDF filenames (without full path)
 */
export async function listProjectPDFs(projectId: string): Promise<string[]> {
  const r2Prefix = process.env.R2_BASE_PATH || '';
  const basePath = r2Prefix ? `${r2Prefix}/` : '';
  const prefix = `${basePath}projects/${projectId}/pdfs/`;

  try {
    const files = await listR2Files(prefix);

    // Filter for PDF files and extract filenames
    const pdfs = files
      .filter(file => file.key.toLowerCase().endsWith('.pdf'))
      .map(file => {
        const parts = file.key.split('/');
        return parts[parts.length - 1];
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    return pdfs;
  } catch (error) {
    console.warn(`⚠️  Could not list R2 PDFs for project "${projectId}":`, error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * List hero carousel images from R2
 */
export async function listHeroImages(): Promise<string[]> {
  const r2Prefix = process.env.R2_BASE_PATH || '';
  const basePath = r2Prefix ? `${r2Prefix}/` : '';
  const prefix = `${basePath}homepage_hero/images/`;

  try {
    const files = await listR2Files(prefix);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    return files
      .filter(file => {
        const ext = file.key.toLowerCase().slice(file.key.lastIndexOf('.'));
        return imageExtensions.includes(ext);
      })
      .map(file => {
        const parts = file.key.split('/');
        return parts[parts.length - 1];
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  } catch (error) {
    console.warn('⚠️  Could not list R2 hero images:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * List team member photos from R2
 */
export async function listTeamPhotos(): Promise<string[]> {
  const r2Prefix = process.env.R2_BASE_PATH || '';
  const basePath = r2Prefix ? `${r2Prefix}/` : '';
  const prefix = `${basePath}team/images/`;

  try {
    const files = await listR2Files(prefix);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    return files
      .filter(file => {
        const ext = file.key.toLowerCase().slice(file.key.lastIndexOf('.'));
        return imageExtensions.includes(ext);
      })
      .map(file => {
        const parts = file.key.split('/');
        return parts[parts.length - 1];
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  } catch (error) {
    console.warn('⚠️  Could not list R2 team photos:', error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * List image files for a specific service in R2
 *
 * @param serviceId - Service ID (e.g., 'pile-dynamic-analysis')
 * @returns Array of image filenames (without full path)
 *
 * @example
 * const images = await listServiceImages('pile-dynamic-analysis');
 * // Returns: ['pda-01.jpg', 'pda-02.jpg']
 */
export async function listServiceImages(serviceId: string): Promise<string[]> {
  const r2Prefix = process.env.R2_BASE_PATH || '';
  const basePath = r2Prefix ? `${r2Prefix}/` : '';
  const prefix = `${basePath}services/${serviceId}/images/`;

  try {
    const files = await listR2Files(prefix);

    // Filter for image extensions and extract filenames
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const images = files
      .filter(file => {
        const ext = file.key.toLowerCase().slice(file.key.lastIndexOf('.'));
        return imageExtensions.includes(ext);
      })
      .map(file => {
        // Extract just the filename from the full key
        const parts = file.key.split('/');
        return parts[parts.length - 1];
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    return images;
  } catch (error) {
    // If R2 listing fails, return empty array (fallback gracefully)
    console.warn(`⚠️  Could not list R2 images for service "${serviceId}":`, error instanceof Error ? error.message : error);
    return [];
  }
}
