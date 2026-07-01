/**
 * eLibrary types for NS Engineering website
 * Five distinct content types: Standard Codes, Publications, Curated Papers, Downloads, Newsletters
 */

export type ELibrarySection =
  | 'standard-codes'
  | 'publications'
  | 'curated-papers'
  | 'downloads'
  | 'newsletters';

// Base interface for common fields
interface ELibraryItemBase {
  id: string;
  title: string;
  section: ELibrarySection;
  tags: string[];
  featured?: boolean;
}

// Individual standard reference
export interface StandardReference {
  organization: string;  // e.g., "BIS", "ASTM International"
  url: string;           // e.g., "https://www.bis.gov.in/..."
}

// Standard Code (external link to standards organizations)
export interface StandardCode extends ELibraryItemBase {
  section: 'standard-codes';
  standards: StandardReference[];  // Array of standards with organization and URL
  category?: string;
  dateAdded: string;
}

// Publication (internal PDF or external link - technical papers/research)
export interface Publication extends ELibraryItemBase {
  section: 'publications';
  description: string;
  fileUrl?: string;       // Internal PDF file URL (optional if external)
  externalUrl?: string;   // External URL (e.g., Springer, ResearchGate)
  source?: string;        // Source name for external URLs (e.g., "Springer", "ResearchGate")
  authors: string[];      // Array of author names (semicolon-separated in CSV)
  publishDate: string;
  category?: string;
}

// Curated Paper (external link with custom icon)
export interface CuratedPaper extends ELibraryItemBase {
  section: 'curated-papers';
  externalUrl: string;
  icon?: string;
  source?: string;
  category?: string;
  dateAdded: string;
}

// Download (internal file - company materials)
export interface Download extends ELibraryItemBase {
  section: 'downloads';
  fileUrl: string;
  description?: string;
  category?: string;
  fileType?: string;
  fileSize?: string;
  dateAdded: string;
}

// Newsletter (internal PDF - company newsletters)
export interface Newsletter extends ELibraryItemBase {
  section: 'newsletters';
  fileUrl?: string;
  description?: string;
  publishDate: string;
  quarter?: string;
  issueNumber?: string;
  summary?: string;
  readingTime?: string;
  highlights?: string[];
}

// Union type for all document types
export type ELibraryItem =
  | StandardCode
  | Publication
  | CuratedPaper
  | Download
  | Newsletter;

// Section metadata
export interface ELibrarySectionInfo {
  id: ELibrarySection;
  label: string;
  description: string;
  icon: string;
  order: number;
  emptyMessage?: string;
}

// Config structure (output from build system)
export interface ELibraryConfig {
  standardCodes: StandardCode[];
  publications: Publication[];
  curatedPapers: CuratedPaper[];
  downloads: Download[];
  newsletters: Newsletter[];
  sections: Record<ELibrarySection, number>;  // Document counts per section
  sectionInfo: ELibrarySectionInfo[];
  metadata: {
    totalDocuments: number;
    lastUpdated: string;
    buildVersion: string;
  };
}

// Type guards for runtime type checking
export function isStandardCode(item: ELibraryItem): item is StandardCode {
  return item.section === 'standard-codes';
}

export function isPublication(item: ELibraryItem): item is Publication {
  return item.section === 'publications';
}

export function isCuratedPaper(item: ELibraryItem): item is CuratedPaper {
  return item.section === 'curated-papers';
}

export function isDownload(item: ELibraryItem): item is Download {
  return item.section === 'downloads';
}

export function isNewsletter(item: ELibraryItem): item is Newsletter {
  return item.section === 'newsletters';
}
