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
 * Prepends the Next.js basePath to a given path
 * For GitHub Pages deployment at /nswebsite
 * @param path - The path to prepend the basePath to
 * @returns Path with basePath prefix
 */
export function withBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
}
