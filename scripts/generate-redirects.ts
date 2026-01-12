/**
 * Generate Redirect Pages
 *
 * Creates static HTML redirect pages for all old WordPress URLs.
 * Run: npm run generate:redirects
 */

import fs from 'fs-extra';
import path from 'path';
import { redirectRules } from '../src/data/redirects';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const BASE_URL = 'https://www.nsengineering.com.np';

/**
 * Generate redirect HTML content
 */
function generateRedirectHTML(to: string, from: string): string {
  const fullNewUrl = `${BASE_URL}${to}`;
  const title = `Redirecting to ${to.replace('/', ' ').trim()}...`;
  const displayName = to.split('#')[0].replace(/\//g, ' ').trim() || 'new page';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Canonical URL points to new location -->
  <link rel="canonical" href="${fullNewUrl}">

  <!-- Meta refresh for SEO-friendly redirect (treated as 301 by Google) -->
  <meta http-equiv="refresh" content="0; url=${to}">

  <title>${title}</title>

  <!-- Prevent indexing of redirect page -->
  <meta name="robots" content="noindex, nofollow">

  <!-- JavaScript redirect fallback -->
  <script>
    window.location.replace('${to}');
  </script>

  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
    }
    .redirect-message {
      text-align: center;
      padding: 2rem;
      max-width: 600px;
    }
    .spinner {
      border: 4px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top: 4px solid white;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 1rem auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    a {
      color: #dbeafe;
      text-decoration: underline;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="redirect-message">
    <div class="spinner"></div>
    <h1>Page Moved</h1>
    <p>This page has moved to <a href="${to}">${displayName}</a>.</p>
    <p>You will be redirected automatically in a moment...</p>
    <p style="font-size: 0.875rem; margin-top: 2rem; opacity: 0.8;">
      If you are not redirected, <a href="${to}">click here</a>.
    </p>
  </div>

  <!-- Noscript fallback -->
  <noscript>
    <meta http-equiv="refresh" content="0; url=${to}">
  </noscript>
</body>
</html>`;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Generating redirect pages...\n');

  // Track unique redirect pages (avoid duplicates from trailing slash variants)
  const processedPaths = new Set<string>();
  let created = 0;

  for (const rule of redirectRules) {
    // Normalize path (remove trailing slash for directory creation)
    const normalizedFrom = rule.from.replace(/\/$/, '');

    if (processedPaths.has(normalizedFrom)) {
      continue; // Skip duplicate
    }
    processedPaths.add(normalizedFrom);

    // Create directory in public/
    const dirPath = path.join(PUBLIC_DIR, normalizedFrom);
    await fs.ensureDir(dirPath);

    // Generate HTML content
    const htmlContent = generateRedirectHTML(rule.to, rule.from);

    // Write index.html
    const filePath = path.join(dirPath, 'index.html');
    await fs.writeFile(filePath, htmlContent, 'utf-8');

    console.log(`✅ Created: ${normalizedFrom}/index.html → ${rule.to}`);
    created++;
  }

  console.log(`\n✨ Successfully generated ${created} redirect pages!`);
  console.log('\n📋 Redirect Summary:');
  console.log('   - Career pages: /career/ → /careers/');
  console.log('   - Downloads: /downloads/ → /elibrary/');
  console.log('   - Gallery pages: /gallery/ & /gallery-6/ → /projects/');
  console.log('   - Test pages: → /services/ (with anchors)');
  console.log('   - Certification: /certification/ → /about/');
}

main().catch(console.error);
