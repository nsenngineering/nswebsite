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
│   ├── ui/             # Reusable UI components
│   └── animations/     # Animation wrappers
├── data/               # Static data files
├── types/              # TypeScript interfaces
└── lib/                # Utility functions
```

## Customization

### Colors

Edit brand colors in `src/app/globals.css`:
- Primary: Blue (#1890ff)
- Secondary: Teal (#13c2c2)

### Content

Update company information in `src/data/site-config.ts`

## Future Enhancements

- ERPNext integration for client portal
- Real-time equipment availability
- Multi-step RFQ form
- Interactive project timeline
- Advanced search and filtering
