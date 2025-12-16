# Services Management Guide

Complete guide for managing NSEGS services content using CSV files.

---

## Overview

Services are managed through two CSV files that work together:
1. **`services.csv`** - Individual service definitions (PDA Testing, CBR Test, etc.)
2. **`service-categories.csv`** - Service category metadata (Pile Testing, Soil Laboratory, etc.)

When you run `npm run build:content`, these CSV files are parsed, validated, and transformed into `src/data/generated/services.json` for use on the website.

---

## File Locations

```
content/services/
├── services.csv                    # Individual services (17 services)
├── service-categories.csv          # Category metadata (6 categories)
└── {service-id}/                   # Service media folders
    ├── images/                     # Service images
    │   └── {service-id}.jpg
    └── diagrams/                   # Optional technical diagrams
        └── {diagram-name}.svg

public/images/services/             # Auto-generated (copied from content/)
public/images/diagrams/             # Auto-generated (copied from content/)

src/data/generated/services.json   # Auto-generated (do not edit manually)
```

---

## CSV File Structures

### 1. `services.csv`

Contains individual service definitions.

**Columns:**

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `id` | ✅ | Unique kebab-case identifier | `pda-testing` |
| `category` | ✅ | Category ID (must exist in categories CSV) | `pile-testing` |
| `name` | ✅ | Service display name | `Pile Driving Analyzer (PDA)` |
| `shortDescription` | ✅ | One-line summary | `High-strain dynamic testing for pile capacity verification` |
| `fullDescription` | ✅ | Detailed description (2-3 sentences) | `PDA testing provides real-time analysis...` |
| `processSteps` | ✅ | Semicolon-separated steps | `Install sensors;Monitor pile driving;Capture data` |
| `equipmentUsed` | ✅ | Semicolon-separated equipment | `PDA System;Strain Transducers;Accelerometers` |
| `typicalDeliverables` | ✅ | Semicolon-separated deliverables | `PDA Report;Capacity Analysis;Driving Record` |
| `icon` | ✅ | Lucide icon name | `Hammer`, `Beaker`, `Activity` |
| `image` | ✅ | Image filename (in service folder) | `pda-testing.jpg` |
| `diagram` | Optional | Optional diagram filename | `pda-process.svg` |

**Valid Categories:**
- `pile-testing`
- `soil-laboratory`
- `rock-laboratory`
- `drilling`
- `geophysical`
- `ndt`

**Valid Icon Names:**
Common Lucide icons: `Hammer`, `Beaker`, `Box`, `Drill`, `Waves`, `Shield`, `Activity`, `BarChart`, `Triangle`, `Scissors`, `Filter`, `Gauge`, `Zap`, `Radio`, `Grid`, `Layers`, `TrendingUp`, `Map`

**Example Row:**

```csv
id,category,name,shortDescription,fullDescription,processSteps,equipmentUsed,typicalDeliverables,icon,image,diagram
cbr-test,soil-laboratory,California Bearing Ratio (CBR),Evaluate subgrade strength for pavement design,"CBR testing measures soil strength for pavement design. It determines the bearing capacity of soil and aggregates for road construction applications.","Prepare compacted specimen;Soak sample (if required);Measure swell;Perform penetration test;Calculate CBR value","CBR Mold;Loading Machine;Dial Gauges;Surcharge Weights","CBR Report;Load-Penetration Curve;Swell Data;Design Recommendations",BarChart,cbr-test.jpg,
```

### 2. `service-categories.csv`

Contains category-level metadata.

**Columns:**

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `id` | ✅ | Unique kebab-case identifier | `pile-testing` |
| `name` | ✅ | Category display name | `Pile Testing` |
| `description` | ✅ | Category description | `Comprehensive pile foundation testing services` |
| `icon` | ✅ | Lucide icon name | `Hammer` |

**Example Row:**

```csv
id,name,description,icon
pile-testing,Pile Testing,Comprehensive pile foundation testing services,Hammer
```

---

## How to Add a New Service

### Step 1: Create Service Folder Structure

```bash
mkdir "content/services/new-service-id"
mkdir "content/services/new-service-id/images"
mkdir "content/services/new-service-id/diagrams"  # Optional
```

### Step 2: Add Images

Place service images in the images folder:

```
content/services/new-service-id/images/new-service-id.jpg
```

**Image Requirements:**
- Format: JPG, PNG, or WebP
- Recommended size: 800x600px minimum
- Max file size: 2MB
- Filename should match service ID

### Step 3: Add Diagram (Optional)

Place technical diagrams in the diagrams folder:

```
content/services/new-service-id/diagrams/process-diagram.svg
```

**Diagram Requirements:**
- Format: SVG (preferred) or PNG
- Should illustrate process/methodology
- Keep file size under 500KB

### Step 4: Update `services.csv`

Open `content/services/services.csv` in Excel or a text editor.

Add a new row with your service data:

```csv
new-service-id,soil-laboratory,New Test Name,Brief description here,"Detailed description with multiple sentences. Should explain what the test does and why it's important.","Step 1;Step 2;Step 3;Step 4","Equipment A;Equipment B;Equipment C","Report 1;Report 2;Certificate",Filter,new-service-id.jpg,process-diagram.svg
```

**Important:**
- Use semicolons (`;`) to separate array items
- Keep ID in kebab-case (lowercase with hyphens)
- Ensure category exists in `service-categories.csv`
- Match image/diagram filenames exactly

### Step 5: Build and Test

```bash
npm run build:content
```

Check for errors in the output. If successful, you'll see:

```
✅ Services data generated successfully!
   Services: 18
   Categories: 6
```

### Step 6: Verify on Website

```bash
npm run dev
```

Navigate to `/services` and verify your new service appears under the correct category.

---

## How to Edit an Existing Service

### 1. Edit Service Details

Open `content/services/services.csv` in Excel.

Find the row with the service ID you want to edit.

Update the desired fields (name, description, etc.).

**Common Edits:**
- Update pricing in description
- Add new equipment to `equipmentUsed`
- Modify process steps
- Change icon for better representation

### 2. Update Images

Replace the image file in:

```
content/services/{service-id}/images/{service-id}.jpg
```

Keep the same filename to avoid updating the CSV.

### 3. Rebuild Content

```bash
npm run build:content
npm run dev
```

Verify changes on the website.

---

## How to Delete a Service

### 1. Remove from CSV

Open `content/services/services.csv`.

Delete the entire row for the service you want to remove.

### 2. Remove Media Files (Optional)

```bash
rmdir /s "content\services\{service-id}"
```

Or manually delete the service folder.

### 3. Rebuild

```bash
npm run build:content
```

---

## How to Add a New Service Category

### Step 1: Update `service-categories.csv`

Add a new row:

```csv
new-category-id,New Category Name,Description of what this category covers,IconName
```

### Step 2: Update Type Definitions

Edit `src/types/service.ts`:

```typescript
export type ServiceCategory =
  | 'pile-testing'
  | 'soil-laboratory'
  | 'rock-laboratory'
  | 'drilling'
  | 'geophysical'
  | 'ndt'
  | 'new-category-id';  // Add your new category
```

### Step 3: Update Parser Validation

Edit `scripts/parsers/services-parser.ts`:

```typescript
const VALID_CATEGORIES: ServiceCategory[] = [
  'pile-testing',
  'soil-laboratory',
  'rock-laboratory',
  'drilling',
  'geophysical',
  'ndt',
  'new-category-id'  // Add here
];
```

### Step 4: Update Services Page Styling

Edit `src/app/services/page.tsx` - Add color mapping:

```typescript
const categoryColors: Record<string, string> = {
  // ... existing colors ...
  'new-category-id': 'from-purple-500 to-blue-700'
};
```

### Step 5: Add Applications Data

In the same file, add applications:

```typescript
const applicationsByCategory: Record<string, string[]> = {
  // ... existing applications ...
  'new-category-id': [
    'Application 1',
    'Application 2',
    'Application 3'
  ]
};
```

### Step 6: Rebuild and Test

```bash
npm run build:content
npm run dev
```

---

## Advanced: Using Semicolons in CSV

If you need to use a semicolon in your text (not as a separator), there are two options:

### Option 1: Use Different Separator

Change array separator in the CSV. Currently arrays use `;`:

```csv
"Equipment A;Equipment B;Equipment C"
```

### Option 2: Escape in Code

Update `services-parser.ts` to handle escaped semicolons:

```typescript
const processSteps = row.processSteps
  ? row.processSteps.split(';').map(s => s.trim().replace('\\;', ';'))
  : [];
```

Then in CSV, use `\;` for literal semicolons:

```csv
"Step 1: Do this\; then that;Step 2;Step 3"
```

---

## Troubleshooting

### Error: "Invalid category for service"

**Cause:** Service references a category that doesn't exist in `service-categories.csv`.

**Fix:**
1. Check the `category` value in `services.csv`
2. Ensure it matches an `id` in `service-categories.csv`
3. Check for typos (e.g., `pile-test` vs `pile-testing`)

### Error: "Image not found for service"

**Cause:** Image file doesn't exist or filename doesn't match CSV.

**Fix:**
1. Check image exists: `content/services/{service-id}/images/{filename}`
2. Verify filename in CSV matches actual file
3. Check file extension (jpg vs jpeg vs png)

### Error: "CSV parsing failed"

**Cause:** Malformed CSV (missing quotes, extra commas, etc.)

**Fix:**
1. Open CSV in a text editor (not Excel)
2. Check for unescaped quotes or commas
3. Ensure all fields with commas/newlines are wrapped in quotes
4. Validate CSV at: https://csvlint.io/

### Services Not Showing on Website

**Checklist:**
- ✅ Ran `npm run build:content` after editing CSV
- ✅ No build errors in console
- ✅ Generated `src/data/generated/services.json` exists
- ✅ Service category ID is valid
- ✅ Restarted dev server (`npm run dev`)

### Wrong Icon Displaying

**Cause:** Icon name in CSV doesn't match a valid Lucide icon.

**Fix:**
1. Check icon name against Lucide docs: https://lucide.dev/icons/
2. Use exact case: `Hammer` not `hammer`
3. Common icons: `Hammer`, `Beaker`, `Box`, `Drill`, `Waves`, `Shield`

---

## Data Flow Diagram

```
services.csv + service-categories.csv
            ↓
   (Edit in Excel/CSV Editor)
            ↓
   npm run build:content
            ↓
  scripts/parsers/services-parser.ts
            ↓
    Validate & Transform
            ↓
   Copy images to public/
            ↓
  src/data/generated/services.json
            ↓
 src/app/services/page.tsx (reads JSON)
            ↓
    Website displays services
```

---

## Best Practices

### 1. Service IDs

- Use kebab-case: `static-load-test` not `Static_Load_Test`
- Be descriptive but concise
- Don't change IDs after creation (breaks links)

### 2. Descriptions

- **Short Description:** 1 line, under 100 characters
- **Full Description:** 2-3 sentences, explain what, why, how
- Avoid marketing fluff, be technical but accessible

### 3. Process Steps

- Keep to 4-6 steps
- Start each with an action verb
- Be specific but concise: `"Drill to test depth"` not `"Drilling is performed"`

### 4. Equipment Lists

- Use proper equipment names
- Include capacities where relevant: `"Load Cells (1000 tons)"`
- Order by importance

### 5. Deliverables

- List concrete outputs clients receive
- Include report names, data types, certificates
- Be specific: `"CBR Report"` not `"Test Results"`

### 6. Images

- Use real project photos, not stock images
- Show equipment in action when possible
- Ensure good lighting and composition
- Optimize before adding (use JPEG compression)

---

## Quick Reference Commands

```bash
# Build all content (including services)
npm run build:content

# Run development server
npm run dev

# Build for production
npm run build

# View generated services JSON
cat src/data/generated/services.json

# Validate CSV (Windows)
type content\services\services.csv

# Count services
findstr /R /C:"^[^,]*," content\services\services.csv | find /C /V ""
```

---

## Related Files

- **CSV Data:** `content/services/services.csv`, `content/services/service-categories.csv`
- **Parser:** `scripts/parsers/services-parser.ts`
- **Types:** `src/types/service.ts`
- **Generated Output:** `src/data/generated/services.json`
- **Services Page:** `src/app/services/page.tsx`
- **Build Pipeline:** `scripts/build-content.ts`

---

## Migration Notes

The services system was migrated from hardcoded TypeScript data (`src/data/services.ts`) to CSV-based content management on 2024-12-15.

**Benefits of CSV System:**
- ✅ Non-developers can edit content
- ✅ Excel-friendly editing
- ✅ Easier to bulk update
- ✅ Consistent with projects/equipment systems
- ✅ Automated validation
- ✅ Media file management

**What Changed:**
- Services data moved from `.ts` to `.csv`
- Added build pipeline integration
- Services page now reads from generated JSON
- Image management automated

**Backward Compatibility:**
- Backup of old data kept in `servicesBackup` variable
- Can switch back by commenting out CSV import

---

**Last Updated:** 2024-12-15
**Version:** 1.0.0
