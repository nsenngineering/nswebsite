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
| `content/categories/categories.csv` | **ProjectCategories** |
| `content/services/service-categories.csv` | **ServiceCategories** |
| `content/services/services.csv` | **Services** |
| `content/company/company-info.csv` | **CompanyInfo** |
| `content/rotating_metrics/metrics.csv` | **RotatingMetrics** |
| `content/alumni/alumni.csv` | **Alumni** |
| `content/faq/faq.csv` | **FAQ** |
| `content/faq/faq-categories.csv` | **FAQCategories** |

## Code Configuration

The default tab names are now hardcoded in the parsers:

- **Projects** → `scripts/parsers/project-parser.ts`
- **HomepageHeroCarousel** → `scripts/parsers/hero-carousel-parser.ts`
- **HomepageHeroMilestones** → `scripts/parsers/milestone-parser.ts`
- **Team** → `scripts/parsers/team-parser.ts`
- **ElibraryDocuments** → `scripts/build-content.ts` + `scripts/parsers/elibrary-parser.ts`
- **ElibrarySections** → `scripts/parsers/elibrary-parser.ts`
- **ProjectCategories** → `scripts/parsers/category-parser.ts`
- **ServiceCategories** → `scripts/parsers/services-parser.ts`
- **Services** → `scripts/parsers/services-parser.ts`
- **CompanyInfo** → `scripts/parsers/company-info-parser.ts`
- **RotatingMetrics** → `scripts/parsers/rotating-metrics-parser.ts`
- **Alumni** → `scripts/parsers/alumni-parser.ts`
- **FAQ** → `scripts/parsers/faq-parser.ts`
- **FAQCategories** → `scripts/parsers/faq-parser.ts`

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
📊 Fetching data from Google Sheets tab: "ProjectCategories"
📊 Fetching data from Google Sheets tab: "ServiceCategories"
📊 Fetching data from Google Sheets tab: "Services"
📊 Fetching data from Google Sheets tab: "CompanyInfo"
📊 Fetching data from Google Sheets tab: "RotatingMetrics"
📊 Fetching data from Google Sheets tab: "Alumni"
📊 Fetching data from Google Sheets tab: "FAQCategories"
📊 Fetching data from Google Sheets tab: "FAQ"
```

If you see errors like "Sheet tab not found", double-check that your tab names match EXACTLY (case-sensitive!).

## Company Info Sheet Structure

The **CompanyInfo** sheet uses a key-value pair structure (2 columns):

| key | value |
|-----|-------|
| company_name | N.S. Engineering & Geotechnical Services Pvt. Ltd. |
| company_short_name | NS Engineering |
| company_tagline | Constantly Evolving, Foundation You Can Trust |
| contact_email | info@nsengineering.com.np |
| contact_phone | +977-01-5260121 |
| ... | ... |

This format makes it easy to edit individual company details in Google Sheets.

## Rotating Metrics Sheet Structure

The **RotatingMetrics** sheet contains the metric cards displayed below the hero carousel:

| id | icon | value | label | description | gradient | href |
|----|------|-------|-------|-------------|----------|------|
| experience | Trophy | 10+ | Years of Experience | Delivering excellence in geotechnical services across Nepal since 2015 | from-primary-600 to-primary-800 | /about |
| projects | Briefcase | 100+ | Projects Completed | Successful projects across roads, bridges, hydropower, and infrastructure | from-primary-700 to-primary-900 | /projects |

**Available Icons**: Trophy, Briefcase, Wrench, Users, Award, Target
