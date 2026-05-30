# Your Cron Endpoints - Production Ready

**Backend URL:** `https://bigronjones-39pm.onrender.com`  
**CRON_SECRET:** `789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5`

---

## 📋 ENDPOINT SUMMARY

| Purpose                 | Endpoint                    | Method   | Auth         |
| ----------------------- | --------------------------- | -------- | ------------ |
| **Blog Generation** ⭐  | `/api/generate-blogs`       | GET/POST | CRON_SECRET  |
| **Email Scheduling** ⭐ | `/api/cron/email-scheduler` | GET/POST | CRON_SECRET  |
| Lead Nurture Emails     | `/api/send-sequence`        | GET      | Bearer token |

---

## 🎯 ANSWER TO YOUR REQUEST

### BLOG CRON ENDPOINT:

```
https://bigronjones-39pm.onrender.com/api/generate-blogs?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5
```

### EMAIL CRON ENDPOINT:

```
https://bigronjones-39pm.onrender.com/api/cron/email-scheduler?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5
```

### HTTP METHOD:

```
GET or POST (both supported)
```

### AUTHENTICATION:

```
Query Parameter: ?secret=<CRON_SECRET>

Alternative (Bearer token):
Header: Authorization: Bearer 789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5

Your CRON_SECRET from .env:
789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5
```

---

## CRON-JOB.ORG CONFIGURATION

### Job 1: Daily AI Blog Generation

**For cron-job.org:**

| Setting               | Value                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **URL**               | `https://bigronjones-39pm.onrender.com/api/generate-blogs?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5` |
| **Method**            | `GET`                                                                                                                              |
| **Schedule**          | `0 7 * * *` (7 AM UTC daily)                                                                                                       |
| **Timeout**           | `60` seconds                                                                                                                       |
| **Headers**           | None required                                                                                                                      |
| **Request Body**      | Empty (GET request)                                                                                                                |
| **Expected Response** | `200 OK` with JSON                                                                                                                 |

**JSON Success Response:**

```json
{
  "success": true,
  "blogs": [
    {
      "title": "5 Recovery Techniques for Muscle Soreness",
      "slug": "5-recovery-techniques-muscle-soreness",
      "publishedAt": "2025-05-30T07:15:00Z"
    }
  ]
}
```

---

### Job 2: Daily Trial Email Scheduling

**For cron-job.org:**

| Setting               | Value                                                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **URL**               | `https://bigronjones-39pm.onrender.com/api/cron/email-scheduler?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5` |
| **Method**            | `GET`                                                                                                                                    |
| **Schedule**          | `0 6 * * *` (6 AM UTC daily)                                                                                                             |
| **Timeout**           | `30` seconds                                                                                                                             |
| **Headers**           | None required                                                                                                                            |
| **Request Body**      | Empty (GET request)                                                                                                                      |
| **Expected Response** | `200 OK` with JSON                                                                                                                       |

**JSON Success Response:**

```json
{
  "emailsSent": 5,
  "skipped": 2,
  "errors": 0,
  "details": [
    {
      "email": "user@example.com",
      "status": "sent",
      "day": 2
    }
  ]
}
```

---

### Job 3: Daily Lead Nurture Emails (Optional)

**For cron-job.org:**

| Setting               | Value                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **URL**               | `https://bigronjones-39pm.onrender.com/api/send-sequence`                                |
| **Method**            | `GET`                                                                                    |
| **Schedule**          | `0 7 * * *` (7 AM UTC daily)                                                             |
| **Timeout**           | `30` seconds                                                                             |
| **Headers**           | `Authorization: Bearer 789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5` |
| **Request Body**      | Empty (GET request)                                                                      |
| **Expected Response** | `200 OK` with JSON                                                                       |

---

## TEST COMMANDS

### Test Blog Generation Locally:

```bash
curl -i "https://bigronjones-39pm.onrender.com/api/generate-blogs?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5&manual=true"
```

**Expected Response (200 OK):**

```json
{
  "success": true,
  "blogs": [...]
}
```

---

### Test Email Scheduler Locally:

```bash
curl -i "https://bigronjones-39pm.onrender.com/api/cron/email-scheduler?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5"
```

**Expected Response (200 OK):**

```json
{
  "emailsSent": 5,
  "skipped": 2,
  "errors": 0,
  "details": [...]
}
```

---

### Test Lead Sequence Locally:

```bash
curl -i -H "Authorization: Bearer 789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5" \
  "https://bigronjones-39pm.onrender.com/api/send-sequence"
```

**Expected Response (200 OK):**

```json
{
  "sent": 10,
  "skipped": 3,
  "failed": 0
}
```

---

## DETAILED ENDPOINT ANALYSIS

### 1. Blog Generation Endpoint

**Location:** `backend/handlers/generate-blogs.ts`

```
GET/POST /api/generate-blogs
```

**Authentication:** CRON_SECRET (query param or bearer token)

**Purpose:**

- Generates 3 new AI blog posts daily
- Uses Google Gemini API (Ron's voice)
- Fetches trending fitness keywords
- Attaches on-brand cover images
- Stores to Supabase + in-memory cache

**Required Environment Variables:**

- `GOOGLE_API_KEY`
- `CRON_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Query Parameters:**

- `secret` (required) - Your CRON_SECRET
- `manual=true` (optional) - For manual triggers

**Sample Response:**

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

---

### 2. Email Scheduler Endpoint

**Location:** `backend/handlers/cron/email-scheduler.ts`

```
GET/POST /api/cron/email-scheduler
```

**Authentication:** CRON_SECRET (query param)

**Purpose:**

- Sends personalized trial day emails
- Email schedule:
  - Day 1: DAY_1_WELCOME (immediate on booking)
  - Day 2: DAY_2_EDUCATION
  - Day 4: DAY_4_REINFORCEMENT
  - Day 6: DAY_6_PUSH
  - Day 7: DAY_7_CONVERSION
- Prevents duplicate sends
- Personalizes with recovery metrics

**Required Environment Variables:**

- `CRON_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

**Query Parameters:**

- `secret` (required) - Your CRON_SECRET

**Sample Response:**

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
    },
    {
      "email": "user3@example.com",
      "status": "no_email_today",
      "day": 3
    }
  ]
}
```

**Status Codes:**

- `sent` - Email sent successfully
- `already_sent` - Duplicate prevention
- `no_email_today` - Trial day has no scheduled email
- `trial_ended` - Trial period expired
- `send_failed` - Error sending email
- `error` - Unexpected error

---

### 3. Send Sequence Endpoint (Lead Nurture)

**Location:** `backend/handlers/send-sequence.ts`

```
GET /api/send-sequence
```

**Authentication:** CRON_SECRET (Bearer token required)

**Purpose:**

- Sends next email in lead nurture sequence
- Processes up to 100 due leads per run
- Email cadence: 1 day (days 1-3), 2 days (days 4-7), 3 days (after)

**Required Headers:**

```
Authorization: Bearer 789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5
```

**Required Environment Variables:**

- `CRON_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `SITE_URL`

**Sample Response:**

```json
{
  "sent": 10,
  "skipped": 3,
  "failed": 0
}
```

---

## HOW THE CRON JOBS WORK TOGETHER

```
Daily at 6 AM UTC:
  ↓
Run Email Scheduler
  ├─ Query all active trials (trial_start_date is set)
  ├─ Calculate which day of trial each user is on
  ├─ Check EMAIL_SCHEDULE[day] for what email to send
  ├─ Check email_logs to prevent duplicates
  ├─ Get recovery metrics for personalization
  ├─ Send via Resend API
  └─ Log each attempt to email_logs table

Daily at 7 AM UTC:
  ↓
Run Blog Generator
  ├─ Fetch trending fitness keywords (free API)
  ├─ Select 3 fresh keywords (avoid repeats)
  ├─ Generate each blog with Gemini AI
  ├─ Attach cover image
  ├─ Store to Supabase (blogs table)
  └─ Merge with in-memory store

Daily at 7 AM UTC (optional):
  ↓
Run Send Sequence
  ├─ Query leads with next_email_due_at <= now
  ├─ Fetch next email in their sequence
  ├─ Send via Resend API
  └─ Update next_email_due_at
```

---

## CRON-JOB.ORG SETUP STEPS

### Step 1: Create Blog Generation Job

1. Go to **cron-job.org**
2. Click **+ New Cronjob**
3. Fill in:
   - **URL:** `https://bigronjones-39pm.onrender.com/api/generate-blogs?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5`
   - **Method:** `GET`
   - **Schedule:** `0 7 * * *`
   - **Notification:** Your email
4. Click **Create**

### Step 2: Create Email Scheduler Job

1. Click **+ New Cronjob**
2. Fill in:
   - **URL:** `https://bigronjones-39pm.onrender.com/api/cron/email-scheduler?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5`
   - **Method:** `GET`
   - **Schedule:** `0 6 * * *`
   - **Notification:** Your email
3. Click **Create**

### Step 3: Create Send Sequence Job (Optional)

1. Click **+ New Cronjob**
2. Fill in:
   - **URL:** `https://bigronjones-39pm.onrender.com/api/send-sequence`
   - **Method:** `GET`
   - **Schedule:** `0 7 * * *`
   - **Custom Headers:** `Authorization: Bearer 789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5`
   - **Notification:** Your email
3. Click **Create**

---

## WEBHOOK ENDPOINTS (Not Cron - Event-Driven)

These are NOT cron jobs but should be configured for production:

### Calendly Webhook

```
POST https://bigronjones-39pm.onrender.com/api/webhooks/calendly
Authentication: HMAC SHA256 (CALENDLY_WEBHOOK_SECRET)
Triggered when: User books event in Calendly
```

### Stripe Webhook

```
POST https://bigronjones-39pm.onrender.com/api/webhooks/stripe
Authentication: HMAC SHA256 (STRIPE_WEBHOOK_SECRET)
Triggered when: Stripe payment event occurs
```

---

## TROUBLESHOOTING

| Issue                      | Solution                                                                    |
| -------------------------- | --------------------------------------------------------------------------- |
| 401 Unauthorized           | Check CRON_SECRET is correct and included in URL                            |
| 500 Internal Error         | Check all env vars are set on Render (GOOGLE_API_KEY, RESEND_API_KEY, etc.) |
| No emails sending          | Check RESEND_API_KEY and RESEND_FROM_EMAIL are set                          |
| No blogs generating        | Check GOOGLE_API_KEY is set and has quota                                   |
| Cron-job.org says "Failed" | Check Render backend is running (may have sleeping on free tier)            |

---

## TESTING CHECKLIST

- [ ] Test blog endpoint: `curl -i "https://bigronjones-39pm.onrender.com/api/generate-blogs?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5&manual=true"`
- [ ] Test email endpoint: `curl -i "https://bigronjones-39pm.onrender.com/api/cron/email-scheduler?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5"`
- [ ] Test send-sequence: `curl -i -H "Authorization: Bearer 789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5" https://bigronjones-39pm.onrender.com/api/send-sequence`
- [ ] All should return 200 OK
- [ ] Check Render logs for any errors
- [ ] Set up 3 cron jobs on cron-job.org
- [ ] Wait for first scheduled run (6 AM UTC tomorrow)
- [ ] Verify emails appear in Resend dashboard
- [ ] Verify new blogs appear in Supabase

---

**Generated:** May 30, 2026
