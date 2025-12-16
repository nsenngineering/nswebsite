import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ProjectCategory } from '@/types/project';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a placeholder image SVG data URI for projects without images
 * @param category - The project category to determine the color
 * @returns SVG data URI string
 */
export function getPlaceholderImage(category: ProjectCategory): string {
  const colors: Record<ProjectCategory, string> = {
    'pile-testing': '#7c3aed',
    'tunnel-road': '#6d28d9',
    'hydropower': '#8b5cf6',
    'transmission': '#5b21b6',
    'ndt': '#6366f1'
  };

  const color = colors[category] || '#7c3aed';

  // Create SVG with category color background and "No Image Available" text
  return `data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='${encodeURIComponent(color)}' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3ENo Image Available%3C/text%3E%3C/svg%3E`;
}

/**
 * Utility function for basePath handling
 *
 * Currently returns the path as-is since we're using custom domains
 * (stage.nsengineering.com and nsengineering.com) which serve from root.
 *
 * Supports both local paths and external URLs (e.g., Cloudflare R2).
 * Only prepends basePath to relative paths, not to full URLs.
 *
 * Kept for future flexibility - can set NEXT_PUBLIC_BASE_PATH if needed.
 *
 * @param path - The path or URL to return (with optional basePath prefix)
 * @returns Path with basePath prefix if NEXT_PUBLIC_BASE_PATH is set and path is relative
 *
 * @example
 * // Local path with basePath
 * withBasePath('/projects/image.jpg') // => '/subfolder/projects/image.jpg' (if basePath = '/subfolder')
 *
 * // R2 URL (unchanged)
 * withBasePath('https://cdn.example.com/image.jpg') // => 'https://cdn.example.com/image.jpg'
 */
export function withBasePath(path: string): string {
  // Skip basePath for absolute URLs (http:// or https://)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return basePath ? `${basePath}${path}` : path;
}
