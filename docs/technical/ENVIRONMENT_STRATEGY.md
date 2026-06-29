# Environment Strategy

Comprehensive guide to the three-environment promotion model for NS Engineering website.

**Date**: 2026-06-07  
**Last Updated**: 2026-06-07  
**Related**: [DEPLOYMENT.md](../../DEPLOYMENT.md) | [deploy-dev.yml](../../.github/workflows/deploy-dev.yml)

---

## Overview

The site runs in **three isolated environments**, each with:
- Dedicated Cloudflare Pages project
- Dedicated R2 bucket (media storage)
- Dedicated Turnstile keys (bot protection)
- Dedicated email worker (contact form backend)

**Code promotes up**: dev → stage → prod (never sideways, never backwards)  
**Same artifact**: Built once, deployed to all environments with environment-specific secrets injected

```
┌─────────────────────────────────────────────────────────────┐
│  Push to main/feature branch                                │
│  ↓                                                           │
│  Build: Single artifact (one-time only)                     │
│  • Next.js static export                                     │
│  • Baked-in placeholders for R2 URL, Turnstile, Worker URL  │
│  • Asset sync: Google Drive → Dev R2                        │
│  ↓ (artifact shared, not rebuilt)                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ DEPLOYMENT STAGE: DEV (Automatic)                     │   │
│  │ • Inject: dev R2 URL, dev Turnstile key              │   │
│  │ • Deploy to: nsengineering-dev (Cloudflare Pages)    │   │
│  │ • Live at: dev.nsengineering.com.np                  │   │
│  │ • Asset flow: Google Drive → Dev R2                  │   │
│  └─────────────────────┬──────────────────────────────┘   │
│                        ↓ (no wait)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ PROMOTION STAGE: Assets (Automatic)                  │   │
│  │ • Promote: Dev R2 → Stage R2 (rclone sync)           │   │
│  └─────────────────────┬──────────────────────────────┘   │
│                        ↓ (requires approval)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ DEPLOYMENT STAGE: STAGE (Manual Approval)             │   │
│  │ • Inject: stage R2 URL, stage Turnstile key          │   │
│  │ • Deploy to: nsengineering-stage (Cloudflare Pages)  │   │
│  │ • Live at: stage.nsengineering.com.np                │   │
│  │ • Assets used: Stage R2 (previously promoted)        │   │
│  └─────────────────────┬──────────────────────────────┘   │
│                        ↓ (no wait)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ PROMOTION STAGE: Assets (Automatic)                  │   │
│  │ • Promote: Stage R2 → Prod R2 (rclone sync)          │   │
│  └─────────────────────┬──────────────────────────────┘   │
│                        ↓ (requires approval)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ DEPLOYMENT STAGE: PROD (Manual Approval)              │   │
│  │ • Inject: prod R2 URL, prod Turnstile key            │   │
│  │ • Deploy to: nsengineering-prod (Cloudflare Pages)   │   │
│  │ • Live at: nsengineering.com.np                      │   │
│  │ • Assets used: Prod R2 (previously promoted)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Details

### 1. Development (DEV)

**Purpose**: Continuous testing and validation. Deploys automatically on every push.

| Property | Value |
|---|---|
| **Domain** | `dev.nsengineering.com.np` |
| **Cloudflare Pages Project** | `nsengineering-dev` |
| **Production Branch** | `dev` |
| **R2 Bucket** | `nswebsite-dev` |
| **Turnstile Keys** | Dev-specific (from `dev` GitHub environment) |
| **Email Worker** | `email-worker-dev.emailapi-nsengineering.workers.dev` |
| **Deployment** | Automatic (no approval needed) |
| **GitHub Environment** | `dev` |
| **Approval Required?** | ❌ No |
| **Typical Users** | Internal team, QA, stakeholders |

**Use Cases**:
- ✅ Test new features immediately after push
- ✅ Verify Google Sheets changes propagate correctly
- ✅ Debug issues before staging
- ✅ Preview content updates

**Media Flow**:
- Google Drive → rclone → Dev R2 → Website

**Promotion Path**:
- Dev R2 assets → Stage R2 (automatic, happens before staging deploy approval)

---

### 2. Staging (STAGE)

**Purpose**: Pre-production testing with approval gate. Content & code are reviewed here before production.

| Property | Value |
|---|---|
| **Domain** | `stage.nsengineering.com.np` |
| **Cloudflare Pages Project** | `nsengineering-stage` |
| **Production Branch** | `stage` |
| **R2 Bucket** | `nswebsite-stage` |
| **Turnstile Keys** | Stage-specific (from `staging` GitHub environment) |
| **Email Worker** | `email-worker-stage.emailapi-nsengineering.workers.dev` |
| **Deployment** | Manual (requires approval in GitHub) |
| **GitHub Environment** | `staging` |
| **Approval Required?** | ⚠️ Yes (configurable via GitHub protection rules) |
| **Typical Users** | Team leads, product managers, senior stakeholders |

**Use Cases**:
- ✅ Final review before production
- ✅ Performance testing at scale
- ✅ Load testing
- ✅ Security scanning (automated tools can run against this)
- ✅ User acceptance testing (UAT)

**Media Flow**:
- Dev R2 → rclone → Stage R2 → Website

**Promotion Path**:
- Stage R2 assets → Prod R2 (automatic, happens before prod deploy approval)

**Gotchas**:
- ⚠️ Images are promoted from Dev R2, not synced from Google Drive directly
- ⚠️ If new images were uploaded to Google Drive after dev deployment, they won't appear in staging until the next full pipeline run

---

### 3. Production (PROD)

**Purpose**: Live customer-facing site. Requires approval before deployment. Traffic serves from here.

| Property | Value |
|---|---|
| **Domain** | `nsengineering.com.np` + `www.nsengineering.com.np` |
| **Cloudflare Pages Project** | `nsengineering-prod` |
| **Production Branch** | `main` |
| **R2 Bucket** | `nswebsite-prod` |
| **Turnstile Keys** | Prod-specific (from `production` GitHub environment) |
| **Email Worker** | `email-worker-prod.emailapi-nsengineering.workers.dev` |
| **Deployment** | Manual (requires approval in GitHub) |
| **GitHub Environment** | `production` |
| **Approval Required?** | ⚠️ Yes (configured via GitHub protection rules) |
| **Typical Users** | End users, clients, partners |

**Use Cases**:
- ✅ Stable, tested version only
- ✅ High availability expected
- ✅ All critical features verified

**Media Flow**:
- Stage R2 → rclone → Prod R2 → Website

**Promotion Path**:
- None (prod is the final step)

**Gotchas**:
- ⚠️ Once promoted to prod, images stay there forever (no automatic refresh)
- ⚠️ If you need to update prod images, the next pipeline run will sync new ones from Google Drive → Dev R2 → Stage R2 → Prod R2

---

## Promotion Flow (Deep Dive)

### Single Artifact Pattern

The key insight: **Build happens once, deploy happens three times**.

```
Build Phase (happens once)
    │
    ├─ Checkout code
    ├─ Install deps
    ├─ Create Google credentials
    ├─ Run: npm run build:cloud
    │   ├─ Fetch from Google Sheets
    │   ├─ Parse content
    │   ├─ Generate ./out (static HTML/JS/CSS)
    │   └─ Export ./content/**/*.csv (version control)
    │
    └─ Upload artifact: ./out
           │
           ├─ Deploy to Dev (inject dev secrets) ─┐
           │                                       ├─ Deployment jobs
           ├─ Deploy to Stage (inject stage secrets) ┤
           │                                       │
           └─ Deploy to Prod (inject prod secrets) ┘

Benefits:
✅ Consistency: Exact same HTML/JS/CSS runs in all environments
✅ Speed: No rebuild overhead for stage/prod
✅ Debugging: Easy to tell if issue is build or deployment
✅ Rollback: Can restore old deployment without rebuild
```

### R2 Asset Promotion

Assets promote independently of code:

```
Google Drive
    │ (rclone sync on every push)
    ▼
Dev R2 ────────┬─────────────────────────┐
               │ (automatic, before       │
               │  staging approval)       │
               ▼                          │
            Stage R2 ──────┬──────────────┤
                           │ (automatic,  │
                           │  before prod │
                           │  approval)   │
                           ▼              │
                        Prod R2 ◄─────────┘
```

**Key points**:
- Dev syncs directly from Google Drive on every push
- Stage is promoted from Dev (one-way)
- Prod is promoted from Stage (one-way)
- This ensures new assets are tested in lower environments first

**Scenario: New image added to Google Drive**
1. Dev deployment: Image syncs to Dev R2 immediately
2. Approve staging: Image promotes to Stage R2
3. Approve production: Image promotes to Prod R2
4. Users see new image on all three sites

**Scenario: Image deleted from Google Drive**
1. Dev deployment: Image removed from Dev R2 (rclone updates)
2. Approve staging: Deletion promotes to Stage R2
3. Approve production: Deletion promotes to Prod R2
4. All three sites show broken image (until replaced)

---

## Secret Injection at Deploy Time

Each environment gets its own secrets injected at deploy time (not build time):

```
Built Artifact (./out)
    │
    ├─ index.html
    │  └─ Contains: "https://NSENGINEERING_R2_URL"
    │  └─ Contains: "NSENGINEERING_TURNSTILE_KEY"
    │
    ├─ Deploy to Dev
    │  └─ Run: find ./out -exec sed -i "s|https://NSENGINEERING_R2_URL|https://pub-dev-abc123.r2.dev|g" {} \;
    │  └─ Result: index.html now has dev R2 URL
    │
    ├─ Deploy to Stage
    │  └─ Run: find ./out -exec sed -i "s|https://NSENGINEERING_R2_URL|https://pub-stage-def456.r2.dev|g" {} \;
    │  └─ Result: index.html now has stage R2 URL
    │
    └─ Deploy to Prod
       └─ Run: find ./out -exec sed -i "s|https://NSENGINEERING_R2_URL|https://pub-prod-ghi789.r2.dev|g" {} \;
       └─ Result: index.html now has prod R2 URL
```

**Why not bake secrets at build time?**
- ❌ Would need three separate builds
- ❌ Slow (N × build time)
- ❌ More prone to mistakes (N × chances for error)

**Why inject at deploy time?**
- ✅ Single build
- ✅ Fast
- ✅ Consistent artifact across all environments

---

## Approval Gates

### GitHub Protection Rules

To require approval before staging or production deployments:

**Setup** (one-time):
```
Settings → Environments → staging → Deployment branches and secrets
  → Enable "Require reviewers"
  → Add required reviewers (e.g., team leads)

Settings → Environments → production → Deployment branches and secrets
  → Enable "Require reviewers"
  → Add required reviewers (e.g., CTO + team lead)
```

**In practice**:
1. Dev deploys automatically (no approval)
2. Workflow pauses at staging approval
3. You get a notification in GitHub
4. Assigned reviewer approves/rejects
5. If approved, staging deploys automatically
6. Same process for production

---

## Rollback Strategy

### Scenario 1: Bug Found in Dev

**Action**: Fix and re-run the pipeline.

```
1. Update code/content
2. Commit and push
3. Trigger deploy-dev.yml manually
4. Pipeline runs dev → stage → prod again
```

### Scenario 2: Bug Found in Staging (before approval to prod)

**Action**: Fix in dev, then re-approve.

```
1. Fix issue in code/content
2. Commit and push to main
3. Trigger deploy-dev.yml
4. Dev redeploys with fix
5. Assets republish (Dev R2 updated)
6. Review stage again, then approve prod
```

### Scenario 3: Critical Bug in Production

**Action**: Promote previous Prod R2 assets or revert code.

**Option A** (if bug is just content):
```bash
# Restore previous CSV version from Git
git checkout <previous-commit> -- content/

# Trigger pipeline to rebuild with old content
gh workflow run deploy-dev.yml -r main

# Pipeline will auto-promote through all envs
```

**Option B** (if bug is code):
```bash
# Revert code commit
git revert <bad-commit>
git push

# Trigger pipeline
gh workflow run deploy-dev.yml -r main

# Approve production deployment
```

**Option C** (urgent, manual rollback):
```bash
# In Cloudflare dashboard:
# Pages → nsengineering-prod → Deployments → [select old deployment] → Promote to Production

# This doesn't rollback assets (R2), only the code
# If you need full rollback, use Option A or B
```

---

## Monitoring & Alerts

### Pre-Deployment Checks

Before approving promotion to staging or production:

```bash
# Verify dev deployed successfully
curl https://dev.nsengineering.com.np/

# Verify content loaded
curl https://dev.nsengineering.com.np/ | grep "NS Engineering"

# Verify R2 images load
curl -I https://dev.nsengineering.com.np/hero/image.jpg

# Verify contact form works
curl -X POST https://dev.nsengineering.com.np/api/contact \
  -d '{"name":"Test","email":"test@example.com"}'
```

### Post-Deployment Checks

After each environment deployment:

```bash
# Check 200 OK
curl -I https://stage.nsengineering.com.np/ | head -1

# Check security headers
curl -I https://stage.nsengineering.com.np/ | grep -i "x-frame-options"

# Check robots.txt (should not block stage/dev)
curl https://stage.nsengineering.com.np/robots.txt

# Performance: Check home page load time
time curl -o /dev/null -s -w '%{time_total}\n' https://stage.nsengineering.com.np/
```

### Health Monitoring

Set up monitoring in your platform (Datadog, New Relic, etc.):

- [ ] Uptime checks: All three environments should return 200
- [ ] SSL certificate expiry: Cloudflare handles auto-renewal, but monitor anyway
- [ ] Response time: Track latency trends over time
- [ ] Error rate: Alert if 4xx/5xx rate exceeds threshold

---

## Disaster Recovery

### Lost Dev R2 Assets

If dev R2 bucket is corrupted or deleted:

```bash
# Google Drive is the source of truth
# Trigger pipeline to resync
gh workflow run deploy-dev.yml -r main

# Pipeline will:
# 1. Sync Google Drive → Dev R2
# 2. Promote Dev R2 → Stage R2
# 3. Promote Stage R2 → Prod R2
# (if you approve staging and prod)
```

### Corrupted Production Deployment

If prod deployment artifact is corrupted:

```bash
# Option 1: Use previous Cloudflare Pages deployment
# Cloudflare Pages → nsengineering-prod → Deployments → [select old] → Promote to Production

# Option 2: Rebuild and redeploy
gh workflow run deploy-dev.yml -r main
# Then approve staging and production
```

### DNS Failure (domain not resolving)

Check Cloudflare dashboard:
1. **Pages** → **nsengineering-prod** → **Custom domains**
2. Verify `nsengineering.com.np` is listed and "Active"
3. If not, re-add it (usually just takes a few minutes)

---

## Environment Parity Checklist

After promoting to stage or prod, verify parity with dev:

- [ ] **Content**: Same Google Sheets content loaded
- [ ] **Images**: All images display (R2 promoted correctly)
- [ ] **Styling**: Layout and colors match dev
- [ ] **Functionality**:
  - [ ] Hero section works
  - [ ] Navigation menus open/close
  - [ ] Project map loads
  - [ ] Forms submit (contact form, careers)
  - [ ] eLibrary searches
  - [ ] Team page loads
- [ ] **Performance**: Load time within 5% of dev
- [ ] **Security**:
  - [ ] No console errors
  - [ ] No mixed content warnings (HTTP in HTTPS site)
  - [ ] CSP headers present
- [ ] **SEO**:
  - [ ] Robots.txt allows crawling (prod only)
  - [ ] Sitemap.xml accessible
  - [ ] Meta tags present

---

## FAQ

**Q: Can I deploy only to staging, skipping dev?**  
A: No. The workflow is linear: build → deploy dev → (promote assets) → deploy stage → (promote assets) → deploy prod. You cannot skip stages.

**Q: What if I need to roll back only assets, not code?**  
A: Restore a previous CSV version from Git, commit, and re-run the pipeline. Google Drive is synced to assets only on push.

**Q: Can different teams approve different environments?**  
A: Yes. Set protection rules per environment. E.g., dev has no approvers, staging needs 1 engineer approval, prod needs 2 approvals (engineer + product).

**Q: How long do deployments take?**  
A: ~3-5 minutes per environment. Full pipeline: ~15 minutes (dev auto → stage approval → prod approval).

**Q: If I reject the stage approval, can I reject prod too?**  
A: Yes. If you don't approve stage, prod never runs. The workflow stops at that gate.

**Q: Can I promote code without assets?**  
A: No. Code and assets are always promoted together. If you only want to update assets, make a trivial code change (e.g., update a comment) and re-run.

**Q: Do I lose old deployments after a new deployment?**  
A: No. Cloudflare Pages keeps a history of all deployments. You can always promote an old deployment to production if needed.

---

## References

- **Deployment Workflow**: [.github/workflows/deploy-dev.yml](../../.github/workflows/deploy-dev.yml)
- **Deployment Guide**: [DEPLOYMENT.md](../../DEPLOYMENT.md)
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **GitHub Environments**: https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment
