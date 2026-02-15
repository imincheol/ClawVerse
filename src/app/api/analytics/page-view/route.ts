import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

const PAGE_VIEW_BOT_UA = /(bot|crawl|spider|preview|monitor)/i;

interface PageViewPayload {
  path: string;
  targetType?: string | null;
  targetSlug?: string | null;
}

function normalizePath(path: string) {
  if (!path || !path.trim()) return "/";
  return path.startsWith("/") ? path.trim().replace(/\/+$/, "") || "/" : `/${path.trim().replace(/^\/+/, "").replace(/\/+$/, "")}`;
}

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: true, ignored: "no-supabase" });
  }

  let body: PageViewPayload = { path: "/" };
  try {
    const parsed = (await request.json()) as PageViewPayload;
    if (typeof parsed?.path === "string") body = parsed;
  } catch {
    const fallback = request.headers.get("referer");
    if (fallback) {
      try {
        const url = new URL(fallback);
        body.path = url.pathname;
      } catch {
        body.path = "/";
      }
    }
  }

  const normalizedPath = normalizePath(body.path || "/");
  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent") || "";
  const rl = await rateLimit(`page-view:${ip}:${normalizedPath}`, RATE_LIMITS.pageView);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  if (!normalizedPath || PAGE_VIEW_BOT_UA.test(ua)) {
    return NextResponse.json({ success: true, ignored: "bot-or-invalid" });
  }

  const ipHash = createHash("sha256")
    .update(`${ip}|${process.env.PAGE_VIEW_IP_SALT || "clawverse-page-view"}`)
    .digest("hex");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    await supabase
      .from("page_view_events")
      .insert({
        path: normalizedPath,
        target_type: body.targetType || null,
        target_slug: body.targetSlug || null,
        user_agent: ua.slice(0, 512) || null,
        referer: request.headers.get("referer") || null,
        ip_hash: ipHash,
      });
  } catch {
    // ignore insert errors for analytics telemetry
  }

  return NextResponse.json({ success: true });
}
