# Equipment Catalog Management Guide

## Overview

The equipment catalog uses the same CSV-based content management system as projects and teams. All equipment data, specifications, categories, and media are managed through simple CSV files and directory structures.

---

## Quick Start

### 1. Add New Equipment

**Edit the CSV file:**
```
content/equipment/equipment.csv
```

**Add a new row** with the following columns:

```csv
id,name,category,manufacturer,model,key_spec,description,capacity,accuracy,standards,software,applications,images,spec_sheet
```

**Example:**
```csv
pda-8000s,Pile Driving Analyzer PDA-8000S,pile-testing,Pile Dynamics Inc.,PDA-8000S,40000 kN Capacity,Industry-standard dynamic pile testing equipment...,Testing Range: 100 kN - 40000 kN,±2% of reading,ASTM D4945;ISO 9001:2015,PDI-PDA Software,Driven pile testing;Drilled shaft testing,,
```

### 2. Add Equipment Images (Optional)

**Create a folder:**
```
content/equipment/{equipment-id}/images/
```

**Add your images:**
```
content/equipment/pda-8000s/images/
  ├── pda-field.jpg
  ├── pda-closeup.jpg
  └── pda-setup.jpg
```

**Note:** Images are auto-detected! Leave the `images` column empty in CSV and the build system will automatically find and include all images from the folder.

### 3. Add Specification Sheet (Optional)

**Create a folder:**
```
content/equipment/{equipment-id}/spec-sheet/
```

**Add your PDF:**
```
content/equipment/pda-8000s/spec-sheet/
  └── pda-8000s-datasheet.pdf
```

### 4. Build Content

```bash
npm run build:content
```

This will:
- Parse your CSV
- Validate all data
- Auto-detect images and spec sheets
- Copy media to `public/equipment/`
- Generate `src/data/generated/equipment.json`

---

## CSV Column Reference

### Required Fields

| Column | Description | Example |
|--------|-------------|---------|
| `id` | Unique identifier (kebab-case) | `pda-8000s` |
| `name` | Full equipment name | `Pile Driving Analyzer PDA-8000S` |
| `category` | Equipment category | `pile-testing` |
| `description` | 1-2 sentence overview | `Industry-standard dynamic pile testing equipment...` |

### Optional Fields

| Column | Description | Example |
|--------|-------------|---------|
| `manufacturer` | Brand/manufacturer name | `Pile Dynamics Inc.` |
| `model` | Model number | `PDA-8000S` |
| `key_spec` | Highlight spec for card view | `40000 kN Capacity` |
| `capacity` | Full capacity specification | `Testing Range: 100 kN - 40000 kN` |
| `accuracy` | Measurement accuracy | `±2% of reading` |
| `standards` | Semicolon-separated standards | `ASTM D4945;ISO 9001:2015;EN 12699` |
| `software` | Software/technology details | `PDI-PDA Software with real-time analysis` |
| `applications` | Semicolon-separated list | `Driven pile testing;Drilled shaft testing` |
| `images` | Semicolon-separated filenames | `pda-field.jpg;pda-setup.jpg` (or leave empty for auto-detection) |
| `spec_sheet` | PDF filename | `pda-8000s-datasheet.pdf` (or leave empty for auto-detection) |
| `featured` | Show on homepage | `TRUE` or `FALSE` |

---

## Equipment Categories

**Available Categories** (defined in `content/equipment/categories.csv`):

| ID | Label | Description |
|----|-------|-------------|
| `pile-testing` | Pile Testing | Dynamic and static pile load testing equipment |
| `drilling` | Drilling | Core drilling and borehole investigation rigs |
| `laboratory` | Laboratory | Soil and rock testing laboratory instruments |
| `geophysical` | Geophysical | Geophysical survey and subsurface investigation tools |
| `field-testing` | Field Testing | In-situ field testing equipment |

**Category Requirements:**
- Must use one of the 5 pre-defined categories
- Category ID must be lowercase, kebab-case
- Custom category colors can be defined in `categories.csv`

---

## Media Management

### Images

**Supported Formats:**
- `.jpg`, `.jpeg`, `.png`

**Recommended Sizes:**
- Hero image: 800x600px minimum
- Additional images: 1200x900px for best quality

**Auto-Detection:**
1. Create folder: `content/equipment/{id}/images/`
2. Add images to folder
3. Leave `images` column empty in CSV
4. Build system will:
   - Auto-detect all images
   - Sort alphabetically
   - Use first image as hero image

**Manual Override (CSV):**
If you want specific images or custom order:
```csv
images
pda-hero.jpg;pda-detail-1.jpg;pda-detail-2.jpg
```

**Hero Image:**
- First image in the list is used as the hero image
- Displayed on equipment card
- Featured in modal carousel

### Specification Sheets

**Supported Format:**
- PDF only (`.pdf`)

**Auto-Detection:**
1. Create folder: `content/equipment/{id}/spec-sheet/`
2. Add PDF to folder
3. Leave `spec_sheet` column empty in CSV
4. Build system will auto-detect the first PDF

**Manual Override (CSV):**
```csv
spec_sheet
pda-8000s-technical-specs.pdf
```

---

## Complete Example

### Directory Structure

```
content/equipment/
├── equipment.csv
├── categories.csv
├── pda-8000s/
│   ├── images/
│   │   ├── pda-field.jpg         (auto-detected as hero)
│   │   ├── pda-closeup.jpg
│   │   └── pda-setup.jpg
│   └── spec-sheet/
│       └── pda-datasheet.pdf
├── rotary-drill-700m/
│   ├── images/
│   │   └── drill-operation.jpg
│   └── spec-sheet/
│       └── drill-specs.pdf
└── ...
```

### CSV Entry

```csv
id,name,category,manufacturer,model,key_spec,description,capacity,accuracy,standards,software,applications,images,spec_sheet
pda-8000s,Pile Driving Analyzer PDA-8000S,pile-testing,Pile Dynamics Inc.,PDA-8000S,40000 kN Capacity,Industry-standard dynamic pile testing equipment for quality assurance and bearing capacity evaluation of driven piles and drilled shafts.,Testing Range: 100 kN - 40000 kN,±2% of reading,ASTM D4945;ISO 9001:2015;EN 12699,PDI-PDA Software with real-time signal analysis,Driven pile testing;Drilled shaft testing;Foundation quality assurance;Bearing capacity evaluation,,
```

### Generated Output

After running `npm run build:content`, this generates:

**Public Files:**
```
public/equipment/pda-8000s/
├── images/
│   ├── pda-field.jpg
│   ├── pda-closeup.jpg
│   └── pda-setup.jpg
└── spec-sheet/
    └── pda-datasheet.pdf
```

**JSON Data:**
```json
{
  "id": "pda-8000s",
  "name": "Pile Driving Analyzer PDA-8000S",
  "category": "pile-testing",
  "manufacturer": "Pile Dynamics Inc.",
  "model": "PDA-8000S",
  "keySpec": "40000 kN Capacity",
  "description": "Industry-standard dynamic pile testing equipment...",
  "specs": {
    "capacity": "Testing Range: 100 kN - 40000 kN",
    "accuracy": "±2% of reading",
    "standards": ["ASTM D4945", "ISO 9001:2015", "EN 12699"],
    "software": "PDI-PDA Software with real-time signal analysis"
  },
  "applications": [
    "Driven pile testing",
    "Drilled shaft testing",
    "Foundation quality assurance",
    "Bearing capacity evaluation"
  ],
  "media": {
    "images": [
      "pda-8000s/images/pda-field.jpg",
      "pda-8000s/images/pda-closeup.jpg",
      "pda-8000s/images/pda-setup.jpg"
    ],
    "specSheet": "pda-8000s/spec-sheet/pda-datasheet.pdf",
    "heroImage": "pda-8000s/images/pda-field.jpg"
  },
  "featured": false
}
```

---

## Editing Existing Equipment

### Update Equipment Details

1. Open `content/equipment/equipment.csv` in Excel or a text editor
2. Find the row with the equipment ID
3. Edit any column values
4. Save the file
5. Run `npm run build:content`

### Add/Remove Images

**Add Images:**
1. Add new image files to `content/equipment/{id}/images/`
2. Run `npm run build:content` (auto-detects new images)

**Remove Images:**
1. Delete image files from `content/equipment/{id}/images/`
2. Run `npm run build:content`

**Change Hero Image:**
1. Rename images so desired hero is alphabetically first
   - OR -
2. Manually specify in CSV: `images` column → `hero.jpg;other1.jpg;other2.jpg`

### Update Specification Sheet

1. Replace PDF in `content/equipment/{id}/spec-sheet/`
2. Keep same filename, or update `spec_sheet` column in CSV
3. Run `npm run build:content`

---

## Removing Equipment

### Soft Delete (Recommended)

Delete the row from `equipment.csv` and rebuild:
```bash
# 1. Delete row from CSV
# 2. Rebuild
npm run build:content
```

**Note:** Media files remain in `content/equipment/{id}/` for recovery if needed.

### Hard Delete

Remove both CSV entry and media files:
```bash
# 1. Delete row from equipment.csv
# 2. Delete folder
rm -rf content/equipment/{id}/
# 3. Rebuild
npm run build:content
```

---

## Featured Equipment

To feature equipment on the homepage:

1. Set `featured` column to `TRUE` in CSV
2. Rebuild: `npm run build:content`
3. Featured equipment will appear in homepage carousel (if implemented)

**Example:**
```csv
...,featured
...,TRUE
```

---

## Validation & Error Handling

### Build Validation

The build system validates:
- ✅ Required fields (id, name, category, description)
- ✅ ID format (kebab-case)
- ✅ Category matches allowed list
- ✅ Duplicate IDs
- ✅ Media file existence (warnings only)

### Common Errors

**Error: Invalid equipment ID format**
```
❌ Invalid equipment ID format: "PDA 8000S"
   Equipment IDs must be lowercase, kebab-case (e.g., "pda-8000s")
```
**Fix:** Use lowercase letters, numbers, and hyphens only.

**Error: Invalid category**
```
❌ Invalid category "pile_testing" for equipment: pda-8000s
   Allowed categories: pile-testing, drilling, laboratory, geophysical, field-testing
```
**Fix:** Use one of the 5 allowed categories with hyphens (not underscores).

**Error: Missing required field**
```
❌ Missing required field "description" for equipment: pda-8000s
```
**Fix:** Add the missing field value in CSV.

**Warning: Media file not found**
```
⚠️  Warning: image file not found
   Equipment: pda-8000s
   File: content/equipment/pda-8000s/images/missing.jpg
```
**Fix:** Add the missing file or update CSV to remove reference.

---

## Advanced Features

### Custom Category Colors

Edit `content/equipment/categories.csv`:

```csv
id,label,color,gradientFrom,gradientTo,description
pile-testing,Pile Testing,#7c3aed,purple-500,purple-700,Dynamic and static pile load testing equipment
```

**Color Format:**
- `color`: Hex code (e.g., `#7c3aed`)
- `gradientFrom`, `gradientTo`: Tailwind color classes (e.g., `purple-500`)

### Semicolon-Separated Lists

For standards and applications, use semicolons (`;`) to separate items:

```csv
standards
ASTM D4945;ISO 9001:2015;EN 12699;AASHTO T123
```

This will parse to:
```json
["ASTM D4945", "ISO 9001:2015", "EN 12699", "AASHTO T123"]
```

### Empty Fields

Optional fields can be left empty:
```csv
...,manufacturer,model,...
...,,,          # No manufacturer or model
```

---

## Troubleshooting

### Images Not Showing

**Check:**
1. Images are in `content/equipment/{id}/images/` folder
2. Build ran successfully: `npm run build:content`
3. Images copied to `public/equipment/{id}/images/`
4. Image extensions are `.jpg`, `.jpeg`, or `.png`

### Category Not Showing

**Check:**
1. Category ID matches one of the 5 allowed categories
2. Category uses kebab-case (hyphens, not underscores)
3. `content/equipment/categories.csv` exists and is valid

### Build Fails

**Debug Steps:**
1. Check CSV for malformed rows (missing commas, quotes)
2. Validate all required fields are present
3. Check for duplicate equipment IDs
4. Review build error messages for specific issues

---

## Tips & Best Practices

### Content Tips

1. **Key Spec:** Make it concise and impactful
   - ✅ Good: `40000 kN Capacity`
   - ❌ Too long: `Maximum testing capacity of 40000 kN with high precision`

2. **Description:** Keep to 1-2 sentences
   - Focus on primary purpose and key benefit
   - Avoid overly technical jargon

3. **Applications:** List practical use cases
   - Be specific (not just "testing")
   - Think from client's perspective

### Media Tips

1. **Hero Image:** Choose action/field shots
   - Equipment in use at project sites
   - Clear, well-lit, professional
   - Avoid stock photos

2. **Additional Images:** Show variety
   - Different angles
   - Close-ups of controls/interfaces
   - Transport/setup configurations

3. **Spec Sheets:** Use manufacturer PDFs
   - Official datasheets preferred
   - Include model number in filename
   - Keep file sizes reasonable (<5MB)

### Workflow Tips

1. **Batch Editing:** Use Excel for bulk changes
   - Sort by category
   - Copy-paste common standards
   - Use fill-down for manufacturer names

2. **Version Control:** Commit CSV changes with descriptive messages
   ```bash
   git add content/equipment/equipment.csv
   git commit -m "Add 3 new laboratory equipment items"
   ```

3. **Testing:** Always rebuild and test locally before deploying
   ```bash
   npm run build:content
   npm run dev
   # Test equipment page and modal
   ```

---

## Getting Help

**Documentation:**
- [Content Management Overview](./content-management.md)
- [CSV Parser Documentation](../scripts/parsers/equipment-parser.ts)
- [Equipment Types Reference](../src/types/equipment.ts)

**Common Issues:**
- Build errors: Check validation rules above
- Images not showing: Verify folder structure and file extensions
- Categories not working: Confirm category ID matches allowed list

**Need to add a new category?** Contact the development team to update:
- `src/types/equipment.ts` (EquipmentCategory type)
- `scripts/parsers/equipment-parser.ts` (ALLOWED_CATEGORIES)
- `content/equipment/categories.csv` (category metadata)

---

Last Updated: 2025-12-11
