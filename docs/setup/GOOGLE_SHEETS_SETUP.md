# Google Sheets Setup Guide

## Overview

This guide will walk you through setting up Google Sheets integration for the NS Engineering website. Once complete, you'll be able to manage all website content (projects, team, milestones, etc.) through a single Google Spreadsheet instead of editing CSV files.

## Prerequisites

- Google account
- Access to Google Cloud Console
- Project repository cloned locally
- `google-credentials.json` file placed in project root ✅ (You already have this!)

---

## Part 1: Google Cloud Setup (15-20 minutes)

### Step 1: Create Google Cloud Project (5 min)

1. Go to https://console.cloud.google.com
2. Click "Select a Project" dropdown (top navigation bar)
3. Click "New Project" button
4. Enter project name: **"NS Engineering Website"**
5. Click **"Create"**
6. Wait for project creation (30-60 seconds)
7. Make sure the new project is selected in the dropdown

### Step 2: Enable Google Sheets API (2 min)

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. In the search bar, type: **"Google Sheets API"**
3. Click on **"Google Sheets API"** from results
4. Click the blue **"Enable"** button
5. Wait for API to be enabled (~10 seconds)

### Step 3: Create Service Account (5 min)

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** button (top of page)
3. Select **"Service Account"** from dropdown
4. Fill in the form:
   - **Service account name**: `ns-website-sheets-reader`
   - **Service account ID**: (auto-generated, leave it)
   - **Description**: "Read-only access to website content sheets"
5. Click **"Create and Continue"**
6. **Grant access** (Step 2 of form):
   - Click the "Role" dropdown
   - Search for and select: **"Viewer"** (under "Basic" section)
   - This gives read-only access
7. Click **"Continue"**
8. **Grant users access** (Step 3 - optional):
   - Leave blank, click **"Done"**

### Step 4: Generate JSON Key (3 min)

1. You should now see your service account in the list
2. Click on the **service account email** (looks like: `ns-website-sheets-reader@project-id.iam.gserviceaccount.com`)
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Select **"JSON"** format
6. Click **"Create"**
7. A JSON file will download automatically
8. **IMPORTANT**:
   - Rename the downloaded file to: `google-credentials.json`
   - Move it to your project root directory (same level as `package.json`)
   - ✅ You've already done this!

9. **Copy the service account email** - you'll need it in the next step
   - Format: `ns-website-sheets-reader@YOUR-PROJECT-ID.iam.gserviceaccount.com`
   - Keep this handy - you'll paste it when sharing the spreadsheet

---

## Part 2: Google Sheets Setup (10-15 minutes)

### Step 5: Create Spreadsheet with Multiple Tabs (10 min)

1. Go to https://sheets.google.com
2. Click **"Blank"** to create a new spreadsheet
3. Name it: **"NS Engineering Data"** (top-left corner)

Now you'll create 6 tabs by uploading your CSV files:

#### Tab 1: Projects

1. Go to **File** → **Import** → **Upload** tab
2. Click **"Browse"** and select: `content/projects/projects.csv`
3. Import settings:
   - **Import location**: "Replace current sheet"
   - **Separator type**: "Detect automatically"
4. Click **"Import data"**
5. Rename the sheet tab (double-click "Sheet1"): **"Projects"**

#### Tab 2: HomepageHeroCarousel

1. Click the **"+"** button at bottom-left to add a new sheet
2. Double-click the new sheet name and rename to: **"HomepageHeroCarousel"**
3. Go to **File** → **Import** → **Upload** tab
4. Select: `content/homepage_hero/hero_carousel.csv`
5. Import settings:
   - **Import location**: "Insert new sheet(s)"
   - **Separator type**: "Detect automatically"
6. Click **"Import data"**
7. The data will be in a new sheet - **cut/paste** it into your "HomepageHeroCarousel" tab
8. Delete the extra imported sheet

**TIP**: For tabs 3-6, follow the same process:
- Create new tab with correct name
- Import CSV
- Move data to named tab
- Delete extra sheet

#### Tab 3: HomepageHeroMilestones

- File: `content/homepage_hero/milestones.csv`
- Tab name: **"HomepageHeroMilestones"**

#### Tab 4: Team

- File: `content/team/team.csv`
- Tab name: **"Team"**

#### Tab 5: ElibraryDocuments

- File: `content/elibrary/documents.csv`
- Tab name: **"ElibraryDocuments"**

#### Tab 6: ElibrarySections

- File: `content/elibrary/sections.csv`
- Tab name: **"ElibrarySections"**

**Your spreadsheet should now have 6 tabs at the bottom:**
```
Projects | HomepageHeroCarousel | HomepageHeroMilestones | Team | ElibraryDocuments | ElibrarySections
```

### Step 6: Share Spreadsheet with Service Account (2 min)

1. Click the **"Share"** button (top-right corner)
2. In the "Add people and groups" field:
   - **Paste your service account email** from Step 4
   - Format: `ns-website-sheets-reader@YOUR-PROJECT-ID.iam.gserviceaccount.com`
3. Set role: **"Viewer"** (read-only)
4. **UNCHECK** "Notify people" (service accounts don't need notifications)
5. Click **"Share"**
6. Click **"Done"**

### Step 7: Get Sheet ID (1 min)

1. Look at your browser's URL bar
2. URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. **Copy the Sheet ID** (the long string between `/d/` and `/edit`)
   - Example: `1abc123xyz456def789ghi012jkl345mno678pqr`
4. Save this somewhere - you'll need it next!

---

## Part 3: Environment Configuration (5 minutes)

### Step 8: Create .env.cloud File (3 min)

1. Open your terminal in the project directory
2. Copy the template:
   ```bash
   cp .env.cloud.example .env.cloud
   ```

3. Open `.env.cloud` in your editor
4. Update these values:
   ```bash
   # Content Source Mode
   CONTENT_SOURCE_MODE=sheets

   # Google Sheets Configuration
   GOOGLE_SHEET_ID=PASTE_YOUR_SHEET_ID_HERE
   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
   ```

5. **Replace `PASTE_YOUR_SHEET_ID_HERE`** with your actual Sheet ID from Step 7
6. Save the file

**Your `.env.cloud` should look like:**
```bash
CONTENT_SOURCE_MODE=sheets
GOOGLE_SHEET_ID=1abc123xyz456def789ghi012jkl345mno678pqr
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

---

## Part 4: Testing (10 minutes)

### Step 9: Test Cloud Build (5 min)

1. Open terminal in project directory
2. Run the cloud build command:
   ```bash
   npm run build:content:cloud
   ```

3. **Expected output:**
   ```
   🔨 Building content...

   📝 Using credentials file: google-credentials.json
   ✅ Connected to Google Sheet: "NS Engineering Data"
   📊 Fetching data from Google Sheets tab: "Projects"
      Rows: 50, Columns: 14
   ✅ Fetched 49 rows from "Projects"
   ✅ Successfully parsed 49 projects

   📊 Fetching data from Google Sheets tab: "HeroCarousel"
   ...
   ✅ Content build complete!
   ```

4. **If you see errors:**
   - Check Sheet ID is correct in `.env.cloud`
   - Verify service account email was added to sheet sharing
   - Confirm `google-credentials.json` is in project root
   - Check tab names match exactly (case-sensitive!)

### Step 10: Test Dev Server (3 min)

1. Start the dev server in cloud mode:
   ```bash
   npm run dev:cloud
   ```

2. Open browser: http://localhost:3000
3. **Verify:**
   - ✅ Projects page loads
   - ✅ Team page shows members
   - ✅ Hero carousel displays
   - ✅ No console errors

### Step 11: Test Fallback (2 min)

Test that CSV fallback works if Sheets fails:

```bash
# Temporarily break Sheets connection
GOOGLE_SHEET_ID=invalid npm run build:content:cloud
```

**Expected output:**
```
⚠️  Failed to fetch from Google Sheets, falling back to local CSV
📋 Using local CSV file: content/projects/projects.csv
✅ Build succeeds with CSV data
```

---

## Part 5: Workflow & Usage

### Editing Content (Going Forward)

**Option 1: Edit in Google Sheets** (Recommended)
1. Open your "NS Engineering Data" spreadsheet
2. Edit data directly in the sheets
3. Save (auto-saves)
4. Rebuild: `npm run build:content:cloud`
5. Test: `npm run dev:cloud`

**Option 2: Switch to Local Mode**
```bash
npm run dev:local  # Uses local CSV files
```

### Build Modes Comparison

| Command | Data Source | Media Source | Use Case |
|---------|-------------|--------------|----------|
| `npm run dev:local` | Local CSV | Local files | Offline development |
| `npm run dev:cloud` | Google Sheets | Local files* | Online collaboration |

*Cloudflare R2 for media will be added in next phase

### Common Commands

```bash
# Cloud mode (uses Google Sheets)
npm run build:content:cloud  # Build content only
npm run dev:cloud            # Dev server
npm run build:cloud          # Production build

# Local mode (uses CSV files)
npm run build:content:local  # Build content only
npm run dev:local            # Dev server
npm run build:local          # Production build
```

---

## Troubleshooting

### Error: "Failed to load Google Sheet"

**Solution:**
- Verify Sheet ID in `.env.cloud` is correct
- Check service account email has Viewer access to sheet
- Confirm Google Sheets API is enabled in Cloud Console

### Error: "Sheet tab not found"

**Solution:**
- Check tab names are exactly: `Projects`, `HeroCarousel`, `Milestones`, `Team`, `eLibrary`, `eLibrarySections`
- Tab names are case-sensitive!

### Error: "Credentials file not found"

**Solution:**
- Verify `google-credentials.json` is in project root
- Check path in `.env.cloud`: `GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json`

### Error: "Cannot find name 'fetchDataWithFallback'"

**Solution:**
- Run: `npm install` to ensure dependencies are installed
- Rebuild: `npm run build:content:cloud`

---

## Next Steps

✅ **Google Sheets integration complete!**

**Future enhancements:**
1. ⏳ Set up Cloudflare R2 for media storage (images, PDFs)
2. ⏳ Configure GitHub Actions to use Sheets in CI/CD
3. ⏳ Add team member access to Google Sheet for collaborative editing

For R2 setup, see: `docs/CLOUDFLARE_R2_MIGRATION.md`

---

## Files Reference

**Configuration:**
- `.env.cloud` - Cloud mode environment variables (gitignored)
- `.env.cloud.example` - Template for cloud configuration
- `google-credentials.json` - Service account credentials (gitignored)

**Code (already implemented):**
- `scripts/parsers/google-sheets-parser.ts` - Google Sheets API client
- `scripts/parsers/data-source.ts` - Data fetching with fallback
- `scripts/build-content.ts` - Main build script

**Documentation:**
- `docs/BUILD_MODES.md` - Detailed build modes comparison
- `GOOGLE_SHEETS_SETUP.md` - This file

---

## Summary

**What you completed:**
1. ✅ Created Google Cloud project
2. ✅ Enabled Google Sheets API
3. ✅ Created service account with Viewer role
4. ✅ Generated `google-credentials.json`
5. ✅ Created spreadsheet with 6 tabs
6. ✅ Uploaded all CSV data to sheets
7. ✅ Shared sheet with service account
8. ✅ Configured `.env.cloud`
9. ✅ Tested cloud build
10. ✅ Verified dev server works

**You can now:**
- Edit content in Google Sheets
- Build with `npm run dev:cloud`
- Collaborate with team (share Google Sheet with others)
- Fall back to local CSV if needed

**Ready for production!** 🚀
