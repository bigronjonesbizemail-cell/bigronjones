# Complete API Endpoints Analysis

## Cron Jobs, Webhooks, Blog Generation & Email Automation

Generated: May 30, 2026

---

## PART 1: ALL RELEVANT ENDPOINTS

### 🔵 CRON JOBS (Scheduled Automation)

#### 1. Email Scheduler for Trial System

- **Method**: POST/GET
- **Route**: `/api/cron/email-scheduler`
- **File**: `backend/handlers/cron/email-scheduler.ts`
- **Purpose**: Sends personalized trial day emails (DAY_1, DAY_2, DAY_4, DAY_6, DAY_7) to active trial users
- **Schedule**: Daily at 6 AM UTC
- **Authentication**: CRON_SECRET (query parameter or bearer token)
- **Triggers**:
  - Automatically via cron job
  - Can be manually triggered with `?secret=CRON_SECRET`
- **Response**: JSON with `{ emailsSent, skipped, errors, details }`

**Key Features:**

- Tracks which day user is in trial (calculates from trial_start_date)
- Prevents duplicate emails (checks email_logs table)
- Personalizes with recovery metrics (energy_level, soreness_level)
- Marks trials as completed when end date passed
- Logs all attempts to email_logs table

---

#### 2. Lead Nurture Sequence (Daily Email)

- **Method**: GET
- **Route**: `/api/send-sequence`
- **File**: `backend/handlers/send-sequence.ts`
- **Purpose**: Sends next email in lead nurture sequence (marketing automation)
- **Schedule**: Daily (recommended same time as email scheduler)
- **Authentication**: CRON_SECRET (Bearer token required)
- **Triggers**:
  ```bash
  curl -H "Authorization: Bearer $CRON_SECRET" \
    https://your-domain.com/api/send-sequence
  ```
- **Response**: JSON with count of emails sent, failed, skipped

**Key Features:**

- Processes up to 100 due leads per invocation
- Cadence: 1 day for first 3 days, 2 days for days 4-7, 3 days after day 7
- Prevents duplicate sends per lead
- Uses Resend email service
- Marks leads as "contacted" when sequence exhausted

---

### 🟢 BLOG GENERATION (AI Content)

#### 3. Generate AI Blogs (Trend-Based)

- **Method**: GET or POST
- **Route**: `/api/generate-blogs`
- **File**: `backend/handlers/generate-blogs.ts`
- **Purpose**: Generates 3 new AI blog posts daily using Google Gemini AI in "Ron's voice"
- **Schedule**: Daily (automated via cron)
- **Authentication**: CRON_SECRET (Bearer token or query parameter)
- **Triggers**:

  ```bash
  # Via Bearer token
  curl -H "Authorization: Bearer $CRON_SECRET" \
    https://your-domain.com/api/generate-blogs

  # Via query parameter
  curl "https://your-domain.com/api/generate-blogs?secret=$CRON_SECRET"

  # Manual trigger (dev only)
  curl "https://your-domain.com/api/generate-blogs?secret=$CRON_SECRET&manual=true"
  ```

- **Response**: JSON with `{ success, blogs: [...], error?: string }`

**Key Features:**

- Fetches trending fitness keywords (keyless API)
- Generates blog with title, subtitle, body, tags, excerpt, challenge
- Attaches on-brand cover image (Unsplash/Pexels/Ron's photos)
- Generates slug and reading time
- Stores to Supabase + in-memory store
- Tracks recent keywords to avoid repeats
- Logs trend run metrics

**Blog Output:**

```
{
  title: string,
  subtitle: string,
  category: string,
  tags: string[],
  body: string,
  excerpt: string,
  readingTime: string,
  challengeOfTheDay: string,
  slug: string,
  publishedAt: ISO date,
  byline: {
    author: "Ron Jones",
    photo: string (rotated from RON_PHOTOS array)
  }
}
```

---

#### 4. List Published Blogs (Read API)

- **Method**: GET
- **Route**: `/api/blogs`
- **File**: `backend/handlers/blogs.ts`
- **Purpose**: Returns published blogs filtered by category or slug
- **Authentication**: None (public endpoint)
- **Query Parameters**:
  - `category` (optional): Filter by category (e.g., "Fitness", "Recovery")
  - `slug` (optional): Get single blog by slug
- **Triggers**:

  ```bash
  # List all blogs
  curl https://your-domain.com/api/blogs

  # Filter by category
  curl "https://your-domain.com/api/blogs?category=Fitness"

  # Get single blog
  curl "https://your-domain.com/api/blogs?slug=trendy-keyword-post-slug"
  ```

- **Response**: JSON array of Blog objects or single Blog

**Data Source:** Supabase + in-memory store (merged, Supabase wins on collisions)

---

#### 5. Get Single Blog by View

- **Method**: GET
- **Route**: `/api/blog-view`
- **File**: `backend/handlers/blog-view.ts`
- **Purpose**: Track blog views and return blog content
- **Authentication**: None (public endpoint)
- **Query Parameters**: `slug` (required)
- **Response**: Blog object + view count incremented

---

### 🔴 WEBHOOKS (Event-Driven)

#### 6. Calendly Webhook (Trial Activation)

- **Method**: POST
- **Route**: `/api/webhooks/calendly`
- **File**: `backend/handlers/webhooks-calendly.ts`
- **Purpose**: Handles Calendly booking events, triggers trial start and sends DAY_1 email
- **Events Handled**: `invitee.created`, `event.created`
- **Authentication**: HMAC SHA256 signature validation
  - Header: `x-calendly-webhook-signature`
  - Secret: `CALENDLY_WEBHOOK_SECRET`
- **Triggers**: Calendly sends POST when user books event
- **Response**: 200 on success, 400/401 on error

**Process Flow:**

1. Validate HMAC SHA256 signature
2. Parse Calendly payload
3. Find/create user by email
4. Set trial_start_date and trial_end_date (7 days from booking)
5. Mark hasBookedCalendly = true
6. Send DAY_1_WELCOME email immediately
7. Return 200 with success/failure details

**Setup Required in Calendly:**

```
Webhook URL: https://your-domain.com/api/webhooks/calendly
Events: invitee.created, event.created
Signing secret: $CALENDLY_WEBHOOK_SECRET
```

---

#### 7. Stripe Webhook (Payment Confirmation)

- **Method**: POST
- **Route**: `/api/webhooks/stripe`
- **File**: `backend/handlers/webhooks/stripe.ts`
- **Purpose**: Confirms payment and marks user as paid (safety net for Stripe checkout)
- **Events Handled**:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
  - `checkout.session.expired`
- **Authentication**: HMAC SHA256 signature validation
  - Header: `stripe-signature`
  - Secret: `STRIPE_WEBHOOK_SECRET`
- **Triggers**: Stripe sends POST on payment events
- **Response**: 200 on success, 401/400 on error

**Process Flow:**

1. Verify Stripe signature using webhook secret
2. Extract session data (email, amount, metadata)
3. Find user by email
4. Mark payment_status = "paid"
5. Store stripe_session_id
6. Update timestamp
7. Return 200 OK

**Setup Required in Stripe:**

```
Webhook Endpoint URL: https://your-domain.com/api/webhooks/stripe
Events: checkout.session.completed, etc.
Signing secret: $STRIPE_WEBHOOK_SECRET (different per environment!)
```

---

#### 8. Test Calendly Webhook (Dev Only)

- **Method**: POST
- **Route**: `/api/test-webhook-calendly`
- **File**: `backend/handlers/test-webhook-calendly.ts`
- **Purpose**: Test Calendly webhook flow locally
- **Authentication**: None (blocked in production)
- **Disabled in**: Production (NODE_ENV=production)
- **Request Body**:
  ```json
  {
    "email": "test@example.com",
    "name": "Test User",
    "eventStartTime": "2025-05-10T10:00:00Z",
    "testEmailType": "DAY_1_WELCOME"
  }
  ```
- **Response**: Simulates full Calendly webhook processing

---

### 🟡 OTHER AUTOMATION/TRACKING ENDPOINTS

#### 9. Trial Completion

- **Method**: POST
- **Route**: `/api/day-complete`
- **File**: `backend/handlers/day-complete.ts`
- **Purpose**: Logs daily trial completion and collects feedback
- **Authentication**: JWT (user must be logged in)
- **Triggers**: User submits daily check-in form

---

#### 10. Log Activity

- **Method**: POST
- **Route**: `/api/log-activity`
- **File**: `backend/handlers/log-activity.ts`
- **Purpose**: Tracks user activity (views, clicks, engagement)
- **Authentication**: JWT
- **Triggers**: Frontend event tracking

---

#### 11. Trial Feedback

- **Method**: POST/GET
- **Route**: `/api/trial-feedback`
- **File**: `backend/handlers/trial-feedback.ts`
- **Purpose**: Collects/retrieves user feedback during trial
- **Authentication**: JWT

---

---

## PART 2: RECOMMENDED CRON SETUP FOR RAILWAY

Based on your production URL: `https://bigronjones-api-production-7563.up.railway.app`

### For Blog Generation (Optional but Recommended)

**Endpoint**: `https://bigronjones-api-production-7563.up.railway.app/api/generate-blogs`

**Schedule**: Daily at 7:00 AM UTC

**Command**:

```bash
curl --fail --silent --show-error \
  "https://bigronjones-api-production-7563.up.railway.app/api/generate-blogs?secret=$CRON_SECRET"
```

**Environment Variables Needed on Railway**:

- `GOOGLE_API_KEY` (for Gemini)
- `ANTHROPIC_API_KEY` (fallback)
- `UNSPLASH_ACCESS_KEY` (optional, for stock images)
- `PEXELS_API_KEY` (optional, for stock images)
- `CRON_SECRET` (shared)

**Success Response**:

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

---

### For Email Scheduling (RECOMMENDED - Primary Cron)

**Endpoint**: `https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler`

**Schedule**: Daily at 6:00 AM UTC (all trial emails depend on this)

**Command**:

```bash
curl --fail --silent --show-error \
  "https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=$CRON_SECRET"
```

**Environment Variables Needed on Railway**:

- `CRON_SECRET` (generated: `openssl rand -hex 32`)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

**Success Response**:

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

### For Lead Nurture Sequence (RECOMMENDED - Secondary Cron)

**Endpoint**: `https://bigronjones-api-production-7563.up.railway.app/api/send-sequence`

**Schedule**: Daily at 7:00 AM UTC (15 min after email scheduler)

**Command**:

```bash
curl --fail --silent --show-error \
  -H "Authorization: Bearer $CRON_SECRET" \
  "https://bigronjones-api-production-7563.up.railway.app/api/send-sequence"
```

**Environment Variables Needed**:

- `CRON_SECRET` (same as above)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `SITE_URL`

**Success Response**:

```json
{
  "sent": 10,
  "skipped": 3,
  "failed": 0
}
```

---

## PART 3: AUTHENTICATION & SECURITY

### CRON_SECRET Generation

Generate once, store securely on Railway:

```bash
# Generate 64-character hex secret
openssl rand -hex 32

# Example output:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### Authentication Methods

| Endpoint                    | Auth Method          | Location      | Example                        |
| --------------------------- | -------------------- | ------------- | ------------------------------ |
| `/api/cron/email-scheduler` | Query param `secret` | URL params    | `?secret=TOKEN`                |
| `/api/send-sequence`        | Bearer token         | Header        | `Authorization: Bearer TOKEN`  |
| `/api/generate-blogs`       | Query OR Bearer      | Either        | Both supported                 |
| `/api/webhooks/calendly`    | HMAC signature       | Header        | `x-calendly-webhook-signature` |
| `/api/webhooks/stripe`      | HMAC signature       | Header        | `stripe-signature`             |
| `/api/blogs`                | None                 | Public        | Open access                    |
| `/api/trial-feedback`       | JWT                  | Cookie/Header | User session                   |

### Security Notes

1. **CRON_SECRET** must be 32+ chars (hex preferred)
2. **STRIPE_WEBHOOK_SECRET** is different in staging vs production
3. **CALENDLY_WEBHOOK_SECRET** is unique to your Calendly workspace
4. All webhook signatures use HMAC SHA256
5. Never log secrets in console (code already masks them)

---

## PART 4: RAILWAY CRON JOB SETUP

### Step 1: Create Cron Jobs in Railway Console

1. Go to [Railway Dashboard](https://railway.app)
2. Select your project
3. Click **+ New** → **Cron Job**
4. For each job:
   - **Name**: e.g., "Email Scheduler"
   - **Schedule**: Cron expression (see table below)
   - **Command**: See section above
   - **Environment**: Link to same environment as backend service

### Step 2: Cron Schedule Reference

| Time          | Cron Expression | Description                      |
| ------------- | --------------- | -------------------------------- |
| 6:00 AM UTC   | `0 6 * * *`     | Daily at 6 AM (emails)           |
| 7:00 AM UTC   | `0 7 * * *`     | Daily at 7 AM (blogs, sequences) |
| 9:00 AM UTC   | `0 9 * * *`     | Daily at 9 AM                    |
| Every 2 hours | `0 */2 * * *`   | Every 2 hours                    |
| Every 30 min  | `*/30 * * * *`  | Every 30 minutes                 |

### Step 3: Add Environment Variables

**On Railway Backend Service:**

```
CRON_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@example.com
GOOGLE_API_KEY=AIza...
CALENDLY_WEBHOOK_SECRET=xxxxx
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (different from Stripe account signing secret)
```

### Step 4: Test Cron Jobs

**Manual trigger in Railway:**

1. Go to Cron Job details
2. Click **Run Now**
3. Check logs for success (HTTP 200)

**Or curl from terminal:**

```bash
curl --fail --silent --show-error \
  "https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=YOUR_CRON_SECRET"
```

Expected response if successful:

```json
{
  "emailsSent": 5,
  "skipped": 0,
  "errors": 0,
  "details": [...]
}
```

---

## PART 5: RECOMMENDED DEPLOYMENT CHECKLIST

- [ ] Generate `CRON_SECRET` with `openssl rand -hex 32`
- [ ] Set `CRON_SECRET` in Railway backend environment
- [ ] Verify all email env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- [ ] Verify all AI env vars: `GOOGLE_API_KEY`, `ANTHROPIC_API_KEY`
- [ ] Set `CALENDLY_WEBHOOK_SECRET` from Calendly workspace settings
- [ ] Set `STRIPE_WEBHOOK_SECRET` from Stripe dashboard (production endpoint)
- [ ] Test `/api/cron/email-scheduler?secret=$CRON_SECRET` manually
- [ ] Test `/api/generate-blogs?secret=$CRON_SECRET&manual=true` manually
- [ ] Create Railway Cron Job 1: Email Scheduler (6 AM UTC)
- [ ] Create Railway Cron Job 2: Blog Generation (7 AM UTC)
- [ ] Create Railway Cron Job 3: Send Sequence (7:15 AM UTC)
- [ ] Run Manual Trigger on each cron job to verify
- [ ] Check logs for 200 responses and success messages
- [ ] Wait 24 hours and verify cron jobs ran automatically
- [ ] Monitor email delivery in Resend dashboard
- [ ] Monitor new blogs in Supabase (blogs table)

---

## PART 6: FINAL ANSWERS

### RECOMMENDED BLOG CRON URL:

```
https://bigronjones-api-production-7563.up.railway.app/api/generate-blogs?secret=$CRON_SECRET
```

### RECOMMENDED EMAIL CRON URL:

```
https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=$CRON_SECRET
```

### AUTHENTICATION REQUIRED:

**YES** — Query parameter `secret=$CRON_SECRET` is mandatory

- Generate: `openssl rand -hex 32`
- Store on Railway as environment variable `CRON_SECRET`
- Pass in URL: `?secret=$CRON_SECRET`
- If missing/incorrect: Returns `401 Unauthorized`

### RAILWAY START COMMAND:

Keep using the existing backend start command:

```bash
npm start
```

This runs `tsx backend/server.ts` which serves both regular API endpoints and cron endpoints.

### RAILWAY CRON JOB 1 - Email Scheduler:

```bash
#!/bin/bash
curl --fail --silent --show-error \
  "https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=$CRON_SECRET" \
  --max-time 30
```

- **Schedule**: `0 6 * * *` (6 AM UTC daily)
- **Timeout**: 30 seconds
- **Retry**: Automatic on failure

### RAILWAY CRON JOB 2 - Blog Generation (Optional):

```bash
#!/bin/bash
curl --fail --silent --show-error \
  "https://bigronjones-api-production-7563.up.railway.app/api/generate-blogs?secret=$CRON_SECRET" \
  --max-time 60
```

- **Schedule**: `0 7 * * *` (7 AM UTC daily)
- **Timeout**: 60 seconds (Gemini API can be slower)
- **Retry**: Automatic on failure

### RAILWAY CRON JOB 3 - Lead Sequence (Optional):

```bash
#!/bin/bash
curl --fail --silent --show-error \
  -H "Authorization: Bearer $CRON_SECRET" \
  "https://bigronjones-api-production-7563.up.railway.app/api/send-sequence" \
  --max-time 30
```

- **Schedule**: `0 7 * * *` (7 AM UTC daily, same as blogs)
- **Timeout**: 30 seconds
- **Retry**: Automatic on failure

---

## PART 7: PRODUCTION DEPLOYMENT STEPS

### On Railway Dashboard:

1. **Select Project** → **Backend Service**
2. **Environment** → Add all vars from "RAILWAY START COMMAND" section
3. **Settings** → Ensure start command is `npm start`
4. **Deploy** → Latest commit should auto-deploy

### Create Cron Job 1 (Required for Trial System):

1. **+ New** → **Cron Job**
2. **Name**: "Email Scheduler - Daily Trial Emails"
3. **Schedule**: `0 6 * * *`
4. **Command**: (see Cron Job 1 above)
5. **Environment Variables**: Link to same as backend
6. **Create** → Wait for confirmation

### Create Cron Job 2 (Optional - AI Blogs):

1. **+ New** → **Cron Job**
2. **Name**: "Blog Generator - Daily AI Posts"
3. **Schedule**: `0 7 * * *`
4. **Command**: (see Cron Job 2 above)
5. **Environment Variables**: Link to same as backend
6. **Create** → Wait for confirmation

### Create Cron Job 3 (Optional - Lead Nurture):

1. **+ New** → **Cron Job**
2. **Name**: "Send Sequence - Daily Lead Emails"
3. **Schedule**: `0 7 * * *`
4. **Command**: (see Cron Job 3 above)
5. **Environment Variables**: Link to same as backend
6. **Create** → Wait for confirmation

### Test All Endpoints:

```bash
# Test email scheduler
curl "https://bigronjones-api-production-7563.up.railway.app/api/cron/email-scheduler?secret=YOUR_SECRET"

# Test blog generation
curl "https://bigronjones-api-production-7563.up.railway.app/api/generate-blogs?secret=YOUR_SECRET&manual=true"

# Test send sequence
curl -H "Authorization: Bearer YOUR_SECRET" \
  "https://bigronjones-api-production-7563.up.railway.app/api/send-sequence"
```

All should return `200 OK` with JSON response.

---

## References

- **Email Scheduler**: `backend/handlers/cron/email-scheduler.ts`
- **Blog Generator**: `backend/handlers/generate-blogs.ts`
- **Send Sequence**: `backend/handlers/send-sequence.ts`
- **Calendly Webhook**: `backend/handlers/webhooks-calendly.ts`
- **Stripe Webhook**: `backend/handlers/webhooks/stripe.ts`
- **API Routing**: `backend/handlers/manifest.ts`
- **Trial System Docs**: `backend/TRIAL_SYSTEM_README.md`
- **Deployment Guide**: `DEPLOYMENT.md`

---

**End of Analysis Document**
