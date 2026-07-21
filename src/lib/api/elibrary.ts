import type {
  ELibraryConfig,
  StandardCode,
  Publication,
  Newsletter,
  CuratedPaper,
  Download as DownloadItem,
} from '@/types/elibrary';
import elibraryData from '@/data/generated/elibrary.json';

const staticData = elibraryData as unknown as ELibraryConfig;

// No more NEXT_PUBLIC_API_URL here. This file runs in the browser, and the
// browser now only ever needs to know about paths on its own origin — the
// Route Handlers under src/app/api/elibrary/*. Where those handlers get
// their data from (json-server, a real API, a database) is no longer this
// file's concern, and that's the point: the BFF absorbed that knowledge.

// ── Safe JSON fetch helper ──
// Guards against the classic "Unexpected token '<', <!DOCTYPE...' is not
// valid JSON" crash, which happens when fetch() hits a URL that returns an
// HTML error page (404/500) instead of actual JSON, and the code blindly
// calls response.json() on it.
async function fetchJsonSafe<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText} (${url})`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(
      `Expected JSON but got "${contentType || 'unknown content-type'}" from ${url}. ` +
      `First 120 chars: ${text.slice(0, 120)}`
    );
  }

  return (await response.json()) as T;
}

/**
 * Generic "load a section from our own Route Handler, fall back to the
 * bundled static JSON on any failure." Every exported getter below is a
 * thin, typed wrapper around this.
 *
 * `routeSegment` is the kebab-case path under /api/elibrary/, e.g.
 * "standard-codes" or "curated-papers" — it matches the folder name under
 * src/app/api/elibrary/, not json-server's own (camelCase) resource name.
 */
async function loadSection<T>(
  routeSegment: string,
  staticFallback: T[],
  sectionName: string
): Promise<T[]> {
  try {
    const payload = await fetchJsonSafe<T[]>(`/api/elibrary/${routeSegment}`);
    return Array.isArray(payload) ? payload : staticFallback;
  } catch (error) {
    console.error(`Failed to load ${sectionName} data`, error);
    return staticFallback;
  }
}

export async function getStandardCodes(): Promise<StandardCode[]> {
  return loadSection<StandardCode>('standard-codes', staticData.standardCodes ?? [], 'standard codes');
}

export async function getPublications(): Promise<Publication[]> {
  return loadSection<Publication>('publications', staticData.publications ?? [], 'publications');
}

export async function getNewsletters(): Promise<Newsletter[]> {
  return loadSection<Newsletter>('newsletters', staticData.newsletters ?? [], 'newsletters');
}

export async function getCuratedPapers(): Promise<CuratedPaper[]> {
  return loadSection<CuratedPaper>('curated-papers', staticData.curatedPapers ?? [], 'curated papers');
}

export async function getDownloads(): Promise<DownloadItem[]> {
  return loadSection<DownloadItem>('downloads', staticData.downloads ?? [], 'downloads');
}

/** Re-exported so components that only need the bundled defaults
 *  (e.g. for initial render before the first fetch resolves) don't
 *  need to import the JSON file directly. */
export const staticElibraryData = staticData;