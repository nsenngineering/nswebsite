'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ElementType } from 'react';
import { BookOpen, Download, FileText, Lightbulb, Newspaper, Search } from 'lucide-react';
import DocumentGrid from '@/components/elibrary/DocumentGrid';
import ReadingPanel from '@/components/elibrary/ReadingPanel';
import StandardCodesCategoryView from '@/components/elibrary/StandardCodesCategoryView';
import type { ELibrarySection, ELibraryConfig, ELibraryItem, Newsletter, StandardCode } from '@/types/elibrary';
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
  const [newsletterItems, setNewsletterItems] = useState<ELibraryItem[]>(data.newsletters ?? []);
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);

  const getApiUrl = (): string => {
  
  const url = process.env.NEXT_PUBLIC_API_URL;
    console.log('ELibraryClient: env.NEXT_PUBLIC_API_URL =', process.env.NEXT_PUBLIC_API_URL);
  if (!url) {
    throw new Error('API_URL is not configured');
  }

  return url;
};
  const JSON_SERVER_URL = getApiUrl();
  console.log('ELibraryClient: JSON_SERVER_URL =', JSON_SERVER_URL);
  
  const sectionCounts = useMemo<Record<ELibrarySection, number>>(() => ({
    'standard-codes': data.standardCodes?.length ?? 0,
    publications: data.publications?.length ?? 0,
    'curated-papers': data.curatedPapers?.length ?? 0,
    downloads: data.downloads?.length ?? 0,
    newsletters: newsletterItems.length || data.newsletters?.length || 0,
  }), [newsletterItems]);

  useEffect(() => {
    if (activeSection !== 'newsletters') return;

    let isCancelled = false;

    const loadNewsletters = async () => {
      try {
        setIsNewsletterLoading(true);
        const response = await fetch(`${JSON_SERVER_URL}/newsletters`, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Failed to load newsletter data: ${response.status}`);
        }

        const payload = (await response.json()) as Newsletter[];
        if (!isCancelled) {
          setNewsletterItems(Array.isArray(payload) ? payload : (data.newsletters ?? []));
        }
      } catch (error) {
        console.error('Failed to load newsletter data', error);
        if (!isCancelled) {
          setNewsletterItems(data.newsletters ?? []);
        }
      } finally {
        if (!isCancelled) {
          setIsNewsletterLoading(false);
        }
      }
    };

    void loadNewsletters();

    return () => {
      isCancelled = true;
    };
  }, [activeSection]);

  const filteredItems = useMemo(() => {
    let items: ELibraryItem[] = [];

    switch (activeSection) {
      case 'standard-codes':  items = data.standardCodes ?? []; break;
      case 'publications':    items = data.publications ?? [];   break;
      case 'curated-papers':  items = data.curatedPapers ?? [];  break;
      case 'downloads':       items = data.downloads ?? [];      break;
      case 'newsletters':     items = newsletterItems;            break;
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
  }, [activeSection, newsletterItems, searchQuery]);

  const handleSectionChange = (section: ELibrarySection) => {
    setActiveSection(section);
    setSelectedItem(null);
    setSelectedStandardCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero — left-aligned, icon + title*/}
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

      {/* ── Below-hero white panel*/}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 pt-8 pb-2 sm:px-6 lg:px-8">

          {/* Full-width search */}
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

          {/* Section filter tabs — below search */}
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

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Result count */}
        <p className="mb-6 text-sm text-gray-600">
          Showing{' '}
          <span className="font-semibold text-gray-900">{filteredItems.length}</span>{' '}
          {activeSection === 'standard-codes' ? 'standard' : ''}{filteredItems.length === 1 ? ' item' : ' items'}
          {searchQuery.trim() ? ` for "${searchQuery}"` : ''}
          {activeSection === 'newsletters' && isNewsletterLoading ? ' • loading latest newsletters' : ''}
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

      {/* ── Reading panel – desktop sidebar ── */}
      {selectedItem && (
        <div className="hidden lg:block fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-gray-200 overflow-y-auto z-40">
          <ReadingPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
      )}

      {/* ── Reading panel – mobile fullscreen ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 lg:hidden bg-white overflow-y-auto">
          <ReadingPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
        </div>
      )}
    </div>
  );
}
