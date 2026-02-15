import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { guardMutationRequest } from "@/lib/security/request-guard";
import crypto from "crypto";

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
  "yopmail.com", "10minutemail.com", "trashmail.com", "fakeinbox.com",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "dispostable.com",
  "maildrop.cc", "mailnesia.com", "tmpmail.net", "temp-mail.org",
]);

let supabaseModule: typeof import("@/lib/supabase/server") | null = null;

async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!supabaseModule) {
    supabaseModule = await import("@/lib/supabase/server");
  }
  try {
    return supabaseModule.createServiceRoleClient();
  } catch {
    return null;
  }
}

function verifyUnsubscribeToken(email: string, token: string): boolean {
  const secret = process.env.NEWSLETTER_CRON_SECRET || process.env.CRON_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(email).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export async function POST(request: NextRequest) {
  const guard = await guardMutationRequest(request, { requireCsrf: false });
  if (guard) return guard;

  const ip = getClientIp(request);
  const rl = await rateLimit(`newsletter:${ip}`, RATE_LIMITS.newsletter);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const domain = email.split("@")[1]?.toLowerCase();
    if (domain && DISPOSABLE_DOMAINS.has(domain)) {
      return NextResponse.json(
        { error: "Disposable email addresses are not allowed" },
        { status: 400 }
      );
    }

    const supabase = await getSupabase();
    if (!supabase) {
      const masked = email.replace(/^(.)(.*)(@.*)$/, (_: string, a: string, b: string, c: string) => a + "*".repeat(b.length) + c);
      return NextResponse.json({ success: true, message: `Subscribed as ${masked}` });
    }

    const { error } = await supabase.from("newsletter_subscribers").upsert(
      { email, unsubscribed_at: null },
      { onConflict: "email" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const masked = email.replace(/^(.)(.*)(@.*)$/, (_: string, a: string, b: string, c: string) => a + "*".repeat(b.length) + c);
    return NextResponse.json({ success: true, message: `Subscribed as ${masked}` });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("unsubscribe");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json(
      { error: "Missing unsubscribe token or email" },
      { status: 400 }
    );
  }

  try {
    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json(
        { error: "Invalid unsubscribe token" },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid unsubscribe token" },
      { status: 403 }
    );
  }

  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ success: true, message: "Unsubscribed" });
  }

  try {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("email", email);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "You have been unsubscribed from ClawVerse newsletter." });
  } catch {
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token = searchParams.get("unsubscribe");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: 400 }
    );
  }

  try {
    if (!verifyUnsubscribeToken(email, token)) {
      return new NextResponse(unsubscribeHtml(false, "Invalid unsubscribe link."), {
        status: 403,
        headers: { "Content-Type": "text/html" },
      });
    }
  } catch {
    return new NextResponse(unsubscribeHtml(false, "Invalid unsubscribe link."), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  const supabase = await getSupabase();
  if (supabase) {
    await supabase
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("email", email);
  }

  return new NextResponse(unsubscribeHtml(true), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

function unsubscribeHtml(success: boolean, errorMsg?: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawverse.io";
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${success ? "Unsubscribed" : "Error"} — ClawVerse</title>
<style>body{margin:0;background:#09090f;color:#e2e8f0;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;}
.card{background:#111118;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:48px;text-align:center;max-width:480px;}
h1{font-size:24px;margin:0 0 16px;}
p{color:#94a3b8;line-height:1.6;}
a{color:#8b5cf6;text-decoration:none;}</style></head>
<body><div class="card">
<h1>${success ? "Unsubscribed" : "Error"}</h1>
<p>${success ? "You have been unsubscribed from the ClawVerse newsletter. You won't receive any more emails from us." : errorMsg || "Something went wrong."}</p>
<p><a href="${siteUrl}">Back to ClawVerse</a></p>
</div></body></html>`;
}
