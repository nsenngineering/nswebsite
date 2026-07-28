import 'server-only';
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

// Same rule as the old route.ts: no NEXT_PUBLIC_ prefix, so this is
// never inlined into client JS, and it's only ever read on the server.
// Set in .env.local for local dev (pointing at your json-server).
// Deliberately unset in cloud/CI builds — see the big comment below
// and the note in deploy-dev.yml.
const JSON_SERVER_URL = process.env.JSON_SERVER_URL ?? '';

/**
 * ── Revalidation policy for this dataset ──────────────────────────
 *
 * Standard Codes, Publications, Newsletters, Curated Papers and
 * Downloads are all "reference library" content: a new edition of a
 * standard or a new quarterly newsletter lands on the order of weeks
 * or months, not minutes. There is no real cost to serving data that
 * is a few hours old, so this is a textbook case for TIME-BASED
 * revalidation rather than on-demand: nobody is going to file a bug
 * report because the standard codes list was 4 hours stale.
 *
 * Contrast with the search box in ELibraryClient: that's filtering
 * over data already sitting in memory on the client, so it is never
 * "cached" in the stale-data sense at all — every keystroke recomputes
 * against whatever was fetched. It doesn't need a revalidation
 * strategy because it never leaves freshness behind in the first
 * place; there's nothing to invalidate.
 *
 * ── The `output: 'export'` caveat (read this) ──────────────────────
 *
 * next.config.ts sets `output: 'export'`. In a static export, every
 * Server Component and Route Handler runs exactly ONCE, at
 * `next build` time, and its output is frozen into static files.
 * There is no Next.js server process left after that build to honor
 * `revalidate` or to respond to `revalidateTag`/`revalidatePath`
 * calls — those APIs require a live server (Node runtime, Vercel, or
 * an ISR-capable edge adapter). Cloudflare Pages here is serving the
 * plain contents of ./out — pure static files, no Next.js runtime.
 *
 * So the `next: { revalidate, tags }` options below are effectively
 * inert in THIS deployment. I'm still wiring them up correctly for
 * two reasons:
 *   1. It documents the intended freshness policy in code, next to
 *      the fetch it applies to, instead of only living in someone's
 *      head.
 *   2. If this project ever drops `output: 'export'` (e.g. moves to
 *      @cloudflare/next-on-pages, which gives Cloudflare Pages a real
 *      Next.js server runtime with ISR support), these options start
 *      working with zero code changes.
 *
 * Until that migration, the thing that actually determines "how
 * fresh is this data" is the CI/CD rebuild cadence — see the
 * `schedule:` trigger added to deploy-dev.yml.
 */
const STANDARD_LIBRARY_REVALIDATE_SECONDS = 60 * 60 * 6; // 6 hours

async function fetchSection<T>(
  resource: string,
  staticFallback: T[],
  tag: string
): Promise<T[]> {
  if (!JSON_SERVER_URL) return staticFallback;

  try {
    const res = await fetch(`${JSON_SERVER_URL}/${resource}`, {
      next: {
        revalidate: STANDARD_LIBRARY_REVALIDATE_SECONDS,
        tags: [tag],
      },
    });
    if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : staticFallback;
  } catch (error) {
    console.error(`Failed to load ${resource} from JSON_SERVER_URL, falling back to static data`, error);
    return staticFallback;
  }
}

/**
 * ── Draft Mode (Goal 6) ────────────────────────────────────────────
 *
 * `published: false` on a Standard Code marks it as not-yet-public.
 * By default this function filters those out — same behavior for
 * every visitor, whether they're on the static production build or
 * hitting a live json-server backend in dev.
 *
 * `includeUnpublished` is the one place that check gets skipped, and
 * it is only ever passed `true` from page.tsx after page.tsx itself
 * has confirmed `draftMode().isEnabled` — i.e. after the visitor
 * proved they hold the __prerender_bypass cookie. This function has
 * no cookie/session awareness of its own; it trusts its caller, which
 * is exactly why page.tsx (a Server Component, not client code) is
 * what makes that call.
 */
export async function getStandardCodesServer(
  { includeUnpublished = false }: { includeUnpublished?: boolean } = {}
): Promise<StandardCode[]> {
  const codes = await fetchSection<StandardCode>(
    'standardCodes',
    staticData.standardCodes ?? [],
    'standard-codes'
  );
  return includeUnpublished ? codes : codes.filter((code) => code.published !== false);
}

export async function getPublicationsServer(): Promise<Publication[]> {
  return fetchSection<Publication>('publications', staticData.publications ?? [], 'publications');
}

export async function getNewslettersServer(): Promise<Newsletter[]> {
  return fetchSection<Newsletter>('newsletters', staticData.newsletters ?? [], 'newsletters');
}

export async function getCuratedPapersServer(): Promise<CuratedPaper[]> {
  return fetchSection<CuratedPaper>('curatedPapers', staticData.curatedPapers ?? [], 'curated-papers');
}

export async function getDownloadsServer(): Promise<DownloadItem[]> {
  return fetchSection<DownloadItem>('downloads', staticData.downloads ?? [], 'downloads');
}

export async function getAllELibrarySections(
  { includeUnpublished = false }: { includeUnpublished?: boolean } = {}
) {
  const [standardCodes, publications, newsletters, curatedPapers, downloads] = await Promise.all([
    getStandardCodesServer({ includeUnpublished }),
    getPublicationsServer(),
    getNewslettersServer(),
    getCuratedPapersServer(),
    getDownloadsServer(),
  ]);
  return { standardCodes, publications, newsletters, curatedPapers, downloads };
}