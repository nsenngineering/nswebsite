# Google Sheets Tab Name Mapping

## Your Actual Sheet Tab Names (Confirmed ✅)

| CSV File Location | Google Sheet Tab Name |
|-------------------|----------------------|
| `content/projects/projects.csv` | **Projects** |
| `content/homepage_hero/hero_carousel.csv` | **HomepageHeroCarousel** |
| `content/homepage_hero/milestones.csv` | **HomepageHeroMilestones** |
| `content/team/team.csv` | **Team** |
| `content/elibrary/standard-codes.csv` | **StandardCodes** |
| `content/elibrary/publications.csv` | **Publications** |
| `content/elibrary/curated-papers.csv` | **CuratedPapers** |
| `content/elibrary/downloads.csv` | **Downloads** |
| `content/elibrary/newsletters.csv` | **Newsletters** |
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
- **StandardCodes** → `scripts/parsers/elibrary-parser.ts`
- **Publications** → `scripts/parsers/elibrary-parser.ts`
- **CuratedPapers** → `scripts/parsers/elibrary-parser.ts`
- **Downloads** → `scripts/parsers/elibrary-parser.ts`
- **Newsletters** → `scripts/parsers/elibrary-parser.ts`
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
📊 Fetching data from Google Sheets tab: "StandardCodes"
📊 Fetching data from Google Sheets tab: "Publications"
📊 Fetching data from Google Sheets tab: "CuratedPapers"
📊 Fetching data from Google Sheets tab: "Downloads"
📊 Fetching data from Google Sheets tab: "Newsletters"
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
| contact_email_careers | careers@nsengineering.com.np |
| contact_phone | +977-01-5260121 |
| contact_phone_alt | +977-9851228995 |
| contact_whatsapp | +977-9851228995 |
| contact_address | Bishal Niwash, 4th Cross, Jwagal, Lalitpur, Nepal |
| social_facebook | https://www.facebook.com/nsengineering |
| social_linkedin | https://www.linkedin.com/company/ns-engineering |
| ... | ... |

This format makes it easy to edit individual company details in Google Sheets.

**Required Fields:**
- All `company_*` fields (name, short_name, tagline, description, url)
- All `contact_*` fields (email, email_careers, phone, phone_alt, whatsapp, address)
- All `social_*` fields (facebook, linkedin, instagram, tiktok)
- All `certification_*` fields (iso, badge)
- All `laboratory_*` fields (name, location, description)
- All `stats_*` fields (years_experience, projects_completed, team_size, drilling_capacity)

## Rotating Metrics Sheet Structure

The **RotatingMetrics** sheet contains the metric cards displayed below the hero carousel:

| id | icon | value | label | description | gradient | href |
|----|------|-------|-------|-------------|----------|------|
| experience | Trophy | 10+ | Years of Experience | Delivering excellence in geotechnical services across Nepal since 2015 | from-primary-600 to-primary-800 | /about |
| projects | Briefcase | 100+ | Projects Completed | Successful projects across roads, bridges, hydropower, and infrastructure | from-primary-700 to-primary-900 | /projects |

**Available Icons**: Trophy, Briefcase, Wrench, Users, Award, Target
