/**
 * CSV Exporter
 *
 * Exports data fetched from Google Sheets back to CSV files for version control.
 * This allows tracking content changes in Git while team edits in Google Sheets.
 */

import path from 'path';
import fs from 'fs-extra';
import { stringify } from 'csv-stringify/sync';
import { fetchSheetData } from './google-sheets-parser.js';

interface SheetExportConfig {
  sheetTabName: string;
  csvOutputPath: string;
  envVarName?: string;
}

/**
 * Export a single Google Sheet tab to CSV file
 */
async function exportSheetToCSV(config: SheetExportConfig): Promise<void> {
  const { sheetTabName, csvOutputPath } = config;

  try {
    // Fetch data from Google Sheets
    const rows = await fetchSheetData(sheetTabName);

    if (rows.length === 0) {
      console.warn(`   ⚠️  No data in sheet "${sheetTabName}", skipping export`);
      return;
    }

    // Get column headers from first row
    const headers = Object.keys(rows[0]);

    // Convert to CSV format
    const csvContent = stringify(rows, {
      header: true,
      columns: headers,
      quoted: true, // Quote all fields to preserve formatting
      quoted_empty: true
    });

    // Ensure directory exists
    await fs.ensureDir(path.dirname(csvOutputPath));

    // Write to file
    await fs.writeFile(csvOutputPath, csvContent, 'utf-8');

    console.log(`   ✅ ${sheetTabName} → ${path.relative(process.cwd(), csvOutputPath)}`);
  } catch (error) {
    console.error(`   ❌ Failed to export ${sheetTabName}:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

/**
 * Export all Google Sheets tabs to CSV files
 */
export async function exportAllSheetsToCSV(): Promise<void> {
  console.log('\n💾 Exporting Google Sheets to CSV for version control...');

  const exports: SheetExportConfig[] = [
    {
      sheetTabName: process.env.GOOGLE_SHEET_TAB_PROJECTS || 'Projects',
      csvOutputPath: path.join(process.cwd(), 'content', 'projects', 'projects.csv')
    },
    {
      sheetTabName: process.env.GOOGLE_SHEET_TAB_HERO || 'HomepageHeroCarousel',
      csvOutputPath: path.join(process.cwd(), 'content', 'homepage_hero', 'hero_carousel.csv')
    },
    {
      sheetTabName: process.env.GOOGLE_SHEET_TAB_MILESTONES || 'HomepageHeroMilestones',
      csvOutputPath: path.join(process.cwd(), 'content', 'homepage_hero', 'milestones.csv')
    },
    {
      sheetTabName: process.env.GOOGLE_SHEET_TAB_TEAM || 'Team',
      csvOutputPath: path.join(process.cwd(), 'content', 'team', 'team.csv')
    },
    {
      sheetTabName: process.env.GOOGLE_SHEET_TAB_ELIBRARY || 'ElibraryDocuments',
      csvOutputPath: path.join(process.cwd(), 'content', 'elibrary', 'documents.csv')
    },
    {
      sheetTabName: process.env.GOOGLE_SHEET_TAB_ELIBRARY_SECTIONS || 'ElibrarySections',
      csvOutputPath: path.join(process.cwd(), 'content', 'elibrary', 'sections.csv')
    },
    {
      sheetTabName: process.env.GOOGLE_SHEET_TAB_CATEGORIES || 'ProjectCategories',
      csvOutputPath: path.join(process.cwd(), 'content', 'categories', 'categories.csv')
    },
    {
      sheetTabName: process.env.GOOGLE_SHEET_TAB_SERVICE_CATEGORIES || 'ServiceCategories',
      csvOutputPath: path.join(process.cwd(), 'content', 'services', 'service-categories.csv')
    },
    {
      sheetTabName: process.env.GOOGLE_SHEET_TAB_SERVICES || 'Services',
      csvOutputPath: path.join(process.cwd(), 'content', 'services', 'services.csv')
    }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const exportConfig of exports) {
    try {
      await exportSheetToCSV(exportConfig);
      successCount++;
    } catch (error) {
      failCount++;
    }
  }

  console.log(`\n📊 Export Summary: ${successCount} succeeded, ${failCount} failed`);

  if (failCount > 0) {
    throw new Error(`Failed to export ${failCount} sheet(s)`);
  }
}

/**
 * Check if we should export (only in cloud mode)
 */
export function shouldExportToCSV(): boolean {
  return process.env.CONTENT_SOURCE_MODE === 'sheets';
}
