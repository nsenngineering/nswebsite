# Plan: Using R2 Bucket Assets in Cloudflare Pages Deployment (dev workflow)

## Objective
Ensure that after syncing assets from Google Drive to Cloudflare R2 bucket (using the provided R2 secrets in the dev environment), the deployed Cloudflare Pages project (CLOUDFLARE_PROJECT_NAME) uses the R2 bucket assets for all live URLs.

---

## 1. Prerequisites
- **Secrets in GitHub Actions:**
  - R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_PROJECT_NAME are set in the dev environment secrets.
  - Other secrets (e.g., Google credentials) are in repo secrets.
- **R2 Sync Step:**
  - Workflow already syncs Google Drive assets to the R2 bucket before the build/deploy step.

---

## 2. Required Changes

### a. Environment Variables for Build
- Set `NEXT_PUBLIC_R2_BASE_URL` in the build environment to the public R2 bucket URL (e.g., `https://pub-<account>.r2.dev/<bucket>`).
- Ensure all asset references in the build use this URL prefix.

### b. Build Process
- The build step (npm run build:cloud or similar) must:
  - Detect R2 mode (via `NEXT_PUBLIC_R2_BASE_URL`)
  - Generate all asset URLs (images, PDFs, etc.) using the R2 public URL
  - Output static files referencing R2 URLs (not local/public/)

### c. Deployment
- Deploy the statically built site (with R2 URLs) to the Cloudflare Pages project specified by CLOUDFLARE_PROJECT_NAME.
- No local/public asset uploads—only references to R2 CDN.

---

## 3. Workflow Steps (Text Diagram)

```
+-------------------+
| Google Drive      |
+-------------------+
         │
         ▼
+-------------------+
| GitHub Action:    |
| rclone sync       |
| (GDrive → R2)     |
+-------------------+
         │
         ▼
+-------------------+
| Set env:          |
| NEXT_PUBLIC_R2_   |
| BASE_URL          |
+-------------------+
         │
         ▼
+-------------------+
| npm run build:cloud|
| (generates static |
| site w/ R2 URLs)  |
+-------------------+
         │
         ▼
+-------------------+
| Deploy to         |
| Cloudflare Pages  |
| (CLOUDFLARE_      |
| PROJECT_NAME)     |
+-------------------+
         │
         ▼
+-------------------+
| Live URLs use R2  |
| CDN for assets    |
+-------------------+
```

---

## 4. Validation
- After deployment, all asset URLs (images, PDFs, etc.) on the live site should point to the R2 CDN domain, not to `/public/` or relative paths.
- Test by visiting the deployed site and inspecting asset URLs.

---

## 5. Rollback/Recovery
- If R2 is unavailable, fallback to local/public assets (if supported by the build system).
- Keep previous deployment artifacts for quick rollback.

---

## 6. Implementation Steps (after approval)
1. Update GitHub Actions workflow to set `NEXT_PUBLIC_R2_BASE_URL` from secrets before build.
2. Ensure build uses R2 URLs for all assets.
3. Deploy to Cloudflare Pages as usual.
4. Validate live URLs.

---

**Please review and approve this plan. After approval, implementation will proceed.**
