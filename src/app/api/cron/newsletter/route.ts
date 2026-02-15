import { NextRequest, NextResponse } from "next/server";
import { createCronSignature, verifyCronRequest } from "@/lib/security/cron-signature";

export async function POST(request: NextRequest) {
  const authorized = await verifyCronRequest(request, "/api/cron/newsletter");
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawverse.io";
    const sendSecret = process.env.NEWSLETTER_CRON_SECRET || process.env.CRON_HMAC_SECRET || process.env.CRON_SECRET;
    if (!sendSecret) {
      return NextResponse.json({ error: "Missing newsletter cron secret" }, { status: 500 });
    }

    const timestamp = String(Math.floor(Date.now() / 1000));
    const signature = sendSecret
      ? await createCronSignature("POST", "/api/newsletter/send", timestamp, sendSecret)
      : "";

    const response = await fetch(`${siteUrl}/api/newsletter/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendSecret}`,
        "x-cron-timestamp": timestamp,
        "x-cron-signature": signature,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
