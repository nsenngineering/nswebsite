# Adding New Projects - Step by Step Guide

**Quick guide for adding a new project to the NS Engineering website**

---

## Overview

Adding a new project involves 4 simple steps:
1. Gather project information
2. Add a row to the CSV file
3. Add project images (optional)
4. Build and preview

**Time required:** 10-15 minutes per project

---

## Step-by-Step Instructions

### Step 1: Gather Project Information

Before you start, collect these details:

**Required Information:**
- ✅ Project name (full title)
- ✅ Client name (company/organization)
- ✅ Category (pile-testing, tunnel-road, hydropower, transmission, or ndt)
- ✅ Year completed (YYYY format)
- ✅ Location (city/district/area name)
- ✅ GPS coordinates (latitude and longitude)
- ✅ Scope of work (list of tasks/deliverables)

**Optional Information:**
- District name
- Project images (photos from site)
- PDF documents (case studies, reports)
- Featured status (show on homepage?)

---

### Step 2: Create a Project ID

**What is a Project ID?**
A unique identifier for the project used in the system.

**Rules:**
- All lowercase letters
- Use dashes (`-`) instead of spaces
- Keep it short (2-4 words)
- Make it descriptive
- Must be unique (check CSV file first)

**Examples:**

| Project Name | Good ID | Bad ID |
|--------------|---------|--------|
| KTFT Project (Fast Track) | `ktft-fast-track` | `KTFT`, `ktft project` |
| Upper Tamor Hydropower | `upper-tamor-hep` | `UpperTamor`, `project_123` |
| France Embassy NDT | `france-embassy-ndt` | `France Embassy`, `ndt1` |
| Budhi Gandaki Drilling | `budhi-gandaki-drilling` | `BudhiGandaki`, `drilling project` |

**How to create:**
1. Take the project name
2. Convert to lowercase
3. Replace spaces with dashes
4. Remove special characters
5. Keep only letters, numbers, and dashes

---

### Step 3: Find GPS Coordinates

**Method 1: Google Maps (Recommended)**

1. Go to [Google Maps](https://maps.google.com)
2. Search for the project location
3. Right-click on the exact spot
4. Click **"What's here?"**
5. Copy the coordinates from the bottom panel
   - Format: `27.7172, 85.3240`
   - First number = Latitude
   - Second number = Longitude

**Method 2: LatLong.net**

1. Go to [LatLong.net](https://www.latlong.net/)
2. Enter location name
3. Click "Find"
4. Copy coordinates

**Coordinate Validation:**
- ✅ Latitude should be between **26°** and **31°** (Nepal range)
- ✅ Longitude should be between **80°** and **89°** (Nepal range)
- ✅ Use decimal format (e.g., `27.7172`) not degrees/minutes/seconds

**What if the exact location is unknown?**
- Use the district headquarters coordinates
- Use the city center coordinates
- Use approximate location (can be refined later)

---

### Step 4: Add Row to CSV File

**Location:** `content/projects/projects.csv`

**Instructions:**

1. **Open the file**
   - Use Excel, Google Sheets, or any spreadsheet software
   - Open: `content/projects/projects.csv`

2. **Go to the last row**
   - Scroll to the bottom of the file
   - Click on the row after the last project

3. **Fill in the columns**

   | Column | What to Enter | Example |
   |--------|---------------|---------|
   | **id** | Your project ID | `budhi-gandaki-drilling` |
   | **title** | Full project name | `Budhi Gandaki HEP Drilling` |
   | **client** | Client company name | `Power Construction Corp` |
   | **category** | One of: `pile-testing`, `tunnel-road`, `hydropower`, `transmission`, `ndt` | `hydropower` |
   | **year** | Year completed | `2025` |
   | **location_name** | Human-readable location | `Gorkha` |
   | **location_district** | District (or leave empty with `""`) | `Gorkha` |
   | **coordinates_lat** | Latitude (from Google Maps) | `28.2380` |
   | **coordinates_lng** | Longitude (from Google Maps) | `84.6288` |
   | **scope** | Work items (separate with `;`) | `Core drilling;Rock testing;Lab analysis` |
   | **images** | Image filenames (separate with `;`) or `""` | `site-1.jpg;site-2.jpg` or `""` |
   | **pdfs** | PDF filenames (separate with `;`) or `""` | `report.pdf` or `""` |
   | **hero_image** | Main image filename or `""` | `site-1.jpg` or `""` |
   | **featured** | `true` or `false` | `false` |

4. **Example Complete Row:**

```csv
budhi-gandaki-drilling,"Budhi Gandaki HEP Drilling","Power Construction Corp",hydropower,2025,"Gorkha",Gorkha,28.2380,84.6288,"Core drilling;Rock testing;Lab analysis","site-1.jpg;site-2.jpg","report.pdf","site-1.jpg",false
```

5. **Save the file**
   - File → Save As → Choose **CSV UTF-8** format
   - Keep filename as `projects.csv`

---

### Step 5: Add Project Images (Optional)

**Skip this step if you don't have images yet**

#### 5a. Create Project Folder

1. Navigate to: `content/projects/`
2. Create a new folder named with your project ID
   - Example: `content/projects/budhi-gandaki-drilling/`

#### 5b. Create Subfolders

Inside your project folder, create:
```
budhi-gandaki-drilling/
├── images/
└── pdfs/
```

#### 5c. Add Your Files

**For Images (`images/` folder):**
- Add your project photos
- Rename to simple names: `site-1.jpg`, `site-2.jpg`, `hero.jpg`
- **Important:** Use lowercase, no spaces, no special characters

**For PDFs (`pdfs/` folder):**
- Add case studies, reports, etc.
- Rename to simple names: `report.pdf`, `case-study.pdf`

**Image Requirements:**
- ✅ Formats: `.jpg`, `.jpeg`, `.png`
- ✅ Max width: 1200px (recommended)
- ✅ Max file size: 500KB per image
- ✅ Compress before uploading (use TinyPNG.com)

**Final Structure Example:**
```
content/projects/budhi-gandaki-drilling/
├── images/
│   ├── hero.jpg         (Main photo - 450KB)
│   ├── site-1.jpg       (Drilling rig - 320KB)
│   ├── site-2.jpg       (Core samples - 280KB)
│   └── equipment.jpg    (Equipment - 390KB)
└── pdfs/
    ├── case-study.pdf   (Project report)
    └── test-results.pdf (Lab results)
```

#### 5d. Reference in CSV

Update your CSV row with the filenames:

```csv
images: "hero.jpg;site-1.jpg;site-2.jpg;equipment.jpg"
pdfs: "case-study.pdf;test-results.pdf"
hero_image: "hero.jpg"
```

**Remember:** Only filenames, not full paths!

---

### Step 6: Build Content

**Open Terminal/Command Prompt:**

**Windows:**
1. Press `Win + R`
2. Type: `cmd`
3. Press Enter

**Mac/Linux:**
1. Press `Cmd + Space`
2. Type: `terminal`
3. Press Enter

**Navigate to project folder:**
```bash
cd "D:\My Documents\NS Website\ns-engineering-website"
```

**Run build command:**
```bash
npm run build:content
```

**What you'll see:**

✅ **Success:**
```
✅ Successfully parsed 33 projects
✅ All media files found
✅ Content build complete!
```

❌ **If there's an error:**
- Read the error message carefully
- Common issues:
  - Missing required field → Fill in all required columns
  - Image not found → Check filename and path
  - Invalid coordinates → Check lat/lng are numbers in Nepal range
  - Duplicate ID → Use a different project ID
- Fix the issue and run the command again

---

### Step 7: Preview Your Changes

**Start development server:**
```bash
npm run dev
```

**Open browser:**
- Go to: http://localhost:3000/projects
- Find your project in the list
- Check the map - your project should appear as a marker
- Click the marker - it should scroll to your project card

**Verify:**
- ✅ Project title displays correctly
- ✅ Client name is accurate
- ✅ Location shows properly
- ✅ Year is correct
- ✅ Scope items are listed
- ✅ Images load (if added)
- ✅ Project appears on map with correct location
- ✅ Category color is appropriate

---

## Quick Checklist

Before building, verify:

- [ ] Project has unique ID (lowercase-with-dashes)
- [ ] All required fields filled in CSV
- [ ] GPS coordinates are valid numbers
- [ ] Category is one of the 5 valid types
- [ ] Scope items separated by semicolons
- [ ] Empty fields have `""` not nothing
- [ ] Image files match names in CSV
- [ ] Image files are compressed (<500KB each)
- [ ] Folder structure is correct
- [ ] CSV saved as `.csv` format

---

## Common Mistakes to Avoid

### ❌ Mistake #1: Using spaces in IDs
```csv
id: "Budhi Gandaki Project"  ❌ Wrong
id: "budhi-gandaki-project"  ✅ Correct
```

### ❌ Mistake #2: Wrong category name
```csv
category: "Hydropower"     ❌ Wrong (capital H)
category: "hydropower"     ✅ Correct (lowercase)
```

### ❌ Mistake #3: Missing quotes around text
```csv
scope: Work item 1;Work item 2    ❌ Wrong (missing quotes)
scope: "Work item 1;Work item 2"  ✅ Correct
```

### ❌ Mistake #4: Full path instead of filename
```csv
images: "content/projects/my-project/images/photo.jpg"  ❌ Wrong
images: "photo.jpg"                                      ✅ Correct
```

### ❌ Mistake #5: Empty cells left blank
```csv
...,images,pdfs,hero_image,...    ❌ Wrong (blank cells)
...,"","","",                     ✅ Correct (empty strings)
```

---

## Example: Complete Project Addition

**Project Details:**
- Name: Kali Gandaki Hydropower Investigation
- Client: International HEP Consultants
- Category: Hydropower
- Year: 2025
- Location: Myagdi District
- Work: Geotechnical survey, core drilling, lab testing

**Step 1: Create ID**
```
"Kali Gandaki Hydropower Investigation"
→ kali-gandaki-hydropower
→ OR kali-gandaki-investigation
→ Choose: kali-gandaki-hep
```

**Step 2: Find GPS (Myagdi District HQ - Beni)**
```
Google Maps: Beni, Myagdi
→ Right-click → What's here?
→ 28.3678, 83.6053
```

**Step 3: CSV Row**
```csv
kali-gandaki-hep,"Kali Gandaki Hydropower Investigation","International HEP Consultants",hydropower,2025,"Beni",Myagdi,28.3678,83.6053,"Geotechnical survey;Core drilling up to 150m;Laboratory testing;Rock sample analysis","","","",false
```

**Step 4: Create folders (if adding images later)**
```
content/projects/kali-gandaki-hep/
├── images/
└── pdfs/
```

**Step 5: Build**
```bash
npm run build:content
```

**Step 6: Preview**
```bash
npm run dev
# Visit: http://localhost:3000/projects
```

**Done!** ✅

---

## Troubleshooting

**Q: Build fails with "Invalid Record Length"**
A: Check that every row has exactly 14 columns. Empty cells need `""`.

**Q: "Project not showing on map"**
A: Check coordinates are valid numbers within Nepal's range (26-31°N, 80-89°E).

**Q: "Image not loading"**
A: Verify:
- File exists in `content/projects/{id}/images/`
- Filename in CSV matches exactly (case-sensitive)
- Filename has no spaces or special characters

**Q: "Duplicate project ID error"**
A: The ID already exists. Choose a different unique ID.

---

## Next Steps

After adding projects:
1. [Content Management Guide](./content-management.md) - Overall guide
2. [GPS Coordinates Guide](./gps-coordinates.md) - Detailed GPS instructions
3. Build and deploy to production

---

**Last Updated:** 2025-11-28
**Version:** 1.0.0
