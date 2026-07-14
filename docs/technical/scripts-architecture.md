# scripts/ Folder & Parsers: Architecture and Lifecycle

This document explains the structure and role of the `scripts/` folder in the NS Engineering Website project, detailing how each script and parser is used throughout the application lifecycle. It also provides a visual/textual flow of the content pipeline and how scripts interconnect.

---

## 1. Overview: What is the `scripts/` Folder?

The `scripts/` folder contains all build-time logic for content ingestion, transformation, validation, and static asset generation. It is the backbone of the content pipeline, ensuring that data from Google Sheets (or CSV fallback) is parsed, validated, and output as strongly-typed JSON for the Next.js UI.

**Key Responsibilities:**
- Fetching data from Google Sheets or CSV
- Parsing and validating content
- Exporting Sheets to CSV for version control
- Generating static assets (JSON, redirects, sitemap)
- Validating and copying media files
- Handling Cloudflare R2 CDN integration

---

## 2. High-Level Flow

```
Google Sheets
    │
    ▼
(scripts/parsers/google-sheets-parser.ts)
    │
    ▼
(scripts/parsers/data-source.ts)
    │
    ▼
(scripts/parsers/*-parser.ts)
    │
    ▼
(scripts/build-content.ts)
    │
    ├─> src/data/generated/*.json (for UI)
    ├─> content/*.csv (for Git)
    └─> public/ (media, redirects, sitemap)
```

---

## 3. Main Scripts

### build-content.ts
- **Purpose:** Orchestrates the entire build process.
- **What it does:**
  - Calls all content parsers (projects, team, services, elibrary, etc.)
  - Validates and copies media files
  - Exports Sheets to CSV if in cloud mode
  - Generates all JSON files for the UI
  - Triggers sitemap and redirect generation

### generate-redirects.ts
- **Purpose:** Generates static HTML redirect pages for legacy URLs.
- **What it does:**
  - Reads redirect rules from `src/data/redirects.ts`
  - Outputs HTML files in `public/` for SEO-friendly redirects

### generate-sitemap.ts
- **Purpose:** Generates `sitemap.xml` for SEO.
- **What it does:**
  - Aggregates all site URLs (static, services, projects, etc.)
  - Outputs `public/sitemap.xml`

---

## 4. Parsers: scripts/parsers/

Each parser is responsible for a specific content type. All follow a similar pattern:
- Fetch data (Sheets or CSV) via `data-source.ts`
- Validate and transform to TypeScript types
- Handle media (images, PDFs) if needed
- Output JSON for the UI

### Core Parsers
- **project-parser.ts**: Projects (with categories, media, GPS)
- **team-parser.ts**: Team members (featured, images, LinkedIn)
- **services-parser.ts**: Services and categories (with images)
- **elibrary-parser.ts**: eLibrary sections (standards, publications, curated papers, downloads, newsletters)
- **faq-parser.ts**: FAQs and categories
- **alumni-parser.ts**: Alumni profiles (with images)
- **category-parser.ts**: Project/service categories
- **company-info-parser.ts**: Company details
- **rotating-metrics-parser.ts**: Homepage metrics
- **hero-carousel-parser.ts**: Homepage hero images
- **milestone-parser.ts**: Homepage milestones

### Utility Parsers & Helpers
- **csv-parser.ts**: Low-level CSV parsing utilities
- **csv-exporter.ts**: Exports Sheets → CSV for Git
- **data-source.ts**: Unified fetch (Sheets or CSV fallback)
- **google-sheets-parser.ts**: Google Sheets API client
- **validate-media.ts**: Checks/copies media files
- **seo-generator.ts**: Auto-generates SEO metadata
- **r2-client.ts**: Cloudflare R2 S3 client for media
- **r2-utils.ts**: R2 mode detection, URL helpers

---

## 5. Content Pipeline: Step-by-Step

1. **Data Fetching**
   - `data-source.ts` calls `google-sheets-parser.ts` if cloud mode, else reads CSV.
   - All content parsers use `fetchDataWithFallback()` for robust data access.

2. **Parsing & Validation**
   - Each `*-parser.ts` validates required fields, types, and formats (e.g., kebab-case IDs, valid dates).
   - Media files are checked (existence, correct path) and copied if needed.

3. **Export & Output**
   - `csv-exporter.ts` writes Sheets data to CSV for Git tracking.
   - Parsers output JSON to `src/data/generated/` for the UI.
   - Media is copied to `public/` or uploaded to R2 CDN.

4. **SEO & Static Assets**
   - `seo-generator.ts` creates SEO metadata (schema.org, meta tags) from content.
   - `generate-sitemap.ts` and `generate-redirects.ts` create supporting static files.

---

## 6. Visual: Content Build Lifecycle

```
+-------------------+
| Google Sheets/CSV |
+-------------------+
         │
         ▼
+---------------------+
| data-source.ts      |  (fetchDataWithFallback)
+---------------------+
         │
         ▼
+---------------------+
| [content]-parser.ts |  (validate, transform, media)
+---------------------+
         │
         ▼
+---------------------+
| build-content.ts    |  (orchestrate all parsers)
+---------------------+
         │
         ▼
+---------------------+
| src/data/generated/ |  (JSON for UI)
+---------------------+
         │
         ▼
+---------------------+
| public/             |  (media, sitemap, redirects)
+---------------------+
```

---

## 7. R2 CDN Integration
- **r2-client.ts**: S3-compatible client for listing/uploading media to Cloudflare R2.
- **r2-utils.ts**: Detects R2 mode, constructs CDN URLs, validates config.
- All media references in JSON are swapped to R2 URLs if enabled.

---

## 8. Summary Table

| Script/Parser              | Role / Output                        |
|---------------------------|--------------------------------------|
| build-content.ts           | Orchestrates full build, all parsers |
| generate-redirects.ts      | Static HTML redirects (SEO)          |
| generate-sitemap.ts        | sitemap.xml for SEO                  |
| project-parser.ts          | Projects JSON, media validation      |
| team-parser.ts             | Team JSON, images, LinkedIn          |
| services-parser.ts         | Services JSON, images                |
| elibrary-parser.ts         | eLibrary JSON (5 sections)           |
| faq-parser.ts              | FAQ JSON, categories                 |
| alumni-parser.ts           | Alumni JSON, images                  |
| category-parser.ts         | Categories JSON                      |
| company-info-parser.ts     | Company info JSON                    |
| rotating-metrics-parser.ts | Homepage metrics JSON                |
| hero-carousel-parser.ts    | Hero images JSON                     |
| milestone-parser.ts        | Milestones JSON                      |
| csv-parser.ts              | CSV parsing utilities                |
| csv-exporter.ts            | Sheets → CSV for Git                 |
| data-source.ts             | Unified fetch (Sheets/CSV)           |
| google-sheets-parser.ts    | Sheets API client                    |
| validate-media.ts          | Media validation/copy                |
| seo-generator.ts           | SEO metadata generation              |
| r2-client.ts               | R2 S3 client for media               |
| r2-utils.ts                | R2 mode detection, URL helpers       |

---

## 9. How to Extend
- Add a new parser in `parsers/` for new content types.
- Register it in `build-content.ts` for orchestration.
- Use `fetchDataWithFallback()` for robust data access.
- Validate, transform, and output JSON as needed.

---

**This architecture ensures all content is robust, versioned, and ready for static export and CDN delivery.**
