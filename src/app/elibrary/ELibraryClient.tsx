'use client';

import { useState, useMemo } from 'react';
import type { ElementType } from 'react';
import { BookOpen, Download, FileText, Lightbulb, Newspaper, Search } from 'lucide-react';
import DocumentGrid from '@/components/elibrary/DocumentGrid';
import ReadingPanel from '@/components/elibrary/ReadingPanel';
import StandardCodesCategoryView from '@/components/elibrary/StandardCodesCategoryView';
import type { ELibrarySection, ELibraryConfig, ELibraryItem, StandardCode } from '@/types/elibrary';
import {
  isStandardCode,
  isPublication,
  isCuratedPaper,
  isDownload,
  isNewsletter,
} from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const data = elibraryData as ELibraryConfig;

/** Derive counts directly from the data arrays so they're always accurate,
 *  regardless of what the generated `sections` map contains. */
const sectionCounts: Record<ELibrarySection, number> = {
  'standard-codes': data.standardCodes?.length ?? 0,
  publications:     data.publications?.length ?? 0,
  'curated-papers': data.curatedPapers?.length ?? 0,
  downloads:        data.downloads?.length ?? 0,
  newsletters:      data.newsletters?.length ?? 0,
};

const sectionIcons: Record<ELibrarySection, ElementType> = {
  'standard-codes': FileText,
  publications: BookOpen,
  'curated-papers': Lightbulb,
  downloads: Download,
  newsletters: Newspaper,
};

export default function ELibraryClient() {
  const [activeSection, setActiveSection] = useState<ELibrarySection>('standard-codes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ELibraryItem | null>(null);
  const [selectedStandardCategory, setSelectedStandardCategory] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    let items: ELibraryItem[] = [];

    switch (activeSection) {
      case 'standard-codes':
        items = data.standardCodes ?? [];
        break;
      case 'publications':
        items = data.publications ?? [];
        break;
      case 'curated-papers':
        items = data.curatedPapers ?? [];
        break;
      case 'downloads':
        items = data.downloads ?? [];
        break;
      case 'newsletters':
        items = data.newsletters ?? [];
        break;
    }

    if (searchQuery.trim() === '') return items;

    const searchLower = searchQuery.toLowerCase();

    return items.filter((item) => {
      const baseMatch =
        item.id.toLowerCase().includes(searchLower) ||
        item.title.toLowerCase().includes(searchLower) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      if (isStandardCode(item)) {
        return (
          baseMatch ||
          item.standards.some((std) => std.organization.toLowerCase().includes(searchLower)) ||
          item.standards.some((std) => std.url.toLowerCase().includes(searchLower)) ||
          item.category?.toLowerCase().includes(searchLower)
        );
      }
      if (isPublication(item)) {
        return (
          baseMatch ||
          item.description.toLowerCase().includes(searchLower) ||
          item.authors.some((author) => author.toLowerCase().includes(searchLower)) ||
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

  const handleSectionChange = (section: ELibrarySection) => {
    setActiveSection(section);
    setSelectedItem(null);
    setSelectedStandardCategory(null);
  };

  const handleCloseReadingPane = () => {
    setSelectedItem(null);
  };

  const totalItems = sectionCounts[activeSection];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Banner (matches Projects page style) ── */}
      <header className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold md:text-6xl">
            Engineering Library
          </h1>
          <p className="mt-5 text-lg leading-8 text-purple-100">
            <span className="font-semibold text-yellow-300">{totalItems}+ resources</span>{' '}
            across standards, publications, research papers, downloads, and newsletters
          </p>
        </div>
      </header>

      {/* ── Tabs + Search bar (below hero, white section) ── */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2">
              {data.sectionInfo
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((section) => {
                  const Icon = sectionIcons[section.id as ELibrarySection] || FileText;
                  const isActive = section.id === activeSection;
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionChange(section.id as ELibrarySection)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'bg-purple-600 text-white shadow'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{section.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                        }`}
                      >
                        {sectionCounts[section.id as ELibrarySection] ?? 0}
                      </span>
                    </button>
                  );
                })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSelectedStandardCategory(null);
                }}
                placeholder="Search standards, publications..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 outline-none ring-2 ring-transparent transition focus:border-purple-400 focus:ring-purple-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Result count */}
        <p className="mb-6 text-sm text-gray-500">
          Showing{' '}
          <span className="font-semibold text-gray-800">{filteredItems.length}</span>{' '}
          {searchQuery.trim()
            ? `result${filteredItems.length === 1 ? '' : 's'} for "${searchQuery}"`
            : `item${filteredItems.length === 1 ? '' : 's'}`}
        </p>

        <div className={selectedItem ? 'lg:mr-96' : ''}>
          {/* Standard Codes → category view */}
          {activeSection === 'standard-codes' ? (
            <StandardCodesCategoryView
              items={filteredItems as StandardCode[]}
              selectedCategory={selectedStandardCategory}
              onCategorySelect={setSelectedStandardCategory}
              onBack={() => setSelectedStandardCategory(null)}
            />
          ) : (
            <DocumentGrid
              items={filteredItems}
              onItemClick={setSelectedItem}
              selectedItemId={selectedItem?.id}
            />
          )}
        </div>
      </div>

      {/* ── Reading panel – desktop sidebar ── */}
      {selectedItem && (
        <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-40">
          <ReadingPanel item={selectedItem} onClose={handleCloseReadingPane} />
        </div>
      )}

      {/* ── Reading panel – mobile fullscreen ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto">
          <ReadingPanel item={selectedItem} onClose={handleCloseReadingPane} />
        </div>
      )}
    </div>
  );
}
