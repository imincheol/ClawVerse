/**
 * Rate limiter with pluggable store support.
 *
 * Default behavior:
 * - Uses Upstash REST when configured
 * - Falls back to in-memory store otherwise
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

export interface RateLimitConfig {
  /** Max requests in the window */
  limit: number;
  /** Window size in seconds */
  windowSec: number;
  /** Behavior when external store is unavailable */
  onStoreError?: "fail-open" | "fail-closed";
}

export type RateLimitResult =
  | { success: true; remaining: number }
  | { success: false; retryAfter: number };

export interface RateLimitStore {
  take(key: string, config: RateLimitConfig): Promise<RateLimitResult>;
}

const buckets = new Map<string, RateLimitEntry>();

// Prune stale entries every 5 minutes to prevent memory leaks.
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

class InMemoryRateLimitStore implements RateLimitStore {
  async take(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const { limit, windowSec } = config;
    const windowMs = windowSec * 1000;
    const now = Date.now();

    pruneIfNeeded(windowMs);

    let entry = buckets.get(key);

    if (!entry) {
      entry = { tokens: limit, lastRefill: now };
      buckets.set(key, entry);
    }

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

    const retryAfter = Math.ceil((windowMs - elapsed) / 1000);
    return { success: false, retryAfter: Math.max(1, retryAfter) };
  }
}

class UpstashRateLimitStore implements RateLimitStore {
  private readonly url: string;
  private readonly token: string;

  constructor(url: string, token: string) {
    this.url = url.replace(/\/$/, "");
    this.token = token;
  }

  async take(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const redisKey = `rl:${key}`;

    const res = await fetch(`${this.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["TTL", redisKey],
        ["EXPIRE", redisKey, String(config.windowSec), "NX"],
      ]),
    });

    if (!res.ok) {
      throw new Error(`Upstash request failed: ${res.status}`);
    }

    const payload = (await res.json()) as Array<{ result: unknown }>;
    const count = Number(payload?.[0]?.result ?? 0);
    const ttlRaw = Number(payload?.[1]?.result ?? -1);
    const ttl = ttlRaw > 0 ? ttlRaw : config.windowSec;

    if (count <= config.limit) {
      return {
        success: true,
        remaining: Math.max(0, config.limit - count),
      };
    }

    return {
      success: false,
      retryAfter: Math.max(1, ttl),
    };
  }
}

const memoryStore = new InMemoryRateLimitStore();

function resolveDefaultStore(): RateLimitStore {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken) {
    return new UpstashRateLimitStore(upstashUrl, upstashToken);
  }
  return memoryStore;
}

let store: RateLimitStore = resolveDefaultStore();

export function setRateLimitStoreForTest(nextStore: RateLimitStore): void {
  store = nextStore;
}

export function resetRateLimitStoreForTest(): void {
  store = resolveDefaultStore();
}

export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const onStoreError = config.onStoreError ?? "fail-open";

  try {
    return await store.take(key, config);
  } catch {
    if (onStoreError === "fail-closed") {
      return { success: false, retryAfter: 60 };
    }
    return { success: true, remaining: Math.max(0, config.limit - 1) };
  }
}

/**
 * Extract client IP from a Next.js request.
 *
 * In production, prefer trusted platform headers. `x-forwarded-for` is
 * only used when TRUST_PROXY=true to reduce spoofing risk.
 */
export function getClientIp(request: Request): string {
  const fromVercel = request.headers.get("x-vercel-forwarded-for");
  if (fromVercel) return fromVercel.split(",")[0].trim();

  const fromCloudflare = request.headers.get("cf-connecting-ip");
  if (fromCloudflare) return fromCloudflare.trim();

  const fromRealIp = request.headers.get("x-real-ip");
  if (fromRealIp) return fromRealIp.trim();

  if (process.env.TRUST_PROXY === "true") {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
  }

  return "unknown";
}

/** Preset configs */
export const RATE_LIMITS = {
  submit: { limit: 10, windowSec: 60, onStoreError: "fail-closed" } as RateLimitConfig,
  reviews: { limit: 20, windowSec: 60, onStoreError: "fail-open" } as RateLimitConfig,
  reviewsVote: { limit: 40, windowSec: 60, onStoreError: "fail-open" } as RateLimitConfig,
  newsletter: { limit: 5, windowSec: 60, onStoreError: "fail-closed" } as RateLimitConfig,
  cspReport: { limit: 120, windowSec: 60, onStoreError: "fail-open" } as RateLimitConfig,
  pageView: { limit: 30, windowSec: 60, onStoreError: "fail-open" } as RateLimitConfig,
  stacksWrite: { limit: 30, windowSec: 60, onStoreError: "fail-open" } as RateLimitConfig,
  profileWrite: { limit: 20, windowSec: 60, onStoreError: "fail-open" } as RateLimitConfig,
  adminWrite: { limit: 20, windowSec: 60, onStoreError: "fail-closed" } as RateLimitConfig,
} as const;
