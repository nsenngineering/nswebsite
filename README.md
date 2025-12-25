# NS Engineering & Geotechnical Services Website

Professional website for NS Engineering & Geotechnical Services Pvt. Ltd., a leading geotechnical and engineering services company in Nepal.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)

---

## 🌟 Features

### Core Features
- **Interactive Service Showcase** - Pile Testing, Soil/Rock Laboratory, Drilling, Geophysical Surveys, NDT
- **Project Portfolio** - 49+ projects with filterable gallery and photo carousels
- **Interactive Map** - Leaflet map with GPS locations, marker clustering, and detailed popups
- **Evolution Timeline** - Company history from 2015-2025 with milestone showcase
- **eLibrary** - 5 specialized sections (standard codes, publications, curated papers, downloads, newsletters) with search and reading pane
- **FAQ System** - 20+ questions with accordion interface and category filtering
- **Careers Portal** - Job listings with benefits showcase and application system
- **Contact/RFQ Form** - Multi-step request for quotation with validation

### Content Management
- **Google Sheets Integration** - 18 integrated sheets for all content types
- **CSV Version Control** - Git tracks all changes with professional audit trail
- **Dual Build Modes** - Local (CSV) and Cloud (Google Sheets) build options
- **Automatic Fallback** - Builds succeed even if Sheets API fails

### Technical Excellence
- **Static Site Generation** - Lightning-fast performance with Next.js 16
- **100% TypeScript** - Fully typed for reliability
- **Responsive Design** - Mobile-first, works on all devices
- **SEO Optimized** - Meta tags, structured data, semantic HTML
- **Performance** - Lazy loading, image optimization, code splitting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- (Optional) Google Cloud account for Sheets integration

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ns-engineering-website.git
cd ns-engineering-website

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 📚 Documentation

**→ [Complete Documentation Index](./docs/README.md)**

### Quick Links

- **Setup**: [Google Sheets Setup](./docs/setup/GOOGLE_SHEETS_SETUP.md)
- **Workflow**: [Content Management Workflow](./docs/guides/content-workflow.md)
- **Guides**: [Adding Projects](./docs/guides/adding-projects.md) | [eLibrary Management](./docs/guides/elibrary-management.md)
- **Technical**: [Build Modes](./docs/technical/BUILD_MODES.md) | [Cloudflare R2](./docs/technical/CLOUDFLARE_R2_MIGRATION.md)

---

## 🛠 Tech Stack

### Framework & Core
- **Next.js 16** - React framework with App Router and static export
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animations and transitions

### Features & Integrations
- **React Leaflet** - Interactive maps with clustering
- **Embla Carousel** - Touch-friendly image carousels
- **React Hook Form + Zod** - Form validation
- **Lucide React** - Icon system
- **Google Sheets API** - Content management
- **CSV Parse/Stringify** - Data processing

### Build Tools
- **tsx** - TypeScript execution
- **csv-parse** - CSV parsing
- **fs-extra** - File system utilities
- **cross-env** - Cross-platform env variables
- **dotenv-cli** - Environment file loading

---

## 🏗 Build Commands

### Development

```bash
# Local mode (uses CSV files)
npm run dev:local

# Cloud mode (uses Google Sheets)
npm run dev:cloud

# Default (auto-detects mode)
npm run dev
```

### Production

```bash
# Build with local CSV
npm run build:local

# Build with Google Sheets
npm run build:cloud

# Default production build
npm run build
```

### Content Management

```bash
# Build content from local CSV
npm run build:content:local

# Build content from Google Sheets + export to CSV
npm run build:content:cloud
```

---

## 📁 Project Structure

```
ns-engineering-website/
├── content/                    # Content source files (CSV)
│   ├── projects/              # Project data + images
│   ├── homepage_hero/         # Hero carousel + milestones
│   ├── team/                  # Team member data
│   ├── elibrary/              # eLibrary (5 sections + metadata)
│   ├── services/              # Service catalog
│   └── categories/            # Category definitions
│
├── docs/                       # Documentation
│   ├── setup/                 # Setup & configuration guides
│   ├── guides/                # User guides
│   ├── technical/             # Technical documentation
│   └── archive/               # Historical docs
│
├── scripts/                    # Build scripts
│   ├── parsers/               # Content parsers
│   └── build-content.ts       # Main build orchestrator
│
├── src/
│   ├── app/                   # Next.js pages (App Router)
│   ├── components/            # React components
│   ├── data/
│   │   ├── generated/         # Auto-generated JSON (gitignored)
│   │   ├── faq.ts             # FAQ data
│   │   └── careers.ts         # Job listings
│   ├── lib/                   # Utilities
│   └── types/                 # TypeScript types
│
├── public/                     # Static assets
│   ├── projects/              # Project images (gitignored)
│   ├── elibrary/              # PDF files (gitignored)
│   └── images/                # Static images
│
├── .env.local                  # Local environment (gitignored)
├── .env.cloud                  # Cloud environment (gitignored)
├── .env.local.example          # Local env template
├── .env.cloud.example          # Cloud env template
└── package.json
```

---

## 🔧 Configuration

### Environment Files

Create from templates:

```bash
# Local development (CSV mode)
cp .env.local.example .env.local

# Cloud mode (Google Sheets)
cp .env.cloud.example .env.cloud
# Then add your Google Sheet ID and credentials
```

See [Google Sheets Setup](./docs/setup/GOOGLE_SHEETS_SETUP.md) for detailed configuration.

### Build Modes

| Mode | Data Source | Command | Use Case |
|------|-------------|---------|----------|
| **Local** | CSV files | `npm run dev:local` | Offline development |
| **Cloud** | Google Sheets | `npm run dev:cloud` | Team collaboration |

See [Build Modes Guide](./docs/technical/BUILD_MODES.md) for comparison.

---

## 🚢 Deployment

### GitHub Pages (Current)

Automatically deploys on push to `cloudflare` branch:

```bash
git push origin cloudflare
```

GitHub Actions automatically:
1. Syncs media from Google Drive → Cloudflare R2
2. Exports Google Sheets → CSV files
3. Builds website with R2 CDN URLs
4. Deploys to GitHub Pages
5. Commits CSV updates to Git

### Media Sync Workflow (rclone)

**Architecture**: Google Drive → rclone → Cloudflare R2 → Website CDN

**What's Synced**:
- Images: `.jpg`, `.png`, `.webp`
- Documents: `.pdf`
- Source: Google Drive `content/` folder
- Destination: Cloudflare R2 bucket

**What's NOT Synced**:
- CSV files (version controlled in Git)
- Managed via Google Sheets API export

**Team Workflow**:
1. Upload media to Google Drive `content/` folder
2. Push any code changes to `cloudflare` branch
3. GitHub Actions auto-syncs media to R2
4. Done!

See [rclone Sync Documentation](./docs/technical/RCLONE_SYNC.md) for complete setup and troubleshooting.

### Custom Domain Setup

1. Add CNAME file to `public/` directory
2. Configure DNS A/CNAME records
3. Enable HTTPS in GitHub Pages settings

---

## 📝 Content Management

### For Non-Technical Team

1. Open [Google Sheet](https://docs.google.com/spreadsheets/d/1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI/edit)
2. Edit content directly
3. Changes auto-save
4. Done! (Developer syncs weekly)

### For Developers

```bash
# 1. Fetch latest from Sheets and export to CSV
npm run build:content:cloud

# 2. Review changes
git diff content/

# 3. Commit with descriptive message
git add content/
git commit -m "Content sync: Added 3 new projects"

# 4. Deploy
git push
```

See [Content Workflow](./docs/guides/content-workflow.md) for complete guide.

---

## 🧪 Testing

```bash
# Build and test locally
npm run build
npx serve@latest out

# Open http://localhost:3000
```

### Production Checklist

- [ ] All content builds successfully
- [ ] Images load correctly
- [ ] Maps display project markers
- [ ] Forms validate properly
- [ ] Links work (internal & external)
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Performance metrics acceptable

---

## 🤝 Contributing

### Adding New Features

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Update documentation if needed
4. Commit with clear messages
5. Push and create pull request

### Content Updates

1. Edit Google Sheets or CSV files
2. Run `npm run build:content:cloud`
3. Review changes with `git diff`
4. Commit with descriptive message
5. Push to deploy

---

## 🐛 Troubleshooting

### Build Failures

**"Sheet tab not found"**
- Check tab names in Google Sheets match exactly (case-sensitive)
- See [Sheet Tab Mapping](./docs/setup/SHEET_TAB_MAPPING.md)

**"Missing credentials"**
- Ensure `.env.cloud` exists with valid `GOOGLE_SHEET_ID`
- Check `google-credentials.json` is in project root

### Content Issues

**Changes not reflecting**
- Run `npm run build:content:cloud` to sync
- Clear browser cache

**Images not loading**
- Check file paths in CSV
- Ensure images exist in `content/` directories
- Run build to copy to `public/`

See [Documentation](./docs/README.md) for more help.

---

## 📊 Project Status

- ✅ **Core Features**: Complete (Projects, Services, eLibrary v2.0, FAQ, Careers)
- ✅ **Google Sheets Integration**: Complete (18/18 sheets)
- ✅ **CSV Version Control**: Complete
- ✅ **Interactive Map**: Complete with clustering
- ✅ **Photo Galleries**: Complete with carousels
- ✅ **Evolution Timeline**: Complete
- ✅ **eLibrary Restructure**: Complete (5 specialized sections)
- 🔄 **Cloudflare R2**: Planned for Phase 2
- 🔄 **Automated Sync**: Planned for Phase 2

---

## 📄 License

© 2024 NS Engineering & Geotechnical Services Pvt. Ltd. All rights reserved.

---

## 📞 Contact

**NS Engineering & Geotechnical Services Pvt. Ltd.**
- **Address**: Bishal Niwash, 4th Cross, Jwagal, Lalitpur, Nepal
- **Phone**: +977-01-5260121, +977-9851228995
- **Email**: info@nsengineering.com.np
- **Website**: www.nsengineering.com.np

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Maps by [Leaflet](https://leafletjs.com/)
- Icons by [Lucide](https://lucide.dev/)
- Hosted on [GitHub Pages](https://pages.github.com/)

---

**Last Updated**: 2024-12-24
**Version**: 2.0.0
**Status**: Production Ready 🚀
