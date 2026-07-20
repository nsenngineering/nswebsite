/**
 * Data Source Helper
 * Provides unified interface for fetching data from Google Sheets or local CSV files
 */

import { parseCSVFile, CSVRecord } from './csv-parser.js';
import { fetchSheetData, shouldUseSheets, getSheetTabName } from './google-sheets-parser.js';
import { fetchErpContent, shouldUseErp } from './erp-content-parser.js';

/**
 * Fetch data from ERP-published content, Google Sheets, or CSV — in that
 * priority order, each falling through to the next on failure.
 * @param csvPath - Path to local CSV file
 * @param sheetTabName - Default Google Sheets tab name
 * @param sheetTabEnvVar - Optional environment variable for custom tab name
 * @param erpContentType - Optional ERP-published content type key (e.g. 'standard-codes').
 *   Only content types that have actually migrated off Sheets pass this — omitting it
 *   leaves a call site on the existing Sheets/CSV path with no behavior change. Gated by
 *   its own ERP_CONTENT_ENABLED flag (see erp-content-parser.ts), not CONTENT_SOURCE_MODE,
 *   so ERP-sourced and Sheets-sourced content types can coexist during the phased migration.
 * @returns Array of records (key-value pairs)
 */
export async function fetchDataWithFallback(
  csvPath: string,
  sheetTabName: string,
  sheetTabEnvVar?: string,
  erpContentType?: string
): Promise<CSVRecord[]> {
  // ERP-published content takes priority when both ERP_CONTENT_ENABLED and
  // a content type for this call site are configured. Falls through to CSV
  // on failure, same reasoning as the Sheets path below: a broken publish
  // should degrade the build to stale content, never break it outright.
  if (shouldUseErp() && erpContentType) {
    try {
      return await fetchErpContent(erpContentType);
    } catch (error) {
      console.warn('⚠️  Failed to fetch ERP-published content, falling back to local CSV');
      console.error(error instanceof Error ? error.message : error);
      // Fall through to CSV
    }
  }

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
