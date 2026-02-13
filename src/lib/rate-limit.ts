/**
 * In-memory token bucket rate limiter.
 *
 * Designed with a simple interface so it can be swapped to Redis/Upstash
 * in production without changing call sites.
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  /** Max requests in the window */
  limit: number;
  /** Window size in seconds */
  windowSec: number;
}

const buckets = new Map<string, RateLimitEntry>();

// Prune stale entries every 5 minutes to prevent memory leaks
const PRUNE_INTERVAL = 5 * 60 * 1000;
let lastPrune = Date.now();

function pruneIfNeeded(windowMs: number) {
  const now = Date.now();
  if (now - lastPrune < PRUNE_INTERVAL) return;
  lastPrune = now;

  for (const [key, entry] of buckets) {
    if (now - entry.lastRefill > windowMs * 2) {
      buckets.delete(key);
    }
  }
}

/**
 * Check and consume a rate limit token.
 *
 * @returns `{ success: true, remaining }` if allowed,
 *          `{ success: false, retryAfter }` if rate-limited.
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig
): { success: true; remaining: number } | { success: false; retryAfter: number } {
  const { limit, windowSec } = config;
  const windowMs = windowSec * 1000;
  const now = Date.now();

  pruneIfNeeded(windowMs);

  let entry = buckets.get(key);

  if (!entry) {
    entry = { tokens: limit, lastRefill: now };
    buckets.set(key, entry);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  const refill = Math.floor((elapsed / windowMs) * limit);
  if (refill > 0) {
    entry.tokens = Math.min(limit, entry.tokens + refill);
    entry.lastRefill = now;
  }

  if (entry.tokens > 0) {
    entry.tokens -= 1;
    return { success: true, remaining: entry.tokens };
  }

  // Calculate retry-after in seconds
  const retryAfter = Math.ceil((windowMs - elapsed) / 1000);
  return { success: false, retryAfter: Math.max(1, retryAfter) };
}

/**
 * Extract client IP from a Next.js request.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

/** Preset configs */
export const RATE_LIMITS = {
  submit: { limit: 10, windowSec: 60 } as RateLimitConfig,
  reviews: { limit: 20, windowSec: 60 } as RateLimitConfig,
  newsletter: { limit: 5, windowSec: 60 } as RateLimitConfig,
} as const;
