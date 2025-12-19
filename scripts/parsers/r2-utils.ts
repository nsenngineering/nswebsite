/**
 * Cloudflare R2 Utilities
 *
 * Shared utilities for R2 mode detection and URL construction.
 * Used across all content parsers (projects, hero, team, elibrary, services).
 */

/**
 * Check if R2 mode is enabled
 * R2 mode is active when NEXT_PUBLIC_R2_BASE_URL environment variable is set
 */
export function isR2Mode(): boolean {
  return !!process.env.NEXT_PUBLIC_R2_BASE_URL;
}

/**
 * Validate R2 configuration
 * Throws error if R2 mode is enabled but configuration is invalid
 */
export function validateR2Config(): void {
  if (!process.env.NEXT_PUBLIC_R2_BASE_URL) {
    throw new Error('NEXT_PUBLIC_R2_BASE_URL is required for R2 mode');
  }

  console.log('✅ R2 Mode Active');
  console.log(`   Base URL: ${process.env.NEXT_PUBLIC_R2_BASE_URL}`);
}

/**
 * Construct R2 URL for media files
 *
 * @param basePath - Base path in R2 bucket (e.g., 'hero', 'team', 'elibrary', 'services')
 * @param filename - Filename or path to the file
 * @param subPath - Optional subdirectory within basePath (e.g., 'images', 'diagrams', 'files')
 * @returns Full R2 URL
 *
 * @example
 * constructR2Url('hero', 'IMG_2968.JPG')
 * // => 'https://pub-XXXXX.r2.dev/hero/IMG_2968.JPG'
 *
 * @example
 * constructR2Url('team', 'arun-pandit.jpg')
 * // => 'https://pub-XXXXX.r2.dev/team/arun-pandit.jpg'
 *
 * @example
 * constructR2Url('services', 'pile-testing.jpg', 'images')
 * // => 'https://pub-XXXXX.r2.dev/services/images/pile-testing.jpg'
 *
 * @example
 * constructR2Url('elibrary', 'is-2131-2008/files/document.pdf')
 * // => 'https://pub-XXXXX.r2.dev/elibrary/is-2131-2008/files/document.pdf'
 */
export function constructR2Url(
  basePath: string,
  filename: string,
  subPath?: string
): string {
  const r2BaseUrl = process.env.NEXT_PUBLIC_R2_BASE_URL!;

  // Remove leading/trailing slashes to avoid double slashes
  const cleanBasePath = basePath.replace(/^\/|\/$/g, '');
  const cleanFilename = filename.replace(/^\/|\/$/g, '');
  const cleanSubPath = subPath?.replace(/^\/|\/$/g, '');

  // Construct URL parts
  const parts = [r2BaseUrl, cleanBasePath];
  if (cleanSubPath) {
    parts.push(cleanSubPath);
  }
  parts.push(cleanFilename);

  return parts.join('/');
}
