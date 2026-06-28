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

    if (searchQuery === '') return items;

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

  const activeSectionInfo = data.sectionInfo.find((section) => section.id === activeSection);

  const handleSectionChange = (section: ELibrarySection) => {
    setActiveSection(section);
    setSelectedItem(null);
    setSelectedStandardCategory(null);
  };

  const handleCloseReadingPane = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 text-white">
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

    {/* Title */}
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-purple-100">
          NS Engineering eLibrary
        </p>

        <h1 className="mt-2 text-4xl font-bold md:text-5xl">
          {activeSectionInfo?.label || 'Engineering Library'}
        </h1>

        <p className="mt-5 text-lg leading-8 text-purple-100">
          {activeSection === 'standard-codes'
            ? 'Industry standards and testing protocols for geotechnical engineering, materials, water, electrical, and construction testing.'
            : activeSectionInfo?.description}
        </p>
      </div>

      {/* Search */}

      <div className="relative w-full lg:w-96">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setSelectedStandardCategory(null);
          }}
          placeholder="Search standards, publications..."
          className="w-full rounded-xl bg-white py-3 pl-12 pr-4 text-gray-900 shadow-lg outline-none ring-2 ring-transparent transition focus:ring-white"
        />
      </div>

    </div>

    {/* Tabs */}

    <div className="mt-10 flex gap-3 overflow-x-auto scrollbar-hide">

      {data.sectionInfo
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          const Icon = sectionIcons[section.id] || FileText;

          const isActive = section.id === activeSection;

          return (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 font-medium transition ${
                isActive
                  ? 'bg-white text-purple-700 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Icon className="h-4 w-4" />

              <span>{section.label}</span>

              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-white/20'
                }`}
              >
                {data.sections[section.id]}
              </span>
            </button>
          );
        })}
    </div>

    {/* Statistics */}

    <div className="mt-10 flex flex-wrap gap-10 border-t border-white/20 pt-8">

      <div>
        <p className="text-3xl font-bold">
          {data.sections[activeSection]}
        </p>

        <p className="text-sm text-purple-100">
          Library Items
        </p>
      </div>

      <div>
        <p className="text-3xl font-bold">
          {filteredItems.length}
        </p>

        <p className="text-sm text-purple-100">
          Search Results
        </p>
      </div>

      {activeSection === 'standard-codes' && (
        <div>
          <p className="text-3xl font-bold">
            3+
          </p>

          <p className="text-sm text-purple-100">
            Standard Bodies
          </p>
        </div>
      )}

    </div>

  </div>
</header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className={selectedItem ? 'lg:mr-96' : ''}>
          {activeSection === 'standard-codes' ? (
            <StandardCodesCategoryView
              items={filteredItems as StandardCode[]}
              selectedCategory={selectedStandardCategory}
              onCategorySelect={setSelectedStandardCategory}
              onBack={() => setSelectedStandardCategory(null)}
            />
          ) : (
            <>
              <div className="mb-6 text-sm text-gray-600">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </div>
              <DocumentGrid
                items={filteredItems}
                onItemClick={setSelectedItem}
                selectedItemId={selectedItem?.id}
              />
            </>
          )}
        </div>
      </div>

      {selectedItem && (
        <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-40">
          <ReadingPanel item={selectedItem} onClose={handleCloseReadingPane} />
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto">
          <ReadingPanel item={selectedItem} onClose={handleCloseReadingPane} />
        </div>
      )}
    </div>
  );
}
