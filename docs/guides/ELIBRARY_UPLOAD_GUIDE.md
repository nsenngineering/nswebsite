# eLibrary Upload Guide

**Status**: Active
**Last Updated**: 2026-01-16

---

## Overview

This guide explains how to upload PDFs to the eLibrary (Publications, Downloads, and Newsletters sections).

## File Structure (Flat Folders)

All eLibrary files use a **flat folder structure** where the PDF filename matches the item ID:

```
public/elibrary/          # Local development
├── publications/
│   ├── publication-id.pdf
│   ├── another-paper.pdf
│   └── research-study.pdf
├── downloads/
│   ├── company-brochure.pdf
│   └── technical-guide.pdf
└── newsletters/
    ├── newsletter-2024-q1.pdf
    └── newsletter-2024-q2.pdf

content/elibrary/         # Google Drive (production)
└── publications/
    ├── publication-id.pdf
    ├── another-paper.pdf
    └── research-study.pdf
```

**Benefits**:
- ✅ Simple: One folder per section
- ✅ Easy to manage: All PDFs in one place
- ✅ No nested folders: Filename = ID
- ✅ Works for both local and R2

---

## How to Upload Publications

### Option 1: Local Development (Testing)

1. **Place your PDF** in the flat folder:
   ```bash
   # Copy PDF to publications folder
   cp ~/Downloads/my-paper.pdf public/elibrary/publications/geotechnical-study-2024.pdf
   ```

2. **Add metadata** to CSV (`content/elibrary/publications.csv`):
   ```csv
   "geotechnical-study-2024","Geotechnical Investigation Study 2024","Comprehensive study of soil conditions in Kathmandu Valley","geotechnical-study-2024.pdf","NS Engineering","2024-12-15","Research","geotechnical;research;kathmandu","FALSE"
   ```

   **Note**: The `fileUrl` field can be omitted if the filename matches `{id}.pdf`:
   ```csv
   "geotechnical-study-2024","Geotechnical Investigation Study 2024","Comprehensive study...","","NS Engineering","2024-12-15",...
   ```
   The parser will automatically use `geotechnical-study-2024.pdf`.

3. **Build and test**:
   ```bash
   npm run build:content:local
   npm run dev:local
   # Visit http://localhost:3000/elibrary
   ```

### Option 2: Production (Google Drive + R2)

1. **Upload PDF to Google Drive**:
   - Navigate to: `content/elibrary/publications/`
   - Upload your PDF with ID as filename: `geotechnical-study-2024.pdf`

2. **Add metadata to Google Sheets**:
   - Open [NS Engineering Google Sheet](https://docs.google.com/spreadsheets/d/1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI/edit)
   - Go to **Publications** tab
   - Add new row:
     ```
     id: geotechnical-study-2024
     title: Geotechnical Investigation Study 2024
     description: Comprehensive study of soil conditions in Kathmandu Valley
     fileUrl: geotechnical-study-2024.pdf (or leave empty for auto-detection)
     author: NS Engineering
     publishDate: 2024-12-15
     category: Research
     tags: geotechnical;research;kathmandu
     featured: FALSE
     ```

3. **Deploy**:
   ```bash
   git push origin cloudflare
   ```

   GitHub Actions will automatically:
   - Sync PDF from Google Drive → Cloudflare R2
   - Export Google Sheets → CSV
   - Build website with R2 URLs

---

## CSV Format

### Publications

```csv
"id","title","description","fileUrl","author","publishDate","category","tags","featured"
```

**Fields**:
- `id` **(required)**: Kebab-case ID (e.g., `slope-stability-2024`)
- `title` **(required)**: Display title
- `description` **(required)**: Brief description (1-2 sentences)
- `fileUrl` **(optional)**: Filename (e.g., `slope-stability-2024.pdf`). If empty, uses `{id}.pdf`
- `author` (optional): Author name
- `publishDate` **(required)**: YYYY-MM-DD format
- `category` (optional): Category name (e.g., "Research", "Technical Guides")
- `tags` (optional): Semicolon-separated (e.g., `geotechnical;research;nepal`)
- `featured` (optional): TRUE or FALSE (default: FALSE)

### Downloads

```csv
"id","title","fileUrl","description","category","fileType","fileSize","tags","featured","dateAdded"
```

**Additional Fields**:
- `fileType` (optional): Auto-detected from extension if not provided
- `fileSize` (optional): Auto-detected if file exists locally

### Newsletters

```csv
"id","title","fileUrl","description","publishDate","quarter","tags","featured"
```

**Additional Fields**:
- `quarter` (optional): Quarter label (e.g., "Q1 2024")

---

## Naming Conventions

### ID Format

- **Lowercase only**: `my-publication`, not `My-Publication`
- **Kebab-case**: Use hyphens, not underscores or spaces
- **Descriptive**: Include topic and optionally year
- **Unique**: Must be unique across all publications

**Good Examples**:
```
slope-stability-manual-2024
pile-testing-case-study-ktft
liquefaction-assessment-kathmandu
masw-survey-best-practices
```

**Bad Examples**:
```
paper1                    # Not descriptive
Slope_Stability_Manual    # Not lowercase, uses underscores
slope stability manual    # Contains spaces
slope-stability-manual-2024-v2-final  # Too verbose
```

### Filename Format

**Recommended**: Match the ID exactly
```
{id}.pdf
```

**Example**:
- ID: `slope-stability-manual-2024`
- Filename: `slope-stability-manual-2024.pdf`

**Alternative**: Custom filename (must specify in `fileUrl` field)
```csv
"slope-stability-2024","Slope Stability Manual","...","custom-name.pdf",...
```

---

## Examples

### Example 1: Simple Publication

**File**: `public/elibrary/publications/triaxial-testing-guide.pdf`

**CSV**: `content/elibrary/publications.csv`
```csv
"triaxial-testing-guide","Triaxial Testing Guide","Comprehensive guide to triaxial testing procedures","","NS Engineering","2024-11-20","Technical Guides","triaxial;laboratory;testing","TRUE"
```

### Example 2: Publication with Custom Filename

**File**: `public/elibrary/publications/ktft-study.pdf`

**CSV**:
```csv
"ktft-pile-testing-2024","KTFT Pile Testing Case Study","50 PDA tests on KTFT project","ktft-study.pdf","Arun Kumar Pandit","2024-09-15","Case Studies","pile testing;pda;ktft","TRUE"
```

### Example 3: Newsletter

**File**: `public/elibrary/newsletters/newsletter-2024-q4.pdf`

**CSV**: `content/elibrary/newsletters.csv`
```csv
"newsletter-2024-q4","NS Engineering Newsletter - Q4 2024","Quarterly newsletter with project updates","newsletter-2024-q4.pdf","2024-12-31","Q4 2024","news;updates;quarterly","FALSE"
```

---

## Build Commands

### Local Development
```bash
# Build content from CSV
npm run build:content:local

# Build website
npm run build:local

# Test locally
npx serve@latest out
```

### Production Build
```bash
# Sync from Google Sheets + build
npm run build:content:cloud

# Full production build
npm run build:cloud
```

---

## File Paths in Code

The parser automatically constructs the correct path based on mode:

**Local Mode**:
```
/elibrary/publications/filename.pdf
```

**R2 Mode** (production):
```
https://pub-XXXXX.r2.dev/elibrary/publications/filename.pdf
```

**Parser Logic** (`scripts/parsers/elibrary-parser.ts:244-248`):
```typescript
// Construct flat file path: publications/{filename}
const fileUrlPath = isR2Mode()
  ? constructR2Url('elibrary', `publications/${fileUrl}`)
  : `publications/${fileUrl}`;
```

---

## Troubleshooting

### PDF not loading

**Check**:
1. Filename matches exactly (case-sensitive)
2. File exists in correct folder
3. CSV has correct `fileUrl` or ID matches filename
4. File has `.pdf` extension

**Test**:
```bash
# Check file exists
ls -la public/elibrary/publications/my-paper.pdf

# Rebuild content
npm run build:content:local

# Check generated JSON
cat src/data/generated/elibrary.json | grep "my-paper"
```

### Build error: "Missing required field fileUrl"

**Cause**: Both `fileUrl` field is empty AND file doesn't match `{id}.pdf` pattern

**Fix**: Either:
1. Add `fileUrl` to CSV row
2. Rename file to match ID: `{id}.pdf`

### R2 sync not working

**Check**:
1. PDF exists in Google Drive: `content/elibrary/publications/`
2. GitHub Actions logs for sync errors
3. R2 bucket has correct permissions

---

## Migration Notes

### Old Structure (Before 2026-01-16)

```
publications/
  └── publication-id/
      └── filename.pdf
```

### New Structure (After 2026-01-16)

```
publications/
  └── publication-id.pdf
```

**Breaking Change**: Existing PDFs in nested folders will need to be moved to flat structure.

**Migration Steps**:
1. Move PDFs from nested folders to flat folder
2. Update CSV `fileUrl` to match `{id}.pdf`
3. Rebuild content

---

## Related Documentation

- [eLibrary Parser Code](../../scripts/parsers/elibrary-parser.ts) - Parser implementation
- [rclone Sync Guide](../technical/RCLONE_SYNC.md) - Google Drive → R2 sync
- [R2 Migration Guide](../technical/CLOUDFLARE_R2_MIGRATION.md) - R2 setup

---

**Version**: 2.0 (Flat Structure)
**Last Updated**: 2026-01-16
