'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ElementType } from 'react';
import { BookOpen, Download, FileText, Lightbulb, Newspaper, Search } from 'lucide-react';
import DocumentGrid from '@/components/elibrary/DocumentGrid';
import ReadingPanel from '@/components/elibrary/ReadingPanel';
import StandardCodesCategoryView from '@/components/elibrary/StandardCodesCategoryView';
import type { ELibrarySection, ELibraryConfig, ELibraryItem, Newsletter, StandardCode, Publication, CuratedPaper, Download as DownloadItem } from '@/types/elibrary';
import {
  isStandardCode,
  isPublication,
  isCuratedPaper,
  isDownload,
  isNewsletter,
} from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

// Cast via unknown to avoid strict structural mismatch between generated JSON
// and the ELibraryConfig TypeScript type (some optional fields may be missing).
const data = elibraryData as unknown as ELibraryConfig;

// Resolved once at module load. Falls back to '' so fetches fail gracefully
// (and we drop back to the static JSON) instead of throwing during render.
//
// IMPORTANT: NEXT_PUBLIC_* vars are inlined by Next.js at BUILD TIME, not
// read at runtime. Having NEXT_PUBLIC_API_URL in your GitHub secrets does
// nothing unless the build step itself has that env var set, e.g.:
//
//   - name: Build
//     env:
//       NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
//     run: npm run build
//
const JSON_SERVER_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const sectionIcons: Record<ELibrarySection, ElementType> = {
  'standard-codes': FileText,
  publications:     BookOpen,
  'curated-papers': Lightbulb,
  downloads:        Download,
  newsletters:      Newspaper,
};

function buildApiUrl(endpoint: string) {
  const baseUrl = JSON_SERVER_URL.trim().replace(/\/+$/, '');
  const normalizedEndpoint = endpoint.replace(/^\/+/, '');

  if (!baseUrl) return '';
  if (!normalizedEndpoint) return baseUrl;

  return `${baseUrl}/${normalizedEndpoint}`;
}

function normalizeFetchedItems<T extends ELibraryItem>(
  payload: unknown,
  fallback: T[],
  targetSection: ELibrarySection,
  guard: (item: ELibraryItem) => item is T,
): T[] {
  const rawItems = Array.isArray(payload)
    ? payload
    : (typeof payload === 'object' && payload !== null && Array.isArray((payload as Record<string, unknown>).items)
      ? ((payload as Record<string, unknown>).items as unknown[])
      : []);

  const normalizedItems = rawItems
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => {
      const record = item as Record<string, unknown>;
      const sectionValue = typeof record.section === 'string' ? record.section : targetSection;
      const correctedSection = targetSection === 'curated-papers' && sectionValue === 'publications'
        ? 'curated-papers'
        : sectionValue;

      return {
        ...record,
        section: correctedSection,
      } as T;
    })
    .filter((item) => guard(item as ELibraryItem));

  return normalizedItems.length ? normalizedItems : fallback;
}

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

  const [isStandardCodeLoading, setIsStandardCodeLoading] = useState(false);
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);
  const [isPublicationLoading, setIsPublicationLoading] = useState(false);
  const [isCuratedPaperLoading, setIsCuratedPaperLoading] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  // Warn exactly once (on mount), not on every render.
  useEffect(() => {
    if (!JSON_SERVER_URL) {
      console.warn('ELibraryClient: NEXT_PUBLIC_API_URL is not configured, falling back to static JSON.');
    }
  }, []);

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
    if (!JSON_SERVER_URL) return;

    let isCancelled = false;

    const loadStandardCodes = async () => {
      try {
        const response = await fetch(`${JSON_SERVER_URL}/standardCodes`, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Failed to load standard codes: ${response.status}`);
        }

        const payload = (await response.json()) as StandardCode[];
        if (!isCancelled) {
          setStandardCodeItems(Array.isArray(payload) ? payload : (data.standardCodes ?? []));
        }
      } catch (error) {
        console.error('Failed to load standard codes data', error);
        if (!isCancelled) {
          setStandardCodeItems(data.standardCodes ?? []);
        }
      }
    };

    void loadStandardCodes();

    return () => {
      isCancelled = true;
    };
  }, [activeSection]);

  // ── Newsletters ──
  useEffect(() => {
    if (activeSection !== 'newsletters') return;
    if (!JSON_SERVER_URL) return;

    let isCancelled = false;

    const loadNewsletters = async () => {
      try {
        setIsNewsletterLoading(true);
        const response = await fetch(`${JSON_SERVER_URL}/newsletters`, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Failed to load newsletter data: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const items = normalizeFetchedItems<Newsletter>(payload, data.newsletters ?? [], 'newsletters', isNewsletter);

        if (!isCancelled) {
          setNewsletterItems(items);
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

  // ── Publications ──
  useEffect(() => {
    if (activeSection !== 'publications') return;
    if (!JSON_SERVER_URL) return;

    let isCancelled = false;

    const loadPublications = async () => {
      try {
        setIsPublicationLoading(true);
        const response = await fetch(`${JSON_SERVER_URL}/publications`, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Failed to load publication data: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const items = normalizeFetchedItems<Publication>(payload, data.publications ?? [], 'publications', isPublication);

        if (!isCancelled) {
          setPublicationItems(items);
        }
      } catch (error) {
        console.error('Failed to load publication data', error);
        if (!isCancelled) {
          setPublicationItems(data.publications ?? []);
        }
      } finally {
        if (!isCancelled) {
          setIsPublicationLoading(false);
        }
      }
    };

    void loadPublications();

    return () => {
      isCancelled = true;
    };
  }, [activeSection]);

  // ── Curated Papers ──
  useEffect(() => {
    if (activeSection !== 'curated-papers') return;
    if (!JSON_SERVER_URL) return;

    let isCancelled = false;

    const loadCuratedPapers = async () => {
      try {
        setIsCuratedPaperLoading(true);
        const response = await fetch(`${JSON_SERVER_URL}/curatedPapers`, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Failed to load curated papers data: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const items = normalizeFetchedItems<CuratedPaper>(payload, data.curatedPapers ?? [], 'curated-papers', isCuratedPaper);

        if (!isCancelled) {
          setCuratedPaperItems(items);
        }
      } catch (error) {
        console.error('Failed to load curated papers data', error);
        if (!isCancelled) {
          setCuratedPaperItems(data.curatedPapers ?? []);
        }
      } finally {
        if (!isCancelled) {
          setIsCuratedPaperLoading(false);
        }
      }
    };

    void loadCuratedPapers();

    return () => {
      isCancelled = true;
    };
  }, [activeSection]);

  // ── Downloads ──
  useEffect(() => {
    if (activeSection !== 'downloads') return;
    if (!JSON_SERVER_URL) return;

    let isCancelled = false;

    const loadDownloads = async () => {
      try {
        setIsDownloadLoading(true);
        const response = await fetch(`${JSON_SERVER_URL}/downloads`, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Failed to load downloads data: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const items = normalizeFetchedItems<DownloadItem>(payload, data.downloads ?? [], 'downloads', isDownload);

        if (!isCancelled) {
          setDownloadItems(items);
        }
      } catch (error) {
        console.error('Failed to load downloads data', error);
        if (!isCancelled) {
          setDownloadItems(data.downloads ?? []);
        }
      } finally {
        if (!isCancelled) {
          setIsDownloadLoading(false);
        }
      }
    };

    void loadDownloads();

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

  const isActiveSectionLoading =
    (activeSection === 'standard-codes' && isStandardCodeLoading) ||
    (activeSection === 'newsletters' && isNewsletterLoading) ||
    (activeSection === 'publications' && isPublicationLoading) ||
    (activeSection === 'curated-papers' && isCuratedPaperLoading) ||
    (activeSection === 'downloads' && isDownloadLoading);

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
          {activeSection === 'publications' && isPublicationLoading ? ' • loading latest publications' : ''}
          {activeSection === 'curated-papers' && isCuratedPaperLoading ? ' • loading latest curated papers' : ''}
          {activeSection === 'downloads' && isDownloadLoading ? ' • loading latest downloads' : ''}
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
