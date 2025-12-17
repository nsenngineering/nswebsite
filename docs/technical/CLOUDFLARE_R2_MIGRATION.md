# Cloudflare R2 Migration Guide

This guide explains how to migrate project images from local storage to Cloudflare R2, and optionally integrate Google Sheets for content management.

## Overview

The NS Engineering website supports two content modes:

### Local Mode (Current - Default)
- **Content Source**: Local CSV file (`content/projects/projects.csv`)
- **Image Storage**: Local filesystem (`content/projects/{project-id}/images/`)
- **Image Serving**: Copied to `public/` during build
- **Benefits**: Simple, no external dependencies, works offline
- **Limitations**: Large git repository, requires developer for content updates

### Cloud Mode (Optional - R2 + Sheets)
- **Content Source**: Google Sheets (with CSV fallback)
- **Image Storage**: Cloudflare R2 (S3-compatible storage)
- **Image Serving**: Direct from R2 CDN
- **Benefits**: Fast builds, small git repo, non-technical content editing
- **Limitations**: Requires internet, external service dependencies

---

## Prerequisites

Before starting, ensure you have:

1. **Cloudflare Account** (Free tier works)
2. **Google Cloud Account** (Free tier works)
3. **Access to NS Engineering Website Repository**
4. **Node.js** 18+ installed locally

---

## Part 1: Google Sheets Setup (Optional)

### Step 1.1: Export CSV to Google Sheets

1. Open `content/projects/projects.csv` in your favorite editor
2. Go to [Google Sheets](https://sheets.google.com)
3. Create a new sheet: **"NS Engineering Projects"**
4. Import the CSV:
   - File → Import → Upload → Select `projects.csv`
   - Import location: "Replace current sheet"
   - Separator type: "Comma"
   - Click "Import data"

### Step 1.2: Add Data Validation (Recommended)

To prevent errors, add dropdowns for key columns:

**Category Column (D):**
- Select column D (Category)
- Data → Data validation
- Criteria: "List of items"
- Items: `pile-testing,hydropower,tunnel-road,transmission,ndt`
- Show dropdown list in cell: ✅
- Reject input: ✅

**Featured Column (N):**
- Select column N (Featured)
- Data → Data validation
- Criteria: "Checkbox"
- Use custom cell values: TRUE / FALSE

### Step 1.3: Share with Team

1. Click "Share" button (top-right)
2. Add team member emails with "Editor" access
3. Click "Send"

**Result**: Non-technical staff can now edit project data without git!

### Step 1.4: Create Google Cloud Service Account

#### 4a. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: **"NS Engineering Website"**
3. Select the project from the dropdown

#### 4b. Enable Google Sheets API

1. Navigation Menu → APIs & Services → Library
2. Search for "Google Sheets API"
3. Click "Enable"

#### 4c. Create Service Account

1. APIs & Services → Credentials
2. Click "Create Credentials" → "Service Account"
3. Service account name: `ns-engineering-build-script`
4. Service account ID: (auto-generated)
5. Click "Create and Continue"
6. Role: **Viewer** (read-only access)
7. Click "Done"

#### 4d. Generate JSON Key

1. Click on the newly created service account email
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Key type: **JSON**
5. Click "Create"
6. **IMPORTANT**: Save the downloaded JSON file as `google-credentials.json` in the project root

**⚠️ SECURITY WARNING**: NEVER commit `google-credentials.json` to git! It's already in `.gitignore`.

#### 4e. Share Sheet with Service Account

1. Copy the service account email (e.g., `ns-engineering-build-script@project-id.iam.gserviceaccount.com`)
2. Open your Google Sheet
3. Click "Share" button
4. Paste the service account email
5. Role: **Viewer**
6. Uncheck "Notify people"
7. Click "Share"

### Step 1.5: Configure Environment Variables

1. Open `.env.local` in the project root
2. Update the following variables:

```bash
# Get Sheet ID from URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
GOOGLE_SHEET_ID=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P

# Use credentials file (recommended for local development)
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Enable Sheets mode
CONTENT_SOURCE_MODE=sheets
```

**Alternative**: Use environment variables directly (better for CI/CD):

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=ns-engineering-build-script@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

(Copy these from the `google-credentials.json` file)

### Step 1.6: Test Sheets Integration

```bash
npm run build:content
```

**Expected output:**
```
📦 Loading project data...
📊 Fetching projects from Google Sheets...
✅ Loaded sheet: "NS Engineering Projects"
📄 Reading worksheet: "Sheet1"
📦 Found 49 projects in sheet
✅ Successfully parsed 49 projects
```

**If it fails**, check:
- Sheet ID is correct in `.env.local`
- Service account has Viewer access to the sheet
- `google-credentials.json` is in the project root
- Google Sheets API is enabled

---

## Part 2: Cloudflare R2 Setup

### Step 2.1: Create R2 Bucket

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **R2** (left sidebar)
3. Click "Create bucket"
4. Bucket name: `ns-engineering-projects`
5. Location: **Automatic** (or closest to Nepal: APAC)
6. Click "Create bucket"

### Step 2.2: Configure Public Access

#### Option A: R2.dev Subdomain (Recommended for Testing)

1. Open the `ns-engineering-projects` bucket
2. Click "Settings" tab
3. Scroll to "Public access"
4. Click "Allow Access"
5. Confirm: "Allow Public Access"

**Result**: Your bucket is now publicly accessible at:
```
https://pub-XXXXX.r2.dev
```

(Copy this URL from the "Public R2.dev bucket URL" section)

#### Option B: Custom Domain (Recommended for Production)

1. In bucket settings, go to "Custom Domains"
2. Click "Connect Domain"
3. Enter domain: `cdn.nsengineering.com.np` (or subdomain of your choice)
4. Follow Cloudflare's DNS configuration steps
5. Wait for DNS propagation (~5-30 minutes)

**Result**: Images will be served from your custom domain.

### Step 2.3: Create R2 Folder Structure

R2 doesn't have "folders" per se, but we'll organize files using path prefixes.

**Expected structure:**
```
ns-engineering-projects/
└── projects/
    ├── ktft-fast-track-1/
    │   └── images/
    │       ├── hero.jpg
    │       ├── site-1.jpg
    │       └── site-2.jpg
    ├── hydropower-project-2/
    │   └── images/
    │       └── hero.jpg
    └── ...
```

**Note**: You'll upload images in the next step.

### Step 2.4: Configure Environment Variables

Update `.env.local`:

```bash
# R2 Public URL (from Step 2.2)
NEXT_PUBLIC_R2_BASE_URL=https://pub-XXXXX.r2.dev

# Bucket name (from Step 2.1)
R2_BUCKET_NAME=ns-engineering-projects

# Base path within bucket
R2_BASE_PATH=projects
```

**For custom domain**, use:
```bash
NEXT_PUBLIC_R2_BASE_URL=https://cdn.nsengineering.com.np
```

### Step 2.5: Upload Images to R2

#### Method 1: Cloudflare Dashboard (Manual - Good for Testing)

1. Open the `ns-engineering-projects` bucket
2. Click "Upload"
3. Navigate into the bucket to `projects/` (create folder if needed)
4. For each project (e.g., `ktft-fast-track-1`):
   - Create folder: `ktft-fast-track-1/`
   - Navigate into it
   - Create folder: `images/`
   - Navigate into `images/`
   - Drag and drop images from `content/projects/ktft-fast-track-1/images/`
5. Repeat for all projects

#### Method 2: Rclone (Recommended for Bulk Upload)

**Install Rclone:**
```bash
# macOS
brew install rclone

# Linux
curl https://rclone.org/install.sh | sudo bash

# Windows
# Download from https://rclone.org/downloads/
```

**Configure Rclone for R2:**
```bash
rclone config

# Follow prompts:
# n) New remote
# name> r2
# Storage> s3
# provider> Cloudflare
# env_auth> false
# access_key_id> (from Cloudflare R2 → Manage R2 API Tokens)
# secret_access_key> (from Cloudflare R2 → Manage R2 API Tokens)
# region> auto
# endpoint> https://<account-id>.r2.cloudflarestorage.com
# (Get account ID from Cloudflare dashboard URL)
```

**Create R2 API Token:**
1. Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Create API Token
3. Token name: `ns-engineering-upload`
4. Permissions: **Object Read & Write**
5. TTL: **Forever** (or set expiration)
6. Copy Access Key ID and Secret Access Key

**Sync Images to R2:**
```bash
# Sync all project images
rclone sync content/projects/ r2:ns-engineering-projects/projects/ \
  --include "**/*.jpg" \
  --include "**/*.jpeg" \
  --include "**/*.png" \
  --progress \
  --dry-run  # Remove --dry-run after verifying

# Verify upload
rclone ls r2:ns-engineering-projects/projects/ | head -20
```

**Expected output:**
```
   145623 ktft-fast-track-1/images/hero.jpg
    98234 ktft-fast-track-1/images/site-1.jpg
   ...
```

### Step 2.6: Test R2 Integration

1. Update `.env.local` to enable R2 mode:

```bash
NEXT_PUBLIC_R2_BASE_URL=https://pub-XXXXX.r2.dev
```

2. Run build:

```bash
npm run build:content
```

**Expected output:**
```
📦 R2 Mode: Skipping local media copy
ℹ️  Images will be served from: https://pub-XXXXX.r2.dev

🌩️  Validating R2 configuration...
✅ R2 Base URL configured: https://pub-XXXXX.r2.dev
✅ R2 Bucket Name: ns-engineering-projects
✅ R2 Base Path: projects
```

3. Check generated JSON:

```bash
cat src/data/generated/projects.json | grep -A 3 '"media"' | head -20
```

**Expected output (R2 mode):**
```json
"media": {
  "images": [
    "https://pub-XXXXX.r2.dev/projects/ktft-fast-track-1/images/hero.jpg",
    "https://pub-XXXXX.r2.dev/projects/ktft-fast-track-1/images/site-1.jpg"
  ],
  "heroImage": "https://pub-XXXXX.r2.dev/projects/ktft-fast-track-1/images/hero.jpg"
}
```

4. Start dev server and verify images load:

```bash
npm run dev
```

Visit: http://localhost:3000/projects

**Images should load from R2!** ✅

---

## Part 3: Workflow for Non-Technical Users

### Adding a New Project (Full Self-Service)

#### Step 1: Add Project Data to Google Sheet

1. Open the shared Google Sheet
2. Scroll to the last row
3. Add new row with project data:
   - **id**: `new-project-2025` (lowercase, kebab-case, NO SPACES)
   - **title**: `New Bridge Project`
   - **client**: `Department of Roads`
   - **category**: Select from dropdown (e.g., `pile-testing`)
   - **year**: `2025`
   - **location_name**: `Jhapa`
   - **location_district**: `Jhapa`
   - **coordinates_lat**: `26.6542` (find on Google Maps)
   - **coordinates_lng**: `87.8357`
   - **scope**: `30 nos. PIT;5 nos. PDA` (semicolon-separated)
   - **images**: `hero.jpg;photo1.jpg;photo2.jpg` (filenames, semicolon-separated)
   - **hero_image**: `hero.jpg`
   - **featured**: `FALSE` (or check the box for TRUE)
4. Save (auto-saves)

#### Step 2: Upload Images to R2

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → R2
2. Open `ns-engineering-projects` bucket
3. Navigate to `projects/` folder
4. Click "Upload" → "Create folder"
5. Folder name: `new-project-2025` (MUST match `id` from sheet!)
6. Navigate into `new-project-2025/`
7. Create folder: `images`
8. Navigate into `images/`
9. Click "Upload" → Drag and drop: `hero.jpg`, `photo1.jpg`, `photo2.jpg`
10. Wait for upload to complete

**⚠️ IMPORTANT**: Filenames in Sheet MUST match uploaded filenames exactly!

#### Step 3: Notify Developer

Send a message to the developer:

```
Hi [Developer Name],

I added a new project to the sheet:
- Project: New Bridge Project
- ID: new-project-2025
- Images uploaded to R2

Ready to publish!
```

#### Step 4: Developer Rebuilds Site

```bash
npm run build:content
npm run build
# Deploy (via GitHub Actions or manual)
```

**Timeline**: Content goes live in ~5 minutes! ✅

---

## Part 4: Deployment

### GitHub Actions Setup (CI/CD)

1. Add secrets to GitHub repository:
   - Settings → Secrets and variables → Actions → New repository secret

**Secrets to add:**

| Secret Name | Value | Source |
|------------|-------|--------|
| `GOOGLE_SHEET_ID` | `1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P` | Google Sheets URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `ns-engineering-build-script@...` | From `google-credentials.json` → `client_email` |
| `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | From `google-credentials.json` → `private_key` |
| `NEXT_PUBLIC_R2_BASE_URL` | `https://pub-XXXXX.r2.dev` | Cloudflare R2 bucket URL |

2. Verify `.github/workflows/deploy.yml` uses these secrets

3. Test deployment:
   - Push to `develop` branch
   - Check Actions tab for build status

---

## Part 5: Cost Analysis

### Cloudflare R2 Pricing

- **Storage**: $0.015/GB/month
  - 100MB images = **$0.0015/month**
  - 1GB images = **$0.015/month**

- **Class A Operations** (writes, uploads):
  - $4.50 per million requests
  - 100 image uploads/month = **~$0.00**

- **Class B Operations** (reads, downloads):
  - $0.36 per million requests
  - 10,000 page views/month × 5 images = **~$0.02/month**

- **Data Transfer**: **FREE** (R2's biggest advantage!)

**Total Estimated Cost**: **$0.02 - $0.10/month** 🎉

### Google Sheets API (Free Tier)

- **Read requests**: 100 per 100 seconds per user (plenty for builds)
- **Cost**: **$0/month**

---

## Part 6: Troubleshooting

### Build Fails: "Missing GOOGLE_SHEET_ID"

**Solution**: Set environment variable in `.env.local`:
```bash
GOOGLE_SHEET_ID=your-actual-sheet-id-here
```

### Build Fails: "Failed to load Google Sheet"

**Check**:
1. Service account email has Viewer access to sheet (check sharing settings)
2. Google Sheets API is enabled in Google Cloud Console
3. `google-credentials.json` is in the project root (not in a subfolder)
4. Sheet ID is correct (copy from URL)

### Images Don't Load from R2

**Check**:
1. R2 bucket has public access enabled
2. `NEXT_PUBLIC_R2_BASE_URL` is set correctly
3. Image filenames in CSV/Sheets match uploaded files EXACTLY (case-sensitive!)
4. Open browser DevTools → Network tab → Check for 404 errors

**Test direct URL**:
```
https://pub-XXXXX.r2.dev/projects/{project-id}/images/hero.jpg
```

Should display the image in browser.

### Builds are Slow

**In Cloud Mode**, builds should be FASTER (no file copying).

**If slow**:
- Check internet connection (Sheets API requires internet)
- Consider switching to CSV mode for offline work

### Accidentally Deleted Images in R2

**Solution**:
1. Re-upload from local backup (`content/projects/`)
2. OR: Enable R2 object versioning (prevents accidental deletion)

---

## Part 7: Switching Between Modes

### Mode 1: Local CSV + Local Images (Default)

`.env.local`:
```bash
CONTENT_SOURCE_MODE=csv
# NEXT_PUBLIC_R2_BASE_URL not set (or empty)
```

### Mode 2: Google Sheets + Local Images

`.env.local`:
```bash
CONTENT_SOURCE_MODE=sheets
GOOGLE_SHEET_ID=...
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
# NEXT_PUBLIC_R2_BASE_URL not set
```

### Mode 3: Local CSV + R2 Images

`.env.local`:
```bash
CONTENT_SOURCE_MODE=csv
NEXT_PUBLIC_R2_BASE_URL=https://pub-XXXXX.r2.dev
```

### Mode 4: Google Sheets + R2 Images (Full Cloud)

`.env.local`:
```bash
CONTENT_SOURCE_MODE=sheets
GOOGLE_SHEET_ID=...
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
NEXT_PUBLIC_R2_BASE_URL=https://pub-XXXXX.r2.dev
```

---

## Part 8: Migration Checklist

### Pre-Migration

- [ ] Create Cloudflare account
- [ ] Create Google Cloud account
- [ ] Backup current `content/` folder
- [ ] Backup current CSV file

### Google Sheets Setup

- [ ] Export CSV to Google Sheets
- [ ] Share sheet with team (Editor access)
- [ ] Add data validation (category dropdown, featured checkbox)
- [ ] Create Google Cloud project
- [ ] Enable Google Sheets API
- [ ] Create service account
- [ ] Download `google-credentials.json`
- [ ] Share sheet with service account email (Viewer access)
- [ ] Update `.env.local` with Sheets credentials
- [ ] Test build with Sheets mode

### Cloudflare R2 Setup

- [ ] Create R2 bucket (`ns-engineering-projects`)
- [ ] Enable public access (R2.dev or custom domain)
- [ ] Create R2 API token
- [ ] Configure Rclone
- [ ] Upload all project images to R2
- [ ] Update `.env.local` with R2 URL
- [ ] Test build with R2 mode
- [ ] Verify images load in browser

### Production Deployment

- [ ] Add GitHub secrets (Sheets + R2 credentials)
- [ ] Test deployment on staging
- [ ] Verify all images load correctly
- [ ] Deploy to production
- [ ] Train team on new workflow

### Documentation

- [ ] Share this guide with team
- [ ] Create quick reference for content editors
- [ ] Document common issues and solutions

---

## Summary

You now have:

✅ **Fast builds** (no more copying 113MB of images)
✅ **Small git repository** (images externalized to R2)
✅ **Non-technical content editing** (Google Sheets)
✅ **CDN-served images** (fast loading worldwide)
✅ **Cost-effective** (~$0.02-0.10/month)
✅ **Scalable** (add 1000+ projects without issues)

---

## Need Help?

Contact the development team or refer to:
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Project README](../README.md)
