# Vercel Deployment Guide - Complete Setup

**Your GitHub Repo:** `Abhishek-IEM/bigronjones-final`  
**Your Backend:** `https://bigronjones-39pm.onrender.com`

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] GitHub repo committed and pushed
- [ ] Vercel account created (https://vercel.com)
- [ ] Connected GitHub to Vercel
- [ ] Project imported from GitHub
- [ ] Environment variables configured
- [ ] Render CORS configured
- [ ] Deployment successful
- [ ] Frontend accessible
- [ ] API requests working

---

## STEP 1: Connect GitHub to Vercel

### 1.1 Create Vercel Account

1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **GitHub** as sign-up method
4. Authorize Vercel to access your GitHub account

### 1.2 Authorize GitHub Access

- Vercel will ask for permission to access your repositories
- Select **Only select repositories** (recommended for security)
- Choose `Abhishek-IEM/bigronjones-final`
- Click **Install & Authorize**

---

## STEP 2: Import Project from GitHub

### 2.1 Import Repository

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Search for `bigronjones-final`
5. Click **Import**

### 2.2 Configure Project

You'll see a screen with:

**Project Name:**

```
bigronjones-final
```

**Framework Preset:**

- Click **Other** (since you have multiple services)

**Root Directory:**

```
./
```

**Build & Output Settings:**

- **Build Command:** (leave empty - Vercel auto-detects)
- **Output Directory:** (leave empty)
- **Install Command:** (leave empty - Vercel auto-detects)

---

## STEP 3: Set Environment Variables

### 3.1 Add Environment Variables for Frontend

After clicking **Import**, you'll see **Environment Variables** section:

**Add these variables from your `.env` file:**

```
VITE_SUPABASE_URL
Value: https://atwdzfchknvsvdldhkug.supabase.co

VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0d2R6ZmNoa252c3ZkbGRoa3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Njc5NTAsImV4cCI6MjA5MzA0Mzk1MH0.-PSbaXb0itvoCoh3KkqOkUD7AzQgns9u2ygc-eIHiX8

VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_live_51Q5Vd7As1t7TJuCZb6Xc9YzY9iKykdWNMKdsnpEaCumFFMuwPgJAjR5N2T4vhMMWwVSskK2vsgC3A1NnasdZttfu00OMO3o9yl

VITE_SITE_URL
Value: https://bigronjones-final.vercel.app
(Or your custom domain once set up)

VITE_ADMIN_EMAILS
Value: manishsinghchouhan13@gmail.com

VITE_GA_ID
Value: (leave blank if not using Google Analytics)
```

### 3.2 Copy Environment Variables

**Easiest way - copy from your `.env`:**

1. Open your `.env` file in editor
2. Find each VITE\_\* variable
3. Copy the value
4. Paste into Vercel dashboard

**Variables to ADD:**

| Variable                      | Value from .env                        |
| ----------------------------- | -------------------------------------- |
| `VITE_SUPABASE_URL`           | Copy exactly                           |
| `VITE_SUPABASE_ANON_KEY`      | Copy exactly                           |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Copy exactly                           |
| `VITE_SITE_URL`               | `https://bigronjones-final.vercel.app` |
| `VITE_ADMIN_EMAILS`           | Copy exactly                           |
| `VITE_GA_ID`                  | Leave blank (optional)                 |

---

## STEP 4: Deploy to Vercel

### 4.1 Click Deploy Button

1. After adding environment variables
2. Click **Deploy**
3. Wait 2-5 minutes for build to complete

### 4.2 Monitor Build Progress

You'll see:

```
✓ Build started
✓ Installing dependencies
✓ Building frontend
✓ Deployment complete
```

### 4.3 Access Your Deployed Site

Once complete, you'll see:

```
✓ Deployment successful

https://bigronjones-final.vercel.app
```

---

## STEP 5: Configure Render CORS

Your Render backend needs to allow requests from your Vercel frontend.

### 5.1 Update Render Environment Variables

1. Go to https://dashboard.render.com
2. Click **bigronjones-api** service
3. Go to **Environment** tab
4. Find `FRONTEND_ORIGIN`
5. Change from:
   ```
   https://localhost:3000
   ```
   To:
   ```
   https://bigronjones-final.vercel.app
   ```
6. Click **Save**

The service will automatically redeploy with the new CORS origin.

### 5.2 Verify CORS is Set

Your Render backend (`backend/server.ts`) already has CORS configured:

```typescript
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "";
// Allows requests from your Vercel frontend
```

---

## STEP 6: Test the Deployment

### 6.1 Test Frontend Access

1. Open https://bigronjones-final.vercel.app in browser
2. Should see your site loading
3. Check browser console for errors (F12)

### 6.2 Test API Requests

1. Go to any page that makes an API call
2. Open DevTools (F12)
3. Go to **Network** tab
4. Try an action (e.g., form submission)
5. Look for `/api/*` requests
6. Should see status **200** (success)

### 6.3 Check for CORS Errors

If you see errors like:

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Fix:**

1. Double-check `FRONTEND_ORIGIN` on Render matches your Vercel domain exactly
2. Wait a few minutes for Render to redeploy
3. Hard refresh browser (Ctrl+Shift+R)

---

## STEP 7: View Deployment Logs

### 7.1 View Build Logs

1. Go to https://vercel.com/dashboard
2. Click **bigronjones-final**
3. Go to **Deployments** tab
4. Click latest deployment
5. See build output and any errors

### 7.2 View Function Logs (Runtime)

1. Click deployment
2. Go to **Functions** or **Logs** tab
3. Select time range
4. See real-time logs of your running app

### 7.3 View Render Backend Logs

1. Go to https://dashboard.render.com
2. Click **bigronjones-api**
3. Go to **Logs** tab
4. See backend request logs and errors

---

## STEP 8: Configure Custom Domain (Optional)

### 8.1 Add Custom Domain to Vercel

1. Go to https://vercel.com/dashboard
2. Click **bigronjones-final** project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your domain (e.g., `bigronjones.com`)
6. Follow DNS setup instructions

### 8.2 Update Environment Variables

Once custom domain is set up:

1. Go to **Settings** → **Environment Variables**
2. Find `VITE_SITE_URL`
3. Update to:
   ```
   https://bigronjones.com
   ```
4. Redeploy (go to Deployments → click latest → **Redeploy**)

### 8.3 Update Render CORS

1. Go to Render dashboard
2. Update `FRONTEND_ORIGIN` to:
   ```
   https://bigronjones.com
   ```
3. Service redeploys automatically

---

## TROUBLESHOOTING

### Issue: Build Fails

**Error:** `npm run build failed`

**Solutions:**

1. Check build command in Vercel matches your `package.json`
2. Verify all dependencies are installed locally
3. Run locally: `npm run build` to see error
4. Fix error locally, commit, and redeploy

---

### Issue: Frontend Works but API Fails

**Error:** 404 or CORS error on `/api/*` requests

**Solutions:**

1. Check `vercel.json` has correct backend URL:
   ```json
   "destination": "https://bigronjones-39pm.onrender.com/api/:path*"
   ```
2. Verify `FRONTEND_ORIGIN` on Render is set to Vercel domain
3. Check Render backend is running (visit health check)
4. Hard refresh browser

---

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**

1. Render backend needs `FRONTEND_ORIGIN` env var set
2. Vercel frontend needs `rewrites` in `vercel.json` to proxy `/api` requests
3. Both already configured in your files
4. May take 2-5 min for Render to redeploy after env change

---

### Issue: Environment Variables Not Working

**Error:** Variables undefined in frontend (`undefined` showing instead of values)

**Solutions:**

1. Variables must start with `VITE_` to be exposed to browser
2. Add them in Vercel dashboard **Environment Variables** section
3. Redeploy after adding (Deployments → click latest → Redeploy)
4. Hard refresh browser to clear cache

---

## DEPLOYMENT SUMMARY

| Component     | Status                    | URL                                     |
| ------------- | ------------------------- | --------------------------------------- |
| **Frontend**  | Deployed on Vercel        | `https://bigronjones-final.vercel.app`  |
| **Backend**   | Running on Render         | `https://bigronjones-39pm.onrender.com` |
| **API Proxy** | Configured in vercel.json | `/api/*` → Render                       |
| **Database**  | Supabase                  | Connected via env vars                  |
| **Email**     | Resend                    | Configured on Render                    |

---

## POST-DEPLOYMENT TASKS

### 1. Monitor Application

- [ ] Check Vercel logs daily for errors
- [ ] Check Render logs for backend issues
- [ ] Monitor Supabase for database performance

### 2. Set Up Cron Jobs

- [ ] Configure cron-job.org for email scheduler
- [ ] Configure cron-job.org for blog generator
- [ ] Use endpoints from CRON_QUICK_REFERENCE.md

### 3. Set Up Webhooks

- [ ] Configure Stripe webhook to point to Render backend
- [ ] Configure Calendly webhook to point to Render backend
- [ ] Test webhooks with test events

### 4. Performance & Security

- [ ] Enable Vercel analytics
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Review Render free tier limits
- [ ] Consider upgrading if production traffic increases

---

## QUICK REFERENCE

| Action             | Link                                              |
| ------------------ | ------------------------------------------------- |
| Vercel Dashboard   | https://vercel.com/dashboard                      |
| Render Dashboard   | https://dashboard.render.com                      |
| Supabase Dashboard | https://app.supabase.com                          |
| Your Frontend      | https://bigronjones-final.vercel.app              |
| Your Backend       | https://bigronjones-39pm.onrender.com             |
| GitHub Repo        | https://github.com/Abhishek-IEM/bigronjones-final |

---

## NEED HELP?

1. **Vercel Issues** → https://vercel.com/docs
2. **Render Issues** → https://docs.render.com
3. **Supabase Issues** → https://supabase.com/docs
4. **Your Logs** → Vercel/Render dashboards

---

**Generated:** May 30, 2026  
**Status:** Ready for production deployment
