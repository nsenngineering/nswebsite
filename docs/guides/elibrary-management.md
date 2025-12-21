# eLibrary Management Guide

## Overview

The eLibrary is a CSV-based content management system for managing technical documents, standards, publications, and newsletters. This guide explains how to add, edit, and manage eLibrary content.

## File Locations

- **Documents CSV**: `content/elibrary/documents.csv`
- **Sections CSV**: `content/elibrary/sections.csv`
- **PDF Files**: `content/elibrary/{document-id}/files/`
- **Generated Output**: `src/data/generated/elibrary.json`

## Document CSV Structure

### Column Definitions

The `documents.csv` file has 11 columns:

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| `id` | string | ✅ Yes | Unique kebab-case identifier | `astm-d4945` |
| `title` | string | ✅ Yes | Document title | `ASTM D4945: Standard Test Method...` |
| `section` | string | ✅ Yes | One of: `standards`, `publications`, `newsletters` | `standards` |
| `category` | string | ❌ No | Optional subcategory | `Pile Testing` |
| `author` | string | ❌ No | Author name or organization | `ASTM International` |
| `date` | string | ✅ Yes | Publication date (YYYY-MM-DD) | `2023-06-15` |
| `summary` | string | ✅ Yes | Short description (2-3 sentences) | `This standard covers...` |
| `content` | string | ✅ Yes | Full text content | `This test method provides...` |
| `file_url` | string | ❌ No | PDF filename (auto-detected if empty) | `astm-d4945.pdf` |
| `tags` | string | ✅ Yes | Semicolon-separated tags | `pile testing;standards;astm` |
| `featured` | boolean | ❌ No | Show prominently (TRUE/FALSE) | `TRUE` |

### Required Fields

- `id` - Must be lowercase, kebab-case (e.g., `my-document-name`)
- `title` - Full document title
- `section` - Must be one of: `standards`, `publications`, `newsletters`
- `date` - Must be in YYYY-MM-DD format
- `summary` - Brief description for listings
- `content` - Full document text
- `tags` - At least one tag (semicolon-separated)

### Optional Fields

- `category` - Custom subcategory for organization
- `author` - Author or organization name
- `file_url` - PDF filename (will auto-detect from filesystem if empty)
- `featured` - Set to `TRUE` to feature the document

## Adding a New Document

### Step 1: Prepare Your PDF (Optional)

If you have a PDF file:

1. Create a folder: `content/elibrary/{document-id}/`
2. Create a subfolder: `content/elibrary/{document-id}/files/`
3. Place your PDF: `content/elibrary/{document-id}/files/{filename}.pdf`

**Example:**
```
content/elibrary/astm-d4945/files/astm-d4945.pdf
```

### Step 2: Add CSV Entry

Open `content/elibrary/documents.csv` in Excel or a text editor.

Add a new row with your document details:

```csv
astm-d4945,ASTM D4945: Standard Test Method for High-Strain Dynamic Testing,standards,Pile Testing,ASTM International,2023-06-15,This standard covers pile testing procedures.,This test method provides detailed procedures for pile capacity testing using dynamic methods.,astm-d4945.pdf,pile testing;standards;astm,TRUE
```

**Important CSV Rules:**
- No line breaks within cells (use spaces instead)
- Use semicolons (`;`) to separate tags
- Use commas (`,`) to separate columns
- Dates must be YYYY-MM-DD format
- Boolean values: `TRUE` or `FALSE` (case-insensitive)

### Step 3: Build Content

Run the build command to process your changes:

```bash
npm run build:content
```

The build process will:
1. ✅ Parse and validate CSV data
2. ✅ Auto-detect PDF files (if `file_url` is empty)
3. ✅ Validate all file paths
4. ✅ Copy PDFs to `public/elibrary/`
5. ✅ Generate `elibrary.json`

### Step 4: Verify

Check the build output for any errors or warnings.

Preview the document in the development server:

```bash
npm run dev
```

Navigate to: `http://localhost:3000/elibrary`

## Editing Existing Documents

1. Open `content/elibrary/documents.csv`
2. Find the row with the document ID you want to edit
3. Update the desired fields
4. Save the file
5. Run `npm run build:content`

**Note:** Do NOT change the `id` column unless you also rename the corresponding folder in `content/elibrary/`.

## Deleting Documents

1. Remove the row from `documents.csv`
2. (Optional) Delete the folder `content/elibrary/{document-id}/`
3. Run `npm run build:content`

## Managing Sections

### Editing Section Metadata

Open `content/elibrary/sections.csv`:

```csv
id,label,description,icon,order
standards,Standards,Industry standards and testing protocols,FileText,1
publications,Publications,Technical papers and research articles,BookOpen,2
newsletters,Newsletters,Company newsletters and updates,Newspaper,3
```

**Available Icons:**
- `FileText` - Document icon
- `BookOpen` - Book icon
- `Newspaper` - Newsletter icon

**Order:** Controls the display order (1 = first, 2 = second, etc.)

### Default Sections

If `sections.csv` is missing or has errors, the system uses these defaults:

1. **Standards** - Industry standards and testing protocols
2. **Publications** - Technical papers and research articles
3. **Newsletters** - Company newsletters and updates

## Document ID Guidelines

### Valid Document IDs (Kebab-Case)

✅ `astm-d4945`
✅ `case-study-ktft-2024`
✅ `newsletter-q1-2024`
✅ `iso-22477-1`

### Invalid Document IDs

❌ `ASTM D4945` (uppercase, spaces)
❌ `case_study_ktft` (underscores)
❌ `Newsletter 2024` (spaces, mixed case)
❌ `my.document.pdf` (dots, file extension)

**Conversion Rule:** Lowercase + replace spaces/special chars with hyphens

## Date Format

Always use ISO 8601 format: `YYYY-MM-DD`

✅ `2024-06-15`
✅ `2023-01-01`
✅ `2025-12-31`

❌ `06/15/2024` (US format)
❌ `15-06-2024` (European format)
❌ `June 15, 2024` (text format)

## Tagging Best Practices

### Good Tags

```
pile testing;standards;astm;dynamic testing;capacity evaluation
```

- Use lowercase
- Be specific
- Use common terms
- Separate with semicolons
- No spaces around semicolons

### Tag Suggestions by Section

**Standards:**
- `standards`, `astm`, `iso`, `british standards`
- Test types: `pile testing`, `soil testing`, `laboratory`
- Specific methods: `spt`, `triaxial`, `cbr`

**Publications:**
- `case studies`, `research`, `technical papers`
- Project types: `hydropower`, `highways`, `bridges`
- Topics: `slope stability`, `liquefaction`, `seismic`

**Newsletters:**
- `newsletter`, `company news`, `updates`
- Quarters: `q1`, `q2`, `q3`, `q4`
- Years: `2024`, `2025`

## Featured Documents

Set `featured = TRUE` to highlight important documents:

- Featured documents appear first in listings
- Highlighted with a yellow "Featured" badge
- Recommended for:
  - Latest standards
  - Major case studies
  - Recent publications
  - Important announcements

**Limit:** Keep 4-6 featured documents per section for best results.

## Auto-Detection of PDFs

The build system automatically detects PDF files when `file_url` is empty:

1. Looks in `content/elibrary/{document-id}/files/`
2. Finds all `.pdf` files
3. Selects the first file alphabetically
4. Uses that filename as `file_url`

**Example:**

```
content/elibrary/astm-d4945/files/
  ├── astm-d4945.pdf          ← Will be selected
  └── backup.pdf
```

**Tip:** If you have multiple PDFs, either:
- Specify the filename in CSV's `file_url` column
- Name the primary file so it's first alphabetically

## Troubleshooting

### Error: "Invalid document ID format"

**Cause:** ID is not kebab-case
**Fix:** Convert to lowercase, replace spaces/special chars with hyphens

### Error: "Invalid section"

**Cause:** Section is not `standards`, `publications`, or `newsletters`
**Fix:** Use one of the three valid section names

### Error: "Invalid date format"

**Cause:** Date is not in YYYY-MM-DD format
**Fix:** Convert date to ISO 8601 format (e.g., `2024-06-15`)

### Warning: "Missing file"

**Cause:** PDF file specified in CSV doesn't exist
**Fix:** Either:
- Add the PDF to `content/elibrary/{id}/files/`
- Remove the filename from CSV (auto-detection will try to find it)
- Leave `file_url` empty if no PDF is needed

### Error: "Duplicate document ID"

**Cause:** Two rows have the same `id` value
**Fix:** Ensure each document has a unique ID

### Build Warnings vs Errors

- **Errors** → Build fails, fix required
- **Warnings** → Build succeeds, but content might be incomplete

## Example: Complete Workflow

### Adding a New Standard

1. **Create folder structure:**
```bash
mkdir -p content/elibrary/bs-8004/files
```

2. **Add PDF:**
```bash
cp ~/Downloads/bs-8004.pdf content/elibrary/bs-8004/files/
```

3. **Add CSV entry:**
```csv
bs-8004,BS 8004: Code of Practice for Foundations,standards,Foundation Design,British Standards Institution,2023-01-20,Provides recommendations for foundation design and construction.,This British Standard gives guidance on foundation design...,bs-8004.pdf,foundations;standards;british standards;design,FALSE
```

4. **Build:**
```bash
npm run build:content
```

5. **Verify output:**
```
✅ Successfully parsed 13 documents
✅ All eLibrary files found
✅ Copied 1 eLibrary files to public/elibrary/
```

6. **Test:**
```bash
npm run dev
# Open http://localhost:3000/elibrary
# Filter by "Standards" section
# Search for "BS 8004"
# Click to view document
# Verify PDF download works
```

## FAQ Management

To edit FAQ content, modify `src/data/faq.ts`:

- Add new questions to the `faqData` array
- Update existing answers
- Organize by category: `services`, `pricing`, `technical`, `general`
- Run `npm run dev` to test (no build step needed for FAQ)

## Careers Management

To manage job listings, modify `src/data/careers.ts`:

- Add jobs to the `jobListings` array
- Set `active: true` for open positions
- Update company benefits in `companyBenefits`
- Run `npm run dev` to test (no build step needed)

## Best Practices

1. **Always run `npm run build:content` after CSV changes**
2. **Test in dev mode before deploying**
3. **Keep document IDs unique and meaningful**
4. **Use consistent tagging across similar documents**
5. **Limit featured documents to 4-6 per section**
6. **Include PDF files for standards and publications**
7. **Write clear, concise summaries (2-3 sentences max)**
8. **Use proper date format (YYYY-MM-DD)**
9. **Proofread content before committing**
10. **Check build output for warnings**

## Need Help?

- Check build output for error messages
- Review example documents in `documents.csv`
- Contact the development team for assistance

---

**Last Updated:** December 2024
**Version:** 1.0.0
