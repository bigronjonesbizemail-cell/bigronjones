# 🚀 OAuth Fix — Quick Runbook (5 Min)

## Problem

Google OAuth redirects to deleted Vercel domain after clicking "Continue with Google"

## Solution

Update 3 external configs (not code — code is correct!)

---

## 🔧 Fix (Copy-Paste)

### 1️⃣ Render Dashboard → Set VITE_SITE_URL (1 min)

```
1. Go to: https://dashboard.render.com
2. Click: bigronjones-web (Static Site)
3. Tab: Environment
4. Find or Add: VITE_SITE_URL
5. Value: https://bigronjones-web.onrender.com
6. Click: Save
7. Wait: 1-2 min for rebuild
```

### 2️⃣ Supabase Dashboard → Update URL Configuration (2 min)

```
1. Go to: https://supabase.com/dashboard
2. Project: atwdzfchknvsvdldhkug
3. Left menu: Authentication → URL Configuration
4. Section: Redirect URLs
5. Add: https://bigronjones-web.onrender.com/auth/callback
6. Click: Save
```

### 3️⃣ Google Cloud Console → Update OAuth URIs (2 min)

```
1. Go to: https://console.cloud.google.com/
2. Project: bigronjones-oauth (dropdown at top)
3. Left menu: APIs & Services → Credentials
4. Click: Big Ron Jones Web (OAuth 2.0 Client ID)
5. Section: Authorized redirect URIs
6. Add: https://bigronjones-web.onrender.com/auth/callback
7. Click: Save
```

---

## ✅ Verify (1 min)

```
1. Open: https://bigronjones-web.onrender.com
2. Click: Sign In
3. Click: Continue with Google
4. Sign in with your Google account
5. Expected: Redirected to dashboard
6. Check console (F12): Should see correct redirectTo URL
```

---

## 🐛 Troubleshooting

**Still redirecting to old Vercel URL?**

1. Clear browser cache: `Ctrl+Shift+Delete`
2. Try incognito/private mode
3. Wait 5 min (caching in Render/Supabase)
4. Check all 3 configs have your Render URL

**Still stuck?**

1. Open F12 Console
2. Check log for `[useAuth] Google OAuth - Verifying redirect configuration:`
3. Verify `redirectTo` matches what you set in steps 2 & 3
4. Check Supabase Logs: Dashboard → Logs (bottom left)

---

## 📋 All Correct URLs (Copy These)

**Render URL (from dashboard):**

```
https://bigronjones-web.onrender.com
```

**Supabase Redirect URL (add to URL Configuration):**

```
https://bigronjones-web.onrender.com/auth/callback
```

**Google Authorized Redirect URI (add to OAuth Client):**

```
https://bigronjones-web.onrender.com/auth/callback
```

---

## 🎯 Done?

- [ ] `VITE_SITE_URL` set on Render
- [ ] Supabase URL Configuration updated
- [ ] Google OAuth URI updated
- [ ] Google login works
- [ ] Dashboard accessible after login

**Enjoy!** 🎉
