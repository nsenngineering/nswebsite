# eLibrary Management Guide

## Overview

The eLibrary is a CSV-based content management system with **five specialized sections** for managing different types of technical content. Each section has its own CSV file with specific fields tailored to that content type.

## Quick Reference

### Five Section Types

1. **Standard Codes** - External links to industry standards (ASTM, ISO, BS, etc.)
2. **Publications** - Internal technical papers and research PDFs
3. **Curated Papers** - External links to recommended research papers
4. **Downloads** - Company materials (brochures, forms, manuals)
5. **Newsletters** - Quarterly company newsletters

### File Locations

```
content/elibrary/
├── standard-codes.csv       # External standard links
├── publications.csv         # Technical papers (internal PDFs)
├── curated-papers.csv       # Research paper links
├── downloads.csv            # Company materials (internal files)
├── newsletters.csv          # Company newsletters (internal PDFs)
└── sections.csv            # Section metadata

Generated output: src/data/generated/elibrary.json
```

---

## Section 1: Standard Codes

External links to industry standards and testing protocols.

### CSV Structure

**File:** `content/elibrary/standard-codes.csv`

**Columns:**
```csv
id,title,externalUrl,organization,category,tags,featured,dateAdded
```

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | Unique kebab-case identifier | `astm-d4945` |
| `title` | string | ✅ Yes | Standard title | `ASTM D4945: High-Strain Dynamic Testing` |
| `externalUrl` | string | ✅ Yes | URL to standard on official website | `https://www.astm.org/Standards/D4945.htm` |
| `organization` | string | ❌ No | Publishing organization | `ASTM International` |
| `category` | string | ❌ No | Classification | `Pile Testing` |
| `tags` | string | ❌ No | Semicolon-separated keywords | `pile testing;standards;astm` |
| `featured` | boolean | ❌ No | Feature prominently (TRUE/FALSE) | `TRUE` |
| `dateAdded` | string | ✅ Yes | Date added (YYYY-MM-DD) | `2023-06-15` |

### Example Entry

```csv
astm-d4945,ASTM D4945: Standard Test Method for High-Strain Dynamic Testing,https://www.astm.org/Standards/D4945.htm,ASTM International,Pile Testing,pile testing;standards;astm,TRUE,2023-06-15
```

### Standard URLs

Since direct standard documents require paid subscriptions, link to the **organization's search/catalog page**:

- **ASTM**: `https://www.astm.org/Standards/{standard-number}.htm`
- **ISO**: `https://www.iso.org/standard/{id}.html`
- **BS**: `https://shop.bsigroup.com/ProductDetail/?pid={id}`

---

## Section 2: Publications

Internal technical papers, case studies, and research with downloadable PDFs.

### CSV Structure

**File:** `content/elibrary/publications.csv`

**Columns:**
```csv
id,title,description,fileUrl,author,publishDate,category,tags,featured
```

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | Unique kebab-case identifier | `case-study-ktft` |
| `title` | string | ✅ Yes | Publication title | `KTFT Project: PDA Testing Case Study` |
| `description` | string | ✅ Yes | Brief description (1-2 sentences) | `Comprehensive case study documenting...` |
| `fileUrl` | string | ✅ Yes | PDF filename | `ktft-case-study.pdf` |
| `author` | string | ❌ No | Author name(s) | `NS Engineering` |
| `publishDate` | string | ✅ Yes | Publication date (YYYY-MM-DD) | `2024-09-15` |
| `category` | string | ❌ No | Classification | `Case Studies` |
| `tags` | string | ❌ No | Semicolon-separated keywords | `case studies;pile testing;pda` |
| `featured` | boolean | ❌ No | Feature prominently (TRUE/FALSE) | `TRUE` |

### Example Entry

```csv
case-study-ktft,KTFT Project: PDA Testing Case Study,Comprehensive case study documenting 50 PDA tests on KTFT highway project,ktft-case-study.pdf,NS Engineering,2024-09-15,Case Studies,case studies;pile testing;pda,TRUE
```

### File Organization

Place PDF files in: `content/elibrary/publications/{id}/{filename}.pdf`

**Example:**
```
content/elibrary/publications/case-study-ktft/ktft-case-study.pdf
```

---

## Section 3: Curated Papers

External links to recommended research papers with optional custom icons.

### CSV Structure

**File:** `content/elibrary/curated-papers.csv`

**Columns:**
```csv
id,title,externalUrl,icon,source,category,tags,dateAdded
```

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | Unique kebab-case identifier | `seismic-design-nepal` |
| `title` | string | ✅ Yes | Paper title | `Seismic Design Guidelines for Nepal` |
| `externalUrl` | string | ✅ Yes | URL to paper | `https://doi.org/10.1234/example` |
| `icon` | string | ❌ No | Lucide icon name (defaults to ExternalLink) | `FileBarChart` |
| `source` | string | ❌ No | Publication source | `Journal of Geotechnical Engineering` |
| `category` | string | ❌ No | Classification | `Seismic` |
| `tags` | string | ❌ No | Semicolon-separated keywords | `seismic;design;nepal` |
| `dateAdded` | string | ✅ Yes | Date added (YYYY-MM-DD) | `2024-01-15` |

### Example Entry

```csv
seismic-design-nepal,Seismic Design Guidelines for Nepal,https://doi.org/10.1234/example,FileBarChart,Journal of Geotechnical Engineering,Seismic,seismic;design;nepal,2024-01-15
```

### Available Icons

Common Lucide icons: `FileBarChart`, `Globe`, `BookOpen`, `Lightbulb`, `FileText`, `ExternalLink`

---

## Section 4: Downloads

Company materials like brochures, forms, manuals, and resources.

### CSV Structure

**File:** `content/elibrary/downloads.csv`

**Columns:**
```csv
id,title,fileUrl,description,category,fileType,fileSize,dateAdded
```

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | Unique kebab-case identifier | `company-brochure` |
| `title` | string | ✅ Yes | File title | `NS Engineering Company Brochure` |
| `fileUrl` | string | ✅ Yes | Filename | `brochure-2024.pdf` |
| `description` | string | ❌ No | Brief description | `Latest company brochure with services...` |
| `category` | string | ❌ No | Classification | `Marketing Materials` |
| `fileType` | string | ❌ No | Auto-detected from extension | `PDF` |
| `fileSize` | string | ❌ No | Auto-calculated if file exists | `2.5 MB` |
| `dateAdded` | string | ✅ Yes | Date added (YYYY-MM-DD) | `2024-10-01` |

### Example Entry

```csv
company-brochure,NS Engineering Company Brochure,brochure-2024.pdf,Latest company brochure with services and capabilities,Marketing Materials,PDF,2.5 MB,2024-10-01
```

### File Organization

Place files in: `content/elibrary/downloads/{id}/{filename}`

**Example:**
```
content/elibrary/downloads/company-brochure/brochure-2024.pdf
```

---

## Section 5: Newsletters

Quarterly company newsletters and updates.

### CSV Structure

**File:** `content/elibrary/newsletters.csv`

**Columns:**
```csv
id,title,fileUrl,description,publishDate,quarter,tags,featured
```

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | Unique kebab-case identifier | `newsletter-2024-q3` |
| `title` | string | ✅ Yes | Newsletter title | `Quarterly Newsletter - Q3 2024` |
| `fileUrl` | string | ✅ Yes | Filename | `newsletter-q3-2024.pdf` |
| `description` | string | ❌ No | Brief summary | `Project highlights and team updates...` |
| `publishDate` | string | ✅ Yes | Publication date (YYYY-MM-DD) | `2024-10-01` |
| `quarter` | string | ❌ No | Quarter label | `Q3 2024` |
| `tags` | string | ❌ No | Semicolon-separated keywords | `newsletter;projects;updates` |
| `featured` | boolean | ❌ No | Feature prominently (TRUE/FALSE) | `FALSE` |

### Example Entry

```csv
newsletter-2024-q3,Quarterly Newsletter - Q3 2024,newsletter-q3-2024.pdf,Project highlights and team updates for Q3 2024,2024-10-01,Q3 2024,newsletter;projects,FALSE
```

### File Organization

Place PDF files in: `content/elibrary/newsletters/{id}/{filename}.pdf`

**Example:**
```
content/elibrary/newsletters/newsletter-2024-q3/newsletter-q3-2024.pdf
```

---

## Section Metadata

### Editing Sections

**File:** `content/elibrary/sections.csv`

**Columns:**
```csv
id,label,description,icon,order,emptyMessage
```

### Current Sections

```csv
standard-codes,Standard Codes,Links to industry standards and testing protocols,FileText,1,No standards available yet
publications,Publications,Technical papers and research from our team,BookOpen,2,No publications available yet
curated-papers,Curated Papers,Recommended research papers and technical articles,Lightbulb,3,No curated papers available yet
downloads,Downloads,Downloadable resources and company materials,Download,4,No downloads available yet
newsletters,Newsletters,Company newsletters with project updates,Newspaper,5,No newsletters available yet
```

### Available Icons

- `FileText` - Standard Codes
- `BookOpen` - Publications
- `Lightbulb` - Curated Papers
- `Download` - Downloads
- `Newspaper` - Newsletters

---

## Common Tasks

### Adding a New Standard

1. **Add CSV entry** to `content/elibrary/standard-codes.csv`:
```csv
iso-22477-1,ISO 22477-1: Geotechnical Investigation and Testing,https://www.iso.org/standard/57728.html,ISO,Pile Testing,pile testing;standards;iso,TRUE,2023-03-10
```

2. **Build content:**
```bash
npm run build:content:local
```

3. **Verify** at http://localhost:3000/elibrary

### Adding a New Publication

1. **Create file structure:**
```bash
mkdir -p content/elibrary/publications/liquefaction-paper
```

2. **Add PDF:**
```bash
cp ~/Downloads/liquefaction.pdf content/elibrary/publications/liquefaction-paper/liquefaction-paper.pdf
```

3. **Add CSV entry** to `content/elibrary/publications.csv`:
```csv
liquefaction-paper,Liquefaction Assessment in Kathmandu Valley,Technical paper examining liquefaction susceptibility based on field investigation,liquefaction-paper.pdf,Dr. Suman Panthi,2024-06-20,Research,liquefaction;research;kathmandu,FALSE
```

4. **Build and verify:**
```bash
npm run build:content:local
npm run dev
```

### Adding a Newsletter

1. **Create file structure:**
```bash
mkdir -p content/elibrary/newsletters/newsletter-2024-q4
```

2. **Add PDF:**
```bash
cp ~/Downloads/q4-newsletter.pdf content/elibrary/newsletters/newsletter-2024-q4/newsletter-q4-2024.pdf
```

3. **Add CSV entry** to `content/elibrary/newsletters.csv`:
```csv
newsletter-2024-q4,Quarterly Newsletter - Q4 2024,newsletter-q4-2024.pdf,Year-end highlights and major project completions,2024-12-20,Q4 2024,newsletter;projects;2024,TRUE
```

4. **Build and verify:**
```bash
npm run build:content:local
```

---

## Validation Rules

### Document IDs (All Sections)

**Valid (kebab-case):**
- ✅ `astm-d4945`
- ✅ `case-study-ktft-2024`
- ✅ `newsletter-q1-2024`

**Invalid:**
- ❌ `ASTM D4945` (uppercase, spaces)
- ❌ `case_study_ktft` (underscores)
- ❌ `my.document.pdf` (dots, extensions)

### Date Format

Always use **ISO 8601**: `YYYY-MM-DD`

- ✅ `2024-06-15`
- ✅ `2023-01-01`
- ❌ `06/15/2024` (US format)
- ❌ `15-06-2024` (EU format)

### Tags

**Format:** Lowercase, semicolon-separated, no spaces around semicolons

- ✅ `pile testing;standards;astm;dynamic testing`
- ❌ `Pile Testing; Standards; ASTM` (uppercase, spaces)

### Boolean Values

Use `TRUE` or `FALSE` (case-insensitive)

- ✅ `TRUE`, `FALSE`
- ✅ `true`, `false`
- ❌ `yes`, `no`, `1`, `0`

---

## Build Process

### Build Commands

```bash
# Local mode (CSV files only)
npm run build:content:local

# Cloud mode (Google Sheets + CSV export)
npm run build:content:cloud
```

### What Happens During Build

1. ✅ Fetches data from 5 CSV files (or Google Sheets in cloud mode)
2. ✅ Parses and validates each section
3. ✅ Checks file URLs and validates external links
4. ✅ Auto-detects file types and sizes
5. ✅ Generates unified JSON: `src/data/generated/elibrary.json`
6. ✅ Reports counts and errors

### Example Output

```
📚 Building eLibrary...
✅ Successfully parsed 4 standard codes
✅ Successfully parsed 5 publications
✅ Successfully parsed 0 curated papers
✅ Successfully parsed 0 downloads
✅ Successfully parsed 3 newsletters

📊 eLibrary Summary:
   Total items: 12
   Sections:
      Standard Codes: 4
      Publications: 5
      Curated Papers: 0
      Downloads: 0
      Newsletters: 3
   Featured items: 4
```

---

## Troubleshooting

### Error: "Invalid item ID format"

**Fix:** Use kebab-case (lowercase with hyphens)

### Error: "Invalid URL format"

**Fix:** Ensure URLs start with `http://` or `https://`

### Error: "Invalid date format"

**Fix:** Use YYYY-MM-DD format

### Error: "Duplicate item ID"

**Fix:** Each ID must be unique within its CSV file

### Warning: "No file found"

**Fix:** Ensure PDF exists at the specified path

---

## Best Practices

### Content Organization

1. **Standard Codes**: Link to official organization pages
2. **Publications**: Include author and publish date for credibility
3. **Curated Papers**: Use descriptive source names
4. **Downloads**: Keep file sizes under 10MB for faster downloads
5. **Newsletters**: Use consistent naming (Q1/Q2/Q3/Q4 + Year)

### Tagging Strategy

- Use 3-5 tags per item
- Be specific but searchable
- Use consistent terminology
- Include year for time-sensitive content

### Featured Items

- Limit to 4-6 featured items per section
- Feature latest/most important content
- Review quarterly and update

### File Naming

- Use descriptive, kebab-case filenames
- Match filename to document ID when possible
- Avoid version numbers in filenames (update in place)

---

## Google Sheets Integration

### Tab Names

When using cloud mode (`npm run build:content:cloud`), create these tabs:

| CSV File | Google Sheet Tab |
|----------|------------------|
| `standard-codes.csv` | `StandardCodes` |
| `publications.csv` | `Publications` |
| `curated-papers.csv` | `CuratedPapers` |
| `downloads.csv` | `Downloads` |
| `newsletters.csv` | `Newsletters` |
| `sections.csv` | `ElibrarySections` |

### Syncing Process

1. Edit content in Google Sheets
2. Run `npm run build:content:cloud`
3. System exports Sheets → CSV files
4. Review changes: `git diff content/elibrary/`
5. Commit CSV changes: `git add content/elibrary/ && git commit`
6. Deploy

See [Content Workflow Guide](./content-workflow.md) for details.

---

## Migration from Old Structure

### Old vs New

**Old (deprecated):**
- Single `documents.csv` with all items
- 3 sections: standards, publications, newsletters
- All fields optional, confusing data model

**New (current):**
- 5 separate CSV files by content type
- Clear required/optional fields per section
- Type-specific validation

### Migration Steps

Old documents automatically migrated:
- Standards → Standard Codes (with URLs added)
- Publications → Publications (description extracted from summary)
- Newsletters → Newsletters (with quarter field added)

No action needed - migration completed during restructure.

---

## Need Help?

- Check build output for specific error messages
- Review examples in CSV files
- See [Content Workflow Guide](./content-workflow.md)
- Contact development team

---

**Last Updated:** December 24, 2024
**Version:** 2.0.0 (5-section restructure)
