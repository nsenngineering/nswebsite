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
 * Generic "load a section from our own Route Handler (/api/elibrary/*),
 * fall back to the bundled static JSON on any failure." The browser never
 * talks to json-server directly anymore — only same-origin, so there is
 * no cross-origin request left to fail on CORS. What lives behind that
 * route (live json-server proxy in dev, or the static fallback in a
 * production static export) is the Route Handler's problem, not ours.
 */
async function loadSection<T>(
  endpoint: string,
  staticFallback: T[],
  sectionName: string
): Promise<T[]> {
  try {
    const payload = await fetchJsonSafe<T[]>(`/api/elibrary/${endpoint}`);
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