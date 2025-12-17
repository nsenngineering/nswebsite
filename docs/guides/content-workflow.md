# Content Management Workflow

This document explains how to manage website content using Google Sheets with Git version control.

## Overview

The NS Engineering website uses a **hybrid content management system**:
- **Google Sheets**: Team edits content (easy, non-technical)
- **CSV Files**: Version controlled in Git (audit trail, backup)
- **Build Process**: Syncs Sheets → CSV → Website

## Benefits

✅ **Easy Editing**: Non-tech team uses familiar Google Sheets interface
✅ **Version Control**: All content changes tracked in Git forever
✅ **Audit Trail**: See who changed what, when, and why (via commit messages)
✅ **Rollback**: Can revert to any previous version
✅ **Backup**: CSV files in repo are failsafe if Sheets API fails
✅ **Diffable**: Git shows exact changes between versions

---

## Workflow

### 1. Team Edits Content in Google Sheets

**Location**: [NS Engineering Data](https://docs.google.com/spreadsheets/d/1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI/edit)

**Who**: Marketing team, project managers, non-technical staff

**What they can edit**:
- Projects (add new projects, update status)
- Team members (titles, descriptions)
- Services (descriptions, pricing info)
- Hero carousel & milestones
- eLibrary documents

**How**:
- Open Google Sheet
- Edit cells directly
- Changes auto-save
- No need to notify anyone

---

### 2. Developer Syncs Content (You)

**When**: Weekly, or before major deployments

**Steps**:

```bash
# 1. Fetch latest from Sheets and export to CSV
npm run build:content:cloud

# 2. Review what changed
git status content/
git diff content/

# 3. Commit with descriptive message
git add content/
git commit -m "Content sync: Week of Dec 17, 2024

- Added 3 new hydropower projects (Upper Tamakoshi, etc.)
- Updated team member titles
- Fixed GPS coordinates for 2 transmission line projects
- Added Q4 2024 newsletter to eLibrary"

# 4. Push to GitHub
git push origin cloudflare
```

**Output**:
```
💾 Exporting Google Sheets to CSV for version control...
   ✅ Projects → content/projects/projects.csv
   ✅ HomepageHeroCarousel → content/homepage_hero/hero_carousel.csv
   ✅ HomepageHeroMilestones → content/homepage_hero/milestones.csv
   ✅ Team → content/team/team.csv
   ✅ ElibraryDocuments → content/elibrary/documents.csv
   ✅ ElibrarySections → content/elibrary/sections.csv
   ✅ ProjectCategories → content/categories/categories.csv
   ✅ ServiceCategories → content/services/service-categories.csv
   ✅ Services → content/services/services.csv

📊 Export Summary: 9 succeeded, 0 failed
```

---

### 3. GitHub Deployment

**Trigger**: Automatically on push to `cloudflare` branch

**What happens**:
1. GitHub Actions runs `npm run build:cloud`
2. Fetches content from Google Sheets
3. Builds static site
4. Deploys to GitHub Pages

**CSV files are used as backup**: If Sheets API fails, build falls back to CSV files in repo.

---

## Version Control Examples

### Check Content History

```bash
# Who changed projects.csv in the last month?
git log --since="1 month ago" --oneline -- content/projects/projects.csv

# What changed in team.csv on Dec 15?
git log --since="2024-12-15" --until="2024-12-16" -p -- content/team/team.csv

# Find when "Upper Tamakoshi" project was added
git log -p --all -S "Upper Tamakoshi" -- content/projects/projects.csv
```

### Revert Changes

```bash
# Undo last commit (keep changes in working directory)
git reset --soft HEAD~1

# Revert specific file to previous version
git checkout HEAD~1 -- content/projects/projects.csv
git commit -m "Revert: Roll back accidental project deletions"

# See file content from 2 weeks ago
git show HEAD@{2.weeks.ago}:content/team/team.csv
```

### Compare Versions

```bash
# What changed between last week and now?
git diff HEAD@{1.week.ago} HEAD -- content/

# Compare two specific commits
git diff abc123..def456 -- content/projects/projects.csv

# See all changes to a specific project
git log -p --grep="KTFT" -- content/projects/projects.csv
```

---

## Build Modes Comparison

| Mode | Command | Data Source | CSV Export | Use Case |
|------|---------|-------------|------------|----------|
| **Local** | `npm run build:content:local` | Local CSV files | No | Offline development |
| **Cloud** | `npm run build:content:cloud` | Google Sheets | **Yes** | Team collaboration + version control |

### Local Mode (CSV Only)
```bash
npm run dev:local
# Uses: content/**/*.csv files
# No Sheets API calls
# No CSV export (already using CSV)
```

### Cloud Mode (Sheets + CSV Export)
```bash
npm run dev:cloud
# Uses: Google Sheets (with CSV fallback)
# Exports Sheets → CSV for version control
# Best for production workflow
```

---

## Files & Structure

### Google Sheet Tabs → CSV Files Mapping

| Google Sheet Tab | CSV File | Content |
|------------------|----------|---------|
| `Projects` | `content/projects/projects.csv` | Project portfolio |
| `HomepageHeroCarousel` | `content/homepage_hero/hero_carousel.csv` | Hero images alt text |
| `HomepageHeroMilestones` | `content/homepage_hero/milestones.csv` | Company timeline |
| `Team` | `content/team/team.csv` | Team members |
| `ElibraryDocuments` | `content/elibrary/documents.csv` | Documents library |
| `ElibrarySections` | `content/elibrary/sections.csv` | Document categories |
| `ProjectCategories` | `content/categories/categories.csv` | Project category styling |
| `ServiceCategories` | `content/services/service-categories.csv` | Service categories |
| `Services` | `content/services/services.csv` | Service catalog |

### Generated Outputs (Gitignored)

These are auto-generated during build and should NOT be committed:

- `src/data/generated/*.json` - JSON files for website runtime
- `public/projects/**` - Copied project images
- `public/elibrary/**` - Copied PDF files

---

## Commit Message Guidelines

Write clear commit messages when syncing content:

### Good Examples

```bash
git commit -m "Content sync: Added Q4 2024 projects

- Added 5 new hydropower projects with photos
- Updated 3 existing project statuses to 'Completed'
- Fixed GPS coordinates for Kulekhani Tunnel project"
```

```bash
git commit -m "Content: Updated team information

- Added new geologist Dr. Sharma
- Updated Managing Director title
- Removed former intern entries"
```

```bash
git commit -m "Content: eLibrary update with new standards

- Added ASTM D1143 (Static Load Testing)
- Added IS 2720 (Soil Testing Methods)
- Updated publication dates for 3 documents"
```

### Bad Examples

❌ `git commit -m "updated stuff"`
❌ `git commit -m "changes"`
❌ `git commit -m "sync"`

**Why bad?** No context for future reference. You won't know what changed 6 months from now.

---

## Troubleshooting

### Issue: Build fails with "Sheet tab not found"

**Solution**: Check tab names in Google Sheets match exactly (case-sensitive):
- Projects
- HomepageHeroCarousel
- HomepageHeroMilestones
- Team
- ElibraryDocuments
- ElibrarySections
- ProjectCategories
- ServiceCategories
- Services

### Issue: CSV export shows many changes but nothing edited

**Cause**: CSV formatting changed (quotes added) but data is identical.

**Solution**: This is normal on first export. Commit the changes:
```bash
git add content/
git commit -m "Normalize CSV formatting (add quotes)"
```

Future exports will only show actual content changes.

### Issue: Build falls back to CSV even though Sheets API should work

**Check**:
1. Is `CONTENT_SOURCE_MODE=sheets` in `.env.cloud`?
2. Is `GOOGLE_SHEET_ID` correct?
3. Is service account email added to Sheet with Viewer access?
4. Is `google-credentials.json` present in project root?

**Test connection**:
```bash
dotenv -e .env.cloud -- cross-env CONTENT_SOURCE_MODE=sheets tsx scripts/build-content.ts
```

---

## Future Enhancements

### Automated Content Sync (GitHub Actions)

Set up a scheduled workflow to automatically sync content every 6 hours:

```yaml
# .github/workflows/sync-content.yml
name: Sync Content from Sheets

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Fetch from Sheets & Export CSV
        run: npm run build:content:cloud

      - name: Commit if changed
        run: |
          git config user.name "Content Sync Bot"
          git add content/
          git diff --staged --quiet || git commit -m "chore: sync content [skip ci]"
          git push
```

**Benefits**:
- Zero manual work
- Content automatically synced
- Team edits reflected within 6 hours
- All changes tracked in Git

---

## Best Practices

1. **Sync weekly** during active content updates
2. **Write descriptive commit messages** (explain WHAT and WHY)
3. **Review diffs before committing** (catch accidental deletions)
4. **Use branches for major content changes** (e.g., `content/annual-report-2024`)
5. **Tag important milestones** (e.g., `v2024-annual-report`)

---

## Related Documentation

- [Google Sheets Setup Guide](../GOOGLE_SHEETS_SETUP.md) - Initial setup
- [Build Modes Guide](./BUILD_MODES.md) - Local vs Cloud comparison
- [Adding Projects Guide](./adding-projects.md) - How to add new projects

---

**Last Updated**: 2024-12-17
**Maintained By**: Development Team
