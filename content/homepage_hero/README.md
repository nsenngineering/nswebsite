# Homepage Hero Carousel - Content Guide

## Overview

The homepage hero carousel automatically displays images from the `images/` folder in alphanumeric order. No manual configuration needed!

## Quick Start

### Method 1: Simple (Just Add Images)

1. **Add your images** to the `images/` folder
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
   - Recommended: Name with numbers for ordering (e.g., `01-founding.jpg`, `02-team.jpg`)
   - Any quantity: 5, 10, 15+ images work

2. **Run build**:
   ```bash
   npm run build:content
   ```

3. **Done!** Images auto-detected, sorted, and displayed with auto-generated alt text

**Example folder structure**:
```
images/
├── 01-founding.jpg
├── 02-team-growth.jpg
├── 03-equipment.jpg
├── 04-projects.jpg
└── 05-certification.jpg
```

Alt text auto-generated:
- `01-founding.jpg` → "NS Engineering - founding"
- `02-team-growth.jpg` → "NS Engineering - team growth"

---

### Method 2: Custom Alt Text (Optional)

If you want to customize alt text for accessibility:

1. **Edit `hero_carousel.csv`** (Excel/Google Sheets)
   - Single column: `alt_text`
   - One row per image (in same order as sorted filenames)

2. **Example CSV**:
   ```csv
   alt_text
   Early days of NS Engineering operations
   Growing team of engineers and geologists at NS Engineering
   State-of-the-art drilling equipment
   ```

3. **Run build**:
   ```bash
   npm run build:content
   ```

**Important**: CSV rows match images by order (after alphanumeric sort)
- Row 1 → First image alphabetically
- Row 2 → Second image alphabetically
- etc.

---

## How Auto-Detection Works

### Image Detection

1. **Scans** `content/homepage_hero/images/` folder
2. **Filters** for image files (`.jpg`, `.jpeg`, `.png`, `.webp`)
3. **Sorts** alphanumerically with natural sort:
   - `01-image.jpg` before `02-image.jpg`
   - `image-01.jpg` before `image-10.jpg`
   - `a-image.jpg` before `b-image.jpg`

### Alt Text Generation

**With CSV** (`hero_carousel.csv` exists):
- Uses alt text from CSV rows in order
- Row 1 → Image 1, Row 2 → Image 2, etc.

**Without CSV** (CSV missing or empty):
- Auto-generates from filename
- Removes numbers and separators
- Adds "NS Engineering" prefix
- Example: `03-field-work.jpg` → "NS Engineering - field work"

**Fallback** (unclear filename):
- Uses default: "NS Engineering organizational evolution - Image X"

---

## Best Practices

### Image Naming

**Recommended**: Number prefixes for clear ordering
```
01-founding-2015.jpg
02-team-expansion-2017.jpg
03-iso-certification-2019.jpg
```

**Also works**: Descriptive names (sorted alphabetically)
```
a-founding.jpg
b-team-expansion.jpg
c-iso-certification.jpg
```

**Avoid**: Random names (unpredictable order)
```
IMG_1234.jpg  ❌
IMG_5678.jpg  ❌
```

### Image Specifications

- **Size**: 1920x1080px (Full HD) recommended
- **Aspect Ratio**: 16:9 for consistent display
- **Format**: JPG (compressed, 80-90% quality)
- **File Size**: < 500KB per image (optimize for web)
- **Total**: Any number (5-15 images typical)

### Alt Text Tips

Good alt text is:
- **Descriptive**: "Engineers conducting pile testing at construction site"
- **Specific**: "ISO 9001:2015 certification ceremony 2019"
- **Concise**: 10-15 words maximum
- **Includes brand**: Mentions "NS Engineering" when relevant

Avoid:
- Generic: "Image 1" ❌
- Redundant: "Picture of photo showing..." ❌
- Too long: Full paragraphs ❌

---

## Updating Images

### Adding New Images

1. Copy new images to `images/` folder
2. Name with appropriate prefix for ordering
3. Optionally add alt text row to CSV
4. Run `npm run build:content`

### Reordering Images

**Method 1**: Rename files
```bash
# Change order by renaming
01-old-first.jpg → 05-now-fifth.jpg
02-now-first.jpg → 01-now-first.jpg
```

**Method 2**: Add number prefixes
```bash
team.jpg → 01-team.jpg
equipment.jpg → 02-equipment.jpg
```

Then run `npm run build:content`

### Removing Images

1. Delete image file from `images/` folder
2. Remove corresponding alt text row from CSV (if used)
3. Run `npm run build:content`

---

## Troubleshooting

### No images showing

**Check**:
1. Images in correct folder? `content/homepage_hero/images/`
2. Valid image format? (`.jpg`, `.jpeg`, `.png`, `.webp`)
3. Build completed? Run `npm run build:content`
4. Images copied? Check `public/hero/` folder

**Build output should show**:
```
📸 Auto-detecting hero carousel images...
   Found 10 images in directory
✅ Configured 10 hero carousel images
📂 Copying hero images to public folder...
✅ Copied 10 images
```

### Wrong order

**Check filename sort**:
```bash
# List files in order
ls content/homepage_hero/images/ | sort
```

**Fix**: Rename files with clear numeric prefixes (01, 02, 03, etc.)

### Alt text not updating

**Check**:
1. CSV column name exactly `alt_text`
2. Number of CSV rows matches number of images
3. CSV saved after editing
4. Build ran after changes

**Verify CSV**:
```bash
# View CSV content
cat content/homepage_hero/hero_carousel.csv
```

---

## Technical Details

### Build Process

1. **Parse**: `scripts/parsers/hero-carousel-parser.ts` scans folder
2. **Copy**: Images copied to `public/hero/` for serving
3. **Generate**: JSON config written to `src/data/generated/hero-carousel.json`
4. **Runtime**: Component imports JSON and displays images

### File Locations

- **Source images**: `content/homepage_hero/images/`
- **Alt text CSV**: `content/homepage_hero/hero_carousel.csv` (optional)
- **Public images**: `public/hero/` (auto-generated)
- **Config JSON**: `src/data/generated/hero-carousel.json` (auto-generated)
- **Component**: `src/components/home/HeroCarousel.tsx`

### Supported Formats

- JPEG: `.jpg`, `.jpeg`
- PNG: `.png`
- WebP: `.webp`

---

## Examples

### Example 1: 10 Years Evolution

**Folder**:
```
images/
├── 01-founding-2015.jpg
├── 02-first-project-2016.jpg
├── 03-team-expansion-2017.jpg
├── 04-equipment-upgrade-2018.jpg
├── 05-iso-certification-2019.jpg
├── 06-major-project-2020.jpg
├── 07-lab-facility-2021.jpg
├── 08-technology-adoption-2022.jpg
├── 09-growth-milestone-2023.jpg
└── 10-future-vision-2024.jpg
```

**CSV** (optional):
```csv
alt_text
NS Engineering foundation and early operations in 2015
First major geotechnical project completion in 2016
Team expansion with experienced engineers in 2017
State-of-the-art drilling equipment acquisition in 2018
ISO 9001:2015 certification achievement in 2019
Completion of major infrastructure project in 2020
Advanced laboratory testing facility opening in 2021
Adoption of modern technology and digital tools in 2022
Milestone 100+ projects completed in 2023
Vision for future innovations and expansion in 2024
```

### Example 2: Thematic (No Years)

**Folder**:
```
images/
├── field-operations.jpg
├── laboratory-testing.jpg
├── team-collaboration.jpg
├── equipment-showcase.jpg
└── project-success.jpg
```

**Auto-generated alt text**:
- "NS Engineering - field operations"
- "NS Engineering - laboratory testing"
- "NS Engineering - team collaboration"
- "NS Engineering - equipment showcase"
- "NS Engineering - project success"

---

## Summary

**✅ Just drop images in folder → Auto-detected!**
- No filename configuration needed
- Alphanumeric sorting
- Optional CSV for alt text
- Any number of images
- Consistent with projects pattern

**For help**: See main project documentation or contact development team.
