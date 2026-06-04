# Secrets Management Guide
**Repos covered**: `nswebsite`, `email-worker`  
**Last audited**: 2026-06-04  
**Status**: Analysis complete — changes pending implementation

---

## 1. Design Principle

Every secret lives in exactly one place, determined by a single question:

> **Is this value the same across all environments, or different?**

| Answer | Where it lives |
|---|---|
| Same for dev, stage, and prod | **Repository level** — set once, inherited everywhere |
| Different per environment | **GitHub environment secret** — set per env, overrides repo level |

GitHub Actions secret resolution order when a job runs in an environment:
```
1. Environment secret (highest priority — overrides everything)
2. Repository secret (fallback if not in environment)
3. Organisation secret (fallback if not in repo)
```

This means a repo-level secret is automatically available to every job in every environment, without duplication. A per-environment secret is only visible to jobs running inside that specific environment.

---

## 2. The Build-Time vs Deploy-Time Distinction

The nswebsite pipeline has one build and three deployments. Understanding when each secret is read is critical to placing it correctly.

```
┌─────────────────────────────────────────────────────────────────────┐
│  BUILD JOB  (runs in GitHub env: dev)                               │
│                                                                      │
│  Can read: dev env secrets + repo-level secrets                     │
│  Cannot read: staging env secrets, production env secrets            │
│                                                                      │
│  Produces: one static artifact (HTML + JS + _redirects)             │
│  NEXT_PUBLIC_* values are compiled as string literals into files    │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ same artifact
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   DEPLOY-DEV          DEPLOY-STAGE     DEPLOY-PROD
   (env: dev)          (env: staging)   (env: production)
   reads dev secrets   reads staging    reads production
   inject dev R2 URL   inject stage     inject prod
   inject dev Turnstile inject stage    inject prod
                        Turnstile       Turnstile
```

**Rule**: Any value that needs to be in the compiled artifact must be readable by the BUILD job — meaning it must be either in the `dev` environment or at repo level. Putting a `NEXT_PUBLIC_*` secret only in `staging` or `production` environment does nothing — the build never runs there, so the value is never baked in.

---

## 3. nswebsite — Current State vs Target State

### 3.1 Repository-Level Secrets

#### Current (audited 2026-06-04)

| Secret | Purpose | Status |
|---|---|---|
| `GDRIVE_CLIENT_ID` | Google Drive auth | ✅ Correct — same Drive for all envs |
| `GDRIVE_PRIVATE_KEY` | Google Drive auth | ✅ Correct |
| `GDRIVE_PRIVATE_KEY_ID` | Google Drive auth | ✅ Correct |
| `GDRIVE_PROJECT_ID` | Google Drive auth | ✅ Correct |
| `GDRIVE_ROOT_FOLDER_ID` | Root folder for rclone sync | ✅ Correct |
| `GDRIVE_SERVICE_ACCOUNT_EMAIL` | Google Drive auth | ✅ Correct |
| `GOOGLE_CREDENTIALS_JSON` | Google Sheets API auth | ✅ Correct — same service account |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google Sheets auth | ✅ Correct |
| `GOOGLE_SHEET_ID` | Which Sheet to fetch content from | ✅ Correct — same sheet |
| `NEXT_PUBLIC_EMAIL_WORKER_URL` | Generic worker fallback (*.pages.dev) | ⚠️ Also in dev env (duplicate) — value may be missing `https://` |
| `CLOUDFLARE_ACCOUNT_ID` | CF account | ⚠️ Stale — shadowed by per-env secrets |
| `CLOUDFLARE_API_TOKEN` | CF API token | ⚠️ Stale — shadowed by per-env secrets |
| `CLOUDFLARE_PROJECT_NAME` | Pages project name | ⚠️ Stale — shadowed (and wrong, since it differs per env) |
| `NEXT_PUBLIC_R2_BASE_URL` | R2 public URL | ⚠️ Stale — shadowed by per-env secrets |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key | ⚠️ Stale — shadowed by per-env secrets |
| `R2_ACCESS_KEY_ID` | R2 credentials | ⚠️ Stale — shadowed by per-env secrets |
| `R2_ACCOUNT_ID` | R2 credentials | ⚠️ Stale — shadowed by per-env secrets |
| `R2_BUCKET_NAME` | R2 bucket name | ⚠️ Stale — shadowed by per-env secrets |
| `R2_SECRET_ACCESS_KEY` | R2 credentials | ⚠️ Stale — shadowed by per-env secrets |

#### Target (what it should be)

| Secret | Value | Why here |
|---|---|---|
| `GDRIVE_CLIENT_ID` | _(unchanged)_ | Same Drive account for all envs |
| `GDRIVE_PRIVATE_KEY` | _(unchanged)_ | ↑ |
| `GDRIVE_PRIVATE_KEY_ID` | _(unchanged)_ | ↑ |
| `GDRIVE_PROJECT_ID` | _(unchanged)_ | ↑ |
| `GDRIVE_ROOT_FOLDER_ID` | _(unchanged)_ | ↑ |
| `GDRIVE_SERVICE_ACCOUNT_EMAIL` | _(unchanged)_ | ↑ |
| `GOOGLE_CREDENTIALS_JSON` | _(unchanged)_ | Same service account |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | _(unchanged)_ | ↑ |
| `GOOGLE_SHEET_ID` | _(unchanged)_ | Same sheet for all envs |
| `NEXT_PUBLIC_EMAIL_WORKER_URL` | `https://email-worker-dev.emailapi-nsengineering.workers.dev` | Fallback for *.pages.dev — same URL always |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_DEV` | `https://email-worker-dev.emailapi-nsengineering.workers.dev` | Baked into artifact at build time — build runs in dev env but all 4 must be accessible |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` | `https://email-worker-stage.emailapi-nsengineering.workers.dev` | ↑ |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` | `https://email-worker-prod.emailapi-nsengineering.workers.dev` | ↑ |

**Delete from repo level** (all shadowed/stale):
`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_PROJECT_NAME`,
`NEXT_PUBLIC_R2_BASE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
`R2_ACCESS_KEY_ID`, `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_SECRET_ACCESS_KEY`

---

### 3.2 `dev` GitHub Environment

Used by: `sync-assets` (rclone), `build` (Next.js), `commit-csv`, `deploy-dev` (wrangler)

#### Current

| Secret | Purpose | Status |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler auth for deploy-dev | ✅ Correct |
| `CLOUDFLARE_ACCOUNT_ID` | Wrangler account for deploy-dev | ✅ Correct |
| `CLOUDFLARE_PROJECT_NAME` | `nsengineering-dev` | ✅ Correct |
| `NEXT_PUBLIC_R2_BASE_URL` | Dev R2 public URL (injected at deploy) | ✅ Correct |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Dev Turnstile site key (injected at deploy) | ✅ Correct |
| `R2_ACCESS_KEY_ID` | Dev R2 creds for rclone sync | ✅ Correct |
| `R2_ACCOUNT_ID` | Dev R2 creds | ✅ Correct |
| `R2_BUCKET_NAME` | `nswebsite-dev` | ✅ Correct |
| `R2_SECRET_ACCESS_KEY` | Dev R2 creds | ✅ Correct |
| `NEXT_PUBLIC_EMAIL_WORKER_URL` | ⚠️ Duplicate of repo level — remove from env |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_DEV` | ⚠️ Move to repo level — remove from env |

#### Target

Remove: `NEXT_PUBLIC_EMAIL_WORKER_URL`, `NEXT_PUBLIC_EMAIL_WORKER_URL_DEV`
(both moving to repo level — build will read them from there)

Everything else: unchanged.

---

### 3.3 `staging` GitHub Environment

Used by: `sync-assets-stage` (rclone promotion), `deploy-stage` (wrangler inject + deploy)

#### Current

| Secret | Purpose | Status |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler auth for deploy-stage | ✅ Correct |
| `CLOUDFLARE_ACCOUNT_ID` | Wrangler account | ✅ Correct |
| `CLOUDFLARE_PROJECT_NAME` | `nsengineering-stage` | ✅ Correct |
| `NEXT_PUBLIC_R2_BASE_URL` | Stage R2 URL (injected at stage deploy) | ✅ Correct |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Stage Turnstile site key (injected at stage deploy) | ✅ Correct |
| `R2_ACCESS_KEY_ID` | Stage R2 creds | ✅ Correct |
| `R2_ACCOUNT_ID` | Stage R2 creds | ✅ Correct |
| `R2_BUCKET_NAME` | `nswebsite-stage` | ✅ Correct |
| `R2_SECRET_ACCESS_KEY` | Stage R2 creds | ✅ Correct |
| `DEV_R2_ACCESS_KEY_ID` | Dev R2 creds (source for promotion) | ✅ Correct |
| `DEV_R2_ACCOUNT_ID` | Dev R2 creds | ✅ Correct |
| `DEV_R2_BUCKET_NAME` | `nswebsite-dev` | ✅ Correct |
| `DEV_R2_SECRET_ACCESS_KEY` | Dev R2 creds | ✅ Correct |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` | ❌ Wrong place — build can't see staging env secrets |

#### Target

Remove: `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` (moving to repo level)

Everything else: unchanged.

---

### 3.4 `production` GitHub Environment

Used by: `sync-assets-prod` (rclone promotion), `deploy-prod` (wrangler inject + deploy)

#### Current

| Secret | Purpose | Status |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler auth for deploy-prod | ✅ Correct |
| `CLOUDFLARE_ACCOUNT_ID` | Wrangler account | ✅ Correct |
| `CLOUDFLARE_PROJECT_NAME` | `nsengineering-prod` | ✅ Correct |
| `NEXT_PUBLIC_R2_BASE_URL` | Prod R2 URL (injected at prod deploy) | ✅ Correct |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Prod Turnstile site key (injected at prod deploy) | ✅ Correct |
| `R2_ACCESS_KEY_ID` | Prod R2 creds | ✅ Correct |
| `R2_ACCOUNT_ID` | Prod R2 creds | ✅ Correct |
| `R2_BUCKET_NAME` | `nswebsite-prod` | ✅ Correct |
| `R2_SECRET_ACCESS_KEY` | Prod R2 creds | ✅ Correct |
| `STAGE_R2_ACCESS_KEY_ID` | Stage R2 creds (source for promotion) | ✅ Correct |
| `STAGE_R2_ACCOUNT_ID` | Stage R2 creds | ✅ Correct |
| `STAGE_R2_BUCKET_NAME` | `nswebsite-stage` | ✅ Correct |
| `STAGE_R2_SECRET_ACCESS_KEY` | Stage R2 creds | ✅ Correct |
| `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` | ❌ Wrong place — build can't see production env secrets |

#### Target

Remove: `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` (moving to repo level)

Everything else: unchanged.

---

## 4. email-worker — Current State vs Target State

The email-worker is simpler — it has no build artifact, no placeholder injection, and no "same value across envs" problem. Every secret is genuinely different per environment (different Resend keys, different recipient emails, different Turnstile secret keys).

The only exception is `CLOUDFLARE_ACCOUNT_ID`, which is the same account across all three environments.

### 4.1 Repository Level

#### Current
Empty — nothing at repo level.

#### Target
| Secret | Value |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | `cfd7fe0fcd61e4435ea8dd698e6caa81` |

Move here from all three environments. The workflow reads it in every deploy job, so repo level makes it available everywhere without duplication.

---

### 4.2 `dev` Environment

#### Current & Target

| Secret | Purpose | Status |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy token | ✅ Keep per-env (may differ) |
| `CLOUDFLARE_ACCOUNT_ID` | CF account | ⚠️ Move to repo level |
| `RESEND_API_KEY_DEV` | Resend API key for dev emails | ✅ Correct — dev key |
| `TURNSTILE_SECRET_KEY_DEV` | Turnstile server-side secret for dev | ✅ Correct |
| `QUOTATION_EMAIL_DEV` | Where RFQ emails go in dev | ✅ Correct — test inbox |
| `CAREERS_EMAIL_DEV` | Where job applications go in dev | ✅ Correct — test inbox |
| `SUPPORT_EMAIL_DEV` | Where support emails go in dev | ✅ Correct — test inbox |

---

### 4.3 `staging` Environment

#### Current & Target

| Secret | Purpose | Status |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy token | ✅ Keep per-env |
| `CLOUDFLARE_ACCOUNT_ID` | CF account | ⚠️ Move to repo level |
| `RESEND_API_KEY_STAGE` | Resend API key for stage | ✅ Correct |
| `TURNSTILE_SECRET_KEY_STAGE` | Turnstile secret for stage | ✅ Correct |
| `QUOTATION_EMAIL_STAGE` | RFQ recipient for stage | ✅ Correct — test inbox |
| `CAREERS_EMAIL_STAGE` | Careers recipient for stage | ✅ Correct — test inbox |
| `SUPPORT_EMAIL_STAGE` | Support recipient for stage | ✅ Correct — test inbox |

---

### 4.4 `production` Environment

#### Current & Target

| Secret | Purpose | Status |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy token | ✅ Keep per-env |
| `CLOUDFLARE_ACCOUNT_ID` | CF account | ⚠️ Move to repo level |
| `RESEND_API_KEY_PROD` | Resend API key for prod | ✅ Correct |
| `TURNSTILE_SECRET_KEY_PROD` | Turnstile secret for prod | ✅ Correct |
| `QUOTATION_EMAIL_PROD` | `info@nsengineering.com.np` | ✅ Correct |
| `CAREERS_EMAIL_PROD` | `hr@nsengineering.com.np` (confirm) | ✅ Correct |
| `SUPPORT_EMAIL_PROD` | `support@nsengineering.com.np` (confirm) | ✅ Correct |

---

## 5. Why Email Worker URLs Belong at Repo Level

This is the most important non-obvious decision in this document.

The `emailService.ts` runtime logic:

```typescript
const getWorkerUrl = (): string => {
  const hostname = window.location.hostname;

  if (hostname === 'dev.nsengineering.com.np')
    return process.env.NEXT_PUBLIC_EMAIL_WORKER_URL_DEV
        || 'https://email-worker-dev.emailapi-nsengineering.workers.dev';

  if (hostname === 'stage.nsengineering.com.np')
    return process.env.NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE
        || 'https://email-worker-stage.emailapi-nsengineering.workers.dev';

  if (hostname === 'nsengineering.com.np' || hostname === 'www.nsengineering.com.np')
    return process.env.NEXT_PUBLIC_EMAIL_WORKER_URL_PROD
        || 'https://email-worker-prod.emailapi-nsengineering.workers.dev';

  return process.env.NEXT_PUBLIC_EMAIL_WORKER_URL; // *.pages.dev fallback
};
```

All four URLs are compiled into the single artifact. The same file is served to users on `dev.nsengineering.com.np`, `stage.nsengineering.com.np`, and `nsengineering.com.np`. At runtime, the browser picks which URL to call based on the current hostname.

This means **all four values must be baked into the artifact at build time**, which means they must be readable by the build job running in the `dev` environment.

- `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` in the `staging` environment: invisible to build ❌
- `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` in the `production` environment: invisible to build ❌
- All four at **repo level**: visible to build ✓, visible to all environments ✓

The values are the same stable URLs that don't change between environments — only the hostname routing at runtime differs. Repo level is both correct and simpler.

**Critical: always include `https://`**

```javascript
fetch('email-worker-dev.emailapi-nsengineering.workers.dev')
// ↑ treated as relative path → https://dev.nsengineering.com.np/contact/email-worker-dev...

fetch('https://email-worker-dev.emailapi-nsengineering.workers.dev')
// ↑ correct absolute URL
```

If the secret value is a non-empty string without `https://`, the `||` fallback is bypassed and `fetch()` builds a broken relative URL.

---

## 6. Secrets That Change vs Secrets That Stay

### When do secrets need updating?

| Secret | Update when |
|---|---|
| `NEXT_PUBLIC_EMAIL_WORKER_URL_*` | Worker is renamed or moved to different subdomain |
| `NEXT_PUBLIC_R2_BASE_URL` (per env) | R2 bucket is replaced or custom domain added |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (per env) | Turnstile app is regenerated / rotated |
| `RESEND_API_KEY_*` | Resend key is rotated or account changes |
| `TURNSTILE_SECRET_KEY_*` | Turnstile secret is rotated (do regularly) |
| `QUOTATION/CAREERS/SUPPORT_EMAIL_*` | Recipient email addresses change |
| `R2_ACCESS_KEY_ID/SECRET` (per env) | R2 API token is rotated |
| `CLOUDFLARE_API_TOKEN` | CF token is rotated |
| `GDRIVE_*` / `GOOGLE_*` | Service account credentials rotated |

### Secrets that should never need to change

| Secret | Why stable |
|---|---|
| `GOOGLE_SHEET_ID` | Same sheet permanently |
| `GDRIVE_ROOT_FOLDER_ID` | Same Drive folder permanently |
| `R2_BUCKET_NAME` (per env) | Bucket names are permanent |
| `CLOUDFLARE_ACCOUNT_ID` | Account never changes |
| `CLOUDFLARE_PROJECT_NAME` (per env) | Pages project names are permanent |

---

## 7. Complete Change Checklist

### nswebsite repo — GitHub Settings → Secrets and variables → Actions

**Add/update at repo level:**
- [ ] `NEXT_PUBLIC_EMAIL_WORKER_URL` → `https://email-worker-dev.emailapi-nsengineering.workers.dev`
- [ ] `NEXT_PUBLIC_EMAIL_WORKER_URL_DEV` → `https://email-worker-dev.emailapi-nsengineering.workers.dev` *(add new)*
- [ ] `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` → `https://email-worker-stage.emailapi-nsengineering.workers.dev` *(add new)*
- [ ] `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` → `https://email-worker-prod.emailapi-nsengineering.workers.dev` *(add new)*

**Delete from repo level** (stale, shadowed by per-env):
- [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] `CLOUDFLARE_API_TOKEN`
- [ ] `CLOUDFLARE_PROJECT_NAME`
- [ ] `NEXT_PUBLIC_R2_BASE_URL`
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- [ ] `R2_ACCESS_KEY_ID`
- [ ] `R2_ACCOUNT_ID`
- [ ] `R2_BUCKET_NAME`
- [ ] `R2_SECRET_ACCESS_KEY`

**Delete from `dev` environment:**
- [ ] `NEXT_PUBLIC_EMAIL_WORKER_URL` *(moving to repo level)*
- [ ] `NEXT_PUBLIC_EMAIL_WORKER_URL_DEV` *(moving to repo level)*

**Delete from `staging` environment:**
- [ ] `NEXT_PUBLIC_EMAIL_WORKER_URL_STAGE` *(moving to repo level)*

**Delete from `production` environment:**
- [ ] `NEXT_PUBLIC_EMAIL_WORKER_URL_PROD` *(moving to repo level)*

---

### email-worker repo — GitHub Settings → Secrets and variables → Actions

**Add at repo level:**
- [ ] `CLOUDFLARE_ACCOUNT_ID` → `cfd7fe0fcd61e4435ea8dd698e6caa81` *(add new)*

**Delete from `dev` environment:**
- [ ] `CLOUDFLARE_ACCOUNT_ID` *(moving to repo level)*

**Delete from `staging` environment:**
- [ ] `CLOUDFLARE_ACCOUNT_ID` *(moving to repo level)*

**Delete from `production` environment:**
- [ ] `CLOUDFLARE_ACCOUNT_ID` *(moving to repo level)*

---

## 8. After Making Changes

Since email worker URLs are `NEXT_PUBLIC_*` values baked at build time, updating the repo-level secrets does nothing until the pipeline runs again. After making all the secret changes:

1. Trigger `deploy-dev.yml` from `feature/cloudflareMigration`
2. The build will read all four worker URLs from repo-level secrets
3. They get baked into the artifact with correct `https://` values
4. All three deployments get the same correct artifact
5. Runtime hostname routing picks the right worker URL for each domain

**Verification:**
```bash
# Check the deployed HTML has no placeholder or relative URL
curl -s https://dev.nsengineering.com.np | grep -o 'email-worker[^"]*' | head -5
# Should show full https:// URLs, not relative paths
```

---

*Document authored: 2026-06-04*  
*Branch: `feature/SecretsManagement`*  
*Related: `docs/DEPLOYMENT_AUDIT_2026-06-03.md`, `docs/CHANGES_2026-06-03.md`*
