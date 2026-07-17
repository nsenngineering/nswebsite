'use client';

import { useEffect, useMemo, useState } from 'react';
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
import {
  getStandardCodes,
  getPublications,
  getNewsletters,
  getCuratedPapers,
  getDownloads,
} from '@/lib/api/elibrary';

// Used only as the synchronous default for first render, before the
// service call in useEffect below resolves. All fetch/error-handling
// concerns now live in src/lib/api/elibrary.ts — this component no
// longer knows a URL exists.
const data = elibraryData as unknown as ELibraryConfig;

const sectionIcons: Record<ELibrarySection, ElementType> = {
  'standard-codes': FileText,
  publications:     BookOpen,
  'curated-papers': Lightbulb,
  downloads:        Download,
  newsletters:      Newspaper,
};

export default function ELibraryClient() {
  const [activeSection, setActiveSection] = useState<ELibrarySection>('standard-codes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ELibraryItem | null>(null);
  const [selectedStandardCategory, setSelectedStandardCategory] = useState<string | null>(null);

  const [standardCodeItems, setStandardCodeItems] = useState<ELibraryItem[]>(data.standardCodes ?? []);
  const [publicationItems, setPublicationItems] = useState<ELibraryItem[]>(data.publications ?? []);
  const [newsletterItems, setNewsletterItems] = useState<ELibraryItem[]>(data.newsletters ?? []);
  const [curatedPaperItems, setCuratedPaperItems] = useState<ELibraryItem[]>(data.curatedPapers ?? []);
  const [downloadItems, setDownloadItems] = useState<ELibraryItem[]>(data.downloads ?? []);

  const [loadingSection, setLoadingSection] = useState<ELibrarySection | null>(null);

  const sectionCounts = useMemo<Record<ELibrarySection, number>>(() => ({
    'standard-codes': standardCodeItems.length || data.standardCodes?.length || 0,
    publications: publicationItems.length || data.publications?.length || 0,
    'curated-papers': curatedPaperItems.length || data.curatedPapers?.length || 0,
    downloads: downloadItems.length || data.downloads?.length || 0,
    newsletters: newsletterItems.length || data.newsletters?.length || 0,
  }), [newsletterItems, standardCodeItems, publicationItems, curatedPaperItems, downloadItems]);

  // ── Standard Codes ──
  useEffect(() => {
    if (activeSection !== 'standard-codes') return;
    let isCancelled = false;

    setLoadingSection('standard-codes');
    getStandardCodes()
      .then((items) => {
        if (!isCancelled) setStandardCodeItems(items);
      })
      .finally(() => {
        if (!isCancelled) setLoadingSection(null);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeSection]);

  // ── Publications ──
  useEffect(() => {
    if (activeSection !== 'publications') return;
    let isCancelled = false;

    setLoadingSection('publications');
    getPublications()
      .then((items) => {
        if (!isCancelled) setPublicationItems(items);
      })
      .finally(() => {
        if (!isCancelled) setLoadingSection(null);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeSection]);

  // ── Newsletters ──
  useEffect(() => {
    if (activeSection !== 'newsletters') return;
    let isCancelled = false;

    setLoadingSection('newsletters');
    getNewsletters()
      .then((items) => {
        if (!isCancelled) setNewsletterItems(items);
      })
      .finally(() => {
        if (!isCancelled) setLoadingSection(null);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeSection]);

  // ── Curated Papers ──
  useEffect(() => {
    if (activeSection !== 'curated-papers') return;
    let isCancelled = false;

    setLoadingSection('curated-papers');
    getCuratedPapers()
      .then((items) => {
        if (!isCancelled) setCuratedPaperItems(items);
      })
      .finally(() => {
        if (!isCancelled) setLoadingSection(null);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeSection]);

  // ── Downloads ──
  useEffect(() => {
    if (activeSection !== 'downloads') return;
    let isCancelled = false;

    setLoadingSection('downloads');
    getDownloads()
      .then((items) => {
        if (!isCancelled) setDownloadItems(items);
      })
      .finally(() => {
        if (!isCancelled) setLoadingSection(null);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeSection]);

  const filteredItems = useMemo(() => {
    let items: ELibraryItem[] = [];

    switch (activeSection) {
      case 'standard-codes':  items = standardCodeItems; break;
      case 'publications':    items = publicationItems; break;
      case 'curated-papers':  items = curatedPaperItems; break;
      case 'downloads':       items = downloadItems; break;
      case 'newsletters':     items = newsletterItems; break;
    }

    if (searchQuery.trim() === '') return items;
    const q = searchQuery.toLowerCase();

    return items.filter((item) => {
      const base =
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      if (isStandardCode(item))  return base || item.standards.some((s) => s.organization.toLowerCase().includes(q) || s.url.toLowerCase().includes(q)) || item.category?.toLowerCase().includes(q);
      if (isPublication(item))   return base || item.description.toLowerCase().includes(q) || item.authors.some((a) => a.toLowerCase().includes(q)) || item.category?.toLowerCase().includes(q);
      if (isCuratedPaper(item))  return base || item.source?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
      if (isDownload(item))      return base || item.description?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
      if (isNewsletter(item))    return base || item.description?.toLowerCase().includes(q) || item.quarter?.toLowerCase().includes(q);
      return base;
    });
  }, [activeSection, newsletterItems, searchQuery, standardCodeItems, publicationItems, curatedPaperItems, downloadItems]);

  const handleSectionChange = (section: ELibrarySection) => {
    setActiveSection(section);
    setSelectedItem(null);
    setSelectedStandardCategory(null);
  };

  const isActiveSectionLoading = loadingSection === activeSection;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold md:text-5xl">Engineering Library</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-purple-100">
            Access our comprehensive collection of standards, technical publications,
            research papers, and resources. Stay informed with the latest in geotechnical
            engineering and testing practices.
          </p>
        </div>
      </header>

      <div className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 pt-8 pb-2 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedStandardCategory(null);
              }}
              placeholder="Search standards, publications, papers..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-5 text-gray-900 shadow-sm outline-none ring-2 ring-transparent transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-100"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {data.sectionInfo
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((section) => {
                const Icon = sectionIcons[section.id as ELibrarySection] || FileText;
                const isActive = section.id === activeSection;
                const count = sectionCounts[section.id as ELibrarySection] ?? 0;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id as ELibrarySection)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'border-purple-600 bg-purple-600 text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{section.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-gray-600">
          Showing{' '}
          <span className="font-semibold text-gray-900">{filteredItems.length}</span>{' '}
          {activeSection === 'standard-codes' ? 'standard' : ''}{filteredItems.length === 1 ? ' item' : ' items'}
          {searchQuery.trim() ? ` for "${searchQuery}"` : ''}
          {activeSection === 'newsletters' && isActiveSectionLoading ? ' • loading latest newsletters' : ''}
          {activeSection === 'publications' && isActiveSectionLoading ? ' • loading latest publications' : ''}
          {activeSection === 'curated-papers' && isActiveSectionLoading ? ' • loading latest curated papers' : ''}
          {activeSection === 'downloads' && isActiveSectionLoading ? ' • loading latest downloads' : ''}
        </p>

        <div className={selectedItem ? 'lg:mr-96' : ''}>
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

      {selectedItem && (
        <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-40">
          <ReadingPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto">
          <ReadingPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
      )}
    </div>
  );
}
