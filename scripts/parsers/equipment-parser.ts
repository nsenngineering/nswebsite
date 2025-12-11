import path from 'path';
import fs from 'fs-extra';
import { CSVRecord, parseSemicolonArray, parseBoolean } from './csv-parser.js';
import type { Equipment, EquipmentCategory, EquipmentCategoryInfo } from '../../src/types/equipment.js';

/**
 * Validate required field exists
 */
function validateRequired(value: string | undefined, fieldName: string, equipmentId: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`❌ Missing required field "${fieldName}" for equipment: ${equipmentId}`);
  }
  return value.trim();
}

/**
 * Validate category is one of the allowed equipment categories
 */
function validateCategory(category: string, equipmentId: string): EquipmentCategory {
  const ALLOWED_CATEGORIES: EquipmentCategory[] = [
    'pile-testing',
    'drilling',
    'laboratory',
    'geophysical',
    'field-testing'
  ];

  if (!ALLOWED_CATEGORIES.includes(category as EquipmentCategory)) {
    throw new Error(
      `❌ Invalid category "${category}" for equipment: ${equipmentId}\n` +
      `   Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}`
    );
  }

  return category as EquipmentCategory;
}

/**
 * Validate equipment ID format (kebab-case)
 */
function validateEquipmentId(id: string): void {
  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!kebabCaseRegex.test(id)) {
    throw new Error(
      `❌ Invalid equipment ID format: "${id}"\n` +
      `   Equipment IDs must be lowercase, kebab-case (e.g., "pda-8000s")`
    );
  }
}

/**
 * Auto-detect images and spec sheet from filesystem when CSV is empty
 */
async function autoDetectMedia(
  equipmentId: string,
  csvImages: string[],
  csvSpecSheet?: string
): Promise<{ images: string[]; specSheet?: string; heroImage?: string }> {
  const CONTENT_ROOT = path.join(process.cwd(), 'content', 'equipment');
  const imagesDir = path.join(CONTENT_ROOT, equipmentId, 'images');
  const specSheetDir = path.join(CONTENT_ROOT, equipmentId, 'spec-sheet');

  let images: string[] = [];
  let heroImage: string | undefined;
  let specSheet: string | undefined;

  // Auto-detect images
  if (csvImages.length > 0) {
    images = csvImages;
    heroImage = csvImages[0];
  } else {
    // Scan filesystem for images
    const dirExists = await fs.pathExists(imagesDir);
    if (dirExists) {
      try {
        const files = await fs.readdir(imagesDir);
        const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
        const imageFiles = files
          .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return IMAGE_EXTENSIONS.includes(ext);
          })
          .sort(); // Alphabetical order

        images = imageFiles;
        heroImage = imageFiles.length > 0 ? imageFiles[0] : undefined;
      } catch (error) {
        console.error(
          `❌ Error reading images directory for equipment "${equipmentId}":`,
          error instanceof Error ? error.message : error
        );
      }
    }
  }

  // Auto-detect spec sheet
  if (csvSpecSheet) {
    specSheet = csvSpecSheet;
  } else {
    // Scan filesystem for spec sheet
    const specDirExists = await fs.pathExists(specSheetDir);
    if (specDirExists) {
      try {
        const files = await fs.readdir(specSheetDir);
        const PDF_EXTENSIONS = ['.pdf'];
        const pdfFiles = files
          .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return PDF_EXTENSIONS.includes(ext);
          })
          .sort();

        specSheet = pdfFiles.length > 0 ? pdfFiles[0] : undefined;
      } catch (error) {
        console.error(
          `❌ Error reading spec-sheet directory for equipment "${equipmentId}":`,
          error instanceof Error ? error.message : error
        );
      }
    }
  }

  return { images, specSheet, heroImage };
}

/**
 * Parse a single equipment item from CSV record
 */
export async function parseEquipment(record: CSVRecord): Promise<Equipment> {
  const id = validateRequired(record.id, 'id', record.id || 'unknown');
  validateEquipmentId(id);

  const name = validateRequired(record.name, 'name', id);
  const category = validateCategory(
    validateRequired(record.category, 'category', id),
    id
  );
  const description = validateRequired(record.description, 'description', id);

  // Optional fields
  const manufacturer = record.manufacturer?.trim() || undefined;
  const model = record.model?.trim() || undefined;
  const keySpec = record.key_spec?.trim() || 'View specifications';

  // Specs fields
  const capacity = record.capacity?.trim() || 'N/A';
  const accuracy = record.accuracy?.trim() || 'N/A';
  const standards = parseSemicolonArray(record.standards);
  const software = record.software?.trim() || undefined;

  // Applications
  const applications = parseSemicolonArray(record.applications);
  if (applications.length === 0) {
    console.warn(`⚠️  Warning: Equipment "${id}" has no applications listed`);
  }

  // Parse media files
  const csvImages = parseSemicolonArray(record.images);
  const csvSpecSheet = record.spec_sheet?.trim() || undefined;

  // Auto-detect media from filesystem if CSV is empty
  const { images, specSheet, heroImage } = await autoDetectMedia(id, csvImages, csvSpecSheet);

  // Construct full media paths
  const imagesPaths = images.map(img => `${id}/images/${img}`);
  const specSheetPath = specSheet ? `${id}/spec-sheet/${specSheet}` : undefined;
  const heroImagePath = heroImage ? `${id}/images/${heroImage}` : undefined;

  const featured = parseBoolean(record.featured);

  return {
    id,
    name,
    category,
    manufacturer,
    model,
    keySpec,
    description,
    specs: {
      capacity,
      accuracy,
      standards,
      software
    },
    applications,
    media: {
      images: imagesPaths,
      specSheet: specSheetPath,
      heroImage: heroImagePath
    },
    featured
  };
}

/**
 * Parse all equipment from CSV records
 */
export async function parseEquipmentList(records: CSVRecord[]): Promise<Equipment[]> {
  const equipment: Equipment[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    try {
      const item = await parseEquipment(records[i]);

      // Check for duplicate IDs
      if (seenIds.has(item.id)) {
        throw new Error(`❌ Duplicate equipment ID: ${item.id}`);
      }
      seenIds.add(item.id);

      equipment.push(item);
    } catch (error) {
      console.error(`\n❌ Error parsing equipment at row ${i + 2}:`);
      throw error;
    }
  }

  console.log(`✅ Successfully parsed ${equipment.length} equipment items`);
  return equipment;
}

/**
 * Format category slug to label (e.g., 'pile-testing' -> 'Pile Testing')
 */
function formatCategoryLabel(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Default category styling
const DEFAULT_COLOR = '#9333ea';         // Purple-600
const DEFAULT_GRADIENT_FROM = 'purple-500';
const DEFAULT_GRADIENT_TO = 'purple-700';

/**
 * Extract equipment category counts
 */
export function extractEquipmentCategories(equipment: Equipment[]): Record<string, number> {
  const categoryCounts: Record<string, number> = {};

  equipment.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  return categoryCounts;
}

/**
 * Load equipment category metadata from CSV
 */
export async function loadEquipmentCategoryMetadata(): Promise<EquipmentCategoryInfo[]> {
  const CATEGORIES_CSV = path.join(process.cwd(), 'content', 'equipment', 'categories.csv');

  // Check if categories CSV exists
  const csvExists = await fs.pathExists(CATEGORIES_CSV);
  if (!csvExists) {
    // Return default categories
    console.log('📋 No equipment categories.csv found, using defaults');
    return getDefaultCategories();
  }

  try {
    const { parseCSVFile } = await import('./csv-parser.js');
    const records = parseCSVFile(CATEGORIES_CSV);

    return records.map(record => ({
      id: validateCategory(record.id, 'categories.csv'),
      label: record.label?.trim() || formatCategoryLabel(record.id),
      color: record.color?.trim() || DEFAULT_COLOR,
      gradientFrom: record.gradientFrom?.trim() || DEFAULT_GRADIENT_FROM,
      gradientTo: record.gradientTo?.trim() || DEFAULT_GRADIENT_TO,
      description: record.description?.trim() || ''
    }));
  } catch (error) {
    console.error('❌ Error loading equipment categories CSV:', error);
    console.log('📋 Using default categories');
    return getDefaultCategories();
  }
}

/**
 * Get default equipment categories
 */
function getDefaultCategories(): EquipmentCategoryInfo[] {
  return [
    {
      id: 'pile-testing',
      label: 'Pile Testing',
      color: '#7c3aed',
      gradientFrom: 'purple-500',
      gradientTo: 'purple-700',
      description: 'Dynamic and static pile load testing equipment'
    },
    {
      id: 'drilling',
      label: 'Drilling',
      color: '#6d28d9',
      gradientFrom: 'purple-600',
      gradientTo: 'purple-800',
      description: 'Core drilling and borehole investigation rigs'
    },
    {
      id: 'laboratory',
      label: 'Laboratory',
      color: '#8b5cf6',
      gradientFrom: 'purple-400',
      gradientTo: 'purple-600',
      description: 'Soil and rock testing laboratory instruments'
    },
    {
      id: 'geophysical',
      label: 'Geophysical',
      color: '#5b21b6',
      gradientFrom: 'purple-700',
      gradientTo: 'purple-900',
      description: 'Geophysical survey and subsurface investigation tools'
    },
    {
      id: 'field-testing',
      label: 'Field Testing',
      color: '#6366f1',
      gradientFrom: 'indigo-600',
      gradientTo: 'purple-700',
      description: 'In-situ field testing equipment'
    }
  ];
}
