# GitHub Copilot Instructions
# NS Engineering & Geotechnical Services Website

## Project Overview

Professional engineering and geotechnical services website for NS Engineering & Geotechnical Services Pvt. Ltd. (Nepal).

### Tech Stack
- Next.js 16 (App Router)
- React
- TypeScript (strict mode)
- Tailwind CSS v4
- Framer Motion
- React Leaflet
- Google Sheets API
- CSV-based CMS
- Static export deployment

---

# Core Architecture

## Content Flow

```txt
Google Sheets
  ↓
CSV Export
  ↓
Generated JSON
  ↓
React Components
```

### Important
- Google Sheets = primary content source
- CSV files = Git tracked backup/version control
- Generated JSON = runtime data layer
- Never manually edit generated JSON files

---

# Folder Structure

```txt
src/
├── app/
├── components/
├── data/
├── lib/
├── types/

scripts/
├── parsers/
└── build-content.ts

content/
docs/
```

---

# Coding Rules

## TypeScript
- Always use strict typing
- Never use `any`
- Use shared interfaces from `src/types`

Example:
```ts
interface TeamMember {
  name: string;
  role: string;
  featured: boolean;
}
```

---

## Imports

Always use absolute imports:

```ts
import { TeamCard } from '@/components/team/TeamCard';
```

Avoid relative imports like:
```ts
../../../components/
```

---

## React Rules

- Use functional components
- Use hooks
- Prefer reusable components
- Prefer server components when possible
- Use Tailwind utility classes only

---

# Styling Rules

## Tailwind
Preferred classes:
- `rounded-2xl`
- `shadow-lg`
- `gap-6`
- `p-6`

Use responsive utilities:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

---

# Content Parser Pattern

All parsers should:
1. Fetch Google Sheets
2. Fallback to CSV
3. Validate data
4. Return typed objects

Example:
```ts
const records = await fetchDataWithFallback('Team');
```

---

# Error Handling

Always use:
```ts
try {
  // logic
} catch (error) {
  console.error(error);
}
```

Prevent build crashes whenever possible.

---

# Team System

## CSV Fields

```csv
name,role,education,experience,featured,linkedinUrl,specializations
```

### Rules
- `featured=true` → About page leadership section
- All members → `/team` page
- `specializations` = semicolon separated

---

# SEO Rules

Use schema.org structured data:
- Organization
- Person
- Service
- Project
- DefinedTerm

### Geographic Targeting
Always include:
- Nepal
- GPS coordinates when available
- District/province hierarchy

---

# Performance Rules

Always:
- Optimize images
- Use lazy loading
- Prefer static rendering
- Keep bundle size small

---

# Accessibility Rules

All components should:
- Use semantic HTML
- Include alt text
- Support keyboard navigation

---

# Build Commands

## Development

```bash
npm run dev:local
npm run dev:cloud
```

## Production

```bash
npm run build:local
npm run build:cloud
```

## Content Sync

```bash
npm run build:content:cloud
```

---

# Deployment

```bash
git push origin cloudflare
```

GitHub Actions automatically:
1. Sync Google Drive → Cloudflare R2
2. Export Sheets → CSV
3. Build site
4. Deploy to GitHub Pages

---

# Important Instructions for Copilot

When generating code:
- Follow existing architecture
- Reuse utilities/components
- Preserve SEO system
- Preserve Google Sheets integration
- Preserve TypeScript strictness
- Avoid breaking production builds
- Keep components modular and reusable

---

# Priority Order

1. Type Safety
2. Maintainability
3. SEO Optimization
4. Accessibility
5. Performance
6. Clean Architecture
7. Stable Builds