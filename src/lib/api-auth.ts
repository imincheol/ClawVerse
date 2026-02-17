import { NextRequest, NextResponse } from "next/server";

/**
 * API Key authentication and rate limiting for ClawVerse registry API.
 *
 * Usage:
 *   const auth = validateApiKey(request);
 *   if (!auth.valid) return auth.response;  // 401 if key required
 *
 * API keys are optional for read endpoints but required for:
 * - POST /api/skills/[slug]/install (tracked installs)
 * - POST /api/v1/webhooks (webhook subscriptions)
 *
 * In production, keys would be stored in Supabase and validated server-side.
 * For MVP, we accept any non-empty X-ClawVerse-Key header for tracking.
 */

export interface ApiAuthResult {
  valid: boolean;
  key: string | null;
  /** Agent or application identifier */
  agentId: string | null;
  response?: NextResponse;
}

export function validateApiKey(
  request: NextRequest,
  options: { required?: boolean } = {},
): ApiAuthResult {
  const key = request.headers.get("x-clawverse-key");
  const agentId = request.headers.get("x-agent-id");

  if (options.required && !key) {
    return {
      valid: false,
      key: null,
      agentId: null,
      response: NextResponse.json(
        {
          error: "API key required",
          message: "Include X-ClawVerse-Key header. Register at https://clawverse.io/api-keys",
          docs: "https://clawverse.io/api/v1/registry",
        },
        { status: 401 },
      ),
    };
  }

  // TODO: In production, validate key against Supabase api_keys table
  // const { data } = await supabase.from('api_keys').select('*').eq('key', key).single();

  return {
    valid: true,
    key: key || null,
    agentId: agentId || null,
  };
}

/**
 * Standard rate limit headers for API responses.
 */
export function rateLimitHeaders(remaining: number = 100): Record<string, string> {
  return {
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.floor(Date.now() / 1000) + 3600),
  };
}
