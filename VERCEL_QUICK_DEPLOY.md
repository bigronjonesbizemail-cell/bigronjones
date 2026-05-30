# ⚡ VERCEL DEPLOYMENT - QUICK STEPS

**Backend:** `https://bigronjones-39pm.onrender.com`  
**GitHub:** `Abhishek-IEM/bigronjones-final`

---

## 🚀 5-MINUTE DEPLOYMENT

### Step 1️⃣: Go to Vercel

```
https://vercel.com/dashboard
```

### Step 2️⃣: Import Project

- Click **Add New** → **Project**
- Click **Import Git Repository**
- Search for `bigronjones-final`
- Click **Import**

### Step 3️⃣: Add Environment Variables

Copy-paste these values from your `.env`:

| Variable                      | Value                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_SUPABASE_URL`           | `https://atwdzfchknvsvdldhkug.supabase.co`                                                                                                                                                                         |
| `VITE_SUPABASE_ANON_KEY`      | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0d2R6ZmNoa252c3ZkbGRoa3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Njc5NTAsImV4cCI6MjA5MzA0Mzk1MH0.-PSbaXb0itvoCoh3KkqOkUD7AzQgns9u2ygc-eIHiX8` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_51Q5Vd7As1t7TJuCZb6Xc9YzY9iKykdWNMKdsnpEaCumFFMuwPgJAjR5N2T4vhMMWwVSskK2vsgC3A1NnasdZttfu00OMO3o9yl`                                                                                                      |
| `VITE_SITE_URL`               | `https://bigronjones-final.vercel.app`                                                                                                                                                                             |
| `VITE_ADMIN_EMAILS`           | `manishsinghchouhan13@gmail.com`                                                                                                                                                                                   |

### Step 4️⃣: Click Deploy

- Click the **Deploy** button
- Wait 2-5 minutes for build
- You'll see ✅ when ready

### Step 5️⃣: Configure Render CORS

1. Go to https://dashboard.render.com
2. Click **bigronjones-api** service
3. Go to **Environment** tab
4. Find `FRONTEND_ORIGIN`
5. Change to: `https://bigronjones-final.vercel.app`
6. Click **Save**

---

## ✅ DONE!

Your site is now live at:

```
https://bigronjones-final.vercel.app
```

---

## 🧪 TEST IT

### Test 1: Frontend Loads

```
Open: https://bigronjones-final.vercel.app
Should see your site
```

### Test 2: API Works

```
- Open DevTools (F12)
- Go to Network tab
- Try any action that calls API
- Should see /api/* requests with status 200
```

### Test 3: Check for Errors

```
- Open Console tab
- Should see no red errors
- If CORS error: wait 5 min for Render to redeploy
```

---

## 📝 ENVIRONMENT VARIABLES EXPLAINED

Only `VITE_*` variables are exposed to browser (safe).

| Variable                      | Purpose                     |
| ----------------------------- | --------------------------- |
| `VITE_SUPABASE_URL`           | Database connection         |
| `VITE_SUPABASE_ANON_KEY`      | Public API key (safe)       |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe payments (public)    |
| `VITE_SITE_URL`               | Your domain (for redirects) |
| `VITE_ADMIN_EMAILS`           | Admin dashboard access      |

---

## 🔧 WHAT'S ALREADY SET UP

✅ `vercel.json` configured for API proxy  
✅ Backend URL updated to Render  
✅ GitHub repo connected  
✅ All code committed and pushed

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] Visit https://vercel.com/dashboard
- [ ] Import GitHub repo
- [ ] Add 5 environment variables
- [ ] Click Deploy
- [ ] Wait for ✅ status
- [ ] Visit your live site
- [ ] Update Render CORS (FRONTEND_ORIGIN)
- [ ] Test API requests work
- [ ] Share your URL! 🎉

---

**Expected Timeline:**

- Step 1-4: 5 minutes
- Step 5: 2 minutes for Render to redeploy
- Total: ~10 minutes to go live

---

**Your Live URLs:**

- 🌐 **Frontend:** https://bigronjones-final.vercel.app
- 🔌 **Backend:** https://bigronjones-39pm.onrender.com
- 📦 **Database:** Supabase (auto-connected)
