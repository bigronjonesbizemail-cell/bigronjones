# 🚀 RAILWAY CRON SETUP - QUICK REFERENCE

**Your Production Backend URL:**

```
https://bigronjones-api-production-7563.up.railway.app
```

---

## 📋 QUICK SETUP (Copy-Paste Ready)

### STEP 1: Generate CRON_SECRET

```bash
openssl rand -hex 32
# Save the output — you'll need it below
```

### STEP 2: Set Railway Environment Variable

Add to your Railway backend service environment:

```
CRON_SECRET=<paste-output-from-step-1>
```

---

## 🔧 RAILWAY CRON JOBS TO CREATE

### Cron Job 1️⃣: Email Scheduler ⭐ REQUIRED

**This sends trial emails automatically**

| Setting         | Value                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**        | Email Scheduler - Daily Trial Emails                                                                                                                    |
| **Schedule**    | `0 6 * * *`                                                                                                                                             |
| **Command**     | `curl --fail --silent --show-error "https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=$CRON_SECRET" --max-time 30` |
| **Environment** | Link to backend service                                                                                                                                 |

**What it does:**

- Sends trial day 1, 2, 4, 6, 7 emails
- Prevents duplicates
- Personalized with recovery metrics
- Runs daily at **6 AM UTC**

---

### Cron Job 2️⃣: Blog Generator (Optional)

**This generates AI blogs daily**

| Setting         | Value                                                                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**        | Blog Generator - Daily AI Posts                                                                                                                   |
| **Schedule**    | `0 7 * * *`                                                                                                                                       |
| **Command**     | `curl --fail --silent --show-error "https://bigronjones-api-production-7563.up.railway.app/api/generate-blogs?secret=$CRON_SECRET" --max-time 60` |
| **Environment** | Link to backend service                                                                                                                           |

**What it does:**

- Generates 3 AI blogs daily
- Uses Gemini AI (Ron's voice)
- Adds cover images
- Stores to Supabase + in-memory
- Runs daily at **7 AM UTC**

**Requires env vars:**

- `GOOGLE_API_KEY`
- `ANTHROPIC_API_KEY` (optional)

---

### Cron Job 3️⃣: Lead Nurture Emails (Optional)

**This sends marketing emails to leads**

| Setting         | Value                                                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**        | Send Sequence - Daily Lead Emails                                                                                                                                    |
| **Schedule**    | `0 7 * * *`                                                                                                                                                          |
| **Command**     | `curl --fail --silent --show-error -H "Authorization: Bearer $CRON_SECRET" "https://bigronjones-api-production-7563.up.railway.app/api/send-sequence" --max-time 30` |
| **Environment** | Link to backend service                                                                                                                                              |

**What it does:**

- Sends next email in nurture sequence to leads
- Max 100 leads per run
- Cadence: 1 day (days 1-3), 2 days (days 4-7), 3 days (after)
- Runs daily at **7 AM UTC**

---

## 📡 TESTING THE ENDPOINTS

### Test 1: Email Scheduler

```bash
curl "https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=YOUR_CRON_SECRET"
```

✅ Success Response:

```json
{
  "emailsSent": 5,
  "skipped": 2,
  "errors": 0,
  "details": [...]
}
```

### Test 2: Blog Generator

```bash
curl "https://bigronjones-api-production-7563.up.railway.app/api/generate-blogs?secret=YOUR_CRON_SECRET&manual=true"
```

✅ Success Response:

```json
{
  "success": true,
  "blogs": [
    {
      "title": "...",
      "slug": "...",
      "publishedAt": "..."
    }
  ]
}
```

### Test 3: Send Sequence

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://bigronjones-api-production-7563.up.railway.app/api/send-sequence"
```

✅ Success Response:

```json
{
  "sent": 10,
  "skipped": 3,
  "failed": 0
}
```

---

## 🔑 REQUIRED ENVIRONMENT VARIABLES

Set these on your Railway backend service:

```
# Required for all crons
CRON_SECRET=<your-generated-secret>

# Required for email scheduler
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@your-domain.com

# Required for blog generator
GOOGLE_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-... (optional)
UNSPLASH_ACCESS_KEY=... (optional)
PEXELS_API_KEY=... (optional)

# Required for webhooks (set on both backend + Calendly/Stripe)
CALENDLY_WEBHOOK_SECRET=<from-calendly>
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe dashboard)
STRIPE_SECRET_KEY=sk_live_...
```

---

## 🎯 ENDPOINT SUMMARY TABLE

| Endpoint                    | Method   | Auth         | Schedule  | Purpose             |
| --------------------------- | -------- | ------------ | --------- | ------------------- |
| `/api/cron/email-scheduler` | POST/GET | `?secret=`   | 6 AM UTC  | Trial emails        |
| `/api/send-sequence`        | GET      | Bearer token | 7 AM UTC  | Lead nurture        |
| `/api/generate-blogs`       | GET/POST | `?secret=`   | 7 AM UTC  | AI blogs            |
| `/api/webhooks/calendly`    | POST     | HMAC         | Real-time | Booking → Trial     |
| `/api/webhooks/stripe`      | POST     | HMAC         | Real-time | Payment confirm     |
| `/api/blogs`                | GET      | None         | —         | Read blogs (public) |
| `/api/trial-feedback`       | POST/GET | JWT          | —         | Trial check-in      |
| `/api/day-complete`         | POST     | JWT          | —         | Log activity        |

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Generate CRON_SECRET: `openssl rand -hex 32`
- [ ] Add CRON_SECRET to Railway backend env
- [ ] Verify RESEND_API_KEY is set
- [ ] Verify GOOGLE_API_KEY is set
- [ ] Test email scheduler endpoint manually
- [ ] Test blog generator endpoint manually
- [ ] Test send sequence endpoint manually
- [ ] Create Railway Cron Job 1: Email Scheduler (required)
- [ ] Create Railway Cron Job 2: Blog Generator (optional)
- [ ] Create Railway Cron Job 3: Send Sequence (optional)
- [ ] Run each cron job manually to verify (click "Run Now" on Railway)
- [ ] Check Railway logs for 200 responses
- [ ] Wait 24 hours and verify jobs ran automatically
- [ ] Check Resend dashboard for sent emails
- [ ] Check Supabase for new blogs in `blogs` table

---

## 🚨 TROUBLESHOOTING

| Issue                       | Solution                                                               |
| --------------------------- | ---------------------------------------------------------------------- |
| 401 Unauthorized            | Check `CRON_SECRET` is set on Railway + URL has `?secret=$CRON_SECRET` |
| 500 Internal Error          | Check all required env vars are set + no typos                         |
| Emails not sending          | Verify `RESEND_API_KEY` + check Resend dashboard for failures          |
| Blogs not generating        | Verify `GOOGLE_API_KEY` + check Railway logs for API errors            |
| Cron job not running        | Check schedule (cron expression) + verify Railway service is running   |
| No emails sent (but 200 OK) | Check if trials exist in Supabase with `trial_start_date` set          |

---

## 📚 Full Documentation

See `API_ENDPOINTS_ANALYSIS.md` for:

- Complete endpoint details
- Request/response examples
- Authentication specifics
- Security notes
- Setup instructions for webhooks

---

**Generated:** May 30, 2026  
**For:** Railway deployment with Supabase + Resend + Stripe + Calendly
