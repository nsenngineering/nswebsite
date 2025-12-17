# Deployment Guide

Complete deployment guide for NS Engineering website to production.

---

## Pre-Deployment Checklist

### 1. Code Quality

- [ ] All TypeScript type errors resolved (`npx tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests pass (if applicable)

### 2. Content Validation

- [ ] All CSV files are valid and parse correctly
- [ ] Project images exist and paths are correct
- [ ] Google Sheets connection works (`npm run build:content:cloud`)
- [ ] CSV files are synced with latest Sheets data
- [ ] No sensitive data in CSV files

### 3. Environment Configuration

- [ ] `.env.cloud` configured (NOT committed)
- [ ] `.env.cloud.example` updated and committed
- [ ] Google credentials file exists locally (NOT committed)
- [ ] All required environment variables documented

### 4. Security

- [ ] `.env*` files in .gitignore (except examples)
- [ ] `google-credentials.json` in .gitignore
- [ ] No API keys or secrets in code
- [ ] No sensitive data in CSV files
- [ ] HTTPS enabled on production domain

### 5. Performance

- [ ] Images optimized (< 500KB each)
- [ ] Lazy loading implemented
- [ ] Build output size reasonable (< 10MB)
- [ ] Lighthouse score > 90 (if applicable)

### 6. SEO & Metadata

- [ ] Meta tags present on all pages
- [ ] Open Graph tags configured
- [ ] Sitemap generated (if applicable)
- [ ] robots.txt configured
- [ ] Favicon exists

### 7. Testing

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test all internal links
- [ ] Test all external links
- [ ] Test forms and validation
- [ ] Test map functionality
- [ ] Test image carousels

---

## GitHub Pages Deployment

### Current Setup

- **Branch**: `cloudflare`
- **Trigger**: Push to branch
- **Build**: GitHub Actions workflow
- **Output**: Static files to GitHub Pages

### Deployment Steps

```bash
# 1. Ensure you're on the correct branch
git checkout cloudflare

# 2. Sync latest content from Sheets
npm run build:content:cloud

# 3. Review changes
git status
git diff content/

# 4. Test build locally
npm run build
npx serve@latest out

# 5. Commit content changes
git add content/
git commit -m "Content sync: [describe changes]"

# 6. Push to deploy
git push origin cloudflare

# 7. Monitor GitHub Actions
# Go to: https://github.com/[username]/ns-engineering-website/actions
# Wait for build to complete (~3-5 minutes)

# 8. Verify deployment
# Visit: https://[username].github.io/ns-engineering-website
```

### Rollback Procedure

If deployment fails or has issues:

```bash
# Option 1: Revert last commit
git revert HEAD
git push origin cloudflare

# Option 2: Reset to previous working commit
git reset --hard <commit-hash>
git push origin cloudflare --force

# Option 3: Checkout specific file from previous commit
git checkout HEAD~1 -- path/to/file
git commit -m "Rollback: Revert changes to [file]"
git push origin cloudflare
```

---

## GitHub Actions Configuration

### Required Secrets

Add these in: GitHub → Settings → Secrets → Actions

```
GOOGLE_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
```

### Workflow File

Location: `.github/workflows/deploy.yml`

Key configurations:
- Runs on push to `cloudflare` branch
- Builds with `npm run build:cloud`
- Deploys to GitHub Pages

---

## Custom Domain Setup

### 1. Add CNAME File

Create `public/CNAME` with your domain:

```
nsengineering.com
```

### 2. Configure DNS

Add these records at your DNS provider:

**Option A: Apex Domain (@)**
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

**Option B: Subdomain (www)**
```
Type: CNAME
Name: www
Value: [username].github.io
```

### 3. Enable HTTPS

1. Go to GitHub → Settings → Pages
2. Check "Enforce HTTPS"
3. Wait for SSL certificate (up to 24 hours)

### 4. Verify

```bash
dig nsengineering.com
curl -I https://nsengineering.com
```

---

## Monitoring & Maintenance

### Post-Deployment Checks

Run immediately after deployment:

```bash
# 1. Check site loads
curl -I https://[your-domain]

# 2. Verify content
# Visit all major pages:
# - Home
# - Projects
# - Services
# - About
# - eLibrary
# - FAQ
# - Careers
# - Contact

# 3. Check console for errors
# Open browser DevTools → Console

# 4. Test forms
# Fill out contact/RFQ form

# 5. Check mobile
# Use browser DevTools → Device Mode
```

### Regular Maintenance

**Weekly**:
- [ ] Sync content from Google Sheets
- [ ] Review and merge content updates
- [ ] Deploy to production

**Monthly**:
- [ ] Update dependencies (`npm outdated`)
- [ ] Review analytics (if configured)
- [ ] Check for broken links
- [ ] Backup content (CSV files are in git)

**Quarterly**:
- [ ] Security audit
- [ ] Performance review
- [ ] Content audit
- [ ] Dependency updates

---

## Troubleshooting

### Build Failures

**"Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**"Type errors"**
```bash
# Check for type errors
npx tsc --noEmit

# If errors found, fix them and rebuild
```

**"Out of memory"**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Deployment Failures

**"GitHub Actions failing"**
1. Check Actions tab for error logs
2. Verify secrets are configured correctly
3. Ensure branch name matches workflow trigger
4. Check build succeeds locally first

**"Site not updating"**
1. Hard refresh browser (Ctrl+F5 / Cmd+Shift+R)
2. Clear browser cache
3. Check GitHub Pages settings
4. Verify deployment completed successfully
5. Wait 5-10 minutes for CDN propagation

**"404 errors"**
1. Check `basePath` configuration in `next.config.js`
2. Verify `assetPrefix` matches deployment path
3. Check that `out/` directory contains built files

### Content Issues

**"Images not loading"**
```bash
# Rebuild content
npm run build:content:cloud

# Check public folder
ls -la public/projects/
ls -la public/elibrary/

# Ensure images copied correctly
npm run build
```

**"Google Sheets not syncing"**
```bash
# Test connection
dotenv -e .env.cloud -- npm run build:content:cloud

# Check credentials
cat google-credentials.json | jq .client_email

# Verify Sheet access
# Open Google Sheet and check service account has Viewer access
```

---

## Emergency Procedures

### Site Down

1. **Verify issue**: Check GitHub Pages status, DNS resolution
2. **Check GitHub Actions**: Look for failed deployments
3. **Rollback**: Revert to last known good commit
4. **Monitor**: Watch for recovery

### Security Incident

1. **Immediate**: Revoke compromised credentials
2. **Rotate**: Generate new API keys/credentials
3. **Audit**: Check git history for exposed secrets
4. **Update**: Push new credentials via GitHub Secrets
5. **Redeploy**: Force deployment with clean credentials

### Data Loss

1. **Check Git**: All content is version controlled
2. **Restore**: `git checkout <commit> -- content/`
3. **Rebuild**: `npm run build:content:cloud`
4. **Verify**: Check restored data
5. **Deploy**: Push restored content

---

## Performance Optimization

### Before Deployment

```bash
# 1. Analyze bundle size
npm run build
ls -lh out/_next/static/chunks/

# 2. Optimize images
# Use tools like: imagemagick, sharp, or online compressors
# Target: < 500KB per image

# 3. Check lighthouse score
npx lighthouse https://[your-domain] --view
```

### Ongoing Optimization

- Enable image lazy loading (already implemented)
- Use WebP format for images (future enhancement)
- Implement code splitting (already done by Next.js)
- Add service worker for offline support (future enhancement)

---

## Backup & Recovery

### Automated Backups

Content is automatically backed up via Git:

```bash
# View all historical versions
git log content/

# Backup specific date
git checkout $(git rev-list -n 1 --before="2024-12-01" cloudflare) -- content/

# Create tagged backup
git tag -a backup-2024-12-17 -m "Pre-holiday backup"
git push origin backup-2024-12-17
```

### Manual Backup

```bash
# Export all content to archive
tar -czf content-backup-$(date +%Y%m%d).tar.gz content/

# Upload to secure location
# (Google Drive, Dropbox, S3, etc.)
```

---

## Documentation References

- [Project README](./README.md) - Main project documentation
- [Content Workflow](./docs/guides/content-workflow.md) - Content management guide
- [Google Sheets Setup](./docs/setup/GOOGLE_SHEETS_SETUP.md) - Initial setup
- [Build Modes](./docs/technical/BUILD_MODES.md) - Local vs Cloud builds

---

## Support Contacts

**Technical Issues:**
- GitHub Issues: [ns-engineering-website/issues](https://github.com/[username]/ns-engineering-website/issues)
- Email: development-team@example.com

**Content Issues:**
- Google Sheet: [NS Engineering Data](https://docs.google.com/spreadsheets/d/1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI/edit)
- Email: content-team@example.com

---

**Last Updated**: 2024-12-17
**Version**: 1.0.0
**Status**: Production Ready 🚀
