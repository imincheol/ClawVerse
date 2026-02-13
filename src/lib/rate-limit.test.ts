import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  rateLimit,
  getClientIp,
  RATE_LIMITS,
  setRateLimitStoreForTest,
  resetRateLimitStoreForTest,
  type RateLimitStore,
} from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetRateLimitStoreForTest();
  });

  it("should allow the first request and return remaining tokens", async () => {
    const result = await rateLimit("test-first-request", { limit: 5, windowSec: 60 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.remaining).toBe(4);
    }
  });

  it("should reject after all tokens are consumed", async () => {
    const key = "test-exhaust";
    const config = { limit: 3, windowSec: 60 };

    await rateLimit(key, config);
    await rateLimit(key, config);
    await rateLimit(key, config);

    const result = await rateLimit(key, config);
    expect(result.success).toBe(false);
  });

  it("should return retryAfter in seconds when rate-limited", async () => {
    const key = "test-retry-after";
    const config = { limit: 1, windowSec: 60 };

    await rateLimit(key, config);

    const result = await rateLimit(key, config);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.retryAfter).toBeGreaterThanOrEqual(1);
      expect(result.retryAfter).toBeLessThanOrEqual(60);
    }
  });

  it("should refill tokens after time passes", async () => {
    const key = "test-refill";
    const config = { limit: 2, windowSec: 10 };

    await rateLimit(key, config);
    await rateLimit(key, config);

    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now + 10_000);

    const result = await rateLimit(key, config);
    expect(result.success).toBe(true);
  });

  it("should support store injection", async () => {
    const mockStore: RateLimitStore = {
      take: vi.fn().mockResolvedValue({ success: true, remaining: 99 }),
    };
    setRateLimitStoreForTest(mockStore);

    const result = await rateLimit("store-injected", { limit: 1, windowSec: 1 });
    expect(result).toEqual({ success: true, remaining: 99 });
  });

  it("should fail-open by default when store errors", async () => {
    const brokenStore: RateLimitStore = {
      take: vi.fn().mockRejectedValue(new Error("store down")),
    };
    setRateLimitStoreForTest(brokenStore);

    const result = await rateLimit("store-error", { limit: 7, windowSec: 60 });
    expect(result).toEqual({ success: true, remaining: 6 });
  });

  it("should fail-closed when configured", async () => {
    process.env.RATE_LIMIT_FAIL_CLOSED = "true";
    const brokenStore: RateLimitStore = {
      take: vi.fn().mockRejectedValue(new Error("store down")),
    };
    setRateLimitStoreForTest(brokenStore);

    const result = await rateLimit("store-error-closed", { limit: 7, windowSec: 60 });
    expect(result).toEqual({ success: false, retryAfter: 60 });

    delete process.env.RATE_LIMIT_FAIL_CLOSED;
  });
});

describe("getClientIp", () => {
  it("should parse x-forwarded-for header", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.50" },
    });
    expect(getClientIp(req)).toBe("203.0.113.50");
  });

  it("should return the first IP when multiple are present", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.50, 70.41.3.18, 150.172.238.178" },
    });
    expect(getClientIp(req)).toBe("203.0.113.50");
  });

  it('should return "unknown" when header is missing', () => {
    const req = new Request("http://localhost");
    expect(getClientIp(req)).toBe("unknown");
  });
});

describe("RATE_LIMITS presets", () => {
  it("should have submit preset", () => {
    expect(RATE_LIMITS.submit).toEqual({ limit: 10, windowSec: 60 });
  });

  it("should have reviews preset", () => {
    expect(RATE_LIMITS.reviews).toEqual({ limit: 20, windowSec: 60 });
  });

  it("should have newsletter preset", () => {
    expect(RATE_LIMITS.newsletter).toEqual({ limit: 5, windowSec: 60 });
  });

  it("should include write presets", () => {
    expect(RATE_LIMITS.reviewsVote).toEqual({ limit: 40, windowSec: 60 });
    expect(RATE_LIMITS.stacksWrite).toEqual({ limit: 30, windowSec: 60 });
    expect(RATE_LIMITS.profileWrite).toEqual({ limit: 20, windowSec: 60 });
    expect(RATE_LIMITS.adminWrite).toEqual({ limit: 20, windowSec: 60 });
  });
});
