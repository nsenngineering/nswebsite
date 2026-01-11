'use client';

import { useState, useMemo } from 'react';
import ELibrarySidebar from '@/components/elibrary/ELibrarySidebar';
import DocumentGrid from '@/components/elibrary/DocumentGrid';
import ReadingPanel from '@/components/elibrary/ReadingPanel';
import type { ELibrarySection, ELibraryConfig, ELibraryItem } from '@/types/elibrary';
import {
  isStandardCode,
  isPublication,
  isCuratedPaper,
  isDownload,
  isNewsletter,
} from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const data = elibraryData as ELibraryConfig;

export default function ELibraryClient() {
  // Initialize with first section
  const [activeSection, setActiveSection] = useState<ELibrarySection>('standard-codes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ELibraryItem | null>(null);

  // Get items for active section and apply search filter
  const filteredItems = useMemo(() => {
    // Get items from active section
    let items: ELibraryItem[] = [];
    switch (activeSection) {
      case 'standard-codes':
        items = data.standardCodes;
        break;
      case 'publications':
        items = data.publications;
        break;
      case 'curated-papers':
        items = data.curatedPapers;
        break;
      case 'downloads':
        items = data.downloads;
        break;
      case 'newsletters':
        items = data.newsletters;
        break;
    }

    // Apply search filter
    if (searchQuery === '') return items;

    const searchLower = searchQuery.toLowerCase();

    return items.filter((item) => {
      // Base search (all items have these fields)
      const baseMatch =
        item.title.toLowerCase().includes(searchLower) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      // Section-specific search
      if (isStandardCode(item)) {
        return (
          baseMatch ||
          item.standards.some(std => std.organization.toLowerCase().includes(searchLower)) ||
          item.standards.some(std => std.url.toLowerCase().includes(searchLower)) ||
          item.category?.toLowerCase().includes(searchLower)
        );
      }
      if (isPublication(item)) {
        return (
          baseMatch ||
          item.description.toLowerCase().includes(searchLower) ||
          item.author?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower)
        );
      }
      if (isCuratedPaper(item)) {
        return (
          baseMatch ||
          item.source?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower)
        );
      }
      if (isDownload(item)) {
        return (
          baseMatch ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower)
        );
      }
      if (isNewsletter(item)) {
        return (
          baseMatch ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.quarter?.toLowerCase().includes(searchLower)
        );
      }

      return baseMatch;
    });
  }, [activeSection, searchQuery]);

  // Handle section change
  const handleSectionChange = (section: ELibrarySection) => {
    setActiveSection(section);
    setSelectedItem(null); // Clear selection when changing sections
  };

  // Handle item click
  const handleItemClick = (item: ELibraryItem) => {
    setSelectedItem(item);
  };

  // Handle reading pane close
  const handleCloseReadingPane = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Engineering Library
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl">
            Access our comprehensive collection of standards, technical publications, research papers, and resources.
            Stay informed with the latest in geotechnical engineering and testing practices.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Section Navigation */}
          <ELibrarySidebar
            sections={data.sectionInfo}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            documentCounts={data.sections}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Document Grid - Main Content */}
          <div className={`flex-1 ${selectedItem ? 'lg:mr-96' : ''}`}>
            {/* Results Count */}
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </div>

            {/* Document Grid */}
            <DocumentGrid
              items={filteredItems}
              onItemClick={handleItemClick}
              selectedItemId={selectedItem?.id}
            />
          </div>

          {/* Reading Pane - Desktop Side Panel */}
          {selectedItem && (
            <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-40">
              <ReadingPanel item={selectedItem} onClose={handleCloseReadingPane} />
            </div>
          )}
        </div>
      </div>

      {/* Reading Pane - Mobile Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto">
          <ReadingPanel item={selectedItem} onClose={handleCloseReadingPane} />
        </div>
      )}
    </div>
  );
}
