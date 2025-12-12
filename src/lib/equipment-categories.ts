import equipmentData from '@/data/generated/equipment.json';
import type { Equipment, EquipmentCategoryInfo, EquipmentCategory } from '@/types/equipment';

// Extract category metadata from generated data
export const equipmentCategories: EquipmentCategoryInfo[] = equipmentData.categoryMetadata;

/**
 * Get all equipment categories for filter dropdowns
 */
export function getAllEquipmentCategories(): EquipmentCategoryInfo[] {
  return equipmentCategories;
}

/**
 * Get equipment category metadata by ID
 */
export function getEquipmentCategoryById(categoryId: EquipmentCategory): EquipmentCategoryInfo | undefined {
  return equipmentCategories.find(cat => cat.id === categoryId);
}

/**
 * Get equipment category label (e.g., "Pile Testing")
 */
export function getEquipmentCategoryLabel(categoryId: EquipmentCategory): string {
  return getEquipmentCategoryById(categoryId)?.label || categoryId;
}

/**
 * Get equipment category color (hex string)
 */
export function getEquipmentCategoryColor(categoryId: EquipmentCategory): string {
  return getEquipmentCategoryById(categoryId)?.color || '#9333ea';
}

/**
 * Get equipment category gradient classes (for Tailwind)
 */
export function getEquipmentCategoryGradient(categoryId: EquipmentCategory): string {
  const category = getEquipmentCategoryById(categoryId);
  if (!category) return 'from-purple-500 to-purple-700';
  return `from-${category.gradientFrom} to-${category.gradientTo}`;
}

/**
 * Get equipment category statistics
 */
export function getEquipmentCategoryStats(equipment: Equipment[]): Record<string, number> {
  const stats: Record<string, number> = {};
  equipmentCategories.forEach(cat => {
    stats[cat.id] = equipment.filter(e => e.category === cat.id).length;
  });
  return stats;
}

/**
 * Format category for display in badges/tags
 */
export function formatEquipmentCategory(categoryId: EquipmentCategory): {
  label: string;
  color: string;
  gradient: string;
} {
  const category = getEquipmentCategoryById(categoryId);
  return {
    label: category?.label || categoryId,
    color: category?.color || '#9333ea',
    gradient: getEquipmentCategoryGradient(categoryId)
  };
}
