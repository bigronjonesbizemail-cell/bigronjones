# Environment Variables - Copy-Paste Ready

**For Vercel Dashboard**

---

## 📋 ALL VARIABLES TO ADD

Add these one-by-one in Vercel dashboard:  
`Project Settings` → `Environment Variables`

---

### Variable 1️⃣: VITE_SUPABASE_URL

**Name:**

```
VITE_SUPABASE_URL
```

**Value:**

```
https://atwdzfchknvsvdldhkug.supabase.co
```

**Environments:** Production, Preview, Development

---

### Variable 2️⃣: VITE_SUPABASE_ANON_KEY

**Name:**

```
VITE_SUPABASE_ANON_KEY
```

**Value:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0d2R6ZmNoa252c3ZkbGRoa3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Njc5NTAsImV4cCI6MjA5MzA0Mzk1MH0.-PSbaXb0itvoCoh3KkqOkUD7AzQgns9u2ygc-eIHiX8
```

**Environments:** Production, Preview, Development

---

### Variable 3️⃣: VITE_STRIPE_PUBLISHABLE_KEY

**Name:**

```
VITE_STRIPE_PUBLISHABLE_KEY
```

**Value:**

```
pk_live_51Q5Vd7As1t7TJuCZb6Xc9YzY9iKykdWNMKdsnpEaCumFFMuwPgJAjR5N2T4vhMMWwVSskK2vsgC3A1NnasdZttfu00OMO3o9yl
```

**Environments:** Production, Preview, Development

---

### Variable 4️⃣: VITE_SITE_URL

**Name:**

```
VITE_SITE_URL
```

**Value:**

```
https://bigronjones-final.vercel.app
```

**Environments:** Production, Preview, Development

**Note:** Change if you use a custom domain

---

### Variable 5️⃣: VITE_ADMIN_EMAILS

**Name:**

```
VITE_ADMIN_EMAILS
```

**Value:**

```
manishsinghchouhan13@gmail.com
```

**Environments:** Production, Preview, Development

---

### Variable 6️⃣: VITE_GA_ID (Optional)

**Name:**

```
VITE_GA_ID
```

**Value:**

```
(leave blank - optional for Google Analytics)
```

**Environments:** Production, Preview, Development

---

## 🔐 HOW TO ADD IN VERCEL

### Method 1: Add During Import (Recommended)

1. During import, you'll see **Environment Variables** section
2. Click **Add**
3. Enter Name and Value
4. Repeat for each variable
5. Click **Deploy**

### Method 2: Add After Deployment

1. Go to https://vercel.com/dashboard
2. Click **bigronjones-final** project
3. Go to **Settings** tab
4. Go to **Environment Variables**
5. Click **Add New**
6. Enter Name and Value
7. Select **Production**, **Preview**, **Development**
8. Click **Save**
9. Go to **Deployments** and click **Redeploy** on latest

---

## ⚠️ IMPORTANT NOTES

✅ **VITE\_\* variables** are safe (exposed to browser)  
✅ **Values are from .env** (public keys, not secrets)  
❌ **Do NOT add backend env vars here** (those go on Render)  
✅ **All VITE\_ variables are required** for app to work

---

## 🔗 RELATED

**Backend Environment Variables** (set on Render, not Vercel):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `RESEND_API_KEY`
- `CRON_SECRET`
- etc.

These are already set on your Render backend.

---

## 📖 AFTER ADDING VARIABLES

1. **If during import:** Click **Deploy** and done
2. **If added after:** Go to **Deployments** → Click latest → **Redeploy**
3. Wait 2-3 minutes for redeployment
4. Test at https://bigronjones-final.vercel.app

---

## ✅ VERIFICATION

After deployment, verify on your live site:

1. Open DevTools (F12)
2. Go to **Console** tab
3. Type: `console.log(import.meta.env.VITE_SUPABASE_URL)`
4. Should print your Supabase URL (not `undefined`)

If shows `undefined`, variables weren't set correctly.

---

**Copy-paste values above into Vercel and you're ready!** 🚀
