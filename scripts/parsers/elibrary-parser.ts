import path from 'path';
import fs from 'fs-extra';
import { CSVRecord, parseSemicolonArray, parseBoolean } from './csv-parser.js';
import type { ELibraryDocument, ELibrarySection, ELibrarySectionInfo } from '../../src/types/elibrary.js';

/**
 * Validate required field exists
 */
function validateRequired(value: string | undefined, fieldName: string, documentId: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`❌ Missing required field "${fieldName}" for document: ${documentId}`);
  }
  return value.trim();
}

/**
 * Validate section is one of the allowed eLibrary sections
 */
function validateSection(section: string, documentId: string): ELibrarySection {
  const ALLOWED_SECTIONS: ELibrarySection[] = ['standards', 'publications', 'newsletters'];

  if (!ALLOWED_SECTIONS.includes(section as ELibrarySection)) {
    throw new Error(
      `❌ Invalid section "${section}" for document: ${documentId}\n` +
      `   Allowed sections: ${ALLOWED_SECTIONS.join(', ')}`
    );
  }

  return section as ELibrarySection;
}

/**
 * Validate document ID format (kebab-case)
 */
function validateDocumentId(id: string): void {
  const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!kebabCaseRegex.test(id)) {
    throw new Error(
      `❌ Invalid document ID format: "${id}"\n` +
      `   Document IDs must be lowercase, kebab-case (e.g., "astm-d4945")`
    );
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function validateDate(date: string, documentId: string): void {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new Error(
      `❌ Invalid date format "${date}" for document: ${documentId}\n` +
      `   Date must be in YYYY-MM-DD format (e.g., "2023-06-15")`
    );
  }

  // Validate it's a real date
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    throw new Error(
      `❌ Invalid date value "${date}" for document: ${documentId}\n` +
      `   Date must be a valid calendar date`
    );
  }
}

/**
 * Auto-detect PDF files from filesystem when CSV is empty
 */
async function autoDetectFiles(documentId: string, csvFileUrl?: string): Promise<string | undefined> {
  if (csvFileUrl) {
    return csvFileUrl;
  }

  const CONTENT_ROOT = path.join(process.cwd(), 'content', 'elibrary');
  const filesDir = path.join(CONTENT_ROOT, documentId, 'files');

  // Check if directory exists
  const dirExists = await fs.pathExists(filesDir);
  if (!dirExists) {
    return undefined;
  }

  try {
    const files = await fs.readdir(filesDir);
    const PDF_EXTENSIONS = ['.pdf'];
    const pdfFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return PDF_EXTENSIONS.includes(ext);
      })
      .sort();

    return pdfFiles.length > 0 ? pdfFiles[0] : undefined;
  } catch (error) {
    console.error(
      `❌ Error reading files directory for document "${documentId}":`,
      error instanceof Error ? error.message : error
    );
    return undefined;
  }
}

/**
 * Parse a single eLibrary document from CSV record
 */
export async function parseDocument(record: CSVRecord): Promise<ELibraryDocument> {
  const id = validateRequired(record.id, 'id', record.id || 'unknown');
  validateDocumentId(id);

  const title = validateRequired(record.title, 'title', id);
  const section = validateSection(
    validateRequired(record.section, 'section', id),
    id
  );
  const summary = validateRequired(record.summary, 'summary', id);
  const content = validateRequired(record.content, 'content', id);

  // Optional fields
  const category = record.category?.trim() || undefined;
  const author = record.author?.trim() || undefined;

  const date = validateRequired(record.date, 'date', id);
  validateDate(date, id);

  // Tags
  const tags = parseSemicolonArray(record.tags);
  if (tags.length === 0) {
    console.warn(`⚠️  Warning: Document "${id}" has no tags`);
  }

  // Parse file URL
  const csvFileUrl = record.file_url?.trim() || undefined;
  const fileUrl = await autoDetectFiles(id, csvFileUrl);

  // Construct full file path if available
  const fileUrlPath = fileUrl ? `${id}/files/${fileUrl}` : undefined;

  const featured = parseBoolean(record.featured);

  return {
    id,
    title,
    section,
    category,
    author,
    date,
    summary,
    content,
    fileUrl: fileUrlPath,
    tags,
    featured
  };
}

/**
 * Parse all eLibrary documents from CSV records
 */
export async function parseELibraryDocuments(records: CSVRecord[]): Promise<ELibraryDocument[]> {
  const documents: ELibraryDocument[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    try {
      const document = await parseDocument(records[i]);

      // Check for duplicate IDs
      if (seenIds.has(document.id)) {
        throw new Error(`❌ Duplicate document ID: ${document.id}`);
      }
      seenIds.add(document.id);

      documents.push(document);
    } catch (error) {
      console.error(`\n❌ Error parsing document at row ${i + 2}:`);
      throw error;
    }
  }

  console.log(`✅ Successfully parsed ${documents.length} documents`);
  return documents;
}

/**
 * Extract document counts by section
 */
export function extractSectionCounts(documents: ELibraryDocument[]): Record<string, number> {
  const sectionCounts: Record<string, number> = {};

  documents.forEach(doc => {
    sectionCounts[doc.section] = (sectionCounts[doc.section] || 0) + 1;
  });

  return sectionCounts;
}

/**
 * Load eLibrary section metadata from CSV
 */
export async function loadSectionMetadata(): Promise<ELibrarySectionInfo[]> {
  const SECTIONS_CSV = path.join(process.cwd(), 'content', 'elibrary', 'sections.csv');

  // Check if sections CSV exists
  const csvExists = await fs.pathExists(SECTIONS_CSV);
  if (!csvExists) {
    console.log('📋 No sections.csv found, using defaults');
    return getDefaultSections();
  }

  try {
    const { parseCSVFile } = await import('./csv-parser.js');
    const records = await parseCSVFile(SECTIONS_CSV);

    return records.map((record, index) => ({
      id: validateSection(record.id, 'sections.csv'),
      label: record.label?.trim() || formatSectionLabel(record.id),
      description: record.description?.trim() || '',
      icon: record.icon?.trim() || 'FileText',
      order: parseInt(record.order) || index + 1
    }));
  } catch (error) {
    console.error('❌ Error loading sections CSV:', error);
    console.log('📋 Using default sections');
    return getDefaultSections();
  }
}

/**
 * Format section slug to label (e.g., 'standards' -> 'Standards')
 */
function formatSectionLabel(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get default eLibrary sections
 */
function getDefaultSections(): ELibrarySectionInfo[] {
  return [
    {
      id: 'standards',
      label: 'Standards',
      description: 'Industry standards and testing protocols',
      icon: 'FileText',
      order: 1
    },
    {
      id: 'publications',
      label: 'Publications',
      description: 'Technical papers and research articles',
      icon: 'BookOpen',
      order: 2
    },
    {
      id: 'newsletters',
      label: 'Newsletters',
      description: 'Company newsletters and updates',
      icon: 'Newspaper',
      order: 3
    }
  ];
}
