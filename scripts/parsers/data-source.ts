/**
 * Data Source Helper
 * Provides unified interface for fetching data from Google Sheets or local CSV files
 */

import { parseCSVFile, CSVRecord } from './csv-parser.js';
import { fetchSheetData, shouldUseSheets, getSheetTabName } from './google-sheets-parser.js';

/**
 * Fetch data from Google Sheets or CSV with automatic fallback
 * @param csvPath - Path to local CSV file
 * @param sheetTabName - Default Google Sheets tab name
 * @param sheetTabEnvVar - Optional environment variable for custom tab name
 * @returns Array of records (key-value pairs)
 */
export async function fetchDataWithFallback(
  csvPath: string,
  sheetTabName: string,
  sheetTabEnvVar?: string
): Promise<CSVRecord[]> {
  // Check if we should use Google Sheets
  if (shouldUseSheets()) {
    const tabName = getSheetTabName(sheetTabName, sheetTabEnvVar);

    try {
      console.log(`📊 Attempting to fetch from Google Sheets tab: "${tabName}"`);
      const data = await fetchSheetData(tabName);
      console.log(`✅ Successfully fetched ${data.length} rows from Google Sheets`);
      return data;
    } catch (error) {
      console.warn('⚠️  Failed to fetch from Google Sheets, falling back to local CSV');
      console.error(error instanceof Error ? error.message : error);
      // Fall through to CSV
    }
  }

  // Fallback to local CSV
  console.log(`📋 Using local CSV file: ${csvPath}`);
  return parseCSVFile(csvPath);
}
