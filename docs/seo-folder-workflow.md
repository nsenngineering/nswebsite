# SEO Folder Workflow and Improvements

## Overview
The `src/lib/seo` folder contains the SEO utility and schema generation logic used by your Next.js app. It is responsible for:
- generating page metadata for Next.js `metadata` export
- producing structured data JSON-LD for AI/SEO optimization
- mapping team member specializations to service schema references

## Files and Responsibilities

### `dynamic-metadata.ts`
- Contains page metadata generators for pages such as `/about`, `/services`, `/projects`, `/team`, `/faq`, `/alumni`, `/careers`, `/contact`, `/elibrary`, `/privacy`, and `/terms`.
- Imports generated JSON data from `@/data/generated/*.json` to compute dynamic counts and metadata text.
- Uses `generatePageMetadata()` from `metadata-helpers.ts` as a shared builder.

### `metadata-helpers.ts`
- Centralizes page metadata construction.
- Builds canonical URLs, Open Graph tags, Twitter cards, robots settings, and page titles.
- Uses `siteConfig.url` from `@/data/site-config` and the Next `Metadata` type.

### `schema-generators.ts`
- Defines reusable JSON-LD schema generators.
- Includes:
  - `generateOrganizationSchema()`
  - `generateLocalBusinessSchema()`
  - `generateBreadcrumbSchema()`
  - `generateServiceSchema()`
  - `generateServiceListSchema()`
  - `generateProjectListSchema()`
  - `generateFAQPageSchema()`
  - `generateJobPostingSchema()`
  - `generatePersonSchema()`
  - `generateDefinedTermSchema()`
- Powers page-level SEO components and page markup in `/app/*` pages.

### `team-service-mapper.ts`
- Maps team member specialization strings to service IDs.
- Converts service IDs into `@id` references for Person schema `knowsAbout`.
- Enables smarter schema linking between team expertise and services.

## Current Workflow
1. Content is authored in Google Sheets / CSV and parsed into generated JSON files.
2. Page files in `src/app/*/page.tsx` import functions from `src/lib/seo/dynamic-metadata.ts` for `metadata`.
3. When a page renders, Next.js uses the generated metadata object.
4. Page components also import schema generators from `src/lib/seo/schema-generators.ts` and render JSON-LD via dedicated SEO components.
5. `team-service-mapper.ts` enriches person schema by linking specializations to service IDs.

## Strengths
- Single source of truth for metadata creation via `metadata-helpers.ts`.
- Dynamic metadata reacts to actual content counts in generated JSON.
- Good structured data coverage: Organization, LocalBusiness, FAQPage, ServiceList, ProjectList, Person, DefinedTerm.
- AI-friendly schema linking between team members and services.
- Clear separation between metadata generation and schema generation.

## Recommended Improvements

### 1. Fix misleading metadata wording
- In `generateAboutMetadata()`, the code currently uses the highest single experience value as `teamYears` but describes it like combined experience.
- Improvement: compute true total or average experience, or reword the description to match the data.

### 2. Add a folder index export
- Create `src/lib/seo/index.ts` to export all helper functions.
- Benefit: easier imports like `import { generateAboutMetadata } from '@/lib/seo';`

### 3. Add stronger TS types and schema return types
- Define shared SEO/schema interfaces in `src/lib/seo/types.ts`.
- Type `generatePageMetadata()` more strictly and add return types for all JSON-LD functions.
- Use `Metadata['openGraph']` and `Metadata['twitter']` typed shapes if possible.

### 4. Improve `generatePageMetadata()` behavior
- Use `keywords` as `string[]` instead of `keywords?.join(', ')` unless required by Next.
- Add `twitter.site` and `twitter.creator` if you have official social handles.
- Expose optional `image` and `type` parameters more cleanly.
- Consider adding `metadataBase: new URL(siteConfig.url)` at app root with Next config if not already done.

### 5. Add schema helper utilities
- Add reusable helpers for:
  - location/address normalization
  - `@id` generation
  - `listItem` building
- This reduces duplication in `generateServiceListSchema()` and `generateProjectListSchema()`.

### 6. Extend schema richness
- Add `mainEntityOfPage` or `url` to Page-level schemas when appropriate.
- Add `review` / `aggregateRating` if you ever have testimonials or ratings data.
- Add `sameAs` with company social links to `generateLocalBusinessSchema()` and `generateOrganizationSchema()`.
- Add `BreadcrumbList` more consistently to more pages.

### 7. Make schema generation more data-driven
- Use actual generated service IDs and project coordinates from content instead of inferred or fallback values.
- Ensure `generateProjectListSchema()` has valid `locationCreated` and `spatialCoverage` only when coordinates exist.
- Validate `term.relatedServiceId` references so broken service IDs cannot be emitted.

### 8. Add tests for mapping logic
- Add unit tests for `team-service-mapper.ts`, especially fuzzy matching and fallback behavior.
- Add tests for JSON-LD output shapes in `schema-generators.ts`.

### 9. Add documentation for SEO folder usage
- This new markdown file should be a starting point.
- Add a short section in `docs/README.md` or `docs/technical/` linking to it.
 
## Practical Next Steps
1. Create `src/lib/seo/index.ts`.
2. Correct the experience count wording in `generateAboutMetadata()`.
3. Add type definitions for SEO schema outputs.
4. Add `twitter.site` / `twitter.creator`, `sameAs`, and breadcrumb schema support.
5. Add a unit test suite for SEO helpers.

## File Created
- `docs/seo-folder-workflow.md`

This document captures the current folder behavior and suggests improvements that keep the folder maintainable, type-safe, and more SEO-effective.
