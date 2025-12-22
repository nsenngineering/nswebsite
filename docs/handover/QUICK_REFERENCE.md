# Content Update Quick Reference

**For**: Non-Technical Content Editors
**Last Updated**: 2024-12-22

---

## What You Can Update

| What | Where to Edit | Where to Upload Assets | Auto-Detects Files? |
|------|---------------|------------------------|---------------------|
| 📍 **Projects** | Google Sheets → `Projects` | `projects/{id}/images/` + `pdfs/` | ✅ Yes |
| 🔧 **Services** | Google Sheets → `Services` | `services/{id}/images/` | ✅ Yes |
| 👥 **Team** | Google Sheets → `Team` | `team/{name}.jpg` | ⚠️ Must match name |
| 📚 **eLibrary** | Google Sheets → `ElibraryDocuments` | `elibrary/{id}/files/` | ✅ Yes (first PDF) |
| 🎯 **Hero Images** | *(Optional)* Google Sheets | `homepage_hero/images/` | ✅ Yes (all files) |
| 📅 **Milestones** | Google Sheets → `HomepageHeroMilestones` | `homepage_hero/images/` | ❌ Must specify name |
| 🎓 **Alumni** | Google Sheets → `Alumni` | `alumni/{id}/profile.jpg` | ✅ Must be "profile.*" |
| ❓ **FAQ** | Google Sheets → `FAQ` | No files needed | N/A |

---

## How to Add a New Project

### Step 1: Add Metadata (Google Sheets)

1. Open the Google Sheet (link from team lead)
2. Go to `Projects` tab
3. Add new row with:
   - **id**: `my-project` (lowercase, hyphens, no spaces)
   - **title**: Project full name
   - **client**: Client name
   - **category**: Choose from: `pile-testing`, `laboratory`, `drilling`, etc.
   - **year**: 2024
   - **location_name**: City/Area
   - **coordinates_lat**: 27.xxxx
   - **coordinates_lng**: 85.xxxx
   - **scope**: Brief description
   - **images**: Leave empty (auto-detects) OR list: `img1.jpg;img2.jpg`
   - **pdfs**: Leave empty OR list: `doc1.pdf;doc2.pdf`
   - **hero_image**: Leave empty (uses first image) OR specify: `main.jpg`
   - **featured**: TRUE or FALSE

### Step 2: Upload Files (Google Drive)

1. Open Google Drive content folder
2. Create folder: `projects/my-project/`
3. Inside, create: `images/` folder
4. Upload photos to `images/`
5. *(Optional)* Create `pdfs/` folder
6. Upload PDFs to `pdfs/`

### Step 3: Deploy (Developer)

- Developer runs deployment (automatic on push to GitHub)
- Changes appear on website in ~15 minutes

---

## How to Add a New Service

### Step 1: Add Metadata (Google Sheets)

1. Go to `Services` tab
2. Add new row with:
   - **id**: `my-service` (kebab-case)
   - **category**: Choose from: `pile-testing`, `soil-laboratory`, etc.
   - **name**: Service name
   - **shortDescription**: One sentence
   - **fullDescription**: Full paragraph
   - **processSteps**: Step 1;Step 2;Step 3 (semicolon-separated)
   - **equipmentUsed**: Tool 1;Tool 2 (semicolon-separated)
   - **typicalDeliverables**: Output 1;Output 2
   - **images**: Leave empty (auto-detects)
   - **hero_image**: Leave empty or specify filename
   - **featured**: TRUE or FALSE

### Step 2: Upload Images

1. Go to Google Drive: `services/my-service/images/`
2. Upload service images

---

## How to Add a Team Member

### Step 1: Add Metadata (Google Sheets)

1. Go to `Team` tab
2. Add new row:
   - **name**: Arun Kumar Pandit
   - **role**: Managing Director
   - **education**: MSc. Geotechnical Engineering
   - **experience**: 19 Years
   - **order**: 1 (display order)

### Step 2: Upload Photo

1. Go to Google Drive: `team/` folder
2. Upload photo with **exact name**: `arun-kumar-pandit.jpg`
   - ⚠️ **IMPORTANT**: Lowercase, hyphens instead of spaces
   - ✅ Good: `arun-kumar-pandit.jpg`
   - ❌ Bad: `Arun Kumar Pandit.jpg`, `arun_pandit.jpg`, `ArunPandit.jpg`

---

## How to Add an eLibrary Document

### Step 1: Add Metadata (Google Sheets)

1. Go to `ElibraryDocuments` tab
2. Add new row:
   - **id**: `astm-d4945` (kebab-case)
   - **title**: Full document title
   - **section**: `standards`, `publications`, or `newsletters`
   - **category**: Pile Testing, Soil Testing, etc.
   - **author**: Author/Organization
   - **date**: 2024-01-15 (YYYY-MM-DD format)
   - **summary**: Brief description
   - **content**: Full description
   - **file_url**: Leave empty (auto-detects) OR specify filename
   - **tags**: tag1;tag2;tag3
   - **featured**: TRUE or FALSE

### Step 2: Upload PDF

1. Go to Google Drive: `elibrary/astm-d4945/files/`
2. Upload PDF file

---

## How to Update Hero Carousel Images

### Option A: Just Upload (Simplest)

1. Go to Google Drive: `homepage_hero/images/`
2. Upload images (JPG, PNG, WEBP)
3. ✅ Done! Images appear automatically
4. Order: Alphabetical by filename

### Option B: Custom Alt Text

1. Upload to `homepage_hero/images/`
2. Go to Google Sheets → `HomepageHeroCarousel` tab
3. Add row with `alt_text` for each image
4. Order matches row order in sheet

---

## Asset Naming Rules

### ✅ Good Folder Names
```
projects/ktft-fast-track-1/images/
services/pile-testing/images/
elibrary/astm-d4945/files/
alumni/ram-sharma/
```

### ❌ Bad Folder Names
```
Projects/KTFT Fast Track/Images/     ❌ (capital letters, spaces)
services/Pile Testing/images/        ❌ (spaces, capitals)
elibrary/ASTM D4945/Files/          ❌ (capitals, spaces)
```

### ✅ Good File Names
```
site-photo-1.jpg
test-results.pdf
profile.jpg
```

### ❌ Bad File Names
```
Site Photo 1.jpg        ❌ (spaces, capitals)
Test Results (Final).pdf ❌ (spaces, parentheses)
Arun Pandit.JPG        ❌ (spaces)
```

**Rules**:
1. Lowercase letters only
2. Use hyphens (`-`) instead of spaces
3. No special characters: `()[]!@#$%`
4. Use extensions: `.jpg`, `.png`, `.pdf`

---

## Common Mistakes to Avoid

### Mistake 1: Wrong Folder Structure
❌ Uploading `projects/project-image.jpg` (missing nested folders)
✅ Upload to `projects/my-project/images/project-image.jpg`

### Mistake 2: Capital Letters in IDs
❌ Google Sheets ID: `My-Project` or `MyProject`
✅ Google Sheets ID: `my-project`

### Mistake 3: Spaces in Filenames
❌ `Photo 1.jpg`, `Test Results.pdf`
✅ `photo-1.jpg`, `test-results.pdf`

### Mistake 4: Wrong Team Photo Names
❌ `Arun Pandit.jpg`, `arun_pandit.jpg`, `pandit-arun.jpg`
✅ `arun-kumar-pandit.jpg` (must match name exactly, in kebab-case)

### Mistake 5: Forgetting Semicolons
When listing multiple files in CSV:
❌ `image1.jpg, image2.jpg, image3.jpg` (commas)
✅ `image1.jpg;image2.jpg;image3.jpg` (semicolons)

### Mistake 6: Wrong Date Format
❌ `15/01/2024`, `Jan 15 2024`, `2024/01/15`
✅ `2024-01-15` (YYYY-MM-DD)

---

## When to Use Auto-Detection vs Manual Entry

### Use Auto-Detection (Leave Field Empty)
- ✅ You have all files in correct folder
- ✅ You want system to find all files automatically
- ✅ You're not sure about filenames
- ✅ Examples: Hero images, project images, service images

### Use Manual Entry (Fill in CSV)
- ✅ You want specific order
- ✅ You want to exclude some files
- ✅ You know exact filenames
- ✅ You want a specific hero/featured image

---

## Who to Ask for Help

### For Content Questions
- What to write in descriptions
- Which category to choose
- Featured vs non-featured

**Ask**: Content Manager 

**Pro Tip**: When in doubt, look at existing examples in Google Sheets and Google Drive to see the correct format!
