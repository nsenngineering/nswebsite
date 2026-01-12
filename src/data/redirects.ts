/**
 * URL Redirect Mapping (WordPress → Next.js)
 *
 * This file maps old WordPress URLs to new Next.js URLs.
 * Used for SEO-friendly client-side redirects during site migration.
 */

export interface RedirectRule {
  from: string;        // Old WordPress path (without domain)
  to: string;          // New Next.js path (without domain)
  type: 'permanent';   // 301 equivalent
  reason: string;      // Documentation
}

export const redirectRules: RedirectRule[] = [
  // High Priority - Page Structure Changes
  {
    from: '/career/',
    to: '/careers/',
    type: 'permanent',
    reason: 'URL standardization: singular → plural',
  },
  {
    from: '/career',
    to: '/careers/',
    type: 'permanent',
    reason: 'URL standardization: singular → plural (no trailing slash)',
  },
  {
    from: '/downloads/',
    to: '/elibrary/',
    type: 'permanent',
    reason: 'Rebrand: downloads → eLibrary',
  },
  {
    from: '/downloads',
    to: '/elibrary/',
    type: 'permanent',
    reason: 'Rebrand: downloads → eLibrary (no trailing slash)',
  },
  {
    from: '/gallery/',
    to: '/projects/',
    type: 'permanent',
    reason: 'Concept change: gallery → projects',
  },
  {
    from: '/gallery',
    to: '/projects/',
    type: 'permanent',
    reason: 'Concept change: gallery → projects (no trailing slash)',
  },
  {
    from: '/gallery-6/',
    to: '/projects/',
    type: 'permanent',
    reason: 'Ongoing projects merged into main projects page',
  },
  {
    from: '/gallery-6',
    to: '/projects/',
    type: 'permanent',
    reason: 'Ongoing projects merged (no trailing slash)',
  },

  // Medium Priority - Individual Test Pages → Services
  {
    from: '/triaxial-shear-test/',
    to: '/services/#triaxial-test',
    type: 'permanent',
    reason: 'Individual test page → Services section anchor',
  },
  {
    from: '/triaxial-shear-test',
    to: '/services/#triaxial-test',
    type: 'permanent',
    reason: 'Individual test page → Services section (no trailing slash)',
  },
  {
    from: '/point-load-test/',
    to: '/services/#point-load-test',
    type: 'permanent',
    reason: 'Individual test page → Services section anchor',
  },
  {
    from: '/point-load-test',
    to: '/services/#point-load-test',
    type: 'permanent',
    reason: 'Individual test page → Services section (no trailing slash)',
  },
  {
    from: '/pile-foundation-test-plans/',
    to: '/services/#pda-testing',
    type: 'permanent',
    reason: 'Pile testing → PDA service section',
  },
  {
    from: '/pile-foundation-test-plans',
    to: '/services/#pda-testing',
    type: 'permanent',
    reason: 'Pile testing → PDA service (no trailing slash)',
  },

  // Low Priority - No Exact Match (Generic Redirect)
  {
    from: '/atterbergs-limit-test/',
    to: '/services/',
    type: 'permanent',
    reason: 'Test page → Services (no specific anchor)',
  },
  {
    from: '/atterbergs-limit-test',
    to: '/services/',
    type: 'permanent',
    reason: 'Test page → Services (no trailing slash)',
  },
  {
    from: '/physical-test-of-cement/',
    to: '/services/',
    type: 'permanent',
    reason: 'Test page → Services (no specific anchor)',
  },
  {
    from: '/physical-test-of-cement',
    to: '/services/',
    type: 'permanent',
    reason: 'Test page → Services (no trailing slash)',
  },

  // Additional - Certification Page
  {
    from: '/certification/',
    to: '/about/',
    type: 'permanent',
    reason: 'Certification info now on About page',
  },
  {
    from: '/certification',
    to: '/about/',
    type: 'permanent',
    reason: 'Certification info now on About page (no trailing slash)',
  },
];

/**
 * Find redirect for a given path
 * @param path - The path to check (e.g., "/career/" or "/career")
 * @returns The redirect target URL, or null if no redirect found
 */
export function findRedirect(path: string): string | null {
  // Normalize path (ensure leading slash)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const rule = redirectRules.find(r => r.from === normalizedPath);
  return rule ? rule.to : null;
}
