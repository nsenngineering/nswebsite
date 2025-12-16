/**
 * Google Sheets Parser
 *
 * Fetches project data from Google Sheets via the Google Sheets API.
 * Falls back to local CSV if Sheets API is unavailable.
 *
 * @module scripts/parsers/google-sheets-parser
 */

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * Row structure from Google Sheets
 * Maps directly to CSV columns
 */
export interface SheetRow {
  id: string;
  title: string;
  client: string;
  category: string;
  year: number;
  location_name: string;
  location_district: string;
  coordinates_lat: number;
  coordinates_lng: number;
  scope: string;
  images: string;
  pdfs: string;
  hero_image: string;
  featured: boolean;
}

/**
 * Fetches project data from Google Sheets
 *
 * Prerequisites:
 * - Google Cloud project with Sheets API enabled
 * - Service account created and JSON key downloaded
 * - Sheet shared with service account email (Viewer access)
 * - Environment variables configured:
 *   - GOOGLE_SHEET_ID or GOOGLE_APPLICATION_CREDENTIALS
 *   - GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   - GOOGLE_PRIVATE_KEY
 *
 * @returns Array of project rows from the sheet
 * @throws Error if authentication fails or sheet cannot be loaded
 */
export async function fetchProjectsFromSheet(): Promise<SheetRow[]> {
  console.log('📊 Fetching projects from Google Sheets...');

  // 1. Authenticate with service account
  let serviceAccountAuth: JWT;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Option A: Use credentials file path (simpler for local dev)
    const credentialsPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);

    if (!fs.existsSync(credentialsPath)) {
      throw new Error(
        `Credentials file not found at: ${credentialsPath}\n` +
        'Please download your service account JSON from Google Cloud Console.'
      );
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

    serviceAccountAuth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  } else {
    // Option B: Use environment variables (better for CI/CD)
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!email || !privateKey) {
      throw new Error(
        'Missing Google Sheets credentials.\n' +
        'Either set GOOGLE_APPLICATION_CREDENTIALS path, or both:\n' +
        '  - GOOGLE_SERVICE_ACCOUNT_EMAIL\n' +
        '  - GOOGLE_PRIVATE_KEY'
      );
    }

    serviceAccountAuth = new JWT({
      email,
      key: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
  }

  // 2. Validate Sheet ID
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error(
      'Missing GOOGLE_SHEET_ID environment variable.\n' +
      'Get the ID from your sheet URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit'
    );
  }

  // 3. Load sheet
  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

  try {
    await doc.loadInfo();
    console.log(`✅ Loaded sheet: "${doc.title}"`);
  } catch (error) {
    throw new Error(
      `Failed to load Google Sheet.\n` +
      `Sheet ID: ${sheetId}\n` +
      `Make sure:\n` +
      `  1. The sheet exists and is accessible\n` +
      `  2. The service account (${serviceAccountAuth.email}) has Viewer access\n` +
      `  3. Sheets API is enabled in Google Cloud Console\n\n` +
      `Original error: ${error}`
    );
  }

  // 4. Get first sheet (or sheet by name)
  const sheet = doc.sheetsByIndex[0]; // or doc.sheetsByTitle['Projects']

  if (!sheet) {
    throw new Error(
      `No worksheets found in the Google Sheet.\n` +
      `Sheet ID: ${sheetId}\n` +
      `Make sure the sheet contains at least one worksheet.`
    );
  }

  console.log(`📄 Reading worksheet: "${sheet.title}"`);

  // 5. Fetch rows
  const rows = await sheet.getRows();
  console.log(`📦 Found ${rows.length} projects in sheet`);

  // 6. Convert rows to objects
  const projects: SheetRow[] = rows.map((row, index) => {
    try {
      return {
        id: row.get('id') || '',
        title: row.get('title') || '',
        client: row.get('client') || '',
        category: row.get('category') || '',
        year: parseInt(row.get('year') || '0', 10),
        location_name: row.get('location_name') || '',
        location_district: row.get('location_district') || '',
        coordinates_lat: parseFloat(row.get('coordinates_lat') || '0'),
        coordinates_lng: parseFloat(row.get('coordinates_lng') || '0'),
        scope: row.get('scope') || '',
        images: row.get('images') || '',
        pdfs: row.get('pdfs') || '',
        hero_image: row.get('hero_image') || '',
        featured: row.get('featured') === 'TRUE' || row.get('featured') === 'true' || false,
      };
    } catch (error) {
      console.error(`⚠️  Error parsing row ${index + 2}:`, error);
      throw new Error(`Failed to parse row ${index + 2}: ${error}`);
    }
  });

  return projects;
}

/**
 * Fetches projects with automatic fallback to local CSV
 *
 * Tries Google Sheets first, falls back to CSV if:
 * - Sheets API credentials are missing
 * - Network error
 * - Permission error
 * - Any other Sheets-related error
 *
 * @returns Array of project rows (from Sheets or CSV)
 */
export async function fetchProjectsWithFallback(): Promise<SheetRow[]> {
  // Check content source mode
  const sourceMode = process.env.CONTENT_SOURCE_MODE || 'csv';

  if (sourceMode === 'csv') {
    console.log('📋 Content source mode: CSV (using local file)');
    return fetchProjectsFromCSV();
  }

  // Try Google Sheets
  try {
    return await fetchProjectsFromSheet();
  } catch (error) {
    console.warn('⚠️  Failed to fetch from Google Sheets, falling back to local CSV');
    console.error(error instanceof Error ? error.message : error);
    return fetchProjectsFromCSV();
  }
}

/**
 * Reads project data from local CSV file (fallback)
 *
 * @returns Array of project rows from CSV
 * @throws Error if CSV file doesn't exist or cannot be parsed
 */
function fetchProjectsFromCSV(): SheetRow[] {
  const csvPath = path.join(process.cwd(), 'content/projects/projects.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error(
      `CSV file not found at: ${csvPath}\n` +
      'Please ensure content/projects/projects.csv exists.'
    );
  }

  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`📦 Loaded ${records.length} projects from local CSV`);

    // Convert CSV records to SheetRow format
    return records.map((record: any) => ({
      id: record.id || '',
      title: record.title || '',
      client: record.client || '',
      category: record.category || '',
      year: parseInt(record.year || '0', 10),
      location_name: record.location_name || '',
      location_district: record.location_district || '',
      coordinates_lat: parseFloat(record.coordinates_lat || '0'),
      coordinates_lng: parseFloat(record.coordinates_lng || '0'),
      scope: record.scope || '',
      images: record.images || '',
      pdfs: record.pdfs || '',
      hero_image: record.hero_image || '',
      featured: record.featured === 'TRUE' || record.featured === 'true' || false,
    }));
  } catch (error) {
    throw new Error(
      `Failed to parse CSV file at: ${csvPath}\n` +
      `Original error: ${error}`
    );
  }
}
