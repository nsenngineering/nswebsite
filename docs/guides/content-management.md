# Content Management Guide

**For NS Engineering Website - Non-Technical Users**

This guide explains how to update project information on the website without writing code.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Editing Projects](#editing-projects)
3. [Adding New Projects](#adding-new-projects)
4. [Adding Project Images](#adding-project-images)
5. [Managing Project Categories](#managing-project-categories)
6. [Publishing Changes](#publishing-changes)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

**To update projects on the website, you only need to:**

1. Edit a CSV file (like Excel)
2. Add project images/PDFs (if needed)
3. Run a simple command
4. Done! ✅

**You do NOT need to:**
- Write any code
- Know programming
- Edit HTML or complicated files

---

## Editing Projects

### Step 1: Open the Projects File

1. Navigate to: `content/projects/`
2. Open: `projects.csv`
3. Use **Excel**, **Google Sheets**, or any spreadsheet software

### Step 2: Understanding the Columns

The CSV file has these columns:

| Column | Required? | Description | Example |
|--------|-----------|-------------|---------|
| `id` | ✅ Yes | Unique project identifier (lowercase, use dashes) | `ktft-fast-track` |
| `title` | ✅ Yes | Project name (displayed on website) | `KTFT Project (Fast Track)` |
| `client` | ✅ Yes | Client/company name | `Kumar-Roshan-Sichuwan JV` |
| `category` | ✅ Yes | Type: `pile-testing`, `tunnel-road`, `hydropower`, `transmission`, or `ndt` | `pile-testing` |
| `year` | ✅ Yes | Year completed | `2024` |
| `location_name` | ✅ Yes | Human-readable location | `Kathmandu Valley` |
| `location_district` | No | District name | `Kathmandu` |
| `coordinates_lat` | ✅ Yes | Latitude (decimal number) | `27.7172` |
| `coordinates_lng` | ✅ Yes | Longitude (decimal number) | `85.3240` |
| `scope` | ✅ Yes | Work items (separated by semicolons) | `50 nos PDA;17 nos Lateral Load` |
| `images` | No | Image filenames (separated by semicolons) | `hero.jpg;site-1.jpg` |
| `pdfs` | No | PDF filenames (separated by semicolons) | `case-study.pdf` |
| `hero_image` | No | Main featured image filename | `hero.jpg` |
| `featured` | No | Show on homepage? (`true` or `false`) | `true` |

### Step 3: Editing a Project

**Example: Changing the client name**

1. Find the row for the project (e.g., `ktft-fast-track`)
2. Locate the `client` column
3. Change the value
4. Save the file

**Important Rules:**
- ✅ Keep quotes around text with commas or special characters
- ✅ Use semicolons (`;`) to separate multiple items
- ✅ Don't leave empty cells - use `""` for empty text fields
- ✅ Save as `.csv` format (not `.xlsx`)

---

## Adding New Projects

### Step 1: Prepare Project Information

Gather these details:
- Project name
- Client name
- Category (pile-testing, tunnel-road, hydropower, transmission, ndt)
- Year completed
- Location and GPS coordinates
- Scope of work (list of tasks)

### Step 2: Create Project ID

**Rules for Project IDs:**
- Lowercase letters only
- Use dashes instead of spaces
- Keep it short but descriptive
- Must be unique

**Examples:**
- ✅ Good: `upper-tamor-hydropower`, `nalgad-hep`, `france-embassy-ndt`
- ❌ Bad: `Project123`, `Upper Tamor`, `project_name`

### Step 3: Add Row to CSV

1. Open `content/projects/projects.csv`
2. Go to the last row
3. Add a new row with your project data
4. Fill in all required columns
5. Save the file

**Example New Row:**
```csv
new-bridge-project,"New Bridge Project","ABC Construction JV",pile-testing,2025,"Pokhara",Kaski,28.2096,83.9856,"20 nos PDA;10 nos Static Load Test","","","",false
```

### Step 4: Find GPS Coordinates (See GPS Guide)

See [GPS Coordinates Guide](./gps-coordinates.md) for detailed instructions.

**Quick method:**
1. Go to [Google Maps](https://maps.google.com)
2. Search for project location
3. Right-click on the location
4. Click "What's here?"
5. Copy the coordinates (format: `27.7172, 85.3240`)

---

## Adding Project Images

### Step 1: Create Project Folder

1. Navigate to: `content/projects/`
2. Create a new folder with your project ID
   - Example: `content/projects/new-bridge-project/`

### Step 2: Create Image Subfolder

Inside your project folder, create:
- `images/` - for photos
- `pdfs/` - for documents (optional)

**Final structure:**
```
content/projects/
└── new-bridge-project/
    ├── images/
    │   ├── hero.jpg
    │   ├── site-1.jpg
    │   └── site-2.jpg
    └── pdfs/
        └── case-study.pdf
```

### Step 3: Add Images

**Image Guidelines:**
- ✅ Formats: `.jpg`, `.jpeg`, `.png`
- ✅ Recommended size: 1200px wide (max)
- ✅ File size: Under 500KB each (compress if needed)
- ✅ Filenames: lowercase, no spaces (use dashes)
  - Good: `hero.jpg`, `site-photo-1.jpg`
  - Bad: `Site Photo 1.JPG`, `IMG_1234.jpg`

**Tools for compressing images:**
- [TinyPNG](https://tinypng.com) - Free online tool
- [ImageOptim](https://imageoptim.com) - Mac app
- [RIOT](https://riot-optimizer.com) - Windows app

### Step 4: Reference Images in CSV

In your CSV row, list the filenames (separated by semicolons):

```csv
images: "hero.jpg;site-1.jpg;site-2.jpg"
hero_image: "hero.jpg"
```

**Note:** Only include the filename, not the full path!

---

## Managing Project Categories

### What are Categories?

Categories group projects by type of work:
- **pile-testing** - Pile load testing and integrity testing
- **tunnel-road** - Tunnel and road construction projects
- **hydropower** - Hydropower plant investigations
- **transmission** - Transmission line and substation projects
- **ndt** - Non-destructive testing services

Categories appear:
- In the filter dropdown on the projects page
- As colored badges on project cards
- As colored markers on the map
- In the statistics section

### Adding a New Category

**Step 1: Add Projects with New Category**

In `content/projects/projects.csv`, use your new category name:

```csv
id,title,client,category,...
new-project,New Project,Client Name,geophysical,...
```

**Category Naming Rules:**
- Use lowercase letters only
- Use dashes instead of spaces (e.g., `soil-lab-testing`)
- Keep it short and descriptive
- Use kebab-case format (e.g., `pile-testing`, not `Pile Testing`)

**Step 2: (Optional) Customize Category Appearance**

To customize colors and labels, edit: `content/categories/categories.csv`

You can open this file in:
- ✅ Microsoft Excel
- ✅ Google Sheets
- ✅ Any spreadsheet software

**CSV Format:**
```csv
id,label,color,gradientFrom,gradientTo,description
geophysical,Geophysical Surveys,#10b981,emerald-400,emerald-600,Seismic and resistivity surveys
```

**Column Guide:**
- `id` (required): Category identifier (must match projects.csv)
- `label` (optional): Display name. Leave empty to auto-generate from ID
- `color` (optional): Hex color code (e.g., `#7c3aed`). Leave empty for default purple
- `gradientFrom` (optional): Tailwind gradient start (e.g., `purple-500`)
- `gradientTo` (optional): Tailwind gradient end (e.g., `purple-700`)
- `description` (optional): Brief service description

**Important:**
- ✅ Leave cells empty (not "null" or "undefined") for defaults
- ✅ Colors must be 6-digit hex codes starting with `#`
- ✅ Save as `.csv` format (not `.xlsx`)

**Step 3: Rebuild Content**

```bash
npm run build:content
```

The new category will automatically:
- ✅ Appear in the filter dropdown
- ✅ Show on the map with custom colors (or default purple if not configured)
- ✅ Display in project cards
- ✅ Update the statistics section

### Default Category Styling

If you don't customize a category, it will use default purple gradient colors that match the website's brand.

### Example: Adding Custom Category Color

**Step 1:** Open `content/categories/categories.csv` in Excel

**Step 2:** Add a new row with custom colors:
```csv
geophysical,Geophysical Surveys,#10b981,emerald-400,emerald-600,Seismic and resistivity surveys
```

**Step 3:** Save and rebuild:
```bash
npm run build:content
```

The new category will use your custom emerald/green colors!

### Example: Using Default Colors

If you don't want to specify custom colors, just leave those cells empty:

```csv
geophysical,Geophysical Surveys,,,,"Seismic surveys"
```

This will:
- Use auto-generated label: "Geophysical Surveys"
- Use default purple color (#9333ea)
- Use default gradients (purple-500 to purple-700)

### Renaming a Category

**Option 1: Update the Label Only**

To change how a category is displayed without changing the ID:

1. Open `content/categories/categories.csv` in Excel
2. Update the `label` cell for that category
3. Save and run `npm run build:content`

**Option 2: Fully Rename the Category**

To change the category ID:

1. Open `content/projects/projects.csv`
2. Find all rows with the old category
3. Change to new category name
4. Update `content/categories/categories.csv` if needed
5. Run `npm run build:content`

**Important:** This changes URLs and may break external links!

### Deleting a Category

To remove a category:

1. Open `content/projects/projects.csv`
2. Change all projects in that category to a different one
3. Run `npm run build:content`

The category will automatically disappear from filters and statistics.

---

## Publishing Changes

### Step 1: Build Content

Open **Command Prompt** (Windows) or **Terminal** (Mac/Linux):

```bash
cd "D:\My Documents\NS Website\ns-engineering-website"
npm run build:content
```

**What this does:**
- Reads your CSV file
- Validates all data
- Checks if images exist
- Generates website-ready files
- Copies images to the correct location

### Step 2: Check for Errors

**If you see ✅ "Content build complete!":**
- Everything is good! Your changes are ready.

**If you see ❌ errors:**
- Read the error message carefully
- Common issues:
  - Missing required field
  - Image file not found
  - Invalid GPS coordinates
  - Duplicate project ID
- Fix the issue and run the command again

### Step 3: Preview Changes

```bash
npm run dev
```

Then open: http://localhost:3000/projects

**Check:**
- ✅ Project appears in the list
- ✅ Project shows on map
- ✅ Images load correctly
- ✅ All information is accurate

### Step 4: Deploy to Website

```bash
npm run build
```

Then deploy to hosting (GitHub Pages, Vercel, etc.)

---

## Troubleshooting

### Problem: "CSV parsing error"

**Solution:** Check that:
- All rows have the same number of columns (14)
- Empty cells have `""` not nothing
- Text with commas is in quotes: `"ABC, Inc."`
- File is saved as `.csv` not `.xlsx`

### Problem: "Image not found"

**Solution:** Check that:
- Image file exists in correct folder
- Filename in CSV matches exactly (case-sensitive)
- Path structure: `content/projects/{project-id}/images/{filename}`
- No typos in filename

### Problem: "Invalid coordinates"

**Solution:** Check that:
- Coordinates are decimal numbers (not degrees/minutes/seconds)
- Latitude is between 26° and 31° (Nepal range)
- Longitude is between 80° and 89° (Nepal range)
- Use decimal point (`.`) not comma
- Example: `27.7172` ✅ not `27,7172` ❌

### Problem: "Duplicate project ID"

**Solution:**
- Each project must have a unique ID
- Check if ID already exists
- Use a different ID for the new project

### Problem: "Invalid hex color" error

**Solution:**
- Colors must be 6-digit hex codes
- ✅ Correct: `#7c3aed`
- ❌ Wrong: `7c3aed` (missing #)
- ❌ Wrong: `#7c3` (too short)
- ❌ Wrong: `purple` (not hex)

### Problem: Category appears with wrong colors

**Solution:**
- Check that category ID in `categories.csv` matches exactly
- Category IDs are case-sensitive
- `pile-testing` ≠ `Pile-Testing` ≠ `pile_testing`
- Make sure both `projects.csv` and `categories.csv` use the same ID

### Problem: Images too large / slow loading

**Solution:**
- Compress images before uploading
- Recommended max size: 500KB per image
- Use tools: TinyPNG, ImageOptim, or online compressors
- Resize to max width of 1200px

---

## Tips & Best Practices

### ✅ Do's

- ✅ Always save CSV as `.csv` format
- ✅ Use consistent naming (lowercase-with-dashes)
- ✅ Compress images before adding
- ✅ Test changes locally before deploying
- ✅ Keep backups of CSV file
- ✅ Use descriptive project IDs
- ✅ Fill in as much information as possible

### ❌ Don'ts

- ❌ Don't edit generated files in `src/data/generated/`
- ❌ Don't use spaces in filenames
- ❌ Don't upload huge images (>2MB)
- ❌ Don't change column headers in CSV
- ❌ Don't skip required fields
- ❌ Don't use special characters in IDs

---

## Quick Reference: CSV Template

Copy this template for new projects:

```csv
project-id,"Project Title","Client Name",category,2025,"Location Name",District,27.7172,85.3240,"Scope item 1;Scope item 2;Scope item 3","image1.jpg;image2.jpg","document.pdf","image1.jpg",false
```

**Replace:**
- `project-id` → Your unique ID
- `Project Title` → Full project name
- `Client Name` → Client company
- `category` → One of: pile-testing, tunnel-road, hydropower, transmission, ndt
- `2025` → Year completed
- `Location Name` → Human-readable location
- `District` → District name (or empty `""`)
- `27.7172, 85.3240` → GPS coordinates
- `Scope item 1;...` → Semicolon-separated scope items
- `image1.jpg;...` → Image filenames (or empty `""`)
- `document.pdf` → PDF filename (or empty `""`)
- `image1.jpg` → Hero image (or empty `""`)
- `false` → Featured on homepage? (true/false)

---

## Need Help?

**Common Questions:**
1. "How do I find GPS coordinates?" → See [GPS Coordinates Guide](./gps-coordinates.md)
2. "How do I add images?" → See [Adding New Projects Guide](./adding-projects.md)
3. "The build failed, what do I do?" → Read the error message and check this troubleshooting section

**Contact:**
- Technical support: [Your contact info]
- Documentation: This file and other docs in `/docs` folder

---

**Last Updated:** 2025-11-28
**Version:** 1.0.0
