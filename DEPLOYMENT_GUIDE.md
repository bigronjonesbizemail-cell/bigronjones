# Deployment Guide: Backend on Render + Frontend on Vercel

This guide walks you through deploying your full-stack application with:

- **Backend**: Render (Node.js API)
- **Frontend**: Vercel (React/Vite SPA)

## Prerequisites

- GitHub account with your repo pushed
- Render account (render.com)
- Vercel account (vercel.com)
- All environment variables documented below

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Render Configuration

Your `render.yaml` is already configured. Verify it contains:

- Web service: `bigronjones-api`
- Runtime: Node
- Root directory: `.` (project root)
- Start command: `npm start` (runs `tsx backend/server.ts`)
- Health check: `/healthz`

### Step 2: Deploy via Render Blueprint

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repo
4. Select the branch (usually `main`)
5. Click **Create** to deploy

### Step 3: Configure Backend Environment Variables

Once the service is created:

1. **Open the `bigronjones-api` service** on Render dashboard
2. Go to **Environment** tab
3. Add these variables (marked `sync: false` in render.yaml):

```
FRONTEND_ORIGIN          → https://your-vercel-domain.vercel.app (or custom domain)
SITE_URL                 → https://your-vercel-domain.vercel.app
VITE_SITE_URL           → https://your-vercel-domain.vercel.app
SUPABASE_URL            → Your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY → Your Supabase service role key (never expose publicly)
STRIPE_SECRET_KEY       → Your Stripe secret key
STRIPE_WEBHOOK_SECRET   → Your Stripe webhook secret
STRIPE_CHECKOUT_LINK    → Your Stripe checkout link
RESEND_API_KEY          → Your Resend email API key
RESEND_FROM_EMAIL       → Your sender email (e.g., noreply@example.com)
RESEND_AUDIENCE_ID      → Your Resend audience ID
CONTACT_INBOX_EMAIL     → Your contact form inbox email
CALENDLY_WEBHOOK_SECRET → Your Calendly webhook secret (if used)
GOOGLE_API_KEY          → Your Google API key (for blog generation)
ANTHROPIC_API_KEY       → Your Anthropic API key (for blog generation)
UNSPLASH_ACCESS_KEY     → Your Unsplash key (optional, for blog images)
PEXELS_API_KEY          → Your Pexels key (optional, for blog images)
CRON_SECRET             → Generate with: openssl rand -hex 32
NODE_VERSION            → 22
```

### Step 4: Get Your Render URL

After deployment, you'll see a URL like:

```
https://bigronjones-api.onrender.com
```

**Copy this URL** — you'll need it for Vercel configuration.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Vercel Configuration

Update `vercel.json` to point to your actual Render URL:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-RENDER-URL.onrender.com/api/:path*"
    },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key",
    "VITE_STRIPE_PUBLISHABLE_KEY": "@vite_stripe_publishable_key",
    "VITE_SITE_URL": "@vite_site_url",
    "VITE_ADMIN_EMAILS": "@vite_admin_emails",
    "VITE_GA_ID": "@vite_ga_id"
  }
}
```

Replace `YOUR-RENDER-URL` with your actual Render service URL.

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. **Import Git Repository** — select your repo
4. **Framework Preset**: Auto-detect (or leave blank)
5. **Root Directory**: Leave empty (defaults to project root)
6. Click **Deploy**

### Step 3: Configure Frontend Environment Variables on Vercel

1. After deployment, go to **Project Settings** → **Environment Variables**
2. Add these variables for all environments (Production, Preview, Development):

```
VITE_SUPABASE_URL              → Your Supabase project URL
VITE_SUPABASE_ANON_KEY         → Your Supabase anon/public key (safe for browser)
VITE_STRIPE_PUBLISHABLE_KEY    → Your Stripe publishable key
VITE_SITE_URL                  → Your Vercel domain (e.g., https://bigronjones.vercel.app)
VITE_ADMIN_EMAILS              → Comma-separated admin emails
VITE_GA_ID                      → Your Google Analytics ID (if used)
```

### Step 4: Redeploy Frontend

After adding environment variables:

1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Select **Redeploy** (this uses the new env vars)

---

## Part 3: Configure Webhooks & Callbacks

### Stripe Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Webhooks**
2. Add endpoint:
   - URL: `https://YOUR-RENDER-URL.onrender.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `checkout.session.completed`

### Calendly Webhooks (if used)

1. Configure your Calendly webhook to point to:
   ```
   https://YOUR-RENDER-URL.onrender.com/api/webhooks/calendly
   ```

### OAuth Callbacks

For Google OAuth (if used):

- Authorized redirect URIs in Google Cloud Console:
  ```
  https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback
  ```

---

## Part 4: Custom Domain (Optional)

### On Render

1. Go to **bigronjones-api** service → **Settings**
2. Under **Custom Domain**, add your domain (e.g., `api.yourdomain.com`)
3. Follow DNS setup instructions

### On Vercel

1. Go to **Project Settings** → **Domains**
2. Add your domain (e.g., `yourdomain.com` or `www.yourdomain.com`)
3. Follow DNS setup instructions

Then update environment variables on both platforms to use the custom domains.

---

## Part 5: Testing & Verification

### Backend Health Check

```bash
curl https://YOUR-RENDER-URL.onrender.com/healthz
```

Should return `200 OK`.

### Frontend Access

Visit `https://YOUR-VERCEL-DOMAIN.vercel.app` in your browser. Should load without errors.

### API Integration Test

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try an action that calls the API (e.g., form submission)
4. Check that API requests go to `/api/*` and succeed

---

## Part 6: Monitoring & Troubleshooting

### View Logs

**Render Logs:**

1. Dashboard → **bigronjones-api** service
2. Click **Logs** tab
3. Look for errors, missing env vars, or connection issues

**Vercel Logs:**

1. Dashboard → **Project** → **Deployments**
2. Click the deployment
3. View **Function Logs** or build logs

### Common Issues

| Issue                         | Solution                                                       |
| ----------------------------- | -------------------------------------------------------------- |
| 502 Bad Gateway on frontend   | Check Render backend is running; verify API URL in vercel.json |
| CORS errors                   | Ensure `FRONTEND_ORIGIN` on Render matches your Vercel domain  |
| Env vars not loading          | Redeploy after adding/changing env vars                        |
| Stripe webhook failures       | Check webhook secret and endpoint URL are correct              |
| Free tier sleeps after 15 min | Consider upgrading to Starter ($7/mo) for production           |

---

## Part 7: Environment Variable Reference

### Backend (Render) - All Variables

See `render.yaml` for the complete list with descriptions.

### Frontend (Vercel) - Public Variables Only

See `vercel.json` `env` section. These are safe to expose to the browser.

---

## Deployment Checklist

- [ ] GitHub repo is up to date with all changes
- [ ] render.yaml is committed
- [ ] vercel.json is committed
- [ ] Render Blueprint deployed successfully
- [ ] All backend env vars set on Render
- [ ] Render health check passing
- [ ] vercel.json updated with Render URL
- [ ] Frontend deployed to Vercel
- [ ] All frontend env vars set on Vercel
- [ ] Frontend redeploy completed
- [ ] Stripe webhooks configured
- [ ] Calendly webhooks configured (if used)
- [ ] OAuth callbacks configured (if used)
- [ ] Health check passes (`/healthz`)
- [ ] Frontend loads without CORS errors
- [ ] Test API call from frontend

---

## Need Help?

- **Render Docs**: https://docs.render.com
- **Vercel Docs**: https://vercel.com/docs
- **Your Project**: See DEPLOYMENT.md and DEPLOYMENT_GUIDE.md

Good luck! 🚀
