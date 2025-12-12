import categoriesData from '@/data/generated/categories.json';
import { Project } from '@/types/project';

export interface CategoryMetadata {
  id: string;
  label: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
}

export const categories: CategoryMetadata[] = categoriesData;

/**
 * Get all categories for filter dropdowns
 */
export function getAllCategories(): CategoryMetadata[] {
  return categories;
}

/**
 * Get category metadata by ID
 */
export function getCategoryById(categoryId: string): CategoryMetadata | undefined {
  return categories.find(cat => cat.id === categoryId);
}

/**
 * Get category label (e.g., "Pile Testing")
 */
export function getCategoryLabel(categoryId: string): string {
  return getCategoryById(categoryId)?.label || categoryId;
}

/**
 * Get category color (hex string for Leaflet markers)
 */
export function getCategoryColor(categoryId: string): string {
  return getCategoryById(categoryId)?.color || '#9333ea';
}

/**
 * Get category gradient classes (for Tailwind)
 */
export function getCategoryGradient(categoryId: string): string {
  const category = getCategoryById(categoryId);
  if (!category) return 'from-purple-500 to-purple-700';
  return `from-${category.gradientFrom} to-${category.gradientTo}`;
}

/**
 * Get category statistics from projects
 */
export function getCategoryStats(projects: Project[]): Record<string, number> {
  const stats: Record<string, number> = {};
  categories.forEach(cat => {
    stats[cat.id] = projects.filter(p => p.category === cat.id).length;
  });
  return stats;
}
