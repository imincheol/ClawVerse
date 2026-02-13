import { NextRequest, NextResponse } from "next/server";
import {
  getCsrfCookieName,
  getCsrfHeaderName,
  getCsrfSessionCookieName,
  verifySignedCsrfToken,
} from "./csrf-token";

class GuardError extends Error {
  status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.status = status;
  }
}

function normalizeOrigin(value: string): string {
  return value.replace(/\/$/, "").toLowerCase();
}

function getAllowedOrigins(request: NextRequest): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const origins = new Set<string>();

  if (fromEnv) {
    try {
      origins.add(normalizeOrigin(new URL(fromEnv).origin));
    } catch {
      // Ignore invalid NEXT_PUBLIC_SITE_URL.
    }
  }

  origins.add(normalizeOrigin(request.nextUrl.origin));
  origins.add("http://localhost:3000");
  origins.add("http://127.0.0.1:3000");

  return [...origins];
}

export function assertAllowedOrigin(request: NextRequest): void {
  const origin = request.headers.get("origin");
  if (!origin) return;

  const normalized = normalizeOrigin(origin);
  const allowed = getAllowedOrigins(request);
  if (!allowed.includes(normalized)) {
    throw new GuardError("Origin not allowed", 403);
  }
}

export function assertJsonRequest(request: NextRequest): void {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new GuardError("Content-Type must be application/json", 415);
  }
}

export async function assertCsrf(request: NextRequest): Promise<void> {
  const sessionId = request.cookies.get(getCsrfSessionCookieName())?.value;
  const cookieToken = request.cookies.get(getCsrfCookieName())?.value;
  const headerToken = request.headers.get(getCsrfHeaderName());

  if (!sessionId || !cookieToken || !headerToken || cookieToken !== headerToken) {
    throw new GuardError("CSRF validation failed", 403);
  }

  const validSignedToken = await verifySignedCsrfToken(cookieToken, sessionId);
  if (!validSignedToken) {
    throw new GuardError("CSRF validation failed", 403);
  }
}

export async function guardMutationRequest(
  request: NextRequest,
  options: { requireCsrf?: boolean; requireJson?: boolean } = {}
): Promise<NextResponse | null> {
  const { requireCsrf = false, requireJson = true } = options;

  try {
    assertAllowedOrigin(request);
    if (requireJson) assertJsonRequest(request);
    if (requireCsrf) await assertCsrf(request);
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request blocked";
    const status = error instanceof GuardError ? error.status : 403;
    return NextResponse.json({ error: message }, { status });
  }
}

export const SECURITY_CONSTANTS = {
  csrfCookieName: getCsrfCookieName(),
  csrfHeaderName: getCsrfHeaderName(),
  csrfSessionCookieName: getCsrfSessionCookieName(),
} as const;
