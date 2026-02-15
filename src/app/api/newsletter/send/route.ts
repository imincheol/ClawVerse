import { NextRequest, NextResponse } from "next/server";
import { sendBatchEmails } from "@/lib/email/client";
import { weeklyNewsletter } from "@/lib/email/templates";
import crypto from "crypto";
import { verifyCronRequest } from "@/lib/security/cron-signature";

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

function generateUnsubscribeToken(email: string): string {
  const secret = process.env.NEWSLETTER_CRON_SECRET || "dev-secret";
  return crypto.createHmac("sha256", secret).update(email).digest("hex");
}

export async function POST(request: NextRequest) {
  const sendSecret = process.env.NEWSLETTER_CRON_SECRET || process.env.CRON_HMAC_SECRET || process.env.CRON_SECRET;
  const authorized = await verifyCronRequest(request, "/api/newsletter/send", {
    secrets: [sendSecret],
  });
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    // Collect weekly data
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [pulseResult, skillsResult, subscribersResult] = await Promise.all([
      supabase
        .from("pulse_items")
        .select("*")
        .gte("published_at", sevenDaysAgo)
        .order("published_at", { ascending: false })
        .limit(20),
      supabase
        .from("skills")
        .select("name, description, slug")
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("newsletter_subscribers")
        .select("email")
        .is("unsubscribed_at", null),
    ]);

    const pulseItems = pulseResult.data || [];
    const newSkills = skillsResult.data || [];
    const subscribers = subscribersResult.data || [];

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "No subscribers" });
    }

    // Build newsletter content
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawverse.io";

    const picks = pulseItems
      .filter((p: Record<string, unknown>) => p.tag === "trending" || p.tag === "new")
      .slice(0, 5)
      .map((p: Record<string, unknown>) => ({
        name: p.title as string,
        description: (p.description as string) || "",
        url: (p.url as string) || undefined,
      }));

    const alerts = pulseItems
      .filter((p: Record<string, unknown>) => p.tag === "security")
      .slice(0, 5)
      .map((p: Record<string, unknown>) => ({
        title: p.title as string,
        severity: "high",
      }));

    const skills = newSkills.map((s: Record<string, unknown>) => ({
      name: s.name as string,
      description: (s.description as string) || "",
      url: `${siteUrl}/skills/${s.slug}`,
    }));

    // Build per-subscriber emails
    const emails = subscribers.map((sub: Record<string, unknown>) => {
      const email = sub.email as string;
      const token = generateUnsubscribeToken(email);
      const unsubscribeUrl = `${siteUrl}/api/newsletter?unsubscribe=${token}&email=${encodeURIComponent(email)}`;
      const { subject, html } = weeklyNewsletter(picks, alerts, skills, unsubscribeUrl);
      return { to: email, subject, html };
    });

    // Send in batches of 50
    let totalSent = 0;
    for (let i = 0; i < emails.length; i += 50) {
      const batch = emails.slice(i, i + 50);
      const result = await sendBatchEmails(batch);
      if (result.success) totalSent += result.sent;
    }

    return NextResponse.json({ success: true, sent: totalSent, subscribers: subscribers.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
