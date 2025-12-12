import path from 'path';
import fs from 'fs-extra';
import { parseCSVFile, CSVRecord } from './csv-parser.js';

export interface CategoryConfig {
  id: string;
  label?: string;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  description?: string;
}

/**
 * Parse categories from CSV file
 */
export async function parseCategoriesCSV(): Promise<CategoryConfig[]> {
  const CSV_PATH = path.join(process.cwd(), 'content', 'categories', 'categories.csv');

  // Check if file exists
  if (!fs.existsSync(CSV_PATH)) {
    console.warn('⚠️  categories.csv not found, using defaults only');
    return [];
  }

  try {
    // Parse CSV using existing parseCSVFile utility
    const records: CSVRecord[] = await parseCSVFile(CSV_PATH);

    // Validate and transform
    return records.map((record, index) => {
      const id = record.id?.trim();

      // Validate required ID
      if (!id) {
        throw new Error(`❌ Missing 'id' in categories.csv row ${index + 2}`);
      }

      // Validate ID format (kebab-case)
      const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
      if (!kebabRegex.test(id)) {
        throw new Error(
          `❌ Invalid category ID "${id}" in row ${index + 2}\n` +
          `   Must be lowercase kebab-case (e.g., "pile-testing")`
        );
      }

      // Validate color format if provided
      const color = record.color?.trim();
      if (color && !/^#[0-9a-fA-F]{6}$/.test(color)) {
        throw new Error(
          `❌ Invalid hex color "${color}" for category "${id}"\n` +
          `   Must be 6-digit hex (e.g., "#7c3aed")`
        );
      }

      return {
        id,
        label: record.label?.trim() || undefined,
        color: color || undefined,
        gradientFrom: record.gradientFrom?.trim() || undefined,
        gradientTo: record.gradientTo?.trim() || undefined,
        description: record.description?.trim() || undefined,
      };
    });
  } catch (error) {
    console.error('❌ Error parsing categories.csv:');
    throw error;
  }
}
