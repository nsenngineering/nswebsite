/**
 * Google Sheets Parser
 *
 * Generic parser for fetching data from Google Sheets via the Google Sheets API.
 * Supports multiple sheet tabs for different content types (projects, hero, team, etc).
 *
 * @module scripts/parsers/google-sheets-parser
 */

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs-extra';
import path from 'path';

/**
 * Generic row structure from Google Sheets
 * Returns key-value pairs matching column headers
 */
export type SheetRow = Record<string, string>;

/**
 * Create authenticated Google Sheets client
 * Supports two authentication methods:
 * 1. Credentials file (GOOGLE_APPLICATION_CREDENTIALS) - local dev
 * 2. Environment variables (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY) - CI/CD
 */
async function createSheetsClient(spreadsheetId: string): Promise<GoogleSpreadsheet> {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  let serviceAccountAuth: JWT;

  // Method 1: Use credentials file (local development)
  if (credentialsPath) {
    const fullPath = path.resolve(credentialsPath);

    if (!await fs.pathExists(fullPath)) {
      throw new Error(
        `Credentials file not found: ${fullPath}\n` +
        'Please download your service account JSON from Google Cloud Console.'
      );
    }

    console.log(`📝 Using credentials file: ${path.basename(fullPath)}`);
    const credentials = await fs.readJSON(fullPath);

    serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  }
  // Method 2: Use environment variables (CI/CD)
  else if (serviceAccountEmail && privateKey) {
    console.log('📝 Using environment variable credentials');
    serviceAccountAuth = new JWT({
      email: serviceAccountEmail,
      key: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  }
  // No credentials found
  else {
    throw new Error(
      'Google Sheets credentials not found!\n' +
      'Please set either:\n' +
      '  - GOOGLE_APPLICATION_CREDENTIALS (path to JSON file)\n' +
      '  OR\n' +
      '  - GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY (env vars)'
    );
  }

  // Create and authenticate the document
  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);

  try {
    await doc.loadInfo();
    console.log(`✅ Connected to Google Sheet: "${doc.title}"`);
    return doc;
  } catch (error) {
    throw new Error(
      `Failed to load Google Sheet.\n` +
      `Sheet ID: ${spreadsheetId}\n` +
      `Make sure:\n` +
      `  1. The sheet exists and is accessible\n` +
      `  2. The service account has Viewer access\n` +
      `  3. Google Sheets API is enabled in Google Cloud Console\n\n` +
      `Original error: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Fetch rows from a specific sheet tab
 * @param sheetName - Name of the tab/sheet to fetch
 * @returns Array of row objects (keys = column headers, values = cell content)
 */
export async function fetchSheetData(sheetName: string): Promise<SheetRow[]> {
  // Get Sheet ID from environment
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error(
      'GOOGLE_SHEET_ID not set!\n' +
      'Add it to your .env.cloud file.\n' +
      'Get the ID from your sheet URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit'
    );
  }

  try {
    console.log(`📊 Fetching data from Google Sheets tab: "${sheetName}"`);

    const doc = await createSheetsClient(spreadsheetId);

    // Get the specific sheet by name
    const sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) {
      const availableTabs = Object.keys(doc.sheetsByTitle).join(', ');
      throw new Error(
        `Sheet tab "${sheetName}" not found!\n` +
        `Available tabs: ${availableTabs || '(none)'}\n` +
        `Please check your tab names in Google Sheets.`
      );
    }

    console.log(`   Rows: ${sheet.rowCount}, Columns: ${sheet.columnCount}`);

    // Fetch all rows
    const rows = await sheet.getRows();

    // Convert rows to plain objects
    const data: SheetRow[] = rows.map(row => {
      const obj: SheetRow = {};
      // Get all column headers and their values
      sheet.headerValues.forEach(header => {
        obj[header] = row.get(header) || '';
      });
      return obj;
    });

    console.log(`✅ Fetched ${data.length} rows from "${sheetName}"`);
    return data;

  } catch (error) {
    throw new Error(
      `Failed to fetch data from Google Sheets tab "${sheetName}"\n` +
      `${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Check if we should use Google Sheets as data source
 */
export function shouldUseSheets(): boolean {
  return process.env.CONTENT_SOURCE_MODE === 'sheets';
}

/**
 * Get sheet tab name from environment with fallback to default
 * Allows customizing tab names via environment variables
 */
export function getSheetTabName(defaultName: string, envVarName?: string): string {
  if (envVarName) {
    const customName = process.env[envVarName];
    if (customName) {
      console.log(`   Using custom tab name from ${envVarName}: "${customName}"`);
      return customName;
    }
  }
  return defaultName;
}
