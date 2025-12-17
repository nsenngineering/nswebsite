# Google Sheets Tab Name Mapping

## Your Actual Sheet Tab Names (Confirmed ✅)

| CSV File Location | Google Sheet Tab Name |
|-------------------|----------------------|
| `content/projects/projects.csv` | **Projects** |
| `content/homepage_hero/hero_carousel.csv` | **HomepageHeroCarousel** |
| `content/homepage_hero/milestones.csv` | **HomepageHeroMilestones** |
| `content/team/team.csv` | **Team** |
| `content/elibrary/documents.csv` | **ElibraryDocuments** |
| `content/elibrary/sections.csv` | **ElibrarySections** |

## Additional Tabs (For Future Use)

You also have these tabs in your Google Sheet that aren't used yet:

| CSV File Location | Google Sheet Tab Name | Status |
|-------------------|----------------------|--------|
| `content/categories/categories.csv` | **ProjectCategories** | ⏳ Not implemented yet |
| `content/services/service-categories.csv` | **ServiceCategories** | ⏳ Not implemented yet |
| `content/services/services.csv` | **Services** | ⏳ Not implemented yet |

**Note:** These additional tabs are ready in your Google Sheet but the website currently reads these from CSV files only. We can add Sheets support for these later if needed.

## Code Configuration

The default tab names are now hardcoded in the parsers:

- **Projects** → `scripts/parsers/project-parser.ts`
- **HomepageHeroCarousel** → `scripts/parsers/hero-carousel-parser.ts`
- **HomepageHeroMilestones** → `scripts/parsers/milestone-parser.ts`
- **Team** → `scripts/parsers/team-parser.ts`
- **ElibraryDocuments** → `scripts/build-content.ts` + `scripts/parsers/elibrary-parser.ts`
- **ElibrarySections** → `scripts/parsers/elibrary-parser.ts`

## Testing Your Setup

Once you complete the Google Cloud setup, test with:

```bash
# Test content build
npm run build:content:cloud

# Expected console output:
📊 Fetching data from Google Sheets tab: "Projects"
📊 Fetching data from Google Sheets tab: "HomepageHeroCarousel"
📊 Fetching data from Google Sheets tab: "HomepageHeroMilestones"
📊 Fetching data from Google Sheets tab: "Team"
📊 Fetching data from Google Sheets tab: "ElibraryDocuments"
📊 Fetching data from Google Sheets tab: "ElibrarySections"
```

If you see errors like "Sheet tab not found", double-check that your tab names match EXACTLY (case-sensitive!).
