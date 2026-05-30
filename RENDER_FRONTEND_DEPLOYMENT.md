# Deploy Frontend to Render (Static Site)

This guide walks you through deploying your React/Vite frontend on **Render as a Static Site** alongside your existing backend API.

## Overview

Your `render.yaml` now includes:

- **bigronjones-api** (Web service) — Node.js backend
- **bigronjones-web** (Static site) — React/Vite frontend CDN
- **Email scheduler cron** — Daily trial emails @ 06:00 UTC
- **Blog generator cron** — Daily blog generation @ 08:00 UTC

---

## Step-by-Step Deployment

### Step 1: Ensure render.yaml is Committed

The updated `render.yaml` includes the static site service. Commit and push to GitHub:

```bash
git add render.yaml
git commit -m "Add frontend static site to Render blueprint"
git push origin main
```

### Step 2: Deploy via Render Blueprint

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repo (if not already connected)
4. Select branch: `main`
5. Click **Create** — Render will deploy all three services (API, Frontend, Email Cron)

**Wait 5-10 minutes** for all services to finish building and deploying.

### Step 3: Configure Frontend Environment Variables

Once `bigronjones-web` is deployed:

1. **Open the `bigronjones-web` service** on Render dashboard
2. Go to **Environment** tab
3. Add these variables (marked `sync: false` in render.yaml):

| Variable                        | Value                                      | Source                             |
| ------------------------------- | ------------------------------------------ | ---------------------------------- |
| `VITE_SUPABASE_URL`             | `https://atwdzfchknvsvdldhkug.supabase.co` | From `.env`                        |
| `VITE_SUPABASE_ANON_KEY`        | Your Supabase anon key                     | From `.env` (starts with `eyJ...`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable key              | From `.env`                        |
| `VITE_STRIPE_PUBLISHABLE_KEY`   | Your Stripe publishable key                | From `.env` (starts with `pk_`)    |
| `VITE_SITE_URL`                 | `https://bigronjones-web.onrender.com`     | Your Render domain                 |
| `VITE_GA_ID`                    | Your Google Analytics ID (if used)         | From `.env`                        |
| `VITE_ADMIN_EMAILS`             | `manishsinghchouhan13@gmail.com`           | From `.env`                        |

**Save** — Render will automatically rebuild and redeploy with the new environment variables.

### Step 4: Configure Backend CORS for Frontend

Update the **bigronjones-api** backend environment variable:

1. Open the `bigronjones-api` service on Render dashboard
2. Go to **Environment** tab
3. Update `FRONTEND_ORIGIN` to your new frontend URL:

```
FRONTEND_ORIGIN=https://bigronjones-web.onrender.com
```

(If using a custom domain for the frontend, use that instead)

4. **Save** — the API will redeploy with the updated CORS origin

### Step 5: Update Backend to Point to Frontend

Update the **bigronjones-api** environment variable:

1. In the backend's **Environment** tab, set:

```
SITE_URL=https://bigronjones-web.onrender.com
VITE_SITE_URL=https://bigronjones-web.onrender.com
```

These are used for:

- Stripe success/cancel redirects
- Email confirmation links
- OAuth callbacks
- Admin dashboard redirects

2. **Save** — the API will redeploy

### Step 6: Verify Deployment

1. Visit `https://bigronjones-web.onrender.com`
2. Check the browser console (F12) for any errors
3. Test API calls by:
   - Logging in
   - Viewing the dashboard
   - Checking a blog post

If you see CORS errors, double-check that `FRONTEND_ORIGIN` on the backend matches your frontend URL exactly.

---

## Frontend Build Process

When you push to GitHub (main branch), Render automatically:

1. **Clones** the latest code
2. **Installs** dependencies: `npm install`
3. **Builds** the frontend: `npm run build`
4. **Publishes** the `dist/` folder to the CDN
5. **Routes** all requests to `index.html` (for React Router SPA support)

The build takes ~2-3 minutes. Check the **Build & Deploys** tab on the service dashboard to monitor progress.

---

## Custom Domain (Optional)

To use your own domain (e.g., `www.bigronjones.com`):

1. On the `bigronjones-web` service, click **Settings** → **Custom Domain**
2. Enter your domain: `www.bigronjones.com`
3. Add the CNAME record provided by Render to your DNS provider
4. Update all environment variables that reference the URL:
   - Backend: `FRONTEND_ORIGIN`, `SITE_URL`, `VITE_SITE_URL`
   - Frontend: `VITE_SITE_URL`

---

## Troubleshooting

### Frontend builds but returns 404

- Check that `publishDirectory` is set to `dist`
- Verify the build command runs `npm run build`
- Check build logs for errors

### API calls fail with CORS error

- Backend's `FRONTEND_ORIGIN` must match your frontend URL exactly
- Restart the backend service after updating env vars

### Environment variables not loading

- Environment variables take effect **after** a rebuild
- After adding/updating vars, manually trigger a rebuild:
  - On the service dashboard, click **Settings** → scroll to **Build & Deploy** → **Deploy Latest**

### Blank page loads

- Check browser console (F12) for JavaScript errors
- Verify all `VITE_*` variables are set correctly
- Clear browser cache and hard refresh (Ctrl+Shift+R)

---

## Free Tier Considerations

✅ **Static Site** is always free (unlimited traffic, instant deploy)

⚠️ **API Service** sleeps after ~15 min idle

- First request wakes it (30–60 sec delay)
- Consider upgrading backend to Starter ($7/mo) if using webhooks (Stripe, Calendly)

---

## Next Steps

1. ✅ Deploy backend API via blueprint
2. ✅ Deploy frontend static site via blueprint
3. ✅ Configure all environment variables
4. ✅ Update SITE_URL references in backend
5. 📧 Test email workflows (login, trial, checkout)
6. 🔗 Set up custom domain (optional)

Questions? Check [Render Docs: Static Sites](https://render.com/docs/static-sites)
