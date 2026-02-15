"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

function hasAuthEnv() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function isAuthProviderEnabled() {
  const flag = process.env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED;
  if (!flag) return true;
  return ["1", "true", "yes", "on"].includes(flag.toLowerCase());
}

export default function AuthButton() {
  const hasSupabase = hasAuthEnv();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(hasSupabase);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [providerEnabled, setProviderEnabled] = useState(() => isAuthProviderEnabled());

  useEffect(() => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data: { user }, error }) => {
        if (error) {
          console.error("[AuthButton] getUser failed:", error);
          setError("Unable to read auth session.");
          setUser(null);
          return;
        }
        setUser(user);
      })
      .catch((e) => {
        console.error("[AuthButton] getUser exception:", e);
        setError("Unable to read auth session.");
        setUser(null);
      })
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [hasSupabase]);

  const handleLogin = async () => {
    if (!hasSupabase) return;
    setError(null);
    setBusy(true);

    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        const msg = error.message || "Unable to start GitHub sign in.";
        const isUnsupportedProvider =
          /Unsupported provider/i.test(msg) || /provider is not enabled/i.test(msg);
        if (isUnsupportedProvider) {
          setProviderEnabled(false);
          setError("GitHub OAuth is not enabled in Supabase Auth providers.");
        } else {
          setError(msg);
        }
        setBusy(false);
      }
    } catch (e) {
      console.error("[AuthButton] OAuth start exception:", e);
      setError("GitHub login request failed.");
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    if (!hasSupabase) return;
    setError(null);
    setBusy(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[AuthButton] signOut failed:", error);
        setError(error.message || "Failed to sign out.");
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("[AuthButton] signOut exception:", e);
      setError("Failed to sign out.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return null;

  // No Supabase configured — don't show button
  if (!hasSupabase) return null;

  // Hide login button if GitHub provider is intentionally or practically unavailable
  if (!providerEnabled && !user) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.user_metadata?.avatar_url && (
          <Image
            src={user.user_metadata.avatar_url}
            alt=""
            width={28}
            height={28}
            className="rounded-full"
          />
        )}
        <span className="hidden text-xs text-text-secondary md:inline">
          {user.user_metadata?.user_name || user.email?.split("@")[0]}
        </span>
        <button
          onClick={handleLogout}
          disabled={busy}
          className="rounded-lg border border-border px-2.5 py-1 text-[11px] text-text-muted transition-colors hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Signing out..." : "Sign out"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleLogin}
        disabled={busy}
        className="flex items-center gap-1.5 rounded-[10px] border border-border bg-white/[0.04] px-3 py-1.5 text-[13px] text-text-secondary transition-colors hover:bg-white/[0.08] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        {busy ? "Connecting..." : "Sign in with GitHub"}
      </button>
      {error && <p className="text-[11px] text-red-300">{error}</p>}
    </div>
  );
}
