# Cloudflare R2 & Google Sheets Integration

The NS Engineering website now supports **two content management modes**:

## 🏠 Local Mode (Default - Current Setup)

**Content**: Local CSV file
**Images**: Local filesystem → copied to `public/` during build
**Best for**: Development, offline work, simple setup

```bash
# .env.local
CONTENT_SOURCE_MODE=csv
# NEXT_PUBLIC_R2_BASE_URL not set
```

**Build command**:
```bash
npm run build:content
```

---

## ☁️ Cloud Mode (Optional - For Scale)

**Content**: Google Sheets (with CSV fallback)
**Images**: Cloudflare R2 CDN
**Best for**: Production, team collaboration, fast builds, scalability

```bash
# .env.local
CONTENT_SOURCE_MODE=sheets
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
NEXT_PUBLIC_R2_BASE_URL=https://pub-XXXXX.r2.dev
```

**Build command**: Same as above
```bash
npm run build:content
```

---

## 🚀 Quick Start

### Current Setup (No Changes Needed)

Everything works as before! The build system uses **Local Mode** by default.

```bash
# Install dependencies
npm install

# Build content (CSV + local images)
npm run build:content

# Start dev server
npm run dev

# Build for production
npm run build
```

### Migrate to Cloud Mode (Optional)

See the comprehensive guide:

📖 **[CLOUDFLARE R2 MIGRATION GUIDE](./docs/CLOUDFLARE_R2_MIGRATION.md)**

---

## 🎯 Why Migrate to Cloud Mode?

| Feature | Local Mode | Cloud Mode |
|---------|------------|------------|
| **Build Time** | ~30 seconds (copying files) | ~5 seconds (no copying) |
| **Git Repo Size** | 110MB+ (with images) | <10MB (no images) |
| **Content Editing** | Requires git access | Google Sheets (no git) |
| **Image Serving** | Static files | CDN (faster worldwide) |
| **Collaboration** | Developer bottleneck | Team can edit directly |
| **Cost** | Free | ~$0.02-0.10/month |

---

## 📁 Project Structure

```
ns-engineering-website/
├── content/
│   └── projects/
│       ├── projects.csv                 # Local content (still used as backup)
│       └── {project-id}/images/         # Local images (optional in Cloud mode)
├── scripts/
│   ├── build-content.ts                 # Main build orchestrator
│   └── parsers/
│       ├── google-sheets-parser.ts      # NEW: Fetch from Sheets
│       ├── project-parser.ts            # Updated: R2 URL support
│       └── validate-media.ts            # Updated: Skip copy in R2 mode
├── docs/
│   └── CLOUDFLARE_R2_MIGRATION.md       # Migration guide
├── .env.local                            # Environment variables
└── .env.example                          # Example configuration
```

---

## 🔧 Configuration Reference

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CONTENT_SOURCE_MODE` | No | `csv` | Content source: `csv` or `sheets` |
| `GOOGLE_SHEET_ID` | For Sheets | - | Google Sheet ID from URL |
| `GOOGLE_APPLICATION_CREDENTIALS` | For Sheets | - | Path to credentials JSON |
| `NEXT_PUBLIC_R2_BASE_URL` | For R2 | - | R2 public URL (enables R2 mode) |
| `R2_BUCKET_NAME` | No | `ns-engineering-projects` | R2 bucket name |
| `R2_BASE_PATH` | No | `projects` | Base path within R2 bucket |

### Build Behavior

**The build system automatically detects the mode based on environment variables:**

1. If `NEXT_PUBLIC_R2_BASE_URL` is set → **R2 mode** (images from R2)
2. If `CONTENT_SOURCE_MODE=sheets` → **Sheets mode** (data from Google Sheets)
3. Otherwise → **Local mode** (CSV + local images)

**Modes can be mixed:**
- CSV + Local Images (default)
- CSV + R2 Images
- Sheets + Local Images
- Sheets + R2 Images (full cloud)

---

## 🧪 Testing

### Test Local Mode (Default)
```bash
npm run build:content
# Should see: "📋 Content source mode: CSV (using local file)"
# Should see: "📦 Local Mode: Copying media files to public folder..."
```

### Test Sheets Mode
```bash
# In .env.local, set:
CONTENT_SOURCE_MODE=sheets
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

npm run build:content
# Should see: "📊 Fetching projects from Google Sheets..."
```

### Test R2 Mode
```bash
# In .env.local, set:
NEXT_PUBLIC_R2_BASE_URL=https://pub-XXXXX.r2.dev

npm run build:content
# Should see: "📦 R2 Mode: Skipping local media copy"
# Should see: "🌩️  Validating R2 configuration..."
```

---

## 📚 Documentation

- **[Migration Guide](./docs/CLOUDFLARE_R2_MIGRATION.md)** - Complete setup instructions
- **[Content Management Guide](./docs/content-management.md)** - How to add/edit content
- **[Project Progress](./PROJECT_PROGRESS.md)** - Development status

---

## 🆘 Troubleshooting

### Build fails with "Missing GOOGLE_SHEET_ID"
**Solution**: Either set the variable in `.env.local` OR switch to CSV mode:
```bash
CONTENT_SOURCE_MODE=csv
```

### Images don't load in dev mode
**Check**:
1. Run `npm run build:content` first (generates JSON)
2. If using R2, verify `NEXT_PUBLIC_R2_BASE_URL` is set
3. Check browser console for errors

### Want to switch back to Local mode
**Solution**: Comment out or remove from `.env.local`:
```bash
# CONTENT_SOURCE_MODE=csv  # This is the default anyway
# NEXT_PUBLIC_R2_BASE_URL=  # Remove this line
```

Then rebuild:
```bash
npm run build:content
```

---

## 🚦 Migration Status

**Current Status**: ✅ Code Complete

- ✅ Google Sheets integration implemented
- ✅ Cloudflare R2 support added
- ✅ Build system updated (mode-aware)
- ✅ Documentation complete
- ⏳ **Not yet migrated** (optional)

**To migrate**, follow the **[MIGRATION GUIDE](./docs/CLOUDFLARE_R2_MIGRATION.md)**.

---

## 📞 Support

Questions? Contact the development team or open an issue on GitHub.
