# URL Migration Guide - WordPress to Next.js

## Overview
This document tracks the URL migration from WordPress (old site) to Next.js (new site) at nsengineering.com.np.

**Migration Date**: TBD
**Status**: Ready for deployment
**Last Updated**: 2026-01-12

---

## Redirect Mapping

### Page-Level Redirects

| Old URL | New URL | Priority | Status |
|---------|---------|----------|--------|
| `/career/` | `/careers/` | High | ✅ Active |
| `/downloads/` | `/elibrary/` | High | ✅ Active |
| `/gallery/` | `/projects/` | High | ✅ Active |
| `/gallery-6/` | `/projects/` | Medium | ✅ Active |

### Service-Level Redirects

| Old URL | New URL | Priority | Status |
|---------|---------|----------|--------|
| `/triaxial-shear-test/` | `/services/#triaxial-test` | Medium | ✅ Active |
| `/point-load-test/` | `/services/#point-load-test` | Medium | ✅ Active |
| `/pile-foundation-test-plans/` | `/services/#pda-testing` | Medium | ✅ Active |
| `/atterbergs-limit-test/` | `/services/` | Low | ✅ Active |
| `/physical-test-of-cement/` | `/services/` | Low | ✅ Active |

### Other Redirects

| Old URL | New URL | Priority | Status |
|---------|---------|----------|--------|
| `/certification/` | `/about/` | Low | ✅ Active |

---

## How Redirects Work

Our redirect system uses a **three-layer approach** optimized for static hosting (GitHub Pages):

### 1. Static HTML Pages
Each old URL has an `index.html` file in the `public/` directory that serves as a redirect page.

**Example**: `public/career/index.html` redirects to `/careers/`

### 2. Meta Refresh Tag
```html
<meta http-equiv="refresh" content="0; url=/careers/">
```
- **0-second delay** triggers immediate redirect
- **Treated as 301 by Google** (confirmed by Google Search Central)
- SEO-friendly and preserves link equity

### 3. JavaScript Fallback
```javascript
window.location.replace('/careers/');
```
- Executes immediately for modern browsers
- Ensures redirect happens even if meta refresh fails

### 4. Canonical Tag
```html
<link rel="canonical" href="https://www.nsengineering.com.np/careers/">
```
- Signals to search engines the preferred URL
- Prevents duplicate content penalties

### 5. Smart 404 Handler
The custom 404 page (`src/app/not-found.tsx`) detects old URLs and shows:
- 5-second countdown
- Automatic redirect
- Manual "Go Now" button

---

## Technical Implementation

### File Structure
```
ns-engineering-website/
├── src/
│   ├── app/
│   │   └── not-found.tsx          # Smart 404 handler
│   └── data/
│       └── redirects.ts            # Redirect configuration
├── scripts/
│   └── generate-redirects.ts      # HTML generation script
└── public/
    ├── career/
    │   └── index.html             # Redirect page
    ├── downloads/
    │   └── index.html
    ├── gallery/
    │   └── index.html
    └── [... 7 more redirect folders]
```

### Configuration
All redirects are defined in **`src/data/redirects.ts`**:

```typescript
export const redirectRules: RedirectRule[] = [
  {
    from: '/career/',
    to: '/careers/',
    type: 'permanent',
    reason: 'URL standardization: singular → plural',
  },
  // ... more rules
];
```

### Generation
Run the script to create all redirect HTML pages:
```bash
npm run generate:redirects
```

This creates 10 redirect pages automatically.

---

## SEO Impact

### Search Engine Treatment
- **Meta refresh (0s delay)**: Treated as **301 redirect** by Google
- **Link equity**: Preserved through canonical tags
- **Crawl budget**: Minimized by `noindex` robots meta tag on redirect pages
- **User experience**: Sub-second redirect with visual feedback

### Expected Timeline
- **Week 1**: Google discovers redirects
- **Weeks 2-4**: Old URLs start redirecting to new URLs in search results
- **Months 2-3**: 90%+ of old URLs re-indexed to new URLs
- **Month 6**: Full migration complete

### Monitoring
- **Google Search Console**: Track crawl errors and indexing progress
- **Analytics**: Monitor 404 patterns and redirect traffic
- **Rankings**: Verify no drops for key search terms

---

## Testing Redirects

### Local Testing
```bash
# 1. Generate redirect pages
npm run generate:redirects

# 2. Build site
npm run build:local

# 3. Serve locally
npx serve@latest out

# 4. Test each redirect
# Visit: http://localhost:3000/career/
# Expected: Immediate redirect to /careers/
```

### Test Checklist
- [ ] `/career/` → `/careers/`
- [ ] `/downloads/` → `/elibrary/`
- [ ] `/gallery/` → `/projects/`
- [ ] `/gallery-6/` → `/projects/`
- [ ] `/triaxial-shear-test/` → `/services/#triaxial-test`
- [ ] `/point-load-test/` → `/services/#point-load-test`
- [ ] `/pile-foundation-test-plans/` → `/services/#pda-testing`
- [ ] `/atterbergs-limit-test/` → `/services/`
- [ ] `/physical-test-of-cement/` → `/services/`
- [ ] `/certification/` → `/about/`
- [ ] Random URL → 404 with navigation suggestions

### Production Testing
```bash
# Test redirect with curl
curl -I https://www.nsengineering.com.np/career/
# Should return 200 with HTML containing meta refresh

# Browser test
# Visit: https://www.nsengineering.com.np/career/
# Expected: Redirect to /careers/ with visual feedback
```

---

## Maintenance

### Adding New Redirects

1. **Edit configuration**:
   ```typescript
   // src/data/redirects.ts
   export const redirectRules: RedirectRule[] = [
     // ... existing rules
     {
       from: '/old-page/',
       to: '/new-page/',
       type: 'permanent',
       reason: 'Page moved',
     },
   ];
   ```

2. **Generate HTML pages**:
   ```bash
   npm run generate:redirects
   ```

3. **Test locally**:
   ```bash
   npm run build:local
   npx serve@latest out
   # Visit: http://localhost:3000/old-page/
   ```

4. **Commit and deploy**:
   ```bash
   git add src/data/redirects.ts
   git add public/old-page/
   git commit -m "Add redirect: /old-page/ → /new-page/"
   git push origin cloudflare
   ```

### Removing Old Redirects

After **12-18 months**, when Google has fully re-indexed:

1. **Check indexing status**:
   - Google Search Console → Coverage
   - Verify old URLs no longer appear in index
   - Confirm <1% traffic to redirect pages

2. **Remove redirect pages**:
   ```bash
   # Remove HTML files
   rm -rf public/old-page/

   # Archive redirect rule (optional)
   # Move rule to "archived" section in redirects.ts
   ```

3. **Deploy**:
   ```bash
   git add public/
   git add src/data/redirects.ts
   git commit -m "Remove archived redirect: /old-page/"
   git push origin cloudflare
   ```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Generate redirect pages: `npm run generate:redirects`
- [ ] Verify 10 redirect folders exist in `public/`
- [ ] Test locally: `npm run build:local && npx serve@latest out`
- [ ] Type check: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build:cloud`

### Deployment
- [ ] Commit all changes (redirects.ts, generate-redirects.ts, not-found.tsx, public/*)
- [ ] Push to `cloudflare` branch
- [ ] GitHub Actions completes successfully
- [ ] Site deploys to nsengineering.com.np

### Post-Deployment (48 hours)
- [ ] Test all 10 redirects in production
- [ ] Check Google Analytics for 404 spikes
- [ ] Monitor Google Search Console for crawl errors
- [ ] Verify organic traffic remains stable

### Week 2
- [ ] Submit updated sitemap to Google Search Console
- [ ] Monitor Coverage report for indexing progress
- [ ] Track redirect traffic patterns
- [ ] Optional: Request removal of old URLs from Google index

---

## Troubleshooting

### Issue: Redirect Not Working
**Symptoms**: Old URL shows 404 instead of redirecting

**Solution**:
1. Check if redirect HTML file exists: `ls public/old-url/index.html`
2. Re-generate redirects: `npm run generate:redirects`
3. Rebuild site: `npm run build:local`
4. Clear browser cache and test again

### Issue: Redirect Loop
**Symptoms**: Browser shows "Too many redirects" error

**Solution**:
1. Check `redirects.ts` for circular redirects
2. Verify `from` and `to` URLs are different
3. Test in incognito mode to rule out browser cache

### Issue: 404 Page Not Detecting Redirect
**Symptoms**: Old URL shows standard 404 instead of redirect countdown

**Solution**:
1. Verify `findRedirect()` function in `src/data/redirects.ts`
2. Check pathname normalization (trailing slash handling)
3. Test with both `/old-url` and `/old-url/` variants

### Issue: Search Ranking Drop
**Symptoms**: Key pages lose ranking after migration

**Solution**:
1. Verify canonical tags point to new URLs
2. Check Google Search Console for crawl errors
3. Submit updated sitemap
4. Monitor for 2-4 weeks (temporary drops are normal)
5. If persists >6 weeks, contact SEO specialist

---

## Success Metrics

### Technical (Week 1)
- ✅ 100% of old URLs redirect correctly
- ✅ Zero redirect chains
- ✅ <1 second redirect time
- ✅ Zero 404 errors on internal links

### SEO (Months 1-3)
- 📊 No ranking drop for key terms (pile testing, geotechnical Nepal)
- 📊 90%+ old URLs re-indexed to new URLs
- 📊 Organic traffic stable or growing
- 📊 Domain authority maintained

### User Experience (Month 1)
- 📊 Bounce rate on redirects <5%
- 📊 Average session duration unchanged
- 📊 Zero user complaints about redirects

---

## Additional Resources

- **Redirect Configuration**: `src/data/redirects.ts`
- **Generation Script**: `scripts/generate-redirects.ts`
- **404 Handler**: `src/app/not-found.tsx`
- **Main README**: `README.md`
- **Project Docs**: `CLAUDE.md`

---

## Support

For questions or issues:
1. Check this guide first
2. Review [Google Search Central - Redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
3. Contact the development team

---

**Last Updated**: 2026-01-12
**Version**: 1.0.0
**Status**: Production Ready
