# Leadership Team - Content Guide

## Overview

The leadership team section automatically displays team members from the CSV file with optional profile images. Images are auto-detected from the `images/` folder using name-based matching.

## Quick Start

### Add Team Members

1. **Edit CSV** (`team.csv`) in Excel/Google Sheets:
   - Add team member details
   - Set display order

2. **Add Images** (Optional):
   - Drop profile photos in `images/` folder
   - Name format: `firstname-lastname.jpg` or similar

3. **Build**:
   ```bash
   npm run build:content
   ```

4. **Result**: Team displayed with images (if found) or fallback icons

---

## CSV Structure

**File**: `team.csv`

**Columns**:
- `name`: Full name (e.g., "Arun Kumar Pandit")
- `role`: Position title (e.g., "Managing Director")
- `education`: Degree and field (e.g., "MSc. Geotechnical Engineering")
- `experience`: Years of experience (e.g., "19 Years")
- `order`: Display order (1, 2, 3, ...)

**Example**:
```csv
name,role,education,experience,order
Arun Kumar Pandit,Managing Director,MSc. Geotechnical Engineering,19 Years,1
Dhurba Raj Tirpathi,Director,Bachelor in Civil Engineering,28 Years,2
Shrawan Kumar Thapa,Director,MSc. Transportation Engineering,30 Years,3
```

---

## Image Auto-Detection

### How It Works

The build system automatically looks for images matching each team member's name:

1. **Generates slug** from name: "Arun Kumar Pandit" → `arun-kumar-pandit`
2. **Searches** for matching files in `images/` folder
3. **Displays** image if found, otherwise shows icon

### Naming Patterns

**Exact match** (Recommended):
```
arun-kumar-pandit.jpg
dhurba-raj-tirpathi.jpg
shrawan-kumar-thapa.jpg
```

**Fuzzy match** (Also works):
```
arun-pandit.jpg          ✓ Contains "arun" and "pandit"
pandit-arun.jpg          ✓ Contains name parts
arun-kumar-pandit-2024.jpg  ✓ Contains full slug
```

**Won't match**:
```
md.jpg                   ❌ No name parts
director-1.jpg           ❌ No name parts
```

### Supported Formats

- JPEG: `.jpg`, `.jpeg`
- PNG: `.png`
- WebP: `.webp`

---

## Image Specifications

### Recommended

- **Size**: 400x400px (square)
- **Aspect Ratio**: 1:1 (square)
- **Format**: JPG (compressed)
- **File Size**: < 100KB per image
- **Style**: Professional headshot

### Display

- **Container**: 80x80px circle (80x80px)
- **Border**: 4px purple border
- **Shadow**: Shadow for depth
- **Fallback**: Purple gradient circle with user icon

---

## Examples

### Example 1: With Images

**Folder Structure**:
```
content/team/
├── team.csv
└── images/
    ├── arun-kumar-pandit.jpg
    ├── dhurba-raj-tirpathi.jpg
    └── shrawan-kumar-thapa.jpg
```

**Build Output**:
```
👥 Parsing team CSV...
   ✓ Image found for Arun Kumar Pandit
   ✓ Image found for Dhurba Raj Tirpathi
   ✓ Image found for Shrawan Kumar Thapa
✅ Parsed 5 team members
   📸 3 with images, 2 without images
```

**Result**: First 3 members show profile photos, others show icons

### Example 2: Without Images

**Folder Structure**:
```
content/team/
├── team.csv
└── images/
    (empty folder)
```

**Build Output**:
```
👥 Parsing team CSV...
✅ Parsed 5 team members
   📸 0 with images, 5 without images
```

**Result**: All members show purple icon fallback

---

## Adding New Team Members

### Step-by-Step

1. **Update CSV**:
   ```csv
   Anand Gupta,Engineer/Geotechnical,MSc. Geotechnical Engineering,18 Years,6
   ```

2. **Add Image** (Optional):
   - Save as `images/anand-gupta.jpg`
   - Or skip - will show icon

3. **Build**:
   ```bash
   npm run build:content
   ```

4. **Verify**:
   - Check `public/team/` folder for copied images
   - Check `src/data/generated/team.json` for data

---

## Reordering Members

Change the `order` column in CSV:

**Before** (MD at position 1):
```csv
Arun Kumar Pandit,Managing Director,...,1
Dhurba Raj Tirpathi,Director,...,2
```

**After** (MD at position 5):
```csv
Dhurba Raj Tirpathi,Director,...,1
Arun Kumar Pandit,Managing Director,...,5
```

Run `npm run build:content` - members display in new order.

---

## Removing Team Members

1. **Delete row** from CSV
2. **Delete image** from `images/` folder (optional - orphaned images ignored)
3. **Build**: `npm run build:content`

---

## Troubleshooting

### Image not showing

**Check**:
1. Image file exists in `content/team/images/`
2. Filename contains name parts (slug match)
3. Valid format (`.jpg`, `.jpeg`, `.png`, `.webp`)
4. Build completed successfully
5. Image copied to `public/team/` folder

**Build log shows**:
```
👥 Parsing team CSV...
   ✓ Image found for Arun Kumar Pandit  ← Should see this
```

### Wrong image displaying

**Cause**: Multiple files match the same name

**Fix**: Use exact slug match:
```
arun-kumar-pandit.jpg  ← Exact (preferred)
arun-pandit-photo.jpg  ← Fuzzy (may conflict)
```

### Build error: Missing field

**Error**:
```
❌ Missing 'role' field for Arun Kumar Pandit
```

**Fix**: Ensure all required columns filled in CSV

---

## Technical Details

### Build Process

1. **Parse CSV**: Read team member data
2. **Auto-detect**: Search for matching images
3. **Generate**: Create `team.json` with image paths
4. **Copy**: Images to `public/team/` for serving
5. **Display**: Component uses JSON data

### File Locations

- **Source CSV**: `content/team/team.csv`
- **Source images**: `content/team/images/`
- **Generated JSON**: `src/data/generated/team.json`
- **Public images**: `public/team/` (auto-generated)
- **Component**: `src/app/about/page.tsx`

### Image Fallback Logic

```typescript
if (member.hasImage && member.image) {
  // Show profile photo
  <img src={member.image} />
} else {
  // Show purple icon
  <Users icon />
}
```

---

## Best Practices

### CSV Editing

- Use Excel, Google Sheets, or any CSV editor
- Keep data clean (no extra spaces)
- Use consistent formatting
- Verify changes before committing

### Image Management

- Use professional headshots
- Consistent lighting and background
- Square crop (1:1 aspect ratio)
- Optimize file size before adding
- Use descriptive filenames

### Version Control

- Commit CSV changes
- Commit image additions
- Generated JSON auto-updated (don't edit manually)
- Public folder images ignored by git (regenerated)

---

## Summary

**✅ Easy to manage**: Edit CSV in Excel
**✅ Optional images**: Works with or without photos
**✅ Auto-detection**: Smart name matching
**✅ Fallback icons**: Professional default display
**✅ Build-time processing**: Fast runtime performance

Add images when available, use icons when not - the system handles both seamlessly!
