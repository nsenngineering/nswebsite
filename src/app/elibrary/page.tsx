'use client';

import { useState, useMemo } from 'react';
import ELibrarySidebar from '@/components/elibrary/ELibrarySidebar';
import DocumentGrid from '@/components/elibrary/DocumentGrid';
import type { ELibrarySection, ELibraryConfig } from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const data = elibraryData as ELibraryConfig;

export default function ELibraryPage() {
  const [activeSection, setActiveSection] = useState<ELibrarySection | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter documents based on section and search query
  const filteredDocuments = useMemo(() => {
    return data.documents.filter((doc) => {
      // Section filter
      const matchesSection = activeSection === 'all' || doc.section === activeSection;

      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        doc.title.toLowerCase().includes(searchLower) ||
        doc.summary.toLowerCase().includes(searchLower) ||
        doc.content.toLowerCase().includes(searchLower) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        doc.author?.toLowerCase().includes(searchLower) ||
        doc.category?.toLowerCase().includes(searchLower);

      return matchesSection && matchesSearch;
    });
  }, [activeSection, searchQuery]);

  // Handle section change
  const handleSectionChange = (section: ELibrarySection | 'all') => {
    setActiveSection(section);
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
            Access our comprehensive collection of standards, publications, and newsletters.
            Stay informed with the latest in geotechnical engineering and testing practices.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Category List */}
          <ELibrarySidebar
            sections={data.sectionInfo}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            documentCounts={data.sections}
            totalDocuments={data.metadata.totalDocuments}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Document Grid - Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredDocuments.length} of {data.metadata.totalDocuments} documents
            </div>

            {/* Document Grid */}
            <DocumentGrid documents={filteredDocuments} />
          </div>
        </div>
      </div>
    </div>
  );
}
