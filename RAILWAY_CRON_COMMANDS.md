# Railway Cron Job Commands - Copy-Paste Ready

**Backend URL:** `https://bigronjones-api-production-7563.up.railway.app`

---

## 🔴 REQUIRED: Cron Job 1 - Email Scheduler

**Name on Railway:**

```
Email Scheduler - Daily Trial Emails
```

**Schedule (Cron Expression):**

```
0 6 * * *
```

**Command to paste into Railway:**

```bash
curl --fail --silent --show-error "https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=$CRON_SECRET" --max-time 30
```

**What gets sent:**

- DAY_1: Welcome email (immediately when user books)
- DAY_2: Education email (6 AM UTC on day 2)
- DAY_4: Reinforcement email (6 AM UTC on day 4)
- DAY_6: Push email (6 AM UTC on day 6)
- DAY_7: Conversion email (6 AM UTC on day 7)

**Env vars required on Railway:**

```
CRON_SECRET
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
```

---

## 🟡 OPTIONAL: Cron Job 2 - Blog Generator

**Name on Railway:**

```
Blog Generator - Daily AI Posts
```

**Schedule (Cron Expression):**

```
0 7 * * *
```

**Command to paste into Railway:**

```bash
curl --fail --silent --show-error "https://bigronjones-api-production-7563.up.railway.app/api/generate-blogs?secret=$CRON_SECRET" --max-time 60
```

**What gets generated:**

- 3 new AI blog posts daily
- Uses Google Gemini AI
- Written in "Ron's voice"
- Includes cover images
- Stored in Supabase + in-memory cache

**Env vars required on Railway:**

```
CRON_SECRET
GOOGLE_API_KEY
ANTHROPIC_API_KEY (optional fallback)
UNSPLASH_ACCESS_KEY (optional, for fresh stock photos)
PEXELS_API_KEY (optional, for fresh stock photos)
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

---

## 🟠 OPTIONAL: Cron Job 3 - Lead Nurture Sequence

**Name on Railway:**

```
Send Sequence - Daily Lead Emails
```

**Schedule (Cron Expression):**

```
0 7 * * *
```

**Command to paste into Railway:**

```bash
curl --fail --silent --show-error -H "Authorization: Bearer $CRON_SECRET" "https://bigronjones-api-production-7563.up.railway.app/api/send-sequence" --max-time 30
```

**What gets sent:**

- Next email in lead nurture sequence
- Up to 100 leads per run
- Cadence: 1 day for days 1-3, 2 days for days 4-7, 3 days after
- Email subject and body from `email_sequences` table

**Env vars required on Railway:**

```
CRON_SECRET
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
SITE_URL
```

---

## 🧪 Manual Testing Commands

**Test Email Scheduler:**

```bash
curl "https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=YOUR_CRON_SECRET"
```

**Test Blog Generator:**

```bash
curl "https://bigronjones-api-production-7563.up.railway.app/api/generate-blogs?secret=YOUR_CRON_SECRET&manual=true"
```

**Test Send Sequence:**

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://bigronjones-api-production-7563.up.railway.app/api/send-sequence"
```

All should return `200 OK` with JSON response.

---

## 📊 Expected Success Responses

### Email Scheduler Response:

```json
{
  "emailsSent": 5,
  "skipped": 2,
  "errors": 0,
  "details": [
    {
      "email": "user1@example.com",
      "status": "sent",
      "day": 2
    },
    {
      "email": "user2@example.com",
      "status": "already_sent",
      "day": 2
    }
  ]
}
```

### Blog Generator Response:

```json
{
  "success": true,
  "blogs": [
    {
      "title": "5 Recovery Techniques for Muscle Soreness",
      "subtitle": "Science-backed methods",
      "category": "Recovery",
      "tags": ["recovery", "soreness", "coaching"],
      "body": "...",
      "excerpt": "Learn the top 5 recovery techniques...",
      "slug": "5-recovery-techniques-muscle-soreness",
      "readingTime": "5 min read",
      "publishedAt": "2025-05-30T07:15:00Z",
      "byline": {
        "author": "Ron Jones",
        "photo": "/images/ron/mentality-portrait.jpg"
      }
    }
  ]
}
```

### Send Sequence Response:

```json
{
  "sent": 10,
  "skipped": 3,
  "failed": 0
}
```

---

## 🚨 Error Responses

### 401 Unauthorized:

```json
{
  "error": "Unauthorized"
}
```

**Fix:** Check `CRON_SECRET` is set on Railway + URL includes `?secret=$CRON_SECRET`

### 500 Internal Server Error:

```json
{
  "error": "Internal server error"
}
```

**Fix:** Check Railway logs for missing env vars or database connection errors

---

## ⏰ Scheduling Guide

| Cron Expression | Description      | Example          |
| --------------- | ---------------- | ---------------- |
| `0 6 * * *`     | 6 AM UTC daily   | Email scheduler  |
| `0 7 * * *`     | 7 AM UTC daily   | Blog generator   |
| `0 9 * * *`     | 9 AM UTC daily   | Alternative time |
| `0 */2 * * *`   | Every 2 hours    | For testing      |
| `*/15 * * * *`  | Every 15 minutes | For testing      |

---

## 📝 Railway Setup Steps

### 1. Create First Cron Job

1. Open Railway Dashboard
2. Select your project
3. Click **+ New** → **Cron Job**
4. Configure:
   - **Name:** `Email Scheduler - Daily Trial Emails`
   - **Schedule:** `0 6 * * *`
   - **Command:** (paste command from above)
5. **Environment Variables:** Select your backend service environment
6. Click **Create**

### 2. Create Second Cron Job (Optional)

1. Click **+ New** → **Cron Job**
2. Configure:
   - **Name:** `Blog Generator - Daily AI Posts`
   - **Schedule:** `0 7 * * *`
   - **Command:** (paste command from above)
3. **Environment Variables:** Select your backend service environment
4. Click **Create**

### 3. Create Third Cron Job (Optional)

1. Click **+ New** → **Cron Job**
2. Configure:
   - **Name:** `Send Sequence - Daily Lead Emails`
   - **Schedule:** `0 7 * * *`
   - **Command:** (paste command from above)
3. **Environment Variables:** Select your backend service environment
4. Click **Create**

### 4. Test Each Cron Job

1. Go to Cron Job details
2. Click **Run Now**
3. Check status in logs
4. Should see exit code `0` and curl output showing `200 OK`

---

## 🔐 CRON_SECRET Generation

```bash
# Generate 64-character hex token
openssl rand -hex 32

# Example output:
# 7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0

# Copy this value
# Paste it into Railway backend environment variable: CRON_SECRET
# Use in URLs: ?secret=7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

---

## 🔗 Related Endpoints (Not Cron Jobs)

These endpoints are triggered by user actions or webhooks, not cron:

| Endpoint                 | Trigger            | Purpose                                       |
| ------------------------ | ------------------ | --------------------------------------------- |
| `/api/webhooks/calendly` | Calendly booking   | Creates user, starts trial, sends day-1 email |
| `/api/webhooks/stripe`   | Stripe payment     | Marks user as paid                            |
| `/api/trial-feedback`    | User check-in      | Records daily feedback                        |
| `/api/day-complete`      | User completes day | Logs completion                               |
| `/api/blogs`             | Frontend GET       | Reads published blogs                         |
| `/api/login`             | User login         | Authenticates user                            |

---

## 📞 Support

If cron jobs aren't running:

1. **Check Railway logs:**
   - Dashboard → Cron Job → Logs tab
   - Look for exit code 0 (success) or 1 (failure)

2. **Manually test endpoint:**

   ```bash
   curl "https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=YOUR_SECRET"
   ```

3. **Verify env vars are set:**
   - Dashboard → Backend Service → Environment
   - All required vars should be present

4. **Check database:**
   - Supabase → users table should have trial_start_date
   - Supabase → email_logs table should show sent attempts
   - Supabase → blogs table should have new posts

---

**Generated:** May 30, 2026
