import path from 'path';
import fs from 'fs-extra';
import { CSVRecord, parseSemicolonArray, parseBoolean } from './csv-parser.js';
import { fetchDataWithFallback } from './data-source.js';
import { isR2Mode, constructR2Url } from './r2-utils.js';
import type {
  StandardCode,
  Publication,
  CuratedPaper,
  Download,
  Newsletter,
  ELibrarySection,
  ELibrarySectionInfo
} from '../../src/types/elibrary.js';

/**
 * Validate required field exists
 */
function validateRequired(value: string | undefined, fieldName: string, itemId: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`❌ Missing required field "${fieldName}" for item: ${itemId}`);
  }
  return value.trim();
}

/**
 * Validate item ID format (kebab-case)
 */
function validateItemId(id: string): void {
  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!kebabCaseRegex.test(id)) {
    throw new Error(
      `❌ Invalid item ID format: "${id}"\n` +
      `   Item IDs must be lowercase, kebab-case (e.g., "astm-d4945")`
    );
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function validateDate(date: string, itemId: string): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new Error(
      `❌ Invalid date format "${date}" for item: ${itemId}\n` +
      `   Date must be in YYYY-MM-DD format (e.g., "2023-06-15")`
    );
  }

  // Validate it's a real date
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error(
      `❌ Invalid date value "${date}" for item: ${itemId}\n` +
      `   Date must be a valid calendar date`
    );
  }
}

/**
 * Validate URL format
 */
function validateUrl(url: string, itemId: string): void {
  try {
    new URL(url);
  } catch {
    throw new Error(
      `❌ Invalid URL format for item: ${itemId}\n` +
      `   URL: "${url}" is not a valid URL`
    );
  }
}

/**
 * Validate Lucide icon name (basic check - just ensure it's not empty)
 */
function validateIcon(icon: string | undefined): string {
  if (!icon || icon.trim() === '') {
    return 'ExternalLink'; // Default icon
  }
  return icon.trim();
}

/**
 * Auto-detect file type from extension
 */
function detectFileType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const typeMap: Record<string, string> = {
    '.pdf': 'PDF',
    '.docx': 'DOCX',
    '.doc': 'DOC',
    '.xlsx': 'XLSX',
    '.xls': 'XLS',
    '.pptx': 'PPTX',
    '.ppt': 'PPT',
    '.zip': 'ZIP',
    '.rar': 'RAR'
  };
  return typeMap[ext] || ext.replace('.', '').toUpperCase();
}

/**
 * Auto-detect file size (returns human-readable size)
 */
async function detectFileSize(filePath: string): Promise<string | undefined> {
  try {
    const stats = await fs.stat(filePath);
    const bytes = stats.size;

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } catch {
    return undefined;
  }
}

/**
 * Get file URL path (R2 or local)
 */
function getFileUrlPath(section: string, itemId: string, filename: string): string {
  if (isR2Mode()) {
    return constructR2Url('elibrary', `${section}/${itemId}/${filename}`);
  } else {
    return `${section}/${itemId}/${filename}`;
  }
}

// ============================================================================
// STANDARD CODES PARSER
// ============================================================================

/**
 * Parse a single standard code from CSV record
 */
export async function parseStandardCode(record: CSVRecord): Promise<StandardCode> {
  const id = validateRequired(record.id, 'id', record.id || 'unknown');
  validateItemId(id);

  const title = validateRequired(record.title, 'title', id);
  const externalUrlRaw = validateRequired(record.externalUrl, 'externalUrl', id);

  // Parse multiple URLs and organizations (semicolon-separated)
  const urls = parseSemicolonArray(externalUrlRaw);
  const organizations = parseSemicolonArray(record.organization || '');

  // Validate all URLs
  urls.forEach(url => {
    if (url.trim()) {
      validateUrl(url.trim(), id);
    }
  });

  // Create StandardReference array - pair URLs with organizations
  // If organizations count doesn't match URLs, reuse organizations cyclically
  const standards = urls.map((url, i) => {
    const org = organizations.length > 0
      ? organizations[i % organizations.length].trim()
      : 'Unknown';

    return {
      organization: org,
      url: url.trim()
    };
  }).filter(std => std.url); // Remove any empty entries

  // Ensure at least one standard exists
  if (standards.length === 0) {
    throw new Error(`❌ No valid standards found for item: ${id}`);
  }

  const category = record.category?.trim() || undefined;
  const tags = parseSemicolonArray(record.tags);
  const featured = parseBoolean(record.featured);

  const dateAdded = validateRequired(record.dateAdded, 'dateAdded', id);
  validateDate(dateAdded, id);

  return {
    id,
    title,
    section: 'standard-codes',
    standards,
    category,
    tags,
    featured,
    dateAdded
  };
}

/**
 * Parse all standard codes from CSV records
 */
export async function parseStandardCodes(records: CSVRecord[]): Promise<StandardCode[]> {
  const items: StandardCode[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    try {
      const item = await parseStandardCode(records[i]);

      if (seenIds.has(item.id)) {
        throw new Error(`❌ Duplicate item ID: ${item.id}`);
      }
      seenIds.add(item.id);

      items.push(item);
    } catch (error) {
      console.error(`\n❌ Error parsing standard code at row ${i + 2}:`);
      throw error;
    }
  }

  console.log(`✅ Successfully parsed ${items.length} standard codes`);
  return items;
}

// ============================================================================
// PUBLICATIONS PARSER
// ============================================================================

/**
 * Parse a single publication from CSV record
 */
export async function parsePublication(record: CSVRecord): Promise<Publication> {
  const id = validateRequired(record.id, 'id', record.id || 'unknown');
  validateItemId(id);

  const title = validateRequired(record.title, 'title', id);
  const description = validateRequired(record.description, 'description', id);
  const fileUrl = validateRequired(record.fileUrl, 'fileUrl', id);

  const author = record.author?.trim() || undefined;
  const category = record.category?.trim() || undefined;
  const tags = parseSemicolonArray(record.tags);
  const featured = parseBoolean(record.featured);

  const publishDate = validateRequired(record.publishDate, 'publishDate', id);
  validateDate(publishDate, id);

  // Construct full file path
  const fileUrlPath = getFileUrlPath('publications', id, fileUrl);

  return {
    id,
    title,
    section: 'publications',
    description,
    fileUrl: fileUrlPath,
    author,
    publishDate,
    category,
    tags,
    featured
  };
}

/**
 * Parse all publications from CSV records
 */
export async function parsePublications(records: CSVRecord[]): Promise<Publication[]> {
  const items: Publication[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    try {
      const item = await parsePublication(records[i]);

      if (seenIds.has(item.id)) {
        throw new Error(`❌ Duplicate item ID: ${item.id}`);
      }
      seenIds.add(item.id);

      items.push(item);
    } catch (error) {
      console.error(`\n❌ Error parsing publication at row ${i + 2}:`);
      throw error;
    }
  }

  console.log(`✅ Successfully parsed ${items.length} publications`);
  return items;
}

// ============================================================================
// CURATED PAPERS PARSER
// ============================================================================

/**
 * Parse a single curated paper from CSV record
 */
export async function parseCuratedPaper(record: CSVRecord): Promise<CuratedPaper> {
  const id = validateRequired(record.id, 'id', record.id || 'unknown');
  validateItemId(id);

  const title = validateRequired(record.title, 'title', id);
  const externalUrl = validateRequired(record.externalUrl, 'externalUrl', id);
  validateUrl(externalUrl, id);

  const icon = validateIcon(record.icon);
  const source = record.source?.trim() || undefined;
  const category = record.category?.trim() || undefined;
  const tags = parseSemicolonArray(record.tags);
  const featured = parseBoolean(record.featured);

  const dateAdded = validateRequired(record.dateAdded, 'dateAdded', id);
  validateDate(dateAdded, id);

  return {
    id,
    title,
    section: 'curated-papers',
    externalUrl,
    icon,
    source,
    category,
    tags,
    featured,
    dateAdded
  };
}

/**
 * Parse all curated papers from CSV records
 */
export async function parseCuratedPapers(records: CSVRecord[]): Promise<CuratedPaper[]> {
  const items: CuratedPaper[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    try {
      const item = await parseCuratedPaper(records[i]);

      if (seenIds.has(item.id)) {
        throw new Error(`❌ Duplicate item ID: ${item.id}`);
      }
      seenIds.add(item.id);

      items.push(item);
    } catch (error) {
      console.error(`\n❌ Error parsing curated paper at row ${i + 2}:`);
      throw error;
    }
  }

  console.log(`✅ Successfully parsed ${items.length} curated papers`);
  return items;
}

// ============================================================================
// DOWNLOADS PARSER
// ============================================================================

/**
 * Parse a single download from CSV record
 */
export async function parseDownload(record: CSVRecord): Promise<Download> {
  const id = validateRequired(record.id, 'id', record.id || 'unknown');
  validateItemId(id);

  const title = validateRequired(record.title, 'title', id);
  const fileUrl = validateRequired(record.fileUrl, 'fileUrl', id);

  const description = record.description?.trim() || undefined;
  const category = record.category?.trim() || undefined;
  const tags = parseSemicolonArray(record.tags);
  const featured = parseBoolean(record.featured);

  const dateAdded = validateRequired(record.dateAdded, 'dateAdded', id);
  validateDate(dateAdded, id);

  // Auto-detect file type from extension
  const fileType = record.fileType?.trim() || detectFileType(fileUrl);

  // Construct full file path
  const fileUrlPath = getFileUrlPath('downloads', id, fileUrl);

  // Try to detect file size if not provided
  let fileSize = record.fileSize?.trim() || undefined;
  if (!fileSize) {
    const localPath = path.join(process.cwd(), 'content', 'elibrary', 'downloads', id, fileUrl);
    fileSize = await detectFileSize(localPath);
  }

  return {
    id,
    title,
    section: 'downloads',
    fileUrl: fileUrlPath,
    description,
    category,
    fileType,
    fileSize,
    tags,
    featured,
    dateAdded
  };
}

/**
 * Parse all downloads from CSV records
 */
export async function parseDownloads(records: CSVRecord[]): Promise<Download[]> {
  const items: Download[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    try {
      const item = await parseDownload(records[i]);

      if (seenIds.has(item.id)) {
        throw new Error(`❌ Duplicate item ID: ${item.id}`);
      }
      seenIds.add(item.id);

      items.push(item);
    } catch (error) {
      console.error(`\n❌ Error parsing download at row ${i + 2}:`);
      throw error;
    }
  }

  console.log(`✅ Successfully parsed ${items.length} downloads`);
  return items;
}

// ============================================================================
// NEWSLETTERS PARSER
// ============================================================================

/**
 * Parse a single newsletter from CSV record
 */
export async function parseNewsletter(record: CSVRecord): Promise<Newsletter> {
  const id = validateRequired(record.id, 'id', record.id || 'unknown');
  validateItemId(id);

  const title = validateRequired(record.title, 'title', id);
  const fileUrl = validateRequired(record.fileUrl, 'fileUrl', id);

  const description = record.description?.trim() || undefined;
  const quarter = record.quarter?.trim() || undefined;
  const tags = parseSemicolonArray(record.tags);
  const featured = parseBoolean(record.featured);

  const publishDate = validateRequired(record.publishDate, 'publishDate', id);
  validateDate(publishDate, id);

  // Construct full file path
  const fileUrlPath = getFileUrlPath('newsletters', id, fileUrl);

  return {
    id,
    title,
    section: 'newsletters',
    fileUrl: fileUrlPath,
    description,
    publishDate,
    quarter,
    tags,
    featured
  };
}

/**
 * Parse all newsletters from CSV records
 */
export async function parseNewsletters(records: CSVRecord[]): Promise<Newsletter[]> {
  const items: Newsletter[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    try {
      const item = await parseNewsletter(records[i]);

      if (seenIds.has(item.id)) {
        throw new Error(`❌ Duplicate item ID: ${item.id}`);
      }
      seenIds.add(item.id);

      items.push(item);
    } catch (error) {
      console.error(`\n❌ Error parsing newsletter at row ${i + 2}:`);
      throw error;
    }
  }

  console.log(`✅ Successfully parsed ${items.length} newsletters`);
  return items;
}

// ============================================================================
// SECTION METADATA & UTILITIES
// ============================================================================

/**
 * Extract document counts by section
 */
export function extractSectionCounts(
  standardCodes: StandardCode[],
  publications: Publication[],
  curatedPapers: CuratedPaper[],
  downloads: Download[],
  newsletters: Newsletter[]
): Record<ELibrarySection, number> {
  return {
    'standard-codes': standardCodes.length,
    'publications': publications.length,
    'curated-papers': curatedPapers.length,
    'downloads': downloads.length,
    'newsletters': newsletters.length
  };
}

/**
 * Validate section is one of the allowed eLibrary sections
 */
function validateSection(section: string): ELibrarySection {
  const ALLOWED_SECTIONS: ELibrarySection[] = [
    'standard-codes',
    'publications',
    'curated-papers',
    'downloads',
    'newsletters'
  ];

  if (!ALLOWED_SECTIONS.includes(section as ELibrarySection)) {
    throw new Error(
      `❌ Invalid section "${section}"\n` +
      `   Allowed sections: ${ALLOWED_SECTIONS.join(', ')}`
    );
  }

  return section as ELibrarySection;
}

/**
 * Load eLibrary section metadata from CSV
 */
export async function loadSectionMetadata(): Promise<ELibrarySectionInfo[]> {
  const SECTIONS_CSV = path.join(process.cwd(), 'content', 'elibrary', 'sections.csv');

  try {
    const records = await fetchDataWithFallback(
      SECTIONS_CSV,
      'ElibrarySections',
      'GOOGLE_SHEET_TAB_ELIBRARY_SECTIONS'
    );

    return records.map((record, index) => ({
      id: validateSection(record.id),
      label: record.label?.trim() || formatSectionLabel(record.id),
      description: record.description?.trim() || '',
      icon: record.icon?.trim() || 'FileText',
      order: parseInt(record.order) || index + 1,
      emptyMessage: record.emptyMessage?.trim() || undefined
    }));
  } catch (error) {
    console.error('❌ Error loading sections data:', error);
    console.log('📋 Using default sections');
    return getDefaultSections();
  }
}

/**
 * Format section slug to label (e.g., 'standard-codes' -> 'Standard Codes')
 */
function formatSectionLabel(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get default eLibrary sections (5 sections)
 */
function getDefaultSections(): ELibrarySectionInfo[] {
  return [
    {
      id: 'standard-codes',
      label: 'Standard Codes',
      description: 'Links to industry standards and testing protocols',
      icon: 'FileText',
      order: 1,
      emptyMessage: 'No standards available yet'
    },
    {
      id: 'publications',
      label: 'Publications',
      description: 'Technical papers and research from our team',
      icon: 'BookOpen',
      order: 2,
      emptyMessage: 'No publications available yet'
    },
    {
      id: 'curated-papers',
      label: 'Curated Papers',
      description: 'Recommended research papers and technical articles',
      icon: 'Lightbulb',
      order: 3,
      emptyMessage: 'No curated papers available yet'
    },
    {
      id: 'downloads',
      label: 'Downloads',
      description: 'Downloadable resources and company materials',
      icon: 'Download',
      order: 4,
      emptyMessage: 'No downloads available yet'
    },
    {
      id: 'newsletters',
      label: 'Newsletters',
      description: 'Company newsletters with project updates',
      icon: 'Newspaper',
      order: 5,
      emptyMessage: 'No newsletters available yet'
    }
  ];
}
