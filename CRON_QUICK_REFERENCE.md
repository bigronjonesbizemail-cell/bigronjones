# ⚡ QUICK CRON SETUP - Copy-Paste Ready

**Your Backend:** `https://bigronjones-39pm.onrender.com`  
**Your CRON_SECRET:** `789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5`

---

## 🎯 FINAL ANSWER

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
GET (or POST)
```

### AUTHENTICATION:

```
Query Parameter: ?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5

For /api/send-sequence (alternative method):
Header: Authorization: Bearer 789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5
```

---

## 📋 CRON-JOB.ORG CONFIGURATION

### Job 1️⃣: Blog Generation

```
URL:            https://bigronjones-39pm.onrender.com/api/generate-blogs?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5
Method:         GET
Schedule:       0 7 * * *     (7 AM UTC daily)
Timeout:        60 seconds
Headers:        (none)
Request Body:   (empty)
```

### Job 2️⃣: Email Scheduler

```
URL:            https://bigronjones-39pm.onrender.com/api/cron/email-scheduler?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5
Method:         GET
Schedule:       0 6 * * *     (6 AM UTC daily)
Timeout:        30 seconds
Headers:        (none)
Request Body:   (empty)
```

### Job 3️⃣: Lead Sequence (Optional)

```
URL:            https://bigronjones-39pm.onrender.com/api/send-sequence
Method:         GET
Schedule:       0 7 * * *     (7 AM UTC daily)
Timeout:        30 seconds
Headers:        Authorization: Bearer 789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5
Request Body:   (empty)
```

---

## 🧪 TEST COMMANDS

### Test Blog Endpoint:

```bash
curl -i "https://bigronjones-39pm.onrender.com/api/generate-blogs?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5&manual=true"
```

### Test Email Endpoint:

```bash
curl -i "https://bigronjones-39pm.onrender.com/api/cron/email-scheduler?secret=789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5"
```

### Test Send Sequence:

```bash
curl -i -H "Authorization: Bearer 789d823513cccf77866c6629345fcb4d07d2b43dd559ba22ab77f934c3d3f0d5" \
  "https://bigronjones-39pm.onrender.com/api/send-sequence"
```

All should return **200 OK** with JSON response.

---

## 🚀 WHAT EACH DOES

| Endpoint                    | Purpose                    | Runs At  | What It Sends                                       |
| --------------------------- | -------------------------- | -------- | --------------------------------------------------- |
| `/api/generate-blogs`       | Generates 3 AI blogs daily | 7 AM UTC | New blog posts                                      |
| `/api/cron/email-scheduler` | Sends trial day emails     | 6 AM UTC | Welcome, Education, Reinforcement, Push, Conversion |
| `/api/send-sequence`        | Sends lead nurture emails  | 7 AM UTC | Marketing sequence                                  |

---

**Go to cron-job.org and create 3 jobs with the configurations above!**
