# NS Engineering Website - Documentation Index

Complete documentation for the NS Engineering & Geotechnical Services website.

---

## 🚀 Quick Start

**New to this project?** Start here:

1. **[Project Overview](../README.md)** - Main project README
2. **[Google Sheets Setup](./setup/GOOGLE_SHEETS_SETUP.md)** - Initial content management setup
3. **[Content Workflow](./guides/content-workflow.md)** - Day-to-day content management

---

## 📁 Documentation Structure

### Setup & Configuration

Initial setup and environment configuration documents.

- **[Google Sheets Setup](./setup/GOOGLE_SHEETS_SETUP.md)** - Complete Google Sheets integration guide
- **[Google Sheets Implementation Summary](./setup/GOOGLE_SHEETS_IMPLEMENTATION.md)** - Technical implementation details
- **[Sheet Tab Mapping](./setup/SHEET_TAB_MAPPING.md)** - Quick reference for sheet names
- **[Cloudflare R2 Setup](./setup/cloudflare-r2-setup.md)** - Media storage setup (future phase)

### User Guides

Day-to-day guides for content management.

- **[Content Workflow](./guides/content-workflow.md)** - How to manage content with Sheets + Git
- **[Content Management](./guides/content-management.md)** - CSV-based content management
- **[Adding Projects](./guides/adding-projects.md)** - Step-by-step guide for new projects
- **[GPS Coordinates](./guides/gps-coordinates.md)** - Finding GPS coordinates for projects
- **[eLibrary Management](./guides/elibrary-management.md)** - Managing documents library
- **[Services Management](./guides/services-management-guide.md)** - Managing service catalog

### Technical Documentation

In-depth technical documentation for developers.

- **[Build Modes](./technical/BUILD_MODES.md)** - Local vs Cloud build comparison
- **[Cloudflare R2 Migration](./technical/CLOUDFLARE_R2_MIGRATION.md)** - Complete R2 migration guide
- **[Evolution Timeline Technical](./technical/evolution-timeline-technical-guide.md)** - Homepage timeline implementation
- **[Hero Timeline](./technical/hero-timeline-guide.md)** - Hero carousel technical guide
- **[SEO Folder Workflow](../docs/seo-folder-workflow.md)** - SEO utility workflow and improvement guide

### Archive

Historical design documents and analyses.

- **[Brochure Analysis](./archive/BROCHURE-ANALYSIS.md)** - Original brochure content analysis
- **[Button Colors](./archive/BUTTON-COLORS.md)** - Design system colors
- **[Color Updates](./archive/COLOR-UPDATE.md)** - Color scheme updates
- **[Progress History](./archive/PROGRESS.md)** - Historical progress tracking

---

## 🎯 Common Tasks

### For Content Editors

| Task | Documentation |
|------|--------------|
| Edit website content | [Content Workflow](./guides/content-workflow.md) |
| Add new project | [Adding Projects](./guides/adding-projects.md) |
| Update eLibrary | [eLibrary Management](./guides/elibrary-management.md) |
| Manage services | [Services Management](./guides/services-management-guide.md) |

### For Developers

| Task | Documentation |
|------|--------------|
| Set up Google Sheets | [Google Sheets Setup](./setup/GOOGLE_SHEETS_SETUP.md) |
| Understand build modes | [Build Modes](./technical/BUILD_MODES.md) |
| Deploy to production | [Content Workflow](./guides/content-workflow.md) |
| Set up Cloudflare R2 | [Cloudflare R2 Migration](./technical/CLOUDFLARE_R2_MIGRATION.md) |

---

## 🔧 Configuration Files

### Environment Files

Located in project root:

- `.env.local` - Local development configuration (gitignored)
- `.env.cloud` - Cloud mode configuration (gitignored)
- `.env.local.example` - Template for local development
- `.env.cloud.example` - Template for cloud mode

See [Google Sheets Setup](./setup/GOOGLE_SHEETS_SETUP.md) for configuration details.

### Build Scripts

```bash
# Local mode (CSV files)
npm run dev:local
npm run build:local

# Cloud mode (Google Sheets)
npm run dev:cloud
npm run build:cloud
```

---

## 📊 Content Structure

### Google Sheets → CSV Mapping

| Content Type | Google Sheet Tab | CSV File |
|--------------|------------------|----------|
| Projects | `Projects` | `content/projects/projects.csv` |
| Hero Carousel | `HomepageHeroCarousel` | `content/homepage_hero/hero_carousel.csv` |
| Milestones | `HomepageHeroMilestones` | `content/homepage_hero/milestones.csv` |
| Team | `Team` | `content/team/team.csv` |
| eLibrary - Standard Codes | `StandardCodes` | `content/elibrary/standard-codes.csv` |
| eLibrary - Publications | `Publications` | `content/elibrary/publications.csv` |
| eLibrary - Curated Papers | `CuratedPapers` | `content/elibrary/curated-papers.csv` |
| eLibrary - Downloads | `Downloads` | `content/elibrary/downloads.csv` |
| eLibrary - Newsletters | `Newsletters` | `content/elibrary/newsletters.csv` |
| eLibrary Sections | `ElibrarySections` | `content/elibrary/sections.csv` |
| Categories | `ProjectCategories` | `content/categories/categories.csv` |
| Service Categories | `ServiceCategories` | `content/services/service-categories.csv` |
| Services | `Services` | `content/services/services.csv` |

---

## 🆘 Troubleshooting

Common issues and solutions:

1. **Build fails with "Sheet tab not found"**
   - Check tab names in Google Sheets match exactly (case-sensitive)
   - See [Sheet Tab Mapping](./setup/SHEET_TAB_MAPPING.md)

2. **Changes in Sheets not reflected**
   - Run `npm run build:content:cloud` to sync
   - See [Content Workflow](./guides/content-workflow.md)

3. **Missing images/media**
   - Ensure files are in correct directories
   - See [Adding Projects](./guides/adding-projects.md)

4. **Git shows many CSV changes**
   - Normal on first export (formatting changes)
   - Future syncs will only show actual content changes
   - See [Content Workflow](./guides/content-workflow.md)

---

## 📝 Contributing

### Adding Documentation

1. Place docs in appropriate folder:
   - `setup/` - Configuration and initial setup
   - `guides/` - User-facing how-to guides
   - `technical/` - Developer technical docs
   - `archive/` - Historical/reference docs

2. Update this README index
3. Link from relevant sections

### Documentation Standards

- Use clear, descriptive titles
- Include table of contents for long docs
- Add "Last Updated" date at bottom
- Use code blocks with syntax highlighting
- Include examples and screenshots where helpful

---

## 🔗 External Resources

- **Google Sheet**: [NS Engineering Data](https://docs.google.com/spreadsheets/d/1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI/edit)
- **GitHub Repository**: [ns-engineering-website](https://github.com/yourusername/ns-engineering-website)
- **Production Site**: [nsengineering.com](https://nsengineering.com)

---

## 📞 Support

For questions or issues:
- Check [Troubleshooting](#-troubleshooting) section above
- Review relevant documentation
- Contact development team

---

**Last Updated**: 2024-12-24
**Maintained By**: Development Team
