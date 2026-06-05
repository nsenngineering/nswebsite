# NS Engineering Website — Deployment Audit Report
**Date**: 2026-06-03  
**Branch audited**: `feature/cloudflareMigration`  
**Auditor**: Claude Code (live Cloudflare + GitHub inspection)  
**Scope**: Code, CI/CD pipelines, Cloudflare Pages, R2, Workers, DNS, GitHub secrets

---

## Changes Applied (branch: `prodAuditChanges`)

The following issues from this audit have been fixed in branch `prodAuditChanges`:

### ✅ Fixed — R2 URL baked from dev into all environments (Section 1.3)
**File**: `.github/workflows/deploy-dev.yml`  
**Change**: `NEXT_PUBLIC_R2_BASE_URL` in both the workflow-level env and build job env replaced with the placeholder string `"https://NSENGINEERING_R2_URL"`. A new step **"Inject `<env>` R2 URL and Turnstile key"** added to `deploy-dev`, `deploy-stage`, and `deploy-prod` jobs. Each step runs inside its own GitHub environment, so `secrets.NEXT_PUBLIC_R2_BASE_URL` resolves to the correct environment-specific value and is substituted into all `.html` and `.js` files via `find+sed` before the wrangler deploy runs.

**Result**: dev loads from `nswebsite-dev` R2, stage from `nswebsite-stage` R2, prod from `nswebsite-prod` R2.

### ✅ Fixed — Prod Turnstile key never used (Section 2.2)
**File**: `.github/workflows/deploy-dev.yml`  
**Change**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` replaced with placeholder `"NSENGINEERING_TURNSTILE_KEY"` at build time. The same inject step substitutes the correct per-environment Turnstile site key from `secrets.NEXT_PUBLIC_TURNSTILE_SITE_KEY` in each deploy job.

**Result**: dev, stage, and prod each use their own Turnstile site key.

**Remaining action**: Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to the `staging` GitHub environment secrets. The inject step has a `:?` guard that will fail with a clear error message if it is missing.

---

---

## Executive Summary

The new multi-environment Cloudflare Pages architecture is **structurally sound** but has **three blockers** that must be resolved before production DNS cutover, plus several significant issues that will cause subtle problems post-launch. The most urgent is a misconfiguration in Cloudflare Pages that causes custom domains (`dev.nsengineering.com.np`, `stage.nsengineering.com.np`) to serve **stale content from 4–6 days ago**, making all recent deployments — including favicon fixes — invisible on those URLs.

---

## Infrastructure Map (Confirmed Live State)

```
GitHub Actions (deploy-dev.yml)
│
├── Job: build  [runs in GitHub env: dev]
│   ├── Uses: dev R2 URL, dev Turnstile key, all worker URLs
│   └── Produces: site-build artifact (env vars baked in permanently)
│
├── Job: sync-assets  [GitHub env: dev]
│   └── GDrive → nswebsite-dev (R2)
│
├── Job: deploy-dev  [GitHub env: dev]
│   └── artifact → nsengineering-dev Pages, --branch=dev → PREVIEW ❌
│           custom domain: dev.nsengineering.com.np → serving 1-week-old main
│
├── Job: sync-assets-stage  [GitHub env: staging]
│   └── nswebsite-dev → nswebsite-stage (R2 promotion)
│
├── Job: deploy-stage  [GitHub env: staging]
│   └── artifact → nsengineering-stage Pages, --branch=stage → PREVIEW ❌
│           custom domain: stage.nsengineering.com.np → serving 6-day-old main
│
├── Job: sync-assets-prod  [GitHub env: production]
│   └── nswebsite-stage → nswebsite-prod (R2 promotion)
│
└── Job: deploy-prod  [GitHub env: production]
    └── artifact → nsengineering-prod Pages, --branch=main → PRODUCTION ✓
            custom domain: NONE YET ❌ (needed for DNS cutover)

Cloudflare Pages Projects (live):
  nsengineering-dev   production_branch=main  domains: dev.nsengineering.com.np
  nsengineering-stage production_branch=main  domains: stage.nsengineering.com.np
  nsengineering-prod  production_branch=main  domains: (none)

R2 Buckets (live, all public via r2.dev):
  nswebsite-dev   → pub-f58468244b5b418fbb2205a1c42100fd.r2.dev
  nswebsite-stage → pub-43efaf62899f4c4d94f31b2830227f25.r2.dev
  nswebsite-prod  → pub-f5c1196e75664b0a8d9ba70c46527044.r2.dev

Email Workers (live, all respond HTTP 405 = correct):
  email-worker-dev   ✓ (updated 2026-06-03)
  email-worker-stage ✓ (updated 2026-06-03)
  email-worker-prod  ✓ (updated 2026-06-03)
  email-worker       (old generic, still deployed — should be cleaned up)
```

---

## Section 1: Cloudflare Infrastructure

### 1.1 🔴 BLOCKER — Pages Production Branch Mismatch

**What's wrong:**  
All three Cloudflare Pages projects are configured with `production_branch: main`. The workflow deploys dev content with `--branch=dev` and stage content with `--branch=stage`. In Cloudflare Pages, only the production branch creates a Production deployment — everything else is a Preview.

Custom domains (`dev.nsengineering.com.np`, `stage.nsengineering.com.np`) serve the **Production environment** of their respective projects. Since no `main` branch has been deployed to `nsengineering-dev` recently, and the last `main` branch was deployed weeks ago, the custom domains show old content.

**Evidence:**
```
nsengineering-dev:   latest=2026-06-02 env=preview  branch=dev
                     last production was branch=main, 1 week ago
nsengineering-stage: latest=2026-06-02 env=preview  branch=stage
                     last production was branch=stage, 6 days ago (when prod branch was still 'stage')

favicon.ico HTTP 200 on latest preview URLs:
  598146ed.nsengineering-stage.pages.dev/favicon.ico → 200 ✓
  ee57bb0d.nsengineering-dev.pages.dev/favicon.ico   → 200 ✓
  stage.nsengineering.com.np/favicon.ico              → serving old build ❌
```

The favicon and all other recent changes are correctly deployed — they just aren't visible via the custom domains.

**Fix (Cloudflare Dashboard):**
1. Go to Pages → `nsengineering-dev` → Settings → Builds & deployments
2. Change Production branch from `main` to `dev`
3. Repeat for `nsengineering-stage`: change from `main` to `stage`
4. Then re-run one full `deploy-dev.yml` workflow dispatch to create a fresh Production deployment for each

The `nsengineering-prod` project is correctly using `main` — no change needed there.

---

### 1.2 🔴 BLOCKER — `nsengineering-prod` Has No Custom Domain

**What's wrong:**  
```
nsengineering-prod  →  nsengineering-prod.pages.dev  (NO custom domain configured)
```

DNS cutover cannot happen until `nsengineering.com.np` and `www.nsengineering.com.np` are added as custom domains to this project.

**Fix (Cloudflare Dashboard):**
1. Pages → `nsengineering-prod` → Custom domains → Add custom domain
2. Add `nsengineering.com.np`
3. Add `www.nsengineering.com.np`
4. Cloudflare will automatically configure the CNAME/DNS since the domain is already in this account

**DNS note:** `nsengineering.com.np` is already on Cloudflare nameservers (`pat.ns.cloudflare.com`, `christian.ns.cloudflare.com`) and traffic is proxied through Cloudflare. Cutover will be near-instant — no TTL wait needed.

---

### 1.3 🔴 BLOCKER — Production Will Load Images from Dev R2 Bucket

**What's wrong:**  
The build job runs in the GitHub `dev` environment. It bakes `NEXT_PUBLIC_R2_BASE_URL` (the dev environment's value) into the static HTML at compile time. The same artifact is then deployed to staging and production without rebuilding.

**Confirmed R2 public URLs:**
```
nswebsite-dev   → pub-f58468244b5b418fbb2205a1c42100fd.r2.dev  ← baked into ALL deployments
nswebsite-stage → pub-43efaf62899f4c4d94f31b2830227f25.r2.dev  ← never used in HTML
nswebsite-prod  → pub-f5c1196e75664b0a8d9ba70c46527044.r2.dev  ← never used in HTML
```

Every image on the production website — hero carousel, project photos, gallery, team photos, logo, favicon — will load from the **dev R2 bucket**, not the prod R2 bucket.

This works today because:
- The assets are promoted (dev → stage → prod R2), so all three buckets have the same files
- The dev R2 bucket is publicly accessible

The risk: if dev R2 is ever cleared, restructured, or its access changes, the production website breaks. Google and social platforms will also cache the dev R2 URLs in OG previews.

**Fix:**  
The cleanest solution is to either:

**Option A (Recommended — separate build per env):** Add a production build job that rebuilds the Next.js site inside the `production` environment context, using the prod R2 URL. The prod deploy job then uses its own artifact.

**Option B (Quick fix — shared bucket URL):** Use the same R2 public URL for all environments by using a custom domain on the R2 bucket (e.g., `media.nsengineering.com.np`) that points to the prod bucket. Set `NEXT_PUBLIC_R2_BASE_URL` to this custom domain in all environments. The rclone promotion still ensures the right files exist in the right bucket, but images are always loaded via the stable custom domain.

Option B is easier to implement and avoids the triple-build overhead.

---

### 1.4 🟡 No CORS Rules on R2 Buckets

**What's wrong:**  
All three R2 buckets have no CORS rules configured. Currently the favicon/logo/images load fine because `<link rel="icon">` and `<img>` tags don't enforce CORS. However, if any future JavaScript (e.g., `fetch()` for a PDF viewer, image preloading via JS) requests R2 assets, the browser will block it with a CORS error.

**Fix (can defer but do before launch):**  
Add CORS rules to each bucket allowing `GET` from the site origins. Via the Cloudflare dashboard: R2 → bucket → Settings → CORS:
```json
[
  {
    "AllowedOrigins": [
      "https://nsengineering.com.np",
      "https://www.nsengineering.com.np",
      "https://stage.nsengineering.com.np",
      "https://dev.nsengineering.com.np"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

---

### 1.5 🟡 Old `email-worker` Still Deployed

**What's wrong:**  
A worker named `email-worker` (last modified 2026-05-17) is still live alongside the three environment-specific workers. It's the original pre-multi-env worker. Having it deployed wastes a worker slot and could be confused with `email-worker-prod`.

**Fix:** `wrangler delete email-worker` once you've confirmed `email-worker-prod` handles all production traffic correctly.

---

## Section 2: CI/CD Pipeline (GitHub Actions)

### 2.1 🔴 `deploy.yml` Still Active and Conflicts with New Architecture

**What's wrong:**  
`deploy.yml` triggers on every push to the `cloudflare` branch and deploys to **GitHub Pages**. After DNS cutover to Cloudflare Pages, any push to `cloudflare` will:
1. Still deploy to GitHub Pages (wasted build, old infra)
2. NOT deploy to Cloudflare Pages (since `deploy-dev.yml` is `workflow_dispatch` only)

The two workflows will create a split: GitHub Pages gets all pushes; Cloudflare Pages only gets manual deploys.

**Fix — two options:**

**Option A:** Disable `deploy.yml` (delete or change its trigger to `workflow_dispatch`). Change `deploy-dev.yml` trigger to `on: push: branches: [feature/cloudflareMigration]` (or whatever your main delivery branch becomes after merge).

**Option B:** Keep `deploy.yml` for GitHub Pages as a fallback/rollback target, but explicitly comment that it is the OLD pipeline.

---

### 2.2 🟡 Single Artifact Built with Dev Secrets — Env-Specific Values Never Reach Prod

**What's wrong (detailed):**  
The build job is locked to `environment: dev`. GitHub Actions environment secrets are scoped — when a job runs in `dev`, it only sees `dev` secrets. The `production` GitHub environment has correct per-env values for:
- `NEXT_PUBLIC_R2_BASE_URL` → prod R2 URL  
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` → prod Turnstile key  
- `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` → prod worker URL

But **none of these are ever used** because the build never runs in the `production` environment.

**What's baked into every deployment (from `dev` env):**
```
NEXT_PUBLIC_R2_BASE_URL          = dev R2 URL (pub-f584...r2.dev)
NEXT_PUBLIC_TURNSTILE_SITE_KEY   = dev Turnstile site key
NEXT_PUBLIC_EMAIL_WORKER_URL     = dev generic worker URL
NEXT_PUBLIC_EMAIL_WORKER_URL_DEV   ✓
NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE ✓
NEXT_PUBLIC_EMAIL_WORKER_URL_PROD  ✓  (correctly baked in for runtime hostname switching)
```

The email worker URL is fine because `emailService.ts` selects at runtime via `window.location.hostname`. But R2 URL and Turnstile key are baked at build time and cannot switch at runtime.

**Result:**
- Production Turnstile shows dev analytics; bot detection threshold might differ
- Production images come from dev R2 bucket URL (see 1.3)

---

### 2.3 🟡 Staging GitHub Environment Missing `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

**What's wrong:**  
The `staging` GitHub environment has no `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Since the build runs in `dev` (not `staging`), this doesn't break the build today. But it means if you ever move the build to the staging env, Turnstile will be unset and forms will silently fail bot protection.

**Fix:** Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to the staging GitHub environment (even if it's the same key as dev, for explicitness).

---

### 2.4 🟡 `NEXT_PUBLIC_EMAIL_WORKER_URL` (generic) Routes to Dev Worker on `*.pages.dev` URLs

**What's wrong:**  
`emailService.ts` has this runtime routing logic:
```typescript
// stage.nsengineering.com.np → email-worker-stage
// dev.nsengineering.com.np   → email-worker-dev
// nsengineering.com.np       → email-worker-prod
// *.pages.dev (preview URLs) → NEXT_PUBLIC_EMAIL_WORKER_URL  ← dev worker
```

When QA or developers test on the unique preview URLs (e.g., `598146ed.nsengineering-stage.pages.dev`), any form submission goes to the **dev email worker**, not the stage one. Quotation requests from staging previews land in dev.

This is a testing concern, not a production blocker. Production will use the custom domain, which correctly routes to `email-worker-prod`.

---

### 2.5 🟡 rclone Filter Does Not Exclude Non-Media Files

**What's wrong:**  
The rclone sync filters in both `deploy.yml` and `deploy-dev.yml`:
```yaml
--filter "- *.csv"
--filter "+ *.jpg"
--filter "+ *.jpeg"
--filter "+ *.png"
--filter "+ *.webp"
--filter "+ *.pdf"
```

In rclone, any file that doesn't match any rule is **included by default**. So `.docx`, `.xlsx`, `.txt`, `.html`, `.zip`, and any other file types in Google Drive will be synced to R2. The intent appears to be to sync only images and PDFs.

**Fix:** Add `--filter "- *"` as the last filter rule to exclude everything that didn't match an include rule:
```yaml
--filter "- *.csv"
--filter "+ *.jpg"
--filter "+ *.jpeg"
--filter "+ *.png"
--filter "+ *.webp"
--filter "+ *.pdf"
--filter "- *"     # ← add this
```

**Note:** Existing non-media files already in R2 won't be removed by adding this. You'd need a one-time `rclone delete` or `rclone sync` pass to clean them up.

---

### 2.6 🟡 Wrangler Version Inconsistency

**What's wrong:**  
```yaml
# deploy-dev job
npm install -g wrangler        # installs latest wrangler
wrangler pages deploy ./out ...

# deploy-stage and deploy-prod jobs
npx --yes wrangler@3 pages deploy ./out ...  # pins to major version 3
```

The dev deployment uses whatever the latest wrangler is at run time; stage and prod pin to v3. This can cause different behaviors if wrangler has breaking changes between versions. Currently wrangler is at 4.97.0 (as seen in `wrangler whoami`).

**Fix:** Pin all three deploy jobs to the same version:
```yaml
npx --yes wrangler@latest pages deploy ./out ...
# or pin to specific version
npx --yes wrangler@4.97.0 pages deploy ./out ...
```

---

### 2.7 ℹ️ `commit-csv` Job Only Exists in `deploy.yml` (GitHub Pages), Not in `deploy-dev.yml`

**What this means:**  
The Cloudflare Pages pipeline (`deploy-dev.yml`) does not commit CSV exports back to the repository. Only the old GitHub Pages pipeline (`deploy.yml`) commits CSVs. After switching to Cloudflare Pages as the primary pipeline, content changes will no longer be version-controlled via git.

**Fix:** Add a `commit-csv` job to `deploy-dev.yml` identical to the one in `deploy.yml`.

---

## Section 3: Code

### 3.1 🔴 Favicon Implementation Uses R2 URL (No Static Fallback Path)

**What's wrong:**  
`src/app/layout.tsx` sets the favicon to the R2 logo URL:
```typescript
const logoUrl = getLogoUrl(); // returns ${NEXT_PUBLIC_R2_BASE_URL}/logo/ns-logo.jpg

export const metadata = {
  icons: {
    icon: logoUrl,   // <link rel="icon" href="<r2-url>/logo/ns-logo.jpg" />
    apple: logoUrl,
  },
};
```

The generated HTML contains two icon entries:
```html
<link rel="icon" href="/favicon.ico?favicon.0b3bf435.ico" sizes="256x256" type="image/x-icon"/>
<link rel="icon" href="https://pub-f584....r2.dev/logo/ns-logo.jpg"/>
```

**Facts confirmed:**
- `logo/ns-logo.jpg` EXISTS in all three R2 buckets ✓
- `favicon.ico` HTTP 200 on all three latest deployments ✓
- The favicon IS working on the direct deployment URLs

The favicon issue on `stage.nsengineering.com.np` is entirely caused by the production branch mismatch (Section 1.1) — the custom domain serves old content that predates the favicon implementation. Once 1.1 is fixed, the favicon will work immediately.

**Remaining concern:** The `<link rel="icon">` uses a JPG loaded from R2 rather than the standard `favicon.ico`. JPGs are not officially supported as favicons in all browsers (Safari historically requires ICO or PNG). The `out/favicon.ico` file (25KB, from `src/app/favicon.ico`) exists and serves correctly — browsers that don't support JPG favicons will correctly fall back to it.

---

### 3.2 🔴 Turnstile Secret Key Committed to Repository

**What's wrong:**  
`docs/technical/PHASE_4_5_DEPLOYMENT_GUIDE.md` line 51 contains a plaintext Cloudflare Turnstile secret key:
```
- **Secret Key** (private): `0x4AAAAAACJhuYuVPuEqFEz99eH-c6-6Wgc`
```

This key is in git history. Anyone with repository access can use it to validate Turnstile tokens against your site's challenge.

**Fix (do immediately):**
1. Go to Cloudflare Dashboard → Turnstile → your site → Rotate Secret Key
2. Update the new secret key in `email-worker-dev`, `email-worker-stage`, `email-worker-prod` via:
   ```bash
   wrangler secret put TURNSTILE_SECRET_KEY --name email-worker-prod
   ```
3. Remove the exposed key from the doc file and commit

---

### 3.3 🟡 No `_headers` File — No Caching or Security Headers

**What's wrong:**  
There is no `public/_headers` file. Cloudflare Pages will serve the site with default headers only. This means:
- `_next/static/` assets (JS, CSS) are not getting the `immutable` cache directive they need for optimal repeat-visit performance
- No `X-Frame-Options`, `X-Content-Type-Options`, or `Referrer-Policy` security headers
- No HSTS (though Cloudflare proxy handles this at the edge)

**Fix:** Create `public/_headers`:
```
# Cache immutable Next.js static assets forever
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

# Cache root-level static files for 1 day
/favicon.ico
  Cache-Control: public, max-age=86400

# Security headers on all pages
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

### 3.4 🟡 OG Image and Schema Logo Use Hardcoded Production URL

**What's wrong:**  
`src/lib/seo/schema-generators.ts` and `src/lib/seo/metadata-helpers.ts` hardcode the production domain:
```typescript
// schema-generators.ts
logo: `${SITE_URL}/logo/ns-logo.jpg`  // SITE_URL = https://www.nsengineering.com.np

// metadata-helpers.ts
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo/ns-logo.jpg`;
```

This path (`/logo/ns-logo.jpg`) does not exist in the static build output — `out/logo/` directory does not exist. This URL resolves to the production domain's `/logo/ns-logo.jpg` which will 404 after DNS cutover unless:
- There's a Cloudflare redirect/rewrite mapping it to R2, OR
- The file is added to `public/logo/ns-logo.jpg`

OG images matter for link previews on LinkedIn, Twitter/X, WhatsApp, etc.

**Fix:** Either:
- Add the logo file to `public/logo/ns-logo.jpg` so it is deployed as a static asset
- OR add a Cloudflare Pages redirect rule: `https://nsengineering.com.np/logo/* → https://pub-<prod-r2-id>.r2.dev/logo/*`

---

### 3.5 🟡 `emailService.ts` Has Hardcoded Fallback URLs

**What's found:**  
`src/lib/emailService.ts:57-72` has hardcoded fallback URLs:
```typescript
if (hostname === 'stage.nsengineering.com.np') {
  return process.env.NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE ||
    'https://email-worker-stage.emailapi-nsengineering.workers.dev';
}
```

If `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` is ever not set in the build, the code silently uses the hardcoded URL. This is technically a two-layer safety net, but it means the hardcoded URL must stay in sync with the actual deployed worker URL. If the worker subdomain ever changes (e.g., different workers.dev account), this hardcoded value becomes a silent failure point.

Not a blocker, but worth noting.

---

### 3.6 ℹ️ `trailingSlash: true` With No `_redirects` for Legacy URLs

**What's found:**  
`next.config.ts` has `trailingSlash: true`. Cloudflare Pages handles trailing slashes correctly. However, the URL migration redirects are managed via `src/data/redirects.ts` and generated during build. Confirm that the generated `_redirects` file (if any) or the redirect logic survives the Cloudflare Pages deployment.

Check: does `out/_redirects` exist after build? Cloudflare Pages uses `_redirects` for edge redirects.

---

## Section 4: GitHub Secrets Audit

### `dev` GitHub Environment
| Secret | Set | Used in Build | Status |
|---|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | ✓ 2026-05-10 | deploy-dev job | ✓ |
| `CLOUDFLARE_API_TOKEN` | ✓ 2026-05-10 | deploy-dev job | ✓ |
| `CLOUDFLARE_PROJECT_NAME` | ✓ 2026-05-10 | deploy-dev job | ✓ |
| `NEXT_PUBLIC_R2_BASE_URL` | ✓ 2026-05-06 | build (baked in) | ✓ (but baked into all envs) |
| `R2_BUCKET_NAME/ACCESS/SECRET/ACCOUNT` | ✓ 2026-05-12 | sync-assets | ✓ |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✓ 2026-05-06 | build (baked into all envs) | ⚠️ dev key used for prod |
| `NEXT_PUBLIC_EMAIL_WORKER_URL` | ✓ 2026-05-06 | build | ✓ |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_DEV` | ✓ 2026-05-28 | build | ✓ |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` | ✓ 2026-06-01 | build | ✓ |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` | ✓ 2026-06-01 | build | ✓ |
| `GDRIVE_*` credentials | ✓ | sync-assets | ✓ |
| `GOOGLE_CREDENTIALS_JSON` | ✓ | build (Sheets) | ✓ |

### `staging` GitHub Environment
| Secret | Set | Used In | Status |
|---|---|---|---|
| `CLOUDFLARE_PROJECT_NAME` | ✓ 2026-05-22 | deploy-stage | ✓ |
| `NEXT_PUBLIC_R2_BASE_URL` | ✓ 2026-05-22 | (build runs in dev, not used) | ⚠️ set but not consumed |
| `R2_BUCKET_NAME/ACCESS/SECRET/ACCOUNT` | ✓ | sync-assets-stage (STAGE R2) | ✓ |
| `DEV_R2_ACCESS_KEY_ID/SECRET/ACCOUNT/BUCKET` | ✓ 2026-05-24 | sync-assets-stage (source) | ✓ |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` | ✓ 2026-05-28 | (not consumed — build is in dev) | ⚠️ |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✗ MISSING | — | ⚠️ |

### `production` GitHub Environment
| Secret | Set | Used In | Status |
|---|---|---|---|
| `CLOUDFLARE_PROJECT_NAME` | ✓ 2026-05-28 | deploy-prod | ✓ |
| `NEXT_PUBLIC_R2_BASE_URL` | ✓ 2026-05-28 | (build runs in dev, not used) | ⚠️ set but not consumed |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✓ 2026-05-28 | (build runs in dev, not used) | ⚠️ set but not consumed |
| `R2_BUCKET_NAME/ACCESS/SECRET/ACCOUNT` | ✓ | sync-assets-prod (PROD R2) | ✓ |
| `STAGE_R2_ACCESS_KEY_ID/SECRET/ACCOUNT/BUCKET` | ✓ 2026-05-28 | sync-assets-prod (source) | ✓ |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` | ✓ 2026-05-28 | (build runs in dev, not used) | ⚠️ |

---

## Section 5: Pre-DNS Cutover Checklist

### Must Do (Blockers)
- [ ] **CF Dashboard:** Change `nsengineering-dev` production branch → `dev`
- [ ] **CF Dashboard:** Change `nsengineering-stage` production branch → `stage`
- [ ] **CF Dashboard:** Add `nsengineering.com.np` and `www.nsengineering.com.np` as custom domains to `nsengineering-prod`
- [ ] **Security:** Rotate the exposed Turnstile secret key (`0x4AAAAAACJhuYuVPuEqFEz99eH-c6-6Wgc`) and update all three workers
- [ ] **GitHub Secrets:** Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to the `staging` GitHub environment
- [ ] **Merge `prodAuditChanges` branch** into the delivery branch and run `deploy-dev.yml` once to push a fresh Production deployment to all three environments
- [ ] **Verify OG image path:** Either add `public/logo/ns-logo.jpg` or add a Cloudflare redirect for `/logo/*` → R2

### Should Do (Significant)
- [x] ~~**Decide on R2 URL strategy**~~ — **Done** (`prodAuditChanges`): each environment now injects its own R2 URL at deploy time via `find+sed` substitution
- [x] ~~**Turnstile key per environment**~~ — **Done** (`prodAuditChanges`): same inject step handles Turnstile key substitution per environment
- [ ] **Add `public/_headers`** with cache and security headers
- [ ] **Disable or retarget `deploy.yml`** so it doesn't continue deploying to GitHub Pages after cutover
- [ ] **Add `commit-csv` job** to `deploy-dev.yml` for content version control
- [ ] **Add `--filter "- *"` to rclone** to prevent non-media files from syncing to R2
- [ ] **Fix wrangler version** to be consistent across all deploy jobs (currently `npm install -g wrangler` for dev vs `npx --yes wrangler@3` for stage/prod)

### Can Do After Launch
- [ ] Delete old `email-worker` generic worker
- [ ] Add CORS rules to R2 buckets
- [ ] Remove exposed Turnstile secret key from `docs/technical/PHASE_4_5_DEPLOYMENT_GUIDE.md` after rotation

---

## Section 6: What Is Confirmed Working ✅

| Item | Status |
|---|---|
| `favicon.ico` HTTP 200 on all three latest deployments | ✓ |
| `logo/ns-logo.jpg` in all three R2 buckets | ✓ |
| `email-worker-dev` deployed, responding correctly | ✓ |
| `email-worker-stage` deployed, responding correctly | ✓ |
| `email-worker-prod` deployed, responding correctly | ✓ |
| All email worker URLs baked into artifact for runtime routing | ✓ |
| All R2 buckets have public `r2.dev` URLs | ✓ |
| `nsengineering.com.np` nameservers on Cloudflare | ✓ |
| Domain proxied through Cloudflare (instant cutover possible) | ✓ |
| Per-environment `CLOUDFLARE_PROJECT_NAME` secrets | ✓ |
| R2 promotion chain: dev → stage → prod | ✓ |
| `nswebsite-prod` R2 bucket has content | ✓ |
| Next.js static export builds correctly | ✓ |
| `trailingSlash: true` compatible with CF Pages routing | ✓ |

---

*Generated by live audit of GitHub repo + Cloudflare account (cfd7fe0fcd61e4435ea8dd698e6caa81)*  
*All Cloudflare data pulled via wrangler OAuth + CF API as of 2026-06-03*
