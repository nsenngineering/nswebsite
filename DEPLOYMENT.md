# Deployment Guide

Complete deployment guide for NS Engineering website — Cloudflare Pages multi-environment architecture with artifact promotion.

**Last Updated**: 2026-06-07  
**Architecture**: GitHub Actions → Cloudflare Pages (Dev / Stage / Prod) with approval gates  
**Status**: Active — DNS cutover to Cloudflare Pages pending  
**Workflow**: [.github/workflows/deploy-dev.yml](.github/workflows/deploy-dev.yml)

---

## Architecture Overview

```
Push to branch (main or feature)
      │
      ▼
GitHub Actions: deploy-dev.yml
      │
      ├─────────────────────────────────────────────────────────┐
      │  Single Build Phase (happens once)                      │
      │  ┌──────────────────────────────────────────────────┐   │
      │  │ • Sync Google Drive → Dev R2 (rclone)           │   │
      │  │ • Build Next.js to static artifact (./out)       │   │
      │  │ • Placeholders baked in:                          │   │
      │  │   - https://NSENGINEERING_R2_URL                 │   │
      │  │   - NSENGINEERING_TURNSTILE_KEY                  │   │
      │  │   - NSENGINEERING_EMAIL_WORKER_URL               │   │
      │  │ • Commit CSV exports to Git                       │   │
      │  └──────────────────────────────────────────────────┘   │
      └─────────────────────────────────────────────────────────┘
      │
      ├─ Deploy Phase 1: DEV (automatic)
      │  ├─ Inject dev R2 URL, Turnstile key, Email Worker URL
      │  └─ Deploy to nsengineering-dev Pages
      │     └─ Live at: dev.nsengineering.com.np
      │
      ├─ Asset Promotion 1: dev R2 → stage R2 (automatic)
      │  └─ Use rclone to sync assets
      │
      ├─ Deploy Phase 2: STAGING (⚠️ requires approval)
      │  ├─ Inject stage R2 URL, Turnstile key, Email Worker URL
      │  └─ Deploy to nsengineering-stage Pages
      │     └─ Live at: stage.nsengineering.com.np
      │
      ├─ Asset Promotion 2: stage R2 → prod R2 (automatic)
      │  └─ Use rclone to sync assets
      │
      └─ Deploy Phase 3: PRODUCTION (⚠️ requires approval)
         ├─ Inject prod R2 URL, Turnstile key, Email Worker URL
         └─ Deploy to nsengineering-prod Pages
            └─ Live at: nsengineering.com.np (post-cutover)

Key advantage: Same artifact is deployed to all environments.
Only R2 URLs, Turnstile keys, and Worker URLs change per environment.
```

---

## Cloudflare Pages Projects

| Project | Production Branch | Custom Domain | GitHub Env | Status |
|---|---|---|---|---|
| `nsengineering-dev` | `dev` | `dev.nsengineering.com.np` | `dev` | ✅ Active |
| `nsengineering-stage` | `stage` | `stage.nsengineering.com.np` | `staging` | ✅ Active |
| `nsengineering-prod` | `main` | `nsengineering.com.np`, `www.nsengineering.com.np` | `production` | ✅ Configured |

**⚠️ Important**: The CF Pages project's **"Production branch"** setting must match the `--branch` flag in the wrangler deploy command. If they differ, wrangler creates a Preview deployment that will NOT be served by custom domains.

---

## Triggering a Deployment

### Full Pipeline (dev → stage → prod)

The `deploy-dev.yml` workflow runs on manual dispatch only:

1. Go to **GitHub repository** → **Actions** tab
2. Select **"Deploy to Cloudflare Pages (Dev)"** workflow (left sidebar)
3. Click **"Run workflow"** dropdown
4. Select branch (usually `main` or your feature branch)
5. Click **"Run workflow"** button
6. Pipeline starts immediately:
   - ✅ Dev deploys automatically
   - ⏸️ Awaits approval for staging (check GitHub environment protection rules)
   - ⏸️ Awaits approval for production (check GitHub environment protection rules)

### Approving Staging and Production Deployments

Once dev is deployed successfully:

1. Go to **Actions** tab → select the running workflow
2. Scroll down to see pending approvals
3. Click **"Review deployments"** button
4. Select the environment (`staging` or `production`)
5. Add optional comment (e.g., "Tested on dev, ready for stage")
6. Click **"Approve and deploy"**

---

## Required GitHub Secrets

### Repository-Level Secrets (all environments inherit)

All of these secrets are available to the entire workflow:

| Secret | Purpose | Example |
|---|---|---|
| `GOOGLE_SHEET_ID` | Google Sheets content source ID | `1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI` |
| `GOOGLE_CREDENTIALS_JSON` | Google service account (full JSON) | `{"type":"service_account",...}` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service account email | `name@project.iam.gserviceaccount.com` |
| `GDRIVE_PROJECT_ID` | Google Cloud project ID | `ns-engineering-2026` |
| `GDRIVE_PRIVATE_KEY` | Google Drive service account private key | `-----BEGIN PRIVATE KEY-----...` |
| `GDRIVE_PRIVATE_KEY_ID` | Google Drive key ID | `abc123...` |
| `GDRIVE_SERVICE_ACCOUNT_EMAIL` | Google Drive service account email | `gdrive-sync@project.iam.gserviceaccount.com` |
| `GDRIVE_CLIENT_ID` | Google Drive client ID | `123456789.apps.googleusercontent.com` |
| `GDRIVE_ROOT_FOLDER_ID` | Root Google Drive folder for syncing | `1aB2cD3eF4gH5i6j7k8l9m0n1o2p3q4r` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token (wrangler access) | `v1.abc123...` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | `abc123def456` |

### `dev` GitHub Environment Secrets

Set these in **Settings** → **Environments** → **dev**:

| Secret | Purpose | Notes |
|---|---|---|
| `CLOUDFLARE_PROJECT_NAME` | Cloudflare Pages project name | `nsengineering-dev` |
| `R2_BUCKET_NAME` | Dev R2 bucket name | `nswebsite-dev` |
| `R2_ACCESS_KEY_ID` | Dev R2 access key | Generated in CF dashboard |
| `R2_SECRET_ACCESS_KEY` | Dev R2 secret | Generated in CF dashboard |
| `R2_ACCOUNT_ID` | Dev R2 account ID | Same as CLOUDFLARE_ACCOUNT_ID |
| `NEXT_PUBLIC_R2_BASE_URL` | Dev R2 public base URL | `https://pub-abc123.r2.dev` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Dev Turnstile site key | From Cloudflare dashboard |
| `NEXT_PUBLIC_EMAIL_WORKER_URL` | Dev email worker URL | `https://email-worker-dev.emailapi-nsengineering.workers.dev` |

### `staging` GitHub Environment Secrets

Set these in **Settings** → **Environments** → **staging**:

| Secret | Purpose | Notes |
|---|---|---|
| `CLOUDFLARE_PROJECT_NAME` | Cloudflare Pages project name | `nsengineering-stage` |
| `R2_BUCKET_NAME` | Stage R2 bucket (target for stage deploy) | `nswebsite-stage` |
| `R2_ACCESS_KEY_ID` | Stage R2 access key | Generated in CF dashboard |
| `R2_SECRET_ACCESS_KEY` | Stage R2 secret | Generated in CF dashboard |
| `R2_ACCOUNT_ID` | Stage R2 account ID | Same as CLOUDFLARE_ACCOUNT_ID |
| `STAGE_R2_BUCKET_NAME` | Not used in staging env | Kept for future use |
| `STAGE_R2_ACCESS_KEY_ID` | Not used in staging env | Kept for future use |
| `STAGE_R2_SECRET_ACCESS_KEY` | Not used in staging env | Kept for future use |
| `STAGE_R2_ACCOUNT_ID` | Not used in staging env | Kept for future use |
| `DEV_R2_BUCKET_NAME` | Dev R2 bucket (source for promotion) | `nswebsite-dev` |
| `DEV_R2_ACCESS_KEY_ID` | Dev R2 access key (read, for promotion) | Generated in CF dashboard |
| `DEV_R2_SECRET_ACCESS_KEY` | Dev R2 secret (read, for promotion) | Generated in CF dashboard |
| `DEV_R2_ACCOUNT_ID` | Dev R2 account ID (read, for promotion) | Same as CLOUDFLARE_ACCOUNT_ID |
| `NEXT_PUBLIC_R2_BASE_URL` | Stage R2 public base URL (injected at deploy time) | `https://pub-stage123.r2.dev` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Stage Turnstile site key | From Cloudflare dashboard |
| `NEXT_PUBLIC_EMAIL_WORKER_URL` | Stage email worker URL | `https://email-worker-stage.emailapi-nsengineering.workers.dev` |

### `production` GitHub Environment Secrets

Set these in **Settings** → **Environments** → **production**:

| Secret | Purpose | Notes |
|---|---|---|
| `CLOUDFLARE_PROJECT_NAME` | Cloudflare Pages project name | `nsengineering-prod` |
| `R2_BUCKET_NAME` | Prod R2 bucket (target for prod deploy) | `nswebsite-prod` |
| `R2_ACCESS_KEY_ID` | Prod R2 access key | Generated in CF dashboard |
| `R2_SECRET_ACCESS_KEY` | Prod R2 secret | Generated in CF dashboard |
| `R2_ACCOUNT_ID` | Prod R2 account ID | Same as CLOUDFLARE_ACCOUNT_ID |
| `STAGE_R2_BUCKET_NAME` | Stage R2 bucket (source for promotion) | `nswebsite-stage` |
| `STAGE_R2_ACCESS_KEY_ID` | Stage R2 access key (read, for promotion) | Generated in CF dashboard |
| `STAGE_R2_SECRET_ACCESS_KEY` | Stage R2 secret (read, for promotion) | Generated in CF dashboard |
| `STAGE_R2_ACCOUNT_ID` | Stage R2 account ID (read, for promotion) | Same as CLOUDFLARE_ACCOUNT_ID |
| `PROD_R2_BUCKET_NAME` | Not used after deploy | Kept for reference |
| `PROD_R2_ACCESS_KEY_ID` | Not used after deploy | Kept for reference |
| `PROD_R2_SECRET_ACCESS_KEY` | Not used after deploy | Kept for reference |
| `PROD_R2_ACCOUNT_ID` | Not used after deploy | Kept for reference |
| `NEXT_PUBLIC_R2_BASE_URL` | Prod R2 public base URL (injected at deploy time) | `https://pub-prod123.r2.dev` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Prod Turnstile site key | From Cloudflare dashboard |
| `NEXT_PUBLIC_EMAIL_WORKER_URL` | Prod email worker URL | `https://email-worker-prod.emailapi-nsengineering.workers.dev` |

---

## Pre-Deployment Checklist

### Cloudflare Dashboard Setup (one-time)

- [ ] **`nsengineering-dev`**
  - Settings → Builds & deployments → Production branch → set to `dev`
  - Ensure custom domain `dev.nsengineering.com.np` is configured
  
- [ ] **`nsengineering-stage`**
  - Settings → Builds & deployments → Production branch → set to `stage`
  - Ensure custom domain `stage.nsengineering.com.np` is configured
  
- [ ] **`nsengineering-prod`**
  - Settings → Builds & deployments → Production branch → set to `main`
  - Custom domains: Add `nsengineering.com.np` and `www.nsengineering.com.np` (post-cutover)

### GitHub Configuration

- [ ] `dev` environment exists with secrets configured
- [ ] `staging` environment exists with secrets configured
- [ ] `production` environment exists with secrets configured
- [ ] Protection rules: `staging` and `production` require manual approval (if desired)
  - Go to **Settings** → **Environments** → **staging/production** → **Deployment branches and secrets** → Check **Required reviewers**

### Security Pre-Deployment

- [ ] Rotate Turnstile secret key if previously exposed
- [ ] Update `TURNSTILE_SECRET_KEY` in all three email workers:
  ```bash
  wrangler secret put TURNSTILE_SECRET_KEY --env=email-worker-dev
  wrangler secret put TURNSTILE_SECRET_KEY --env=email-worker-stage
  wrangler secret put TURNSTILE_SECRET_KEY --env=email-worker-prod
  ```

### Pre-Cutover Verification

- [ ] Run full `deploy-dev.yml` workflow manually
- [ ] Verify **dev** deployment succeeds
- [ ] Visit `dev.nsengineering.com.np` — confirm:
  - Latest content from Google Sheets loads
  - Favicon present
  - Images load from R2
  - Contact form works
- [ ] Approve staging deployment in GitHub
- [ ] Visit `stage.nsengineering.com.np` — verify same checks
- [ ] Approve production deployment in GitHub
- [ ] Visit `nsengineering-prod.pages.dev` (pre-cutover prod) — verify same checks
- [ ] Test contact form on prod URL and confirm email arrives
- [ ] Verify OG image `/logo/ns-logo.jpg` resolves from R2

---

## DNS Cutover

The domain `nsengineering.com.np` is already managed by Cloudflare nameservers. Cutover is instant — no TTL propagation needed.

### Cutover Steps

1. In **Cloudflare Dashboard** → **Pages** → **`nsengineering-prod`** → **Custom domains**
2. Add domain `nsengineering.com.np`
   - Cloudflare prompts to create CNAME/DNS record (auto-created)
3. Add domain `www.nsengineering.com.np` (same process)
4. CF automatically issues SSL certificate (wait ~5 min)
5. Traffic switches immediately

### Rollback (if needed)

1. Remove custom domains from `nsengineering-prod` in CF dashboard
2. Restore original DNS records (or contact DNS provider if not using CF)
3. Traffic reverts to previous host (GitHub Pages)

---

## Rolling Back a Deployment

### Option 1: Revert to a Previous Cloudflare Pages Deployment

```bash
# List recent deployments (requires wrangler CLI)
wrangler pages deployment list --project-name nsengineering-prod

# View details of a specific deployment
wrangler pages deployment view <deployment-id> --project-name nsengineering-prod

# Promote a previous deployment to production (in CF dashboard)
# Pages → nsengineering-prod → Deployments → [select deployment] → Promote to Production
```

### Option 2: Revert Content to Previous Git State

All CSVs are version-controlled in `content/` — you can restore any previous state:

```bash
# View commit history for content changes
git log --oneline -- content/

# Restore content to a previous commit
git checkout <commit-hash> -- content/
git commit -m "Rollback content to <date>"

# Trigger deploy-dev.yml to rebuild and redeploy with old content
```

### Option 3: Emergency DNS Rollback

If a production deployment causes critical issues:

1. In **Cloudflare Dashboard** → **Pages** → **`nsengineering-prod`** → **Custom domains**
2. Remove `nsengineering.com.np` and `www.nsengineering.com.np`
3. Manually update DNS to point to previous host (or restore GitHub Pages A records)
4. Traffic switches immediately

---

## Post-Deployment Verification

Run these checks after every production deployment:

```bash
# Check site is live
curl -I https://nsengineering.com.np

# Verify favicon loads
curl -I https://nsengineering.com.np/favicon.ico

# Verify R2 images load (check actual R2 URL)
curl -I https://pub-abc123.r2.dev/logo/ns-logo.jpg

# Check for security headers
curl -I https://nsengineering.com.np | grep -i "x-content-type-options\|x-frame-options"

# Verify contact form works (test endpoint)
curl -X POST https://nsengineering.com.np/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test"}'
```

---

## Troubleshooting

### Deployment fails at "Inject dev R2 URL"

**Error**: `NEXT_PUBLIC_R2_BASE_URL is not set in the dev GitHub environment`

**Solution**:
1. Go to **GitHub Settings** → **Environments** → **dev**
2. Add/verify secret `NEXT_PUBLIC_R2_BASE_URL` with the correct R2 URL
3. Re-run the workflow

### Staging approval doesn't appear in GitHub

**Possible causes**:
- `staging` environment doesn't exist yet
- No protection rules configured

**Solution**:
1. Go to **Settings** → **Environments**
2. Click **"New environment"** → name it `staging`
3. (Optional) Add deployment protection rules if you want manual approval

### Wrangler deploy command fails

**Error**: `Could not authenticate with Cloudflare. Did you save your API token?`

**Solution**:
1. Verify `CLOUDFLARE_API_TOKEN` is set in the GitHub environment
2. Verify token is still valid (check Cloudflare dashboard)
3. Re-run the workflow after updating the token

### Images not loading from R2

**Cause**: R2 URL placeholder not substituted correctly

**Debug**:
```bash
# Check if placeholder still exists in deployed files
curl https://dev.nsengineering.com.np/ | grep "NSENGINEERING_R2_URL"

# If found, the substitution failed — check deploy logs in GitHub Actions
```

**Fix**: Re-run the workflow and check for errors in the "Inject R2 URL" step.

### Contact form fails on new environment

**Cause**: Email Worker URL mismatch

**Debug**:
1. Check deployed HTML contains correct worker URL:
   ```bash
   curl https://dev.nsengineering.com.np/ | grep "worker"
   ```
2. Test worker endpoint directly:
   ```bash
   curl -X POST https://email-worker-dev.emailapi-nsengineering.workers.dev/send \
     -H "Content-Type: application/json" \
     -d '{"to":"test@example.com","subject":"Test","text":"Test"}'
   ```

---

## Quick Commands Reference

```bash
# View available workflows
gh workflow list

# Trigger deploy-dev.yml
gh workflow run deploy-dev.yml -r main

# Monitor running workflow
gh run list --status in_progress

# View logs for specific job
gh run view <run-id> --log

# List Cloudflare Pages projects
wrangler pages project list

# List deployments for a project
wrangler pages deployment list --project-name nsengineering-prod

# Check Wrangler version
wrangler --version
```

---

## References

- **Workflow**: [.github/workflows/deploy-dev.yml](.github/workflows/deploy-dev.yml)
- **Environments Guide**: [docs/technical/ENVIRONMENT_STRATEGY.md](./docs/technical/ENVIRONMENT_STRATEGY.md)
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Wrangler CLI Docs**: https://developers.cloudflare.com/workers/wrangler/

# Verify email worker
curl -X POST https://email-worker-prod.emailapi-nsengineering.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"emailType":"contact-inquiry","data":{"test":true}}'
```

Visit all major pages: `/`, `/projects`, `/services`, `/about`, `/team`, `/elibrary`, `/faq`, `/careers`, `/contact`

---

## Regular Maintenance

### Weekly content sync

```bash
# On the delivery branch (feature/cloudflareMigration or main)
npm run build:content:cloud    # Fetch from Sheets + export CSV
git diff content/              # Review changes
git add content/
git commit -m "Content sync: $(date +%Y-%m-%d)"
git push
# Then trigger deploy-dev.yml via GitHub Actions UI
```

### Dependency updates

```bash
npm outdated          # Check outdated packages
npm update            # Update within semver range
npx tsc --noEmit      # Verify no type errors
npm run build:local   # Verify build passes
```

---

## Troubleshooting

### Custom domain not showing latest content

The CF Pages project's production branch is likely misconfigured. Check:
- CF Dashboard → Pages → `nsengineering-<env>` → Settings → Builds & deployments → Production branch
- Must match the `--branch` flag used in the wrangler deploy step (`dev`, `stage`, or `main`)
- Recent deployments showing `Environment: Preview` instead of `Production` confirm this is the issue

### Favicon not loading

1. Check `out/favicon.ico` exists in the build artifact
2. Check `<link rel="icon">` in the HTML for the R2 logo URL — confirm the R2 URL was substituted correctly (should NOT contain `NSENGINEERING_R2_URL` placeholder)
3. Confirm `logo/ns-logo.jpg` exists in the correct R2 bucket

### Images not loading

Confirm the R2 URL substitution ran successfully in the inject step. In the GitHub Actions log for the deploy job, the step "Inject `<env>` R2 URL and Turnstile key" should show `✅ <env> environment values injected`. If missing or errored, check that `NEXT_PUBLIC_R2_BASE_URL` is set in the corresponding GitHub environment.

### Turnstile not working on forms

Confirm `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set in the GitHub environment for that deploy (especially `staging`). The inject step will fail fast with a clear error if the secret is missing.

### Email form submission fails

1. Check `window.location.hostname` at runtime — `emailService.ts` routes based on this
2. On custom domains: dev/stage/prod each route to their own worker
3. On `*.pages.dev` preview URLs: falls back to `NEXT_PUBLIC_EMAIL_WORKER_URL` (dev worker)
4. Test the worker endpoint directly with `curl -X POST ...`

---

## Documentation References

- [Audit Report](./docs/DEPLOYMENT_AUDIT_2026-06-03.md) — Full infrastructure audit with all findings
- [Cloudflare R2 Migration](./docs/technical/CLOUDFLARE_R2_MIGRATION.md) — R2 setup and configuration
- [rclone Sync](./docs/technical/RCLONE_SYNC.md) — GDrive → R2 sync details
- [Content Workflow](./docs/guides/content-workflow.md) — Non-technical content editing guide
- [Project Progress](./PROJECT_PROGRESS.md) — Feature completion status
