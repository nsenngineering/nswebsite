# NS Engineering & Geotechnical Services Website

Professional website for NS Engineering, a geotechnical and engineering services company in Nepal.

## Features

- Interactive service showcase (Pile Testing, Soil/Rock Laboratory, Drilling, Geophysical Surveys)
- Project portfolio with filterable gallery
- Equipment catalog with specifications
- Interactive project location map
- Knowledge center (blog)
- Contact/RFQ form
- Fully responsive design
- Optimized for performance and SEO

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with static export
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Animations**: Framer Motion
- **Maps**: React Leaflet
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

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
├── app/                 # Next.js pages
├── components/          # React components
│   ├── layout/         # Header, Footer
│   ├── home/           # Homepage components
│   ├── services/       # Service cards, modals
│   ├── projects/       # Project components
│   ├── equipment/      # Equipment catalog
│   ├── map/            # Leaflet map components
│   ├── ui/             # Reusable UI components
│   └── animations/     # Animation wrappers
├── data/               # Static data files
│   └── generated/      # Auto-generated from CSV (gitignored)
├── types/              # TypeScript interfaces
└── lib/                # Utility functions (including withBasePath)
content/                # Content management (git tracked)
└── projects/
    ├── projects.csv    # Master project data
    └── {project-id}/   # Per-project media folders
        ├── images/     # Project photos
        └── pdfs/       # Case studies
scripts/                # Build scripts
└── parsers/           # CSV parsing & validation
```

## Customization

### Colors

Edit brand colors in `src/app/globals.css`:
- Primary: Blue (#1890ff)
- Secondary: Teal (#13c2c2)

### Content

Update company information in `src/data/site-config.ts`

## Content Management

### Adding Projects

The website uses a CSV-based content management system:

1. Edit `content/projects/projects.csv` in Excel or Google Sheets
2. Add project images to `content/projects/{project-id}/images/`
3. Run `npm run build:content` to process and validate
4. Images are automatically copied to `public/projects/`

See `docs/content-management.md` for detailed instructions.

### Build Commands

```bash
npm run build:content  # Parse CSV, validate, copy media
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
