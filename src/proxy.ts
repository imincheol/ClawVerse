import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  createSignedCsrfToken,
  getCsrfCookieName,
  getCsrfSessionCookieName,
  getCsrfTtlSeconds,
} from "@/lib/security/csrf-token";

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

async function ensureCsrfCookies(request: NextRequest, response: NextResponse) {
  const sessionCookieName = getCsrfSessionCookieName();
  const csrfCookieName = getCsrfCookieName();
  let sessionId = request.cookies.get(sessionCookieName)?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    response.cookies.set(sessionCookieName, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getCsrfTtlSeconds(),
    });
  }

  const csrfToken = await createSignedCsrfToken(sessionId);
  response.cookies.set(csrfCookieName, csrfToken, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getCsrfTtlSeconds(),
  });
}

async function finalizeResponse(request: NextRequest, response: NextResponse): Promise<NextResponse> {
  applySecurityHeaders(response);
  await ensureCsrfCookies(request, response);
  return response;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Skip if no Supabase config.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return finalizeResponse(request, supabaseResponse);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return finalizeResponse(request, NextResponse.redirect(url));
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (adminEmails.length > 0 && !adminEmails.includes(user.email?.toLowerCase() || "")) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return finalizeResponse(request, NextResponse.redirect(url));
    }
  }

  return finalizeResponse(request, supabaseResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
