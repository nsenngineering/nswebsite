# NS Engineering & Geotechnical Services Website

Professional website for NS Engineering, a geotechnical and engineering services company in Nepal.

## Features

- **Interactive Service Showcase** - Pile Testing, Soil/Rock Laboratory, Drilling, Geophysical Surveys
- **Project Portfolio** - 32+ projects with filterable gallery and image carousels
- **Interactive Map** - Leaflet map with project locations, clustering, and popups
- **Equipment Catalog** - Specifications and capabilities of all testing equipment
- **eLibrary** - Technical documents organized into Standards, Publications, and Newsletters
- **FAQ Page** - 20+ frequently asked questions with accordion interface
- **Careers Page** - Job listings and company benefits showcase
- **Contact/RFQ Form** - Multi-step request for quotation
- **CSV-Based CMS** - Easy content management for projects and eLibrary
- **Fully Responsive** - Optimized for mobile, tablet, and desktop
- **Performance & SEO** - Static site generation with Next.js

## Tech Stack

- **Framework**: Next.js 16 (App Router) with static export
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (100% typed)
- **Animations**: Framer Motion (modals, accordions, transitions)
- **Maps**: React Leaflet + Leaflet Cluster
- **Carousel**: Embla Carousel (image galleries)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Build Tools**: csv-parse, tsx, fs-extra

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build

To create a production build:

```bash
npm run build
```

This generates a static export in the `out` directory.

### Preview Production Build

```bash
npm run build
npx serve@latest out
```

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### BasePath Configuration

The project uses a conditional basePath for GitHub Pages deployment:

- **Development** (`npm run dev`): No basePath, runs at `http://localhost:3000`
- **Production** (`npm run build`): Adds `/nswebsite` basePath for GitHub Pages

All image and asset URLs use the `withBasePath()` utility from `src/lib/utils.ts` to automatically handle this prefix.

### Environment Variables

Create a `.env.local` file for development (already configured):
```bash
NEXT_PUBLIC_BASE_PATH=
```

For production, the basePath is automatically set based on `NODE_ENV`.

### Manual Deployment

1. Ensure GitHub Pages is enabled in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch - GitHub Actions will build and deploy automatically

## Project Structure

```
src/
├── app/                 # Next.js pages (App Router)
│   ├── page.tsx        # Homepage
│   ├── projects/       # Projects + interactive map
│   ├── elibrary/       # eLibrary page
│   ├── faq/            # FAQ page
│   ├── careers/        # Careers page
│   └── ...             # Other pages
├── components/          # React components
│   ├── layout/         # Header, Footer
│   ├── home/           # Homepage components
│   ├── projects/       # ProjectCard, ProjectModal
│   ├── elibrary/       # Sidebar, DocumentList, ReadingPanel
│   ├── faq/            # FAQAccordion
│   ├── careers/        # JobCard, JobModal
│   ├── map/            # Leaflet map components
│   ├── ui/             # Reusable UI (Button, Card, ImageCarousel)
│   └── animations/     # Animation wrappers
├── data/               # Static & generated data
│   ├── faq.ts          # FAQ data (20 questions)
│   ├── careers.ts      # Careers data (benefits + jobs)
│   └── generated/      # Auto-generated from CSV (gitignored)
│       ├── projects.json
│       └── elibrary.json
├── types/              # TypeScript interfaces
│   ├── project.ts
│   └── elibrary.ts
└── lib/                # Utility functions (withBasePath, etc.)

content/                # Content management (git tracked, CSV-based)
├── projects/
│   ├── projects.csv    # Master project data (32 projects)
│   └── {project-id}/   # Per-project media folders
│       ├── images/     # Project photos
│       └── pdfs/       # Case studies
└── elibrary/
    ├── documents.csv   # eLibrary documents (12 documents)
    ├── sections.csv    # Section metadata
    └── {document-id}/  # Per-document folders
        └── files/      # PDF files

scripts/                # Build scripts
├── build-content.ts    # Main orchestrator
└── parsers/            # CSV parsing & validation
    ├── csv-parser.ts
    ├── project-parser.ts
    ├── elibrary-parser.ts
    └── validate-media.ts

docs/                   # User documentation
├── content-management.md
├── adding-projects.md
├── gps-coordinates.md
└── elibrary-management.md
```

## Customization

### Colors

Edit brand colors in `src/app/globals.css`:
- Primary: Blue (#1890ff)
- Secondary: Teal (#13c2c2)

### Content

Update company information in `src/data/site-config.ts`

## Content Management

The website uses a CSV-based content management system for easy editing without code changes.

### Adding Projects

1. Edit `content/projects/projects.csv` in Excel or Google Sheets
2. Add project images to `content/projects/{project-id}/images/`
3. Run `npm run build:content` to process and validate
4. Images are automatically copied to `public/projects/`

See `docs/content-management.md` and `docs/adding-projects.md` for detailed instructions.

### Managing eLibrary

1. Edit `content/elibrary/documents.csv` in Excel or Google Sheets
2. Add PDFs to `content/elibrary/{document-id}/files/`
3. Run `npm run build:content` to process and validate
4. PDFs are automatically copied to `public/elibrary/`

The eLibrary supports three sections: **Standards**, **Publications**, and **Newsletters**.

See `docs/elibrary-management.md` for complete guide.

### Managing FAQ & Careers

- **FAQ**: Edit `src/data/faq.ts` to add/modify questions (no build step needed)
- **Careers**: Edit `src/data/careers.ts` to add job listings (no build step needed)

### Build Commands

```bash
npm run build:content  # Parse CSV, validate, copy media (projects + eLibrary)
npm run dev            # Run dev server (also builds content)
npm run build          # Production build (also builds content)
```

## Troubleshooting

### Images Not Loading (404 Errors)

If you see 404 errors for project images:

1. **Check basePath**: The `withBasePath()` utility should be used for all image/PDF URLs
2. **Verify build**: Run `npm run build:content` to ensure images are copied to `public/projects/`
3. **Check file paths**: Image paths in CSV should match actual filenames (case-sensitive)
4. **Environment**: Ensure `.env.local` exists with `NEXT_PUBLIC_BASE_PATH=` for development

### Build Errors

- **CSV validation errors**: Check error messages for specific issues (missing fields, invalid coordinates, etc.)
- **Media not found**: Ensure images exist in `content/projects/{id}/images/` before running build
- **TypeScript errors**: Run `npm run build` to catch type issues early

## Future Enhancements

- ERPNext integration for client portal
- Real-time equipment availability
- Multi-step RFQ form
- Interactive project timeline
- Advanced search and filtering
