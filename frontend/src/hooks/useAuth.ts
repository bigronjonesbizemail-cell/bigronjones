import { useEffect, useState } from "react";
import { supabase, type Session, type User } from "@/auth/supabase";
import { refreshTrialStatus } from "@/hooks/useTrialStatus";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

export type UseAuthReturn = AuthState & {
  isAuthenticated: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: (
    redirectAfter?: string,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
};

/**
 * Get the site origin for OAuth redirects and email links.
 *
 * Priority order:
 *   1. VITE_SITE_URL env var (set on Render Dashboard → bigronjones-web → Environment)
 *   2. window.location.origin (fallback: http://localhost:3000 or custom domain)
 *   3. empty string (for SSR/tests)
 *
 * CRITICAL: The returned URL must be registered in:
 *   - Supabase: Authentication → URL Configuration → Redirect URLs
 *   - Google Cloud: OAuth 2.0 Client ID → Authorized redirect URIs
 *
 * Example return values:
 *   - Local dev: http://localhost:3000
 *   - Render: https://bigronjones-web.onrender.com
 *   - Custom: https://your-domain.com
 */
function siteOrigin(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function linkTrialOnce(token: string | undefined) {
      // Stamps auth_user_id on any trial row that matches this user's email.
      // Critical for the case where someone paid as a guest (or with a
      // different auth provider) — without this, the trial row stays orphaned
      // and the user is treated as not having paid on the new login.
      if (!token) return;
      try {
        await fetch("/api/link-trial", {
          method: "POST",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
        // Without this signal, useTrialStatus races against link-trial: it can
        // call /api/me before the trial row is stamped and end up caching the
        // user as "no trial" — forcing them to sign out/in to see the
        // dashboard + admin links. Dispatching a refresh after link-trial
        // finishes guarantees one fresh /api/me read against the linked state.
        refreshTrialStatus();
      } catch {
        // non-blocking — server upsert in /api/me is the safety net
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setState({ user: session?.user ?? null, session, loading: false });
      if (session?.access_token) {
        linkTrialOnce(session.access_token);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setState({ user: session?.user ?? null, session, loading: false });
      if (event === "SIGNED_IN" && session?.access_token) {
        linkTrialOnce(session.access_token);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp: UseAuthReturn["signUp"] = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${siteOrigin()}/auth/callback`,
      },
    });
    return { error: (error as Error) ?? null };
  };

  const signIn: UseAuthReturn["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: (error as Error) ?? null };
  };

  const signInWithGoogle: UseAuthReturn["signInWithGoogle"] = async (
    redirectAfter,
  ) => {
    const origin = siteOrigin();
    const safeRedirect =
      redirectAfter && redirectAfter.startsWith("/") ? redirectAfter : null;
    const redirectTo = safeRedirect
      ? `${origin}/auth/callback?redirect=${encodeURIComponent(safeRedirect)}`
      : `${origin}/auth/callback`;

    // Debug logging - critical for troubleshooting OAuth redirect mismatches
    // If redirectTo doesn't match Supabase/Google configs, OAuth will redirect to wrong domain
    console.log("[useAuth] Google OAuth - Verifying redirect configuration:", {
      // Environment variable (set in Render Dashboard)
      VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
      // Browser-detected origin (fallback)
      detected_origin:
        typeof window !== "undefined" ? window.location.origin : "(SSR)",
      // Supabase project URL
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      // FINAL: OAuth redirect URL (must match Supabase + Google configs)
      redirectTo: redirectTo,
      diagnostic: {
        issue:
          "If OAuth redirects to old Vercel URL, redirectTo doesn't match registered URLs",
        fix_1:
          "Update Render → bigronjones-web → Environment → set VITE_SITE_URL=https://bigronjones-web.onrender.com",
        fix_2:
          "Update Supabase Dashboard → Authentication → URL Configuration → add redirectTo URL",
        fix_3:
          "Update Google Cloud → OAuth 2.0 Client → Authorized redirect URIs → add redirectTo URL",
      },
    });

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });

    if (error) {
      console.error("[useAuth] Google OAuth error:", error);
    }

    return { error: (error as Error) ?? null };
  };

  const signOut: UseAuthReturn["signOut"] = async () => {
    // supabase.auth.signOut() defaults to scope: 'global', which makes a
    // round-trip to the auth server to revoke the refresh token. If the
    // network is slow or the token is already invalid that call can hang
    // for many seconds — and the sign-out button feels broken. We do a
    // fast local-only sign-out (wipes session from memory + storage) and
    // fire the global revocation in the background.
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch (err) {
      console.warn("[useAuth] local signOut failed, clearing manually:", err);
    }
    // Belt-and-braces: nuke any sb-*-auth-token so a stale persistSession
    // can never resurrect the session. We deliberately keep `brj.*` UX caches
    // (e.g. brj.dashboardAccess) so a re-login on the same browser doesn't
    // re-paywall a user whose trial is already active — the server is still
    // the source of truth via /api/me; this is just a fast-path hint.
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith("sb-")) keys.push(k);
      }
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // localStorage can be disabled / quota-exceeded — non-fatal
    }
    setState({ user: null, session: null, loading: false });
    // Best-effort server-side revocation; if this hangs we don't block on it.
    supabase.auth.signOut().catch(() => {});
  };

  const resetPassword: UseAuthReturn["resetPassword"] = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteOrigin()}/auth/callback?type=recovery`,
    });
    return { error: (error as Error) ?? null };
  };

  return {
    ...state,
    isAuthenticated: !!state.user,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };
}
