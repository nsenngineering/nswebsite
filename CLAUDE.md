# Claude AI Assistant - Project Context

**Project**: NS Engineering & Geotechnical Services Website
**Status**: Cloudflare Pages Migration In Progress (v1.3.0) — DNS cutover pending
**Last Updated**: 2026-06-03

---

## Quick Reference

### Project Overview
Professional website for **NS Engineering & Geotechnical Services Pvt. Ltd. (NSEGS)**, a leading geotechnical and engineering services company in Nepal. Built with Next.js 16, TypeScript, and features a unique hybrid content management system combining Google Sheets with Git version control.

**Tagline**: "Constantly Evolving, Foundation You Can Trust"
**Certification**: ISO 9001:2015

### Key Documentation
- **[README.md](./README.md)** - Main project documentation
- **[docs/README.md](./docs/README.md)** - Complete documentation index
- **[PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)** - Feature completion status
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment procedures

---

## Current State (v1.3.0)

### ✅ Completed Features

**Content Management System**:
- Google Sheets integration (18/18 sheets connected)
- Automated CSV export for version control
- Dual build modes (Local/Cloud)
- Automatic fallback system

**Core Website Features**:
- Interactive project map with 49 projects
- Photo galleries with Embla carousel
- Evolution timeline (2015-2025)
- **Team members system** with featured leadership display and full directory page
- eLibrary with 5 specialized sections (standards, publications, curated papers, downloads, newsletters)
- FAQ page (20 questions)
- Careers portal
- Service catalog (17 services)

**AI SEO Optimization (NEW)**:
- Person schemas for 5 leadership team members
- DefinedTerm schemas for 8 geotechnical acronyms
- Enhanced Service schemas with geographic targeting (Nepal)
- Enhanced Project schemas with GPS coordinates and location hierarchy
- Knowledge graph connections: Organization ↔ Person ↔ Service ↔ Project
- Fully dynamic: auto-updates with Google Sheets changes

**Production Readiness**:
- Zero TypeScript errors
- 20 organized documentation files
- Complete deployment guide
- All secrets properly gitignored
- Professional README and guides

### 🎯 Current Focus

**Immediate**: Testing and production deployment
**Next**: Team training, Google Sheet sharing
**Phase 2**: Analytics tracking, performance optimization

---

## Tech Stack

**Framework**: Next.js 16 (App Router) with static export
**Language**: TypeScript (100% typed)
**Styling**: Tailwind CSS v4
**Animations**: Framer Motion
**Maps**: React Leaflet + Clustering
**Content**: Google Sheets API + CSV
**Build**: tsx, csv-parse, fs-extra

---

## Project Structure

```
ns-engineering-website/
├── content/              # CSV content source (Git tracked)
├── docs/                 # 20 organized documentation files
│   ├── setup/           # Setup guides (4)
│   ├── guides/          # User guides (6)
│   ├── technical/       # Developer docs (4)
│   └── archive/         # Historical (4)
├── scripts/             # Build system (10+ parsers)
│   ├── parsers/
│   │   ├── google-sheets-parser.ts  # Sheets API client
│   │   ├── data-source.ts           # Unified fetching
│   │   └── csv-exporter.ts          # CSV export
│   └── build-content.ts             # Main orchestrator
├── src/
│   ├── app/             # 8 main pages (new: /team)
│   ├── components/      # 52+ React components (new: TeamCard, TeamModal)
│   ├── data/            # Generated JSON + static data
│   ├── lib/             # Utilities
│   └── types/           # TypeScript definitions
└── public/              # Static assets
```

---

## Content Management

### Google Sheets → CSV → Git Flow

**Editing** (Non-technical team):
1. Edit Google Sheet directly
2. Changes auto-save
3. Done

**Syncing** (Developer):
```bash
npm run build:content:cloud  # Fetch + export to CSV
git diff content/             # Review changes
git commit -m "Content sync"  # Version control
git push                      # Deploy
```

### 18 Integrated Sheets

| Sheet Tab | CSV File | Content |
|-----------|----------|---------|
| Projects | `content/projects/projects.csv` | 49 projects |
| HomepageHeroCarousel | `content/homepage_hero/hero_carousel.csv` | Hero images |
| HomepageHeroMilestones | `content/homepage_hero/milestones.csv` | Timeline |
| Team | `content/team/team.csv` | 5 featured members (leadership) + full directory |
| StandardCodes | `content/elibrary/standard-codes.csv` | Standard codes (external links) |
| Publications | `content/elibrary/publications.csv` | Technical papers (internal PDFs) |
| CuratedPapers | `content/elibrary/curated-papers.csv` | Research papers (external links) |
| Downloads | `content/elibrary/downloads.csv` | Company materials |
| Newsletters | `content/elibrary/newsletters.csv` | Quarterly newsletters |
| ElibrarySections | `content/elibrary/sections.csv` | 5 eLibrary sections |
| ProjectCategories | `content/categories/categories.csv` | 5 categories |
| ServiceCategories | `content/services/service-categories.csv` | 6 categories |
| Services | `content/services/services.csv` | 17 services |
| CompanyInfo | `content/company/company-info.csv` | Company details |
| RotatingMetrics | `content/rotating_metrics/metrics.csv` | Homepage metrics |
| Alumni | `content/alumni/alumni.csv` | Alumni profiles |
| FAQ | `content/faq/faq.csv` | FAQ items |
| FAQCategories | `content/faq/faq-categories.csv` | FAQ categories |

---

## Build Commands

### Development
```bash
npm run dev:local          # Local mode (CSV only)
npm run dev:cloud          # Cloud mode (Google Sheets)
```

### Production
```bash
npm run build:local        # Build with CSV
npm run build:cloud        # Build with Sheets + export CSV
npm run build              # Default build
```

### Content Management
```bash
npm run build:content:local   # Parse CSV only
npm run build:content:cloud   # Fetch Sheets + export CSV
```

---

## Environment Configuration

### Files

```
.env.local              # Local config (gitignored)
.env.cloud              # Cloud config (gitignored)
.env.local.example      # Local template (committed)
.env.cloud.example      # Cloud template (committed)
```

### Cloud Mode Variables

```bash
CONTENT_SOURCE_MODE=sheets
GOOGLE_SHEET_ID=1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
```

---

## Common Tasks

### Adding New Content

**Projects**: Edit Google Sheet → Developer syncs weekly
**Services**: Update `content/services/services.csv` or Sheets
**Team**: Update `content/team/team.csv` or Sheets
  - Fields: name, role, education, experience, order, featured, linkedinUrl, specializations
  - Featured members appear on About page (Leadership Team section)
  - All members appear on `/team` page with search and filter
**eLibrary**: Update respective CSV files or Sheets (5 sections: standard-codes, publications, curated-papers, downloads, newsletters)
**Alumni**: Update `content/alumni/alumni.csv` or Sheets
**FAQ**: Update `content/faq/faq.csv` or Sheets
**Careers**: Edit `src/data/careers.ts` (data-driven, no CSV)

### Build & Test

```bash
# Test local build
npm run build:local
npx serve@latest out

# Test cloud build (with Sheets)
npm run build:cloud

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

### Managing Redirects

**Add new redirect**:
1. Edit `src/data/redirects.ts`
2. Run: `npm run generate:redirects`
3. Commit and deploy

**Test redirects**:
```bash
npm run generate:redirects
npm run build:local
npx serve@latest out
# Visit old URLs to test (e.g., http://localhost:3000/career/)
```

**Location**: `docs/guides/URL_MIGRATION_GUIDE.md`

### Deployment

The site deploys to **Cloudflare Pages** (three environments: dev / stage / prod).

```bash
# Trigger via GitHub Actions UI:
# Actions → "Deploy to Cloudflare Pages (Dev)" → Run workflow
```

**What the pipeline does (deploy-dev.yml)**:
1. Syncs media from Google Drive → `nswebsite-dev` R2 (rclone)
2. Exports Google Sheets → CSV, builds Next.js static export (one artifact)
3. Deploys artifact to `nsengineering-dev` Pages, injecting dev R2 URL + Turnstile key
4. Promotes `nswebsite-dev` R2 → `nswebsite-stage` R2
5. Deploys same artifact to `nsengineering-stage` Pages, injecting stage R2 URL + Turnstile key
6. Promotes `nswebsite-stage` R2 → `nswebsite-prod` R2
7. Deploys same artifact to `nsengineering-prod` Pages, injecting prod R2 URL + Turnstile key

**Environment URLs**:
- Dev: `dev.nsengineering.com.np`
- Stage: `stage.nsengineering.com.np`
- Prod: `nsengineering.com.np` (post-DNS-cutover)

**R2 + Turnstile injection**: The artifact is built with placeholder strings (`https://NSENGINEERING_R2_URL`, `NSENGINEERING_TURNSTILE_KEY`). Each deploy job substitutes the correct values from per-environment GitHub secrets via `find+sed` before uploading to Cloudflare Pages.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full pipeline details, secrets reference, and DNS cutover steps.

**Media Workflow** (rclone):
- Team uploads media to Google Drive `content/` folder
- GitHub Actions syncs to Cloudflare R2 on every push
- Website loads images from R2 CDN
- CSV files remain in Git for version control

See [rclone Sync Documentation](./docs/technical/RCLONE_SYNC.md) for setup details.

---

## Key Design Patterns

### Content Parsing Architecture

All content follows this pattern:

1. **Data Source** (`data-source.ts`):
   - Try Google Sheets (if cloud mode)
   - Fallback to CSV if Sheets fails
   - Return unified CSVRecord[]

2. **Parser** (`[content]-parser.ts`):
   - Call fetchDataWithFallback()
   - Validate and transform data
   - Return typed objects

3. **Build** (`build-content.ts`):
   - Call all parsers
   - Generate JSON files
   - Copy media files
   - Export CSV (if cloud mode)

4. **Runtime** (Components):
   - Import from generated JSON
   - Render with React

### CSV Export for Version Control

Cloud builds automatically export Sheets → CSV:

```typescript
// In build-content.ts
if (shouldExportToCSV()) {
  await exportAllSheetsToCSV();  // Sheets → CSV
}
// Then: git diff content/ shows changes
```

Benefits:
- Git tracks all content changes
- Professional audit trail
- Can revert to any version
- CSV files are backup if Sheets fails

### Team Members Feature (v1.1.0)

**Featured Leadership System**:
- Similar to Alumni pattern with `featured` boolean flag
- Featured members display on About page (Leadership Team section)
- All members accessible via dedicated `/team` page

**Data Structure** (`content/team/team.csv`):
```csv
name, role, education, experience, order, featured, linkedinUrl, specializations
```

**New Fields**:
- `featured` (boolean) - TRUE for leadership display on About page
- `linkedinUrl` (optional) - LinkedIn profile URL
- `specializations` (semicolon-separated) - Key expertise areas

**Components**:
- `TeamCard.tsx` - Individual member card with hover effects
  - Shows first 2 specializations + "X more" badge
  - LinkedIn badge if URL exists
  - Click opens modal
- `TeamModal.tsx` - Full profile modal
  - Complete specializations list
  - Education, experience details
  - LinkedIn profile button

**Pages**:
- `/about` - Leadership Team section (filtered to featured=TRUE only)
- `/team` - Full team directory with:
  - Search by name
  - Filter by role
  - Results count
  - Responsive grid (1/2/3 columns)
  - Modal on card click

**Implementation Pattern**:
```typescript
// About page - show only featured
const leadership = teamData.members.filter(m => m.featured);

// Team page - show all with filters
const filteredTeam = team.filter(member =>
  member.name.toLowerCase().includes(searchQuery) &&
  (selectedRole === 'all' || member.role === selectedRole)
);
```

**Key Files**:
- Types: `src/types/team.ts`
- Parser: `scripts/parsers/team-parser.ts`
- Components: `src/components/team/TeamCard.tsx`, `TeamModal.tsx`
- Pages: `src/app/about/page.tsx`, `src/app/team/page.tsx`
- Data: `content/team/team.csv`

---

## Important Conventions

### File Naming
- Components: PascalCase (`ProjectMap.tsx`)
- Utilities: camelCase (`data-source.ts`)
- Types: PascalCase (`Project`, `Service`)
- Content: kebab-case (`projects.csv`, `project-id`)

### Code Style
- TypeScript: 100% typed, no `any`
- Components: Functional with hooks
- Imports: Absolute paths from `@/`
- CSS: Tailwind utility classes

### Documentation
- User guides in `docs/guides/`
- Technical docs in `docs/technical/`
- Setup guides in `docs/setup/`
- Archive in `docs/archive/`

---

## AI SEO Optimization (v1.2.0)

### Overview
Comprehensive schema.org markup optimized for AI assistants (ChatGPT, Claude, Perplexity) to cite NS Engineering when users ask location-based or expertise-based queries.

### Key Features

**Person Schemas** (5 leadership members):
- Full credentials, experience, and expertise
- Linked to services via `knowsAbout` property
- Example: "Who specializes in pile testing?" → Arun Kumar Pandit (19 years experience)

**DefinedTerm Schemas** (8 technical acronyms):
- PDA, PIT, MASW, SPT, CBR, UCS, NDT, ERT
- Each linked to related service for knowledge graph
- Example: "What is PDA testing?" → Pile Driving Analyzer with detailed explanation

**Geographic Targeting**:
- **Services**: `areaServed: Nepal` with Wikidata reference, language support (en, ne)
- **Projects**: Precise GPS coordinates, district/region hierarchy, spatial coverage
- Example: "Does pile testing happen in Nepal?" → YES, 50 services available
- Example: "Projects in Makwanpur?" → Fast Track Expressway with exact coordinates

**Knowledge Graph**:
```
Organization ──┬── Employees (5 leadership)
               ├── Services (50 services)
               └── Projects (49 projects with GPS)
                    │
Employees ─────────┼─── knowsAbout → Services
Services ──────────┼─── provider → Organization
Projects ──────────┼─── author → Organization
DefinedTerms ──────┴─── isRelatedTo → Services
```

### Implementation Files

**Schema Generators**:
- `src/lib/seo/schema-generators.ts` - Main schema functions
  - `generatePersonSchema()` - Person markup
  - `generateDefinedTermSchema()` - Technical terms
  - `generateServiceListSchema()` - Enhanced with geography
  - `generateProjectListSchema()` - Enhanced with GPS coordinates
  - `generateOrganizationSchema()` - Enhanced with employees

**Supporting Files**:
- `src/lib/seo/team-service-mapper.ts` - Fuzzy matching expertise → services
- `src/data/schema/technical-terms.ts` - 8 geotechnical acronym definitions

**Page Integration**:
- `/team` - Person schemas for all featured members
- `/about` - Person + Organization schemas with employee links
- `/services` - DefinedTerm + enhanced Service schemas
- `/projects` - Enhanced Project schemas with GPS data

### Automatic Updates

When content changes in Google Sheets:
```bash
npm run build:content:cloud  # Fetch Sheets + export CSV
npm run build               # Build with updated schemas
```

**Result**:
- New services auto-get `areaServed: Nepal` and provider linkage
- New projects auto-get GPS coordinates and location hierarchy
- New team members auto-get Person schemas with expertise mapping
- **Zero code changes required!**

### AI Citation Examples

**Before AI SEO**:
- ❌ "Who does pile testing in Nepal?" → Generic or no results

**After AI SEO**:
- ✅ "Who at NS Engineering specializes in pile testing?" → **Arun Kumar Pandit** (Managing Director, 19 years)
- ✅ "What does PDA mean in geotechnical?" → **Pile Driving Analyzer** - High-strain dynamic testing
- ✅ "Does pile testing happen in Nepal?" → **YES, NS Engineering** provides 50+ services in Nepal
- ✅ "Projects in Makwanpur district?" → **Fast Track Expressway** packages with exact coordinates
- ✅ "Geotechnical engineers with 20+ years in Nepal?" → **3 directors** (28Y, 30Y, 20Y experience)

---

## Troubleshooting

### Build Fails

**"Sheet tab not found"**:
- Check tab names match exactly (case-sensitive)
- See [Sheet Tab Mapping](./docs/setup/SHEET_TAB_MAPPING.md)

**"Type errors"**:
```bash
npx tsc --noEmit  # Find errors
# Fix and rebuild
```

**"Missing credentials"**:
- Ensure `.env.cloud` exists
- Check `google-credentials.json` in root
- Verify service account has Viewer access to Sheet

### Content Not Updating

```bash
npm run build:content:cloud  # Re-sync from Sheets
npm run dev                  # Restart dev server
# Hard refresh browser (Ctrl+F5)
```

---

## Company Information

**Name**: NS Engineering & Geotechnical Services Pvt. Ltd. (NSEGS)
**Location**: Bishal Niwash, 4th Cross, Jwagal, Lalitpur, Nepal
**Phone**: +977-01-5260121, +977-9851228995
**Email**: info@nsengineering.com.np
**Website**: www.nsengineering.com.np
**Certification**: ISO 9001:2015

### Core Services
- **Pile Testing**: PDA, PIT, Static Load, Cross-Hole Sonic Logging
- **Soil Laboratory**: Compaction, CBR, Triaxial, Direct Shear, Grain Size
- **Rock Laboratory**: UCS, Point Load, Core Analysis
- **Drilling**: Rotary (up to 700m), Percussion, Auger, SPT
- **Geophysical**: MASW, ERT, Seismic Refraction
- **NDT**: Concrete Integrity, Rebar Detection, Structure Assessment

### Key Team Members (Featured Leadership)
- **Arun Kumar Pandit** - Managing Director (MSc Geotechnical, 19 years)
  - Specializations: Pile Testing, Foundation Design, Project Management, Geotechnical Investigation
- **Dhurba Raj Tirpathi** - Director (Civil Engineering, 28 years)
  - Specializations: Geotechnical Investigation, Site Supervision, Quality Control, Construction Management
- **Shrawan Kumar Thapa** - Director (MSc Transportation, 30 years)
  - Specializations: Transportation Engineering, Road Design, Infrastructure Planning, Highway Engineering
- **Madhav Pokhrel** - Director (MSc Disaster Risk, 15 years)
  - Specializations: Disaster Risk Management, Structural Assessment, Risk Analysis, Emergency Planning
- **Arjun Adhikari** - Director (MSc Geotechnical, 20 years)
  - Specializations: Geotechnical Engineering, Soil Mechanics, Laboratory Testing, Site Investigation

*All team members viewable at `/team` page with search and filter capabilities.*

### Target Industries
- Road & Bridge Construction
- Hydropower Projects
- Building Construction
- Transmission Lines
- Infrastructure Development

---

## Phase 2 Plans (Future)

### Cloudflare R2 Integration
- Move images to R2 CDN
- Reduce Git repo size
- Faster image loading
- See: [docs/technical/CLOUDFLARE_R2_MIGRATION.md](./docs/technical/CLOUDFLARE_R2_MIGRATION.md)

### Automated Content Sync
- GitHub Actions cron job
- Auto-sync Sheets → CSV every 6 hours
- Automated commits
- Zero manual work

### Additional Features
- Google Drive integration for images
- Analytics tracking
- WebP image format
- Service worker for offline
- Performance optimizations

---

## Quick Commands Reference

```bash
# Development
npm install                    # Install dependencies
npm run dev:cloud             # Start dev server (Sheets mode)
npm run build:cloud           # Production build (Sheets mode)

# Content
npm run build:content:cloud   # Sync from Sheets + export CSV
git diff content/             # Review content changes
git add content/              # Stage changes
git commit -m "Content sync"  # Commit

# Deployment
git push origin cloudflare    # Deploy to production

# Testing
npx tsc --noEmit             # Type check
npm run lint                  # Lint code
npx serve@latest out          # Test build locally
```

---

## Support Resources

**Documentation**: [docs/README.md](./docs/README.md)
**Google Sheet**: [NS Engineering Data](https://docs.google.com/spreadsheets/d/1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI/edit)
**Progress**: [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md)
**Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Version**: 1.2.0
**Status**: Production Ready - AI SEO Optimized ✅
**Last Updated**: 2026-01-11
