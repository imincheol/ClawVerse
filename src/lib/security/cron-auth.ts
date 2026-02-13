import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * Verify the CRON_SECRET from an Authorization: Bearer <token> header.
 * Uses crypto.timingSafeEqual to prevent timing attacks.
 * Returns null if valid, or a 401 NextResponse if invalid.
 */
export function verifyCronSecret(request: NextRequest): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  if (token.length !== cronSecret.length) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isValid = timingSafeEqual(
    Buffer.from(token),
    Buffer.from(cronSecret)
  );

  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // Valid — proceed
}
