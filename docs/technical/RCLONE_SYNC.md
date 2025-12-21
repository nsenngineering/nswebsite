# rclone Media Sync Workflow

**Status**: Production Ready
**Last Updated**: 2024-12-19
**Version**: 1.0.0

---

## Overview

Automated media synchronization workflow using **rclone** to sync media files from **Google Drive → Cloudflare R2** while keeping CSV files version-controlled in Git.

### Architecture

```
┌──────────────────┐
│  Google Drive    │ ← Team uploads media here
│  (content/)      │
└────────┬─────────┘
         │
         │ rclone sync (on push to cloudflare)
         │
         ▼
┌──────────────────┐
│  Cloudflare R2   │ ← Public CDN serving
│  (ns-engineering │
│   -projects)     │
└────────┬─────────┘
         │
         │ NEXT_PUBLIC_R2_BASE_URL
         │
         ▼
┌──────────────────┐
│  Website         │ ← Images load from R2
│  (GitHub Pages)  │
└──────────────────┘

┌──────────────────┐
│  Google Sheets   │ ← Team edits metadata
│  (9 sheets)      │
└────────┬─────────┘
         │
         │ Sheets API
         │
         ▼
┌──────────────────┐
│  CSV Files       │ ← Version controlled in Git
│  (content/*.csv) │
└──────────────────┘
```

---

## Workflow Details

### Trigger

**Automatic**: On every push to `cloudflare` branch

**Manual**: Via GitHub Actions UI (Actions → Manual R2 Sync → Run workflow)

### Sync Process

1. **Google Drive → R2 Sync**:
   - Source: `gdrive:content/` (Google Drive folder)
   - Destination: `r2:ns-engineering-projects/` (R2 bucket)
   - Filters:
     - Exclude: `*.csv` (handled by Git)
     - Include: `*.jpg`, `*.jpeg`, `*.png`, `*.webp`, `*.pdf`
   - Method: One-way sync (Drive is source of truth)
   - Verification: Checksum validation

2. **Google Sheets → CSV Export**:
   - Source: Google Sheets API (9 sheets)
   - Destination: `content/**/*.csv` files
   - Version control: Committed to Git

3. **Build & Deploy**:
   - Content parsed from CSV + R2 URLs
   - Website built with Next.js
   - Deployed to GitHub Pages

---

## GitHub Secrets Configuration

### Required Secrets (15 total)

Add these in: **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

#### Google Drive Service Account (6 secrets)

```bash
GDRIVE_PROJECT_ID
# Example: "ns-engineering-123456"
# From: google-credentials.json → "project_id"

GDRIVE_PRIVATE_KEY_ID
# Example: "abc123def456..."
# From: google-credentials.json → "private_key_id"

GDRIVE_PRIVATE_KEY
# Example: "-----BEGIN PRIVATE KEY-----\nMIIE..."
# From: google-credentials.json → "private_key"
# IMPORTANT: Include the entire key with \n characters

GDRIVE_SERVICE_ACCOUNT_EMAIL
# Example: "ns-engineering@ns-engineering-123456.iam.gserviceaccount.com"
# From: google-credentials.json → "client_email"

GDRIVE_CLIENT_ID
# Example: "123456789012345678901"
# From: google-credentials.json → "client_id"

GDRIVE_ROOT_FOLDER_ID
# Example: "1AbC2DeF3GhI4JkL5MnO6PqR"
# From: Google Drive → Right-click "content" folder → Share → Copy link
# Extract ID from: https://drive.google.com/drive/folders/THIS_IS_THE_ID
```

#### Google Sheets Service Account (3 secrets)

```bash
GOOGLE_SHEET_ID
# Value: 1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI

GOOGLE_CREDENTIALS_JSON
# Value: Entire contents of google-credentials.json file
# Copy the full JSON object including { and }

# Note: If using same service account for both Drive and Sheets, you can skip these:
# GOOGLE_SERVICE_ACCOUNT_EMAIL (same as GDRIVE_SERVICE_ACCOUNT_EMAIL)
# GOOGLE_PRIVATE_KEY (same as GDRIVE_PRIVATE_KEY)
```

#### Cloudflare R2 (6 secrets)

```bash
R2_ACCOUNT_ID
# Example: "abc123def456ghi789"
# From: Cloudflare Dashboard → R2 → Overview

R2_ACCESS_KEY_ID
# Example: "xyz789abc123..."
# From: Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API Token

R2_SECRET_ACCESS_KEY
# Example: "secret123key456..."
# From: Same location as Access Key (shown only once!)

R2_BUCKET_NAME
# Value: ns-engineering-projects

NEXT_PUBLIC_R2_BASE_URL
# Example: https://pub-abc123def456.r2.dev
# From: Cloudflare Dashboard → R2 → Your bucket → Settings → Public R2.dev subdomain

# Note: R2_BASE_PATH is not needed (handled in code)
```

---

## rclone Configuration

### Google Drive Remote

```ini
[gdrive]
type = drive
scope = drive.readonly
service_account_credentials = {JSON from secrets}
root_folder_id = {GDRIVE_ROOT_FOLDER_ID}
```

### Cloudflare R2 Remote

```ini
[r2]
type = s3
provider = Cloudflare
access_key_id = {R2_ACCESS_KEY_ID}
secret_access_key = {R2_SECRET_ACCESS_KEY}
endpoint = https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com
acl = public-read
```

### Sync Command

```bash
rclone sync gdrive:content/ r2:ns-engineering-projects/ \
  --exclude "*.csv" \
  --include "*.jpg" --include "*.jpeg" --include "*.png" --include "*.webp" \
  --include "*.pdf" \
  --progress \
  --checksum \
  --log-level INFO \
  --stats 30s
```

**Flags Explained**:
- `--exclude "*.csv"` - Skip CSV files (handled by Git)
- `--include` - Only sync media file types
- `--progress` - Show progress during sync
- `--checksum` - Verify file integrity with checksums
- `--log-level INFO` - Detailed logging for debugging
- `--stats 30s` - Show statistics every 30 seconds

---

## Team Workflow

### For Content Editors (Non-Technical)

#### Editing Metadata (Projects, Services, Team, etc.)

1. Open [Google Sheets](https://docs.google.com/spreadsheets/d/1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI/edit)
2. Edit the relevant sheet (Projects, Team, Services, etc.)
3. Changes auto-save
4. Done! Next deployment will pick up changes

#### Uploading Media Files (Images, PDFs)

1. Open [Google Drive content folder](https://drive.google.com/drive/folders/YOUR_FOLDER_ID)
2. Navigate to the correct subfolder:
   - Projects: `projects/{project-slug}/images/` or `projects/{project-slug}/pdfs/`
   - Hero: `homepage_hero/images/`
   - Team: `team/images/`
   - Services: `services/{service-slug}/images/` or `diagrams/`
   - eLibrary: `elibrary/{doc-slug}/files/`
3. Upload your files (drag & drop)
4. Done! Next deployment will sync to R2

**Important Notes**:
- Do NOT upload CSV files to Google Drive (managed by Sheets API)
- Keep original filenames (referenced in Google Sheets)
- Use supported formats: JPG, PNG, WEBP, PDF

### For Developers

#### Deploying Changes

```bash
# 1. Make code changes
git add .
git commit -m "Your changes"

# 2. Push to cloudflare branch
git push origin cloudflare

# GitHub Actions will automatically:
# - Sync media from Google Drive → R2
# - Export Google Sheets → CSV
# - Build website with R2 URLs
# - Deploy to GitHub Pages
# - Commit CSV updates to Git
```

#### Manual Sync (Testing)

```bash
# Via GitHub Actions UI:
# 1. Go to: Actions → Manual R2 Sync
# 2. Click "Run workflow"
# 3. Choose:
#    - Dry run: true (test without syncing)
#    - Dry run: false (actual sync)
# 4. Click "Run workflow"
# 5. Monitor logs
```

#### Local Testing (Optional)

```bash
# 1. Install rclone
brew install rclone  # macOS
# OR
curl https://rclone.org/install.sh | sudo bash  # Linux

# 2. Configure Google Drive remote
rclone config
# Choose: Google Drive, service account, paste credentials

# 3. Configure R2 remote
rclone config
# Choose: S3, Cloudflare, enter credentials

# 4. Test sync (dry-run)
rclone sync gdrive:content/ r2:ns-engineering-projects/ \
  --exclude "*.csv" \
  --include "*.jpg" --include "*.jpeg" --include "*.png" --include "*.webp" \
  --include "*.pdf" \
  --dry-run \
  --verbose

# 5. Actual sync (if dry-run looks good)
rclone sync gdrive:content/ r2:ns-engineering-projects/ \
  --exclude "*.csv" \
  --include "*.jpg" --include "*.jpeg" --include "*.png" --include "*.webp" \
  --include "*.pdf" \
  --progress \
  --checksum
```

---

## Monitoring & Verification

### GitHub Actions Logs

1. Go to: **Actions** tab in GitHub repository
2. Click on the latest workflow run
3. Expand steps to view logs:
   - "Sync media files from Google Drive to R2" - rclone output
   - "Export Google Sheets to CSV" - Sheets API export
   - "Build website" - Next.js build logs
   - "Commit CSV updates" - Git commit logs

### R2 Bucket Verification

1. **Cloudflare Dashboard** → R2 → `ns-engineering-projects`
2. Browse folder structure:
   ```
   ns-engineering-projects/
   ├── projects/
   │   ├── ktft-fast-track-1/
   │   │   ├── images/
   │   │   └── pdfs/
   │   └── ...
   ├── hero/
   │   ├── IMG_2968.JPG
   │   └── ...
   ├── team/
   │   ├── arun-pandit.jpg
   │   └── ...
   ├── elibrary/
   │   └── is-2131-2008/files/
   └── services/
       ├── images/
       └── diagrams/
   ```
3. Check file counts and sizes

### Website Verification

1. Visit deployed site: [Your GitHub Pages URL]
2. Open browser DevTools → Network tab
3. Verify images load from R2:
   - URLs should be: `https://pub-XXXXX.r2.dev/...`
   - NOT: `/projects/...` or `/hero/...`
4. Check console for errors

### CSV Version Control

```bash
# Check for CSV updates
git log --oneline -- content/

# View CSV changes
git diff HEAD~1 content/

# Revert to previous version (if needed)
git checkout HEAD~1 -- content/projects/projects.csv
git commit -m "Revert projects CSV to previous version"
```

---

## Troubleshooting

### Sync Fails: "Folder not found"

**Error**: `Failed to create file system for "gdrive:content/": directory not found`

**Cause**: `GDRIVE_ROOT_FOLDER_ID` is incorrect or service account doesn't have access

**Fix**:
1. Verify folder ID from Google Drive URL
2. Share folder with service account email
3. Update `GDRIVE_ROOT_FOLDER_ID` secret in GitHub

### Sync Fails: "Access denied"

**Error**: `403 Forbidden` or `Access denied`

**Cause**: Service account doesn't have permission

**Fix**:
1. Go to Google Drive → Right-click "content" folder → Share
2. Add service account email with "Viewer" permission
3. Retry sync

### Sync Fails: "Invalid credentials"

**Error**: `Failed to configure Google Drive remote: parse error`

**Cause**: Malformed JSON in `GDRIVE_PRIVATE_KEY` or other secrets

**Fix**:
1. Re-copy credentials from `google-credentials.json`
2. For `GDRIVE_PRIVATE_KEY`, ensure `\n` characters are preserved
3. Update GitHub secrets
4. Retry sync

### R2 Upload Fails: "Bucket not found"

**Error**: `NoSuchBucket: The specified bucket does not exist`

**Cause**: `R2_BUCKET_NAME` is incorrect

**Fix**:
1. Verify bucket name in Cloudflare Dashboard → R2
2. Update `R2_BUCKET_NAME` secret in GitHub
3. Retry sync

### Images Not Loading from R2

**Symptom**: Website shows broken images

**Cause**: R2 bucket not public or incorrect URL

**Fix**:
1. Cloudflare Dashboard → R2 → Your bucket → Settings
2. Enable "Public R2.dev subdomain"
3. Copy public URL: `https://pub-XXXXX.r2.dev`
4. Update `NEXT_PUBLIC_R2_BASE_URL` secret in GitHub
5. Redeploy

### CSV Not Committing

**Symptom**: CSV changes in Sheets not appearing in Git

**Cause**: Workflow step failing or no changes detected

**Fix**:
1. Check workflow logs for "Export Google Sheets to CSV" step
2. Verify `GOOGLE_CREDENTIALS_JSON` secret is correct
3. Check "Commit CSV updates" step for errors
4. Manually run: `npm run build:content:cloud` locally to test

### Dry Run Shows Unexpected Changes

**Symptom**: Dry run shows many files being deleted or modified

**Cause**: Mismatch between Google Drive and R2 content

**Investigation**:
1. Run dry run again and review logs carefully
2. Check if files were manually deleted from R2
3. Verify Google Drive folder structure matches expected layout
4. If intentional cleanup, proceed with real sync
5. If unexpected, investigate before syncing

---

## Performance & Costs

### Sync Performance

- **Initial Sync**: ~10-15 minutes (114MB media)
- **Incremental Sync**: ~1-3 minutes (only changed files)
- **Build Time**: ~5-7 minutes (parsing + Next.js build)
- **Total Deployment**: ~15-20 minutes (first time), ~8-12 minutes (incremental)

### R2 Storage Costs (Cloudflare)

- **Storage**: $0.015/GB/month
- **Class A Operations** (writes): $4.50/million requests
- **Class B Operations** (reads): $0.36/million requests
- **Egress**: FREE (no bandwidth charges!)

**Estimated Monthly Cost**:
- Storage: 0.114 GB × $0.015 = **$0.002/month**
- Writes: ~100 files × 1 sync/day × 30 days = 3,000 requests = **$0.01/month**
- Total: **~$0.02/month** (essentially free!)

### GitHub Actions Minutes

- **Free Tier**: 2,000 minutes/month for public repos
- **Usage per Deployment**: ~15-20 minutes
- **Capacity**: ~100-130 deployments/month (well within limits)

---

## Migration Impact

### Before rclone Workflow

- Git repo size: **137MB**
- Build time: ~10 minutes (copying files)
- Image serving: Static hosting
- Team workflow: Git commits for media changes
- Version control: Media tracked in Git (inefficient)

### After rclone Workflow

- Git repo size: **<5MB** (97% reduction!)
- Build time: ~5-7 minutes (no file copying)
- Image serving: R2 CDN (global, fast)
- Team workflow: Upload to Google Drive (simple)
- Version control: CSV only (professional audit trail)
- Cost: ~$0.02/month
- Benefits:
  - Faster deployments
  - Better team workflow
  - Professional separation of concerns
  - Unlimited media without repo bloat

---

## Advanced Configuration

### Adding New Media Types

To sync additional file types (e.g., `.svg`, `.gif`):

**Edit**: `.github/workflows/deploy.yml` and `.github/workflows/manual-sync.yml`

```yaml
rclone sync gdrive:content/ r2:${{ secrets.R2_BUCKET_NAME }}/ \
  --exclude "*.csv" \
  --include "*.jpg" --include "*.jpeg" --include "*.png" --include "*.webp" \
  --include "*.pdf" \
  --include "*.svg" --include "*.gif" \  # Add new types here
  --progress \
  --checksum \
  --log-level INFO
```

### Sync Scheduling (Future)

To enable automatic syncs every 6 hours (without code changes):

**Add to** `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches: [cloudflare]
  workflow_dispatch:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
```

**Note**: This will sync media even without code changes. Only enable if team frequently updates media.

### Delete Removed Files

To delete files from R2 that were removed from Google Drive:

**Edit**: Add `--delete-after` flag to rclone sync command

```yaml
rclone sync gdrive:content/ r2:${{ secrets.R2_BUCKET_NAME }}/ \
  --exclude "*.csv" \
  --include "*.jpg" --include "*.jpeg" --include "*.png" --include "*.webp" \
  --include "*.pdf" \
  --delete-after \  # Add this line
  --progress \
  --checksum \
  --log-level INFO
```

**Warning**: This permanently deletes files from R2 that don't exist in Google Drive. Test with dry-run first!

---

## Security Considerations

### Service Account Permissions

- **Google Drive**: Viewer access only (read-only)
- **Google Sheets**: Viewer access only (read-only)
- **R2**: Write access required (for sync)

### Secret Management

- **GitHub Secrets**: Encrypted at rest, only accessible to workflows
- **Never commit**: Credentials files, API keys, private keys
- **Rotate regularly**: Service account keys, R2 API tokens

### Public Access

- **R2 Bucket**: Public read-only (via R2.dev subdomain)
- **No sensitive data**: Only public website media should be synced
- **No authentication**: Images served publicly (by design)

---

## Support & Maintenance

### Regular Maintenance Tasks

**Weekly**:
- Review GitHub Actions logs for errors
- Check R2 storage usage in Cloudflare Dashboard

**Monthly**:
- Audit Google Drive folder structure
- Review CSV commit history
- Verify website images loading correctly

**Quarterly**:
- Rotate service account keys
- Review and clean up unused media files
- Test disaster recovery (restore from CSV)

### Disaster Recovery

**Scenario**: R2 bucket accidentally deleted

**Recovery**:
1. Create new R2 bucket with same name
2. Trigger manual sync workflow (sync from Google Drive → R2)
3. Redeploy website

**Scenario**: Google Drive folder deleted

**Recovery**:
1. Restore from local copies (if available)
2. OR sync from R2 → Google Drive (reverse direction)
3. OR rebuild from CSV + local media files

**Scenario**: CSV files corrupted

**Recovery**:
1. Check Git history: `git log -- content/`
2. Restore from previous commit: `git checkout HEAD~N -- content/`
3. OR re-export from Google Sheets: `npm run build:content:cloud`

---

## Related Documentation

- [R2 Migration Guide](./CLOUDFLARE_R2_MIGRATION.md) - R2 implementation details
- [Google Sheets Integration](../setup/GOOGLE_SHEETS_API_SETUP.md) - Sheets API setup
- [Deployment Guide](../../DEPLOYMENT.md) - Production deployment
- [README](../../README.md) - Main project documentation

---

**Questions or Issues?**

1. Check workflow logs in GitHub Actions
2. Review this troubleshooting section
3. Test with manual sync (dry-run mode)
4. Contact development team

---

**Version**: 1.0.0
**Last Updated**: 2024-12-19
**Status**: Production Ready ✅
