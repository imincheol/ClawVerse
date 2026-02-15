import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSafeRedirectPath(next: string | null): string {
  if (!next) return "/";
  // Only allow relative paths starting with a single slash
  // Block protocol-relative URLs (//evil.com), absolute URLs, and other schemes
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");
  const next = getSafeRedirectPath(searchParams.get("next"));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  const failRedirect = (reason: string, detail?: string) => {
    const params = new URLSearchParams({ auth_error: reason });
    if (detail) params.set("message", detail);
    return NextResponse.redirect(`${siteUrl}/?${params.toString()}`);
  };

  if (oauthError) {
    return failRedirect("oauth-provider", oauthErrorDescription || undefined);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return failRedirect("missing-supabase-config");
  }

  if (!code) {
    return failRedirect("missing-code");
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Auth callback exchange failed:", error);
    return failRedirect("session-exchange", error.message);
  }

  return NextResponse.redirect(`${siteUrl}${next}`);
}
