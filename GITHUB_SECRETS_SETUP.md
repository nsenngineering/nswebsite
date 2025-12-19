# GitHub Secrets Configuration Guide

**Project**: NS Engineering Website - rclone Media Sync
**Date**: 2024-12-19
**Purpose**: Configure GitHub Actions for automated Google Drive → R2 sync

---

## Required GitHub Secrets (15 total)

Add these secrets in: **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

---

## 1. Google Drive Service Account (6 secrets)

These values come from your `google-credentials.json` file (the service account that has access to Google Drive).

### GDRIVE_PROJECT_ID
```
From: google-credentials.json → "project_id"
Example: "ns-engineering-123456"
```

### GDRIVE_PRIVATE_KEY_ID
```
From: google-credentials.json → "private_key_id"
Example: "abc123def456ghi789..."
```

### GDRIVE_PRIVATE_KEY
```
From: google-credentials.json → "private_key"
IMPORTANT: Copy the ENTIRE key including:
  - "-----BEGIN PRIVATE KEY-----"
  - All the encoded content
  - "-----END PRIVATE KEY-----"
  - Keep the \n characters (they're literal backslash-n, not newlines)

Example:
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n...\n-----END PRIVATE KEY-----\n
```

### GDRIVE_SERVICE_ACCOUNT_EMAIL
```
From: google-credentials.json → "client_email"
Example: "ns-engineering@ns-engineering-123456.iam.gserviceaccount.com"
```

### GDRIVE_CLIENT_ID
```
From: google-credentials.json → "client_id"
Example: "123456789012345678901"
```

### GDRIVE_ROOT_FOLDER_ID
```
This is the Google Drive folder ID for your "content" folder.

How to get it:
1. Go to Google Drive
2. Navigate to your "content" folder (the one with projects/, hero/, team/, etc.)
3. Right-click the folder → Share → Copy link
4. Extract the ID from the URL:
   https://drive.google.com/drive/folders/THIS_IS_THE_FOLDER_ID

Example: "1AbC2DeF3GhI4JkL5MnO6PqR7StU8VwX"
```

---

## 2. Google Sheets Service Account (3 secrets)

### GOOGLE_SHEET_ID
```
Value: 1xwrA9RXDq77tCHkeeOGwmjMXYgcT07keR_0qRkBctRI
(This is your existing NS Engineering spreadsheet)
```

### GOOGLE_CREDENTIALS_JSON
```
Value: The ENTIRE contents of your google-credentials.json file

Copy the complete JSON object including the opening { and closing }

Example:
{
  "type": "service_account",
  "project_id": "ns-engineering-123456",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "ns-engineering@ns-engineering-123456.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Note**: If you're using the SAME service account for both Google Drive and Google Sheets (recommended), the values in GOOGLE_CREDENTIALS_JSON should match the Google Drive secrets above.

---

## 3. Cloudflare R2 (6 secrets)

### R2_ACCOUNT_ID
```
From: Cloudflare Dashboard → R2 → Overview
Example: "abc123def456ghi789"
```

### R2_ACCESS_KEY_ID
```
From: Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API Token
Example: "xyz789abc123def456ghi789"
```

### R2_SECRET_ACCESS_KEY
```
From: Same location as R2_ACCESS_KEY_ID
IMPORTANT: This is shown ONLY ONCE when you create the token. Save it immediately!
Example: "secret123key456secret789key012"
```

### R2_BUCKET_NAME
```
Value: ns-engineering-projects
(This is your R2 bucket name - must be created before workflow runs)
```

### NEXT_PUBLIC_R2_BASE_URL
```
From: Cloudflare Dashboard → R2 → Your bucket → Settings → Public R2.dev subdomain
Example: https://pub-abc123def456.r2.dev
```

**Additional Secret (Optional but Recommended)**:

### GOOGLE_SERVICE_ACCOUNT_EMAIL
```
Value: Same as GDRIVE_SERVICE_ACCOUNT_EMAIL
(Used by some scripts for logging/debugging)
```

---

## Quick Setup Checklist

### Before Adding Secrets

- [ ] Create Cloudflare R2 bucket: `ns-engineering-projects`
- [ ] Enable R2 public access (Settings → Public R2.dev subdomain)
- [ ] Generate R2 API tokens (Access Key ID + Secret Access Key)
- [ ] Ensure Google Drive service account has Viewer access to `content` folder
- [ ] Have `google-credentials.json` file ready

### Adding Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret** button
5. Add each secret one by one:
   - Name: Secret name (e.g., `GDRIVE_PROJECT_ID`)
   - Secret: The value from above
   - Click **Add secret**
6. Repeat for all 15 secrets

### After Adding Secrets

- [ ] Verify all 15 secrets are listed in GitHub Actions secrets
- [ ] No typos in secret names (they're case-sensitive!)
- [ ] Test with manual sync workflow (dry-run mode first)
- [ ] Push to `cloudflare` branch to trigger automatic sync

---

## Secret Summary Table

| Secret Name | Source | Required |
|-------------|--------|----------|
| `GDRIVE_PROJECT_ID` | google-credentials.json | Yes |
| `GDRIVE_PRIVATE_KEY_ID` | google-credentials.json | Yes |
| `GDRIVE_PRIVATE_KEY` | google-credentials.json | Yes |
| `GDRIVE_SERVICE_ACCOUNT_EMAIL` | google-credentials.json | Yes |
| `GDRIVE_CLIENT_ID` | google-credentials.json | Yes |
| `GDRIVE_ROOT_FOLDER_ID` | Google Drive folder URL | Yes |
| `GOOGLE_SHEET_ID` | Existing (see above) | Yes |
| `GOOGLE_CREDENTIALS_JSON` | google-credentials.json (full file) | Yes |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Same as GDRIVE_SERVICE_ACCOUNT_EMAIL | Optional |
| `R2_ACCOUNT_ID` | Cloudflare R2 Dashboard | Yes |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 API Tokens | Yes |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 API Tokens | Yes |
| `R2_BUCKET_NAME` | Fixed value: `ns-engineering-projects` | Yes |
| `NEXT_PUBLIC_R2_BASE_URL` | Cloudflare R2 bucket settings | Yes |

**Total Required**: 14 secrets (15 with optional GOOGLE_SERVICE_ACCOUNT_EMAIL)

---

## Testing Your Setup

### 1. Test Manual Sync (Dry Run)

1. Go to: **Actions** tab in GitHub repository
2. Select: **Manual R2 Sync** workflow
3. Click: **Run workflow** button
4. Choose: **dry_run: true**
5. Click: **Run workflow**
6. Monitor the logs - should show what WOULD be synced without actually syncing

### 2. Test Manual Sync (Real Sync)

If dry run looks good:

1. Same steps as above
2. Choose: **dry_run: false**
3. Click: **Run workflow**
4. Verify files appear in R2 bucket

### 3. Test Automatic Sync

```bash
# Make a small change and push to cloudflare branch
git add .
git commit -m "Test rclone workflow"
git push origin cloudflare
```

Check **Actions** tab - should see "Deploy to GitHub Pages" running with rclone sync.

---

## Troubleshooting

### "Folder not found" error

**Problem**: GDRIVE_ROOT_FOLDER_ID is incorrect or service account doesn't have access

**Fix**:
1. Verify folder ID from Google Drive URL
2. Share folder with service account email (Viewer access)
3. Update GDRIVE_ROOT_FOLDER_ID secret

### "Access denied" error

**Problem**: Service account doesn't have permission

**Fix**:
1. Go to Google Drive
2. Right-click "content" folder → Share
3. Add service account email with "Viewer" permission
4. Retry sync

### "Invalid credentials" error

**Problem**: Malformed JSON in GDRIVE_PRIVATE_KEY or GOOGLE_CREDENTIALS_JSON

**Fix**:
1. Re-copy from google-credentials.json carefully
2. For GDRIVE_PRIVATE_KEY, ensure \n characters are preserved (literal backslash-n)
3. For GOOGLE_CREDENTIALS_JSON, copy the entire JSON object
4. Update secrets
5. Retry sync

### "Bucket not found" error

**Problem**: R2_BUCKET_NAME doesn't match actual bucket name

**Fix**:
1. Verify bucket name in Cloudflare Dashboard
2. Should be: `ns-engineering-projects`
3. Update R2_BUCKET_NAME secret if different
4. Retry sync

---

## Security Notes

- **Never commit** these secrets to Git
- **Never share** these secrets publicly
- **Rotate regularly**: Change API tokens and service account keys quarterly
- **Minimum permissions**: Service accounts have read-only access to Google Drive/Sheets
- **R2 tokens**: Can be regenerated in Cloudflare Dashboard if compromised

---

## Support

If you encounter issues:

1. Check workflow logs in GitHub Actions
2. Review [rclone Sync Documentation](./docs/technical/RCLONE_SYNC.md)
3. Test with manual sync (dry-run mode)
4. Verify all secrets are correct (no typos, complete values)

---

**Version**: 1.0.0
**Last Updated**: 2024-12-19
**Status**: Ready for Setup ✅
