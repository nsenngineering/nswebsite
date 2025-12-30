# Phase 4 & 5 Deployment Checklist

**Quick Reference for Deployment**

---

## 📋 Pre-Deployment

- [x] Phase 1-3 completed
- [x] Worker created and tested manually
- [x] Resend API key configured
- [x] Frontend code written
- [x] Worker code written
- [x] Environment variables configured locally
- [x] Documentation created

---

## 🚀 Deployment Steps

### 1. Configure Turnstile Secret in Worker

```bash
cd email-worker

# Add Turnstile secret key
wrangler secret put TURNSTILE_SECRET_KEY
# When prompted, paste: 0x4AAAAAACJhuYuVPuEqFEz99eH-c6-6Wgc
```

- [ ] Turnstile secret configured

---

### 2. Deploy Cloudflare Worker

```bash
# Still in email-worker directory

# Replace src/index.js with content from:
# → cloudflare-worker-email.js

wrangler deploy
```

- [ ] Worker deployed successfully
- [ ] No errors in deployment

---

### 3. Test Worker Directly

```bash
curl -X POST https://email-worker.emailapi-nsengineering.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://nsengineering.com.np" \
  -d '{
    "emailType": "quotation",
    "data": {
      "serviceType": ["pile-testing"],
      "projectName": "Test Project",
      "location": "Kathmandu",
      "timeline": "urgent",
      "description": "Test",
      "fullName": "Test User",
      "email": "test@example.com",
      "phone": "+977-9800000000",
      "company": "Test Co",
      "submittedAt": "2024-12-29T10:00:00.000Z"
    }
  }'
```

- [ ] Returns success response
- [ ] Email received at info@nsengineering.com.np
- [ ] Email formatting looks good

---

### 4. Configure GitHub Secrets

**GitHub → Settings → Secrets → Actions**

Add secrets:

**Secret 1:**
- **Name**: `NEXT_PUBLIC_EMAIL_WORKER_URL`
- **Value**: `https://email-worker.emailapi-nsengineering.workers.dev`

**Secret 2:**
- **Name**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- **Value**: `0x4AAAAAACJhuX2d6hoR6PuP`

- [ ] Secrets added to GitHub

---

### 5. Deploy Frontend

```bash
git add .
git commit -m "Phase 4 & 5: Email integration with Turnstile security"
git push origin cloudflare
```

- [ ] Code pushed to repository
- [ ] GitHub Actions running
- [ ] Deployment successful

---

### 6. Test Production

**Visit**: https://nsengineering.com.np/contact

Test Flow:
1. [ ] Page loads without errors
2. [ ] Select services (Step 1)
3. [ ] Click "Next"
4. [ ] Fill project details (Step 2)
5. [ ] Click "Next"
6. [ ] Fill contact info (Step 3)
7. [ ] **Complete Turnstile verification** (security checkbox)
8. [ ] Click "Submit Request"

Expected Results:
- [ ] Turnstile widget appears in Step 3
- [ ] Turnstile verification completes successfully
- [ ] Loading spinner appears during submission
- [ ] Success toast notification shows
- [ ] Success screen appears
- [ ] Email arrives at info@nsengineering.com.np
- [ ] Email is properly formatted
- [ ] All form data is in email
- [ ] No errors in browser console

---

### 7. Test Error Handling

Test with invalid data:
- [ ] Submit with empty fields → Error toast shows
- [ ] Submit with invalid email → Error toast shows
- [ ] Submit without Turnstile → Error message shows
- [ ] Network error simulation → Error message shows

---

### 8. Test CORS (Optional)

From browser console on different domain:
```javascript
fetch('https://email-worker.emailapi-nsengineering.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emailType: 'quotation',
    data: { /* ... */ }
  })
})
```

- [ ] Should fail (CORS blocked) ✅ This is correct!

---

## ✅ Final Verification

- [ ] Quotation form works end-to-end
- [ ] Emails arrive reliably
- [ ] Email templates look professional
- [ ] Toast notifications work
- [ ] Loading states work
- [ ] Error handling works
- [ ] CORS protection active
- [ ] No console errors
- [ ] No secrets exposed in frontend

---

## 📊 Monitoring

After deployment, monitor:

### Cloudflare Dashboard
- [ ] Check Worker metrics
- [ ] Monitor request count
- [ ] Check error rate

### Email Delivery
- [ ] Confirm emails arriving
- [ ] Check spam folder (should not be there)
- [ ] Verify formatting in email client

### Free Tier Usage
- [ ] Worker requests: < 100,000/day ✅
- [ ] Resend emails: < 100/day, < 3,000/month ✅

---

## 🐛 If Something Goes Wrong

### Email not sending
1. Check browser console
2. Check Network tab
3. Check Worker logs: `wrangler tail`
4. Test Worker directly with curl

### CORS error
1. Verify domain in Worker allowedOrigins
2. Redeploy Worker
3. Hard refresh browser (Ctrl+F5)

### Toast not showing
1. Check ToastContainer is rendered
2. Check z-index conflicts
3. Check browser console

---

## 📚 Documentation

- Full Guide: `docs/technical/PHASE_4_5_DEPLOYMENT_GUIDE.md`
- Summary: `PHASE_4_5_IMPLEMENTATION_SUMMARY.md`
- Email Details: `docs/technical/email_implementation.md`

---

## ✨ You're Done!

When all checkboxes are ✅:
- Email integration is live
- Users can request quotations
- System is secure and scalable
- Ready for future enhancements

🎉 **Congratulations!**
