# OAuth Flow Architecture — Complete Diagram

## Current Flow (Render Deployment)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                                   │
│                                                                           │
│   https://bigronjones-web.onrender.com                                 │
│                                                                           │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │  React App (Vite)                                        │          │
│   │  - SignIn.tsx                                            │          │
│   │  - SignUp.tsx                                            │          │
│   │  - AuthCallback.tsx                                      │          │
│   │                                                          │          │
│   │  User clicks: "Continue with Google"                     │          │
│   │          ↓                                                │          │
│   │  handleGoogle() → signInWithGoogle(redirectAfter)        │          │
│   └──────────────────┬───────────────────────────────────────┘          │
│                      │                                                   │
└──────────────────────┼───────────────────────────────────────────────────┘
                       │
                       │ STEP 1: useAuth.ts hook calls siteOrigin()
                       │
       ┌───────────────▼──────────────────┐
       │  siteOrigin() function           │
       │  ========================        │
       │                                  │
       │  1. Check VITE_SITE_URL env      │
       │     ✅ Set on Render?            │
       │     → https://bigronjones-      │
       │        web.onrender.com         │
       │                                  │
       │  2. Fallback to:                 │
       │     window.location.origin       │
       │     → https://bigronjones-      │
       │        web.onrender.com         │
       │                                  │
       │  Returns:                        │
       │  "https://bigronjones-web.      │
       │   onrender.com"                  │
       └───────────────┬──────────────────┘
                       │
                       │ STEP 2: Build redirectTo URL
                       │
       ┌───────────────▼──────────────────────────────────┐
       │  Construct redirect URL                          │
       │  ================================                │
       │                                                  │
       │  redirectTo = `${origin}/auth/callback`         │
       │                                                  │
       │  = "https://bigronjones-web.onrender.com/      │
       │    auth/callback"                               │
       │                                                  │
       │  (May include ?redirect=/ param)                │
       └───────────────┬──────────────────────────────────┘
                       │
                       │ STEP 3: Call Supabase OAuth
                       │
       ┌───────────────▼──────────────────────────────┐
       │  supabase.auth.signInWithOAuth({             │
       │    provider: "google",                       │
       │    options: {                                │
       │      redirectTo: "https://bigronjones-      │
       │                   web.onrender.com/        │
       │                   auth/callback",          │
       │      queryParams: { ... }                   │
       │    }                                         │
       │  })                                          │
       └───────────────┬──────────────────────────────┘
                       │
        ┌──────────────▼──────────────────────┐
        │                                     │
        │  STEP 4: Supabase Auth Server       │
        │  =========================          │
        │                                     │
        │  Receives:                          │
        │  redirectTo = "https://bigronjones-│
        │                web.onrender.com/   │
        │                auth/callback"      │
        │                                     │
        │  Check URL Configuration:           │
        │  "Is this URL in my allowed list?" │
        │                                     │
        │  ✅ If YES:                         │
        │    → Proceed to Google OAuth       │
        │                                     │
        │  ❌ If NO:                          │
        │    → Use old stored URL            │
        │    → 404 DEPLOYMENT_NOT_FOUND      │
        │                                     │
        └──────────────┬───────────────────┬─┘
                       │ ✅               │ ❌
        ┌──────────────▼──────────────┐  │
        │   GOOGLE OAUTH SERVER       │  │
        │   =====================     │  │
        │                              │  │
        │   supabase.co sends:         │  │
        │   redirect_uri = "https://   │  │
        │   bigronjones-web.          │  │
        │   onrender.com/auth/        │  │
        │   callback"                 │  │
        │                              │  │
        │   Verify in OAuth Console:   │  │
        │   "Is redirect_uri in       │  │
        │    Authorized URIs?"        │  │
        │                              │  │
        │   ✅ If YES:                │  │
        │    → Show Google login      │  │
        │                              │  │
        │   ❌ If NO (OLD VERCEL URL) │  │
        │    → Redirect to default    │  │
        │       (hardcoded URL)       │  │
        └──────────────┬──────────────┘  │
                       │ ✅             │
        ┌──────────────▼────────────┐   │
        │  Google Login Page        │   │
        │  User authenticates       │   │
        │         ↓                 │   │
        │  Google sends auth code   │   │
        │  back to Supabase auth    │   │
        └──────────────┬────────────┘   │
                       │                │
        ┌──────────────▼────────────┐   │
        │  Supabase validates       │   │
        │  code & issues JWT        │   │
        │         ↓                 │   │
        │  Redirects browser to:    │   │
        │  redirectTo URL           │   │
        └──────────────┬────────────┘   │
                       │                │
        ┌──────────────▼────────────┐   │
        │  Browser lands on:        │   │
        │  /auth/callback           │   │
        │  (on Render domain)       │   │
        │         ↓                 │   │
        │  AuthCallback.tsx         │   │
        │  - Exchanges code         │   │
        │  - Sets session           │   │
        │  - Redirects to / or      │   │
        │    last redirect param    │   │
        │         ↓                 │   │
        │  DASHBOARD ✅             │   │
        └───────────────────────────┘   │
                                        │
                        ❌ Old URL Flow:
                        │
        ┌───────────────▼────────────┐
        │ Old Vercel Redirect        │
        │ https://bigronjones-       │
        │ deploy-741x.vercel.app/    │
        │         ↓                  │
        │ 404: DEPLOYMENT_NOT_FOUND  │
        │ ❌ BROKEN                  │
        └────────────────────────────┘
```

---

## Environment Variable Resolution (siteOrigin)

```
┌─────────────────────────────────────────────────┐
│  siteOrigin() Function Resolution               │
│  ===================================             │
│                                                 │
│  Step 1: Check VITE_SITE_URL env var            │
│  ┌───────────────────────────────────────────┐  │
│  │ import.meta.env.VITE_SITE_URL             │  │
│  │                                           │  │
│  │ ✅ If set (on Render):                   │  │
│  │    "https://bigronjones-web.             │  │
│  │     onrender.com"                         │  │
│  │    → Use this ✅                          │  │
│  │                                           │  │
│  │ ❌ If NOT set:                            │  │
│  │    undefined                              │  │
│  │    → Continue to Step 2                   │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Step 2: Check window.location.origin           │
│  ┌───────────────────────────────────────────┐  │
│  │ typeof window !== "undefined"             │  │
│  │                                           │  │
│  │ ✅ If in browser:                        │  │
│  │    window.location.origin                │  │
│  │    → "https://bigronjones-web.           │  │
│  │       onrender.com"                       │  │
│  │    → Use this ✅                          │  │
│  │                                           │  │
│  │ ❌ If SSR/Node.js:                       │  │
│  │    → Step 3                               │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Step 3: Return empty string                    │
│  ┌───────────────────────────────────────────┐  │
│  │ return ""                                 │  │
│  │                                           │  │
│  │ (For SSR context)                        │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  FINAL RETURN VALUE:                           │
│  "https://bigronjones-web.onrender.com"       │
│                                                 │
│  ✅ Works for:                                 │
│  - Local dev (window.location.origin)          │
│  - Render (VITE_SITE_URL or origin)            │
│  - Custom domain (VITE_SITE_URL or origin)     │
│                                                 │
│  🔑 Key: No hardcoding = universal!           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Configuration Checklist (3-Point Verification)

```
┌─────────────────────────────────────────────────────────────┐
│  POINT 1: Render Dashboard                                  │
│  ========================                                   │
│                                                             │
│  Service: bigronjones-web (Static Site)                    │
│  Environment Variables:                                     │
│    VITE_SITE_URL = "https://bigronjones-web.onrender.com"  │
│                                                             │
│  ✅ Ensures: Frontend knows its own domain                 │
│  ✅ Used by: siteOrigin() function                         │
│  ✅ Fallback: window.location.origin if not set            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  POINT 2: Supabase Dashboard                                │
│  ===========================                                │
│                                                             │
│  Project: atwdzfchknvsvdldhkug                              │
│  Authentication → URL Configuration                        │
│                                                             │
│  Redirect URLs:                                             │
│    ✅ http://localhost:3000/auth/callback                  │
│    ✅ https://bigronjones-web.onrender.com/auth/callback   │
│    ✅ https://atwdzfchknvsvdldhkug.supabase.co/auth/v1/   │
│       callback?provider=google                             │
│    ✅ (Custom domain when added)                           │
│                                                             │
│  ✅ Ensures: Supabase accepts redirectTo URLs              │
│  ✅ Required: Before sending to Google                     │
│  ✅ Impact: Without this, OAuth FAILS                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  POINT 3: Google Cloud Console                              │
│  =============================                              │
│                                                             │
│  Project: bigronjones-oauth                                 │
│  APIs & Services → Credentials                             │
│  OAuth 2.0 Client ID: Big Ron Jones Web                    │
│                                                             │
│  Authorized redirect URIs:                                  │
│    ✅ http://localhost:3000/auth/callback                  │
│    ✅ https://bigronjones-web.onrender.com/auth/callback   │
│    ✅ https://atwdzfchknvsvdldhkug.supabase.co/auth/v1/   │
│       callback?provider=google                             │
│    ✅ (Custom domain when added)                           │
│                                                             │
│  ✅ Ensures: Google accepts redirectTo URLs                │
│  ✅ Required: For Google to redirect back                  │
│  ✅ Impact: Without this, OAuth FAILS                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

GOLDEN RULE:
════════════
POINT 2 & POINT 3 MUST HAVE THE SAME URLS!

If redirectTo URL is in POINT 2 but not POINT 3 → Google rejects it
If redirectTo URL is in POINT 3 but not POINT 2 → Supabase rejects it
```

---

## Deployment Scenarios

### Scenario 1: Local Development ✅

```
User visits: http://localhost:3000/auth/login
                    ↓
siteOrigin() returns: http://localhost:3000
                    ↓
redirectTo = "http://localhost:3000/auth/callback"
                    ↓
Supabase checks: ✅ YES (in URL Configuration)
                    ↓
Google checks: ✅ YES (in Authorized URIs)
                    ↓
OAuth succeeds → Dashboard
```

### Scenario 2: Render Deployment ✅ (After Fix)

```
User visits: https://bigronjones-web.onrender.com
                    ↓
siteOrigin() returns: https://bigronjones-web.onrender.com
  (from VITE_SITE_URL env var)
                    ↓
redirectTo = "https://bigronjones-web.onrender.com/auth/callback"
                    ↓
Supabase checks: ✅ YES (after update)
                    ↓
Google checks: ✅ YES (after update)
                    ↓
OAuth succeeds → Dashboard
```

### Scenario 3: Render Deployment ❌ (Before Fix)

```
User visits: https://bigronjones-web.onrender.com
                    ↓
siteOrigin() returns: https://bigronjones-web.onrender.com
  (no VITE_SITE_URL, uses window.location.origin)
                    ↓
redirectTo = "https://bigronjones-web.onrender.com/auth/callback"
                    ↓
Supabase checks: ❌ NO (old URLs only)
                    ↓
Supabase redirects to: https://www.bigronjones.com/auth/callback
  OR uses old hardcoded Vercel URL
                    ↓
Google checks: ❌ NO (old URLs only)
                    ↓
Google redirects to: https://bigronjones-deploy-741x.vercel.app
                    ↓
404: DEPLOYMENT_NOT_FOUND ❌
```

### Scenario 4: Custom Domain (Future) ✅

```
User visits: https://www.bigronjones.com
                    ↓
Render VITE_SITE_URL: "https://www.bigronjones.com"
                    ↓
siteOrigin() returns: https://www.bigronjones.com
                    ↓
redirectTo = "https://www.bigronjones.com/auth/callback"
                    ↓
Supabase checks: ✅ YES (if added)
                    ↓
Google checks: ✅ YES (if added)
                    ↓
OAuth succeeds → Dashboard
```

---

## Decision Tree: OAuth Redirect Success/Failure

```
                         START: User clicks Google
                              ↓
                    Does frontend have origin?
                        /              \
                      ✅ YES            ❌ NO
                      /                  \
                     ↓                    ↓
            Is VITE_SITE_URL set?    Use window.location.origin
            /              \                  │
          ✅ YES           ❌ NO              │
          /                  \               │
         ↓                    ↓               ↓
   Use VITE value    Use window.location   Use window.location
        │                    │                  │
        └────────┬───────────┴──────────────────┘
                 ↓
       Build redirectTo URL
       https://domain/auth/callback
                 ↓
       Is redirectTo in Supabase
       URL Configuration?
          /              \
        ✅ YES           ❌ NO
        /                  \
       ↓                    ↓
    Send to Google    OAUTH FAILS
       ↓              redirects to
    Is redirectTo in  old/default URL
    Google OAuth URIs?     │
    /              \       │
  ✅ YES           ❌ NO   │
  /                  \     │
 ↓                    ↓    ↓
Show Google      OAUTH FAILS  404
login            redirects to DEPLOYMENT
 ↓               old/default  NOT_FOUND
User auth        URL
 ↓
OAuth code
returned to
redirectTo
 ↓
✅ SUCCESS!
Dashboard
```

---

## Summary Table

| Component                  | Local Dev                             | Render                                               | Custom Domain                               |
| -------------------------- | ------------------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| Frontend URL               | `http://localhost:3000`               | `https://bigronjones-web.onrender.com`               | `https://www.bigronjones.com`               |
| `VITE_SITE_URL`            | Not needed (uses origin)              | **MUST SET**                                         | **MUST SET**                                |
| `siteOrigin()` returns     | `http://localhost:3000`               | `https://bigronjones-web.onrender.com`               | `https://www.bigronjones.com`               |
| `redirectTo` URL           | `http://localhost:3000/auth/callback` | `https://bigronjones-web.onrender.com/auth/callback` | `https://www.bigronjones.com/auth/callback` |
| Supabase URL Configuration | ✅ Registered                         | ✅ Must add                                          | ✅ Must add                                 |
| Google OAuth URIs          | ✅ Registered                         | ✅ Must add                                          | ✅ Must add                                 |
| OAuth Works?               | ✅ YES                                | ❌ NO (until fix)                                    | ✅ YES (if configured)                      |
