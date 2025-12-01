import { parse } from 'csv-parse/sync';
import fs from 'fs-extra';

export interface CSVRecord {
  [key: string]: string;
}

/**
 * Parse a CSV file and return records as objects
 */
export async function parseCSVFile(filePath: string): Promise<CSVRecord[]> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const records = parse(fileContent, {
      columns: true, // Use first row as column names
      skip_empty_lines: true,
      trim: true,
      bom: true // Handle BOM (Byte Order Mark) if present
    }) as CSVRecord[];

    return records;
  } catch (error) {
    console.error(`❌ Error parsing CSV file: ${filePath}`);
    throw error;
  }
}

/**
 * Split semicolon-separated string into array
 */
export function parseSemicolonArray(value: string | undefined): string[] {
  if (!value || value.trim() === '') {
    return [];
  }

  return value.split(';')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

/**
 * Parse boolean value from string
 */
export function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const lower = value.toLowerCase().trim();
  return lower === 'true' || lower === '1' || lower === 'yes';
}

/**
 * Parse number value with validation
 */
export function parseNumber(value: string | undefined, fieldName: string): number {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required number field: ${fieldName}`);
  }

  const num = parseFloat(value.trim());
  if (isNaN(num)) {
    throw new Error(`Invalid number for field ${fieldName}: ${value}`);
  }

  return num;
}
