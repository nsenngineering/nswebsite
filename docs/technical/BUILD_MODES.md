# Build Modes Guide

The NS Engineering website supports two distinct build modes: **Local Mode** and **Cloud Mode**.

## 🏠 Local Mode (Default)

**Content Source:** Local CSV files
**Media Storage:** Local filesystem → copied to `public/` during build
**Best for:** Development, offline work, simple setup

### Usage

```bash
# Development
npm run dev:local

# Build for production
npm run build:local
```

### Configuration

No configuration needed! This is the default mode. Your `.env.local` file should have:

```bash
CONTENT_SOURCE_MODE=csv
# NEXT_PUBLIC_R2_BASE_URL is not set (or commented out)
```

### How It Works

1. Reads project data from `content/projects/projects.csv`
2. Reads images from `content/projects/{project-id}/images/`
3. Copies images to `public/projects/` during build
4. Generates static JSON files in `src/data/generated/`
5. Next.js serves images from `/projects/...` URLs

---

## ☁️ Cloud Mode

**Content Source:** Google Sheets (with CSV fallback)
**Media Storage:** Cloudflare R2 CDN
**Best for:** Production, team collaboration, fast builds, scalability

### Usage

```bash
# Development
npm run dev:cloud

# Build for production
npm run build:cloud
```

### Configuration

Update your `.env.local` file (or copy from `.env.cloud.example`):

```bash
# Enable Cloud Mode
CONTENT_SOURCE_MODE=sheets

# Google Sheets
GOOGLE_SHEET_ID=your-sheet-id-here
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# Cloudflare R2
NEXT_PUBLIC_R2_BASE_URL=https://pub-XXXXX.r2.dev
R2_BASE_PATH=projects
R2_BUCKET_NAME=ns-engineering-projects
```

### How It Works

1. Fetches project data from Google Sheets API
2. Falls back to local CSV if Sheets unavailable
3. Skips copying images (served from R2)
4. Generates URLs pointing to R2 CDN
5. Next.js site references images from R2

---

## 🔄 Switching Between Modes

### Quick Switch (Runtime)

You can override the mode without changing `.env.local`:

```bash
# Force local mode
CONTENT_SOURCE_MODE=csv npm run dev

# Force cloud mode
CONTENT_SOURCE_MODE=sheets npm run dev
```

### Permanent Switch

**To Local Mode:**
1. Edit `.env.local`
2. Set `CONTENT_SOURCE_MODE=csv`
3. Comment out `NEXT_PUBLIC_R2_BASE_URL`

**To Cloud Mode:**
1. Edit `.env.local`
2. Set `CONTENT_SOURCE_MODE=sheets`
3. Set your R2 URL and Google Sheets credentials

---

## 📊 Comparison

| Feature | Local Mode | Cloud Mode |
|---------|-----------|------------|
| **Build Time** | ~30 seconds (copying files) | ~5 seconds (no copying) |
| **Git Repo Size** | 110MB+ (with images) | <10MB (no images) |
| **Content Editing** | Edit CSV files | Google Sheets (no git) |
| **Image Serving** | Static files from Next.js | CDN (Cloudflare R2) |
| **Collaboration** | Requires git access | Team can edit directly |
| **Offline Work** | ✅ Yes | ❌ No (needs internet) |
| **Cost** | Free | ~$0.02-0.10/month |
| **Setup Complexity** | Simple | Moderate (needs R2 + Sheets) |

---

## 🛠️ Available Scripts

### Local Mode
- `npm run dev:local` - Start dev server (CSV + local media)
- `npm run build:local` - Production build (CSV + local media)
- `npm run build:content:local` - Build content only (CSV)

### Cloud Mode
- `npm run dev:cloud` - Start dev server (Sheets + R2)
- `npm run build:cloud` - Production build (Sheets + R2)
- `npm run build:content:cloud` - Build content only (Sheets)

### Universal (Uses current .env.local)
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run build:content` - Build content only

---

## 🚀 Deployment Recommendations

### GitHub Pages (Current)
**Use:** Local Mode
**Why:** Simple, no external dependencies, works with static export

### Vercel/Netlify (Future)
**Use:** Cloud Mode
**Why:** Faster builds, smaller deployments, team editing

### CI/CD Pipeline
**Use:** Cloud Mode with environment secrets
**Why:** Automated deploys, no local file management

---

## 🔍 Troubleshooting

### "No projects found in sheet"
- Check `GOOGLE_SHEET_ID` in `.env.local`
- Verify service account has Viewer access to sheet
- Ensure Google Sheets API is enabled

### "Failed to load Google Sheet"
- Check internet connection
- Verify credentials are correct
- Build will auto-fallback to local CSV

### Images not loading (Cloud mode)
- Verify `NEXT_PUBLIC_R2_BASE_URL` is set
- Check images exist in R2 bucket
- Ensure R2 bucket is publicly accessible

### Images not loading (Local mode)
- Run `npm run build:content:local` to copy images
- Check images exist in `content/projects/{id}/images/`
- Verify `public/projects/` folder was created

---

## 📝 Next Steps

1. **Now:** Use Local Mode for development
2. **Phase 1:** Set up Google Sheets for content
3. **Phase 2:** Set up Cloudflare R2 for media
4. **Phase 3:** Switch to Cloud Mode for production

See the [Cloudflare R2 Migration Guide](./CLOUDFLARE_R2_MIGRATION.md) for detailed setup instructions.
