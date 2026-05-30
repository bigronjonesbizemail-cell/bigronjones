# Render Frontend Environment Variables — Quick Reference

Use this when configuring **bigronjones-web** (Static Site) on Render.

| Variable                        | Example Value                              | Required?   | Notes                                            |
| ------------------------------- | ------------------------------------------ | ----------- | ------------------------------------------------ |
| `VITE_SUPABASE_URL`             | `https://atwdzfchknvsvdldhkug.supabase.co` | ✅ Yes      | From your Supabase project URL                   |
| `VITE_SUPABASE_ANON_KEY`        | `eyJhbGciOiJIUzI1NiIs...`                  | ✅ Yes      | Public key (starts with `eyJ`, safe for browser) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...`                       | ✅ Yes      | From Supabase Settings → API                     |
| `VITE_STRIPE_PUBLISHABLE_KEY`   | `pk_live_51Q5Vd7...`                       | ✅ Yes      | From Stripe Dashboard → Developers → API Keys    |
| `VITE_SITE_URL`                 | `https://bigronjones-web.onrender.com`     | ✅ Yes      | Your frontend's public URL (for OAuth redirects) |
| `VITE_GA_ID`                    | `G-XXXXXXXXXX`                             | ❌ Optional | Google Analytics ID (leave empty if not used)    |
| `VITE_ADMIN_EMAILS`             | `manishsinghchouhan13@gmail.com`           | ✅ Yes      | Admin emails from your `.env`                    |

---

## Where to Find These Values

### Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project
3. Settings → API
4. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon (public) key** → `VITE_SUPABASE_ANON_KEY`
   - **Publishable key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

### Stripe Publishable Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers → API Keys
3. Copy **Publishable key** → `VITE_STRIPE_PUBLISHABLE_KEY`

### Your Frontend URL (after deployment)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Open **bigronjones-web** service
3. At the top, copy the URL: `https://bigronjones-web.onrender.com`
4. Use this value for `VITE_SITE_URL`

---

## Security Notes

🔒 **Safe to expose to browser:**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` ← public key only
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_SITE_URL`
- `VITE_GA_ID`
- `VITE_ADMIN_EMAILS`

🔐 **Never expose to browser:**

- `SUPABASE_SERVICE_ROLE_KEY` (goes only on backend)
- `STRIPE_SECRET_KEY` (goes only on backend)

All `VITE_*` prefixed variables are automatically sent to the browser during build.

---

## Deployment Flow

1. Commit changes to `main`
2. Render detects new commit
3. Render installs dependencies: `npm install`
4. Render builds frontend: `npm run build`
5. Render publishes `dist/` folder to global CDN
6. Your site is live at `https://bigronjones-web.onrender.com`

The entire process takes ~2-3 minutes.
