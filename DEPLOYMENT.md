# Deployment Guide

Complete deployment guide for NS Engineering website — Cloudflare Pages multi-environment architecture.

**Last Updated**: 2026-06-03  
**Architecture**: GitHub Actions → Cloudflare Pages (Dev / Stage / Prod)  
**Status**: Active — DNS cutover to Cloudflare Pages pending

---

## Architecture Overview

```
feature branch
      │  merge / PR
      ▼
feature/cloudflareMigration (or main delivery branch)
      │  manual workflow_dispatch
      ▼
GitHub Actions: deploy-dev.yml
      │
      ├─ Job 1: sync-assets        GDrive → nswebsite-dev R2
      ├─ Job 2: build              Next.js static export (one build, shared artifact)
      │                            R2/Turnstile placeholders baked in
      │
      ├─ Job 3: deploy-dev         inject dev R2 URL + Turnstile key → nsengineering-dev Pages
      │           └── custom domain: dev.nsengineering.com.np
      │
      ├─ Job 4: sync-assets-stage  nswebsite-dev R2 → nswebsite-stage R2
      ├─ Job 5: deploy-stage       inject stage R2 URL + Turnstile key → nsengineering-stage Pages
      │           └── custom domain: stage.nsengineering.com.np
      │
      ├─ Job 6: sync-assets-prod   nswebsite-stage R2 → nswebsite-prod R2
      └─ Job 7: deploy-prod        inject prod R2 URL + Turnstile key → nsengineering-prod Pages
                  └── custom domain: nsengineering.com.np / www.nsengineering.com.np (post-cutover)
```

Each deploy job runs inside its own GitHub environment (`dev` / `staging` / `production`), so environment-specific secrets (R2 URL, Turnstile key) are substituted into the artifact at deploy time before uploading to Cloudflare Pages.

---

## Cloudflare Pages Projects

| Project | Production Branch | Custom Domain | GitHub Env |
|---|---|---|---|
| `nsengineering-dev` | `dev` | `dev.nsengineering.com.np` | `dev` |
| `nsengineering-stage` | `stage` | `stage.nsengineering.com.np` | `staging` |
| `nsengineering-prod` | `main` | `nsengineering.com.np`, `www.nsengineering.com.np` | `production` |

**Important:** The CF Pages project's "Production branch" setting must match the `--branch` flag in the wrangler deploy command. If they differ, wrangler creates a Preview deployment that is NOT served by the custom domain.

---

## Triggering a Deployment

### Standard deployment (all environments)

The pipeline runs on manual dispatch only:

1. Go to the GitHub repository → **Actions** tab
2. Select **"Deploy to Cloudflare Pages (Dev)"** workflow
3. Click **Run workflow** → select the branch → **Run workflow**
4. Monitor the pipeline — it runs dev → stage → prod in sequence
5. Each stage and prod job requires manual approval in the GitHub environment gates

### What triggers what

| Trigger | Pipeline |
|---|---|
| `workflow_dispatch` on `deploy-dev.yml` | Full dev → stage → prod Cloudflare Pages pipeline |
| Push to `cloudflare` branch | `deploy.yml` → GitHub Pages (legacy, to be disabled after DNS cutover) |

---

## Required GitHub Secrets

### Repository-level secrets (all environments inherit)

| Secret | Purpose |
|---|---|
| `GOOGLE_SHEET_ID` | Google Sheets content source |
| `GOOGLE_CREDENTIALS_JSON` | Google service account JSON |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account identity |
| `GDRIVE_PROJECT_ID` | GDrive service account project |
| `GDRIVE_PRIVATE_KEY` | GDrive service account private key |
| `GDRIVE_PRIVATE_KEY_ID` | GDrive key ID |
| `GDRIVE_SERVICE_ACCOUNT_EMAIL` | GDrive service account email |
| `GDRIVE_CLIENT_ID` | GDrive client ID |
| `GDRIVE_ROOT_FOLDER_ID` | Root folder in Google Drive to sync |
| `NEXT_PUBLIC_EMAIL_WORKER_URL` | Fallback email worker URL (used on *.pages.dev preview URLs) |

### `dev` GitHub environment secrets

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy token |
| `CLOUDFLARE_ACCOUNT_ID` | CF account ID |
| `CLOUDFLARE_PROJECT_NAME` | `nsengineering-dev` |
| `NEXT_PUBLIC_R2_BASE_URL` | Dev R2 public URL (injected at deploy time) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Dev Turnstile site key (injected at deploy time) |
| `R2_BUCKET_NAME` | `nswebsite-dev` |
| `R2_ACCESS_KEY_ID` | Dev R2 access key |
| `R2_SECRET_ACCESS_KEY` | Dev R2 secret |
| `R2_ACCOUNT_ID` | Dev R2 account ID |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_DEV` | `https://email-worker-dev.emailapi-nsengineering.workers.dev` |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` | Stage worker URL (baked into artifact for runtime routing) |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` | Prod worker URL (baked into artifact for runtime routing) |

### `staging` GitHub environment secrets

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy token |
| `CLOUDFLARE_ACCOUNT_ID` | CF account ID |
| `CLOUDFLARE_PROJECT_NAME` | `nsengineering-stage` |
| `NEXT_PUBLIC_R2_BASE_URL` | Stage R2 public URL (injected at deploy time) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Stage Turnstile site key (injected at deploy time) ⚠️ must be set |
| `R2_BUCKET_NAME` | `nswebsite-stage` (target for stage deploy) |
| `R2_ACCESS_KEY_ID` | Stage R2 access key |
| `R2_SECRET_ACCESS_KEY` | Stage R2 secret |
| `R2_ACCOUNT_ID` | Stage R2 account ID |
| `DEV_R2_BUCKET_NAME` | `nswebsite-dev` (source for promotion) |
| `DEV_R2_ACCESS_KEY_ID` | Dev R2 access key (read, for promotion) |
| `DEV_R2_SECRET_ACCESS_KEY` | Dev R2 secret (read, for promotion) |
| `DEV_R2_ACCOUNT_ID` | Dev R2 account ID (read, for promotion) |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` | Stage worker URL |

### `production` GitHub environment secrets

| Secret | Purpose |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy token |
| `CLOUDFLARE_ACCOUNT_ID` | CF account ID |
| `CLOUDFLARE_PROJECT_NAME` | `nsengineering-prod` |
| `NEXT_PUBLIC_R2_BASE_URL` | Prod R2 public URL (injected at deploy time) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Prod Turnstile site key (injected at deploy time) |
| `R2_BUCKET_NAME` | `nswebsite-prod` (target for prod deploy) |
| `R2_ACCESS_KEY_ID` | Prod R2 access key |
| `R2_SECRET_ACCESS_KEY` | Prod R2 secret |
| `R2_ACCOUNT_ID` | Prod R2 account ID |
| `STAGE_R2_BUCKET_NAME` | `nswebsite-stage` (source for promotion) |
| `STAGE_R2_ACCESS_KEY_ID` | Stage R2 access key (read, for promotion) |
| `STAGE_R2_SECRET_ACCESS_KEY` | Stage R2 secret (read, for promotion) |
| `STAGE_R2_ACCOUNT_ID` | Stage R2 account ID (read, for promotion) |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` | Prod worker URL |

---

## Pre-DNS Cutover Checklist

### Cloudflare Dashboard (one-time setup)

- [ ] `nsengineering-dev` → Settings → Builds & deployments → Production branch → set to `dev`
- [ ] `nsengineering-stage` → Settings → Builds & deployments → Production branch → set to `stage`
- [ ] `nsengineering-prod` → Custom domains → Add `nsengineering.com.np` and `www.nsengineering.com.np`

### GitHub Secrets

- [ ] Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to the `staging` GitHub environment

### Security

- [ ] Rotate the Turnstile secret key that was committed in `docs/technical/PHASE_4_5_DEPLOYMENT_GUIDE.md`
- [ ] Update `TURNSTILE_SECRET_KEY` in all three email workers after rotation:
  ```bash
  wrangler secret put TURNSTILE_SECRET_KEY --name email-worker-dev
  wrangler secret put TURNSTILE_SECRET_KEY --name email-worker-stage
  wrangler secret put TURNSTILE_SECRET_KEY --name email-worker-prod
  ```

### Final verification before cutover

- [ ] Run full `deploy-dev.yml` workflow and verify dev, stage, and prod deployments complete
- [ ] Visit `dev.nsengineering.com.np` — confirm latest content, favicon, images load correctly
- [ ] Visit `stage.nsengineering.com.np` — same check
- [ ] Visit `nsengineering-prod.pages.dev` — same check (this is pre-cutover prod)
- [ ] Submit a test form on the prod Pages URL and confirm email arrives via prod worker
- [ ] Verify OG image at `/logo/ns-logo.jpg` resolves (add to `public/logo/` or add CF Pages redirect)

---

## DNS Cutover

The domain `nsengineering.com.np` is already on Cloudflare nameservers and proxied. Cutover is instant — no TTL propagation wait needed.

**Steps:**
1. In Cloudflare Dashboard → Pages → `nsengineering-prod` → Custom domains
2. Add `nsengineering.com.np` — Cloudflare will prompt to create a CNAME/DNS record
3. Add `www.nsengineering.com.np` — same
4. CF automatically creates the required DNS records and issues the SSL certificate
5. Traffic switches immediately since DNS is managed by Cloudflare

**Rollback:** Remove the custom domains from `nsengineering-prod` and restore the original A records pointing to GitHub Pages IPs.

---

## Email Workers

All three environment-specific workers are deployed and accessible via `workers.dev`:

| Environment | Worker URL |
|---|---|
| Dev | `https://email-worker-dev.emailapi-nsengineering.workers.dev` |
| Stage | `https://email-worker-stage.emailapi-nsengineering.workers.dev` |
| Prod | `https://email-worker-prod.emailapi-nsengineering.workers.dev` |

The frontend (`emailService.ts`) routes to the correct worker at runtime based on `window.location.hostname`. All three URLs are baked into the artifact at build time.

---

## Rollback Procedures

### Revert to previous Pages deployment

```bash
# List recent deployments
wrangler pages deployment list --project-name nsengineering-prod

# Promote a specific previous deployment to production
# (do this in the Cloudflare dashboard: Pages → project → deployment → Promote to Production)
```

### Revert content to previous Google Sheets state

```bash
# All CSVs are version controlled — restore previous content
git checkout <commit-hash> -- content/
git commit -m "Rollback content to <date>"
# Then trigger deploy-dev.yml
```

### Emergency: revert DNS cutover

Remove `nsengineering.com.np` and `www.nsengineering.com.np` from `nsengineering-prod` custom domains in the CF dashboard. Restore GitHub Pages A records manually in the DNS tab.

---

## Post-Deployment Checks

Run these after every production deployment:

```bash
# Check site is live
curl -I https://nsengineering.com.np

# Verify favicon
curl -I https://nsengineering.com.np/favicon.ico

# Verify R2 images load (replace with actual prod R2 URL)
curl -I https://pub-f5c1196e75664b0a8d9ba70c46527044.r2.dev/logo/ns-logo.jpg

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
