/**
 * eLibrary types for NS Engineering website
 * Manages Standards, Publications, and Newsletters
 */

export type ELibrarySection = 'standards' | 'publications' | 'newsletters';

export interface ELibraryDocument {
  id: string;
  title: string;
  section: ELibrarySection;
  category?: string;
  author?: string;
  date: string;
  summary: string;
  content: string;
  fileUrl?: string;
  tags: string[];
  featured?: boolean;
}

export interface ELibrarySectionInfo {
  id: ELibrarySection;
  label: string;
  description: string;
  icon: string;
  order: number;
}

export interface ELibraryConfig {
  documents: ELibraryDocument[];
  sections: Record<string, number>;
  sectionInfo: ELibrarySectionInfo[];
  metadata: {
    totalDocuments: number;
    lastUpdated: string;
    buildVersion: string;
  };
}
