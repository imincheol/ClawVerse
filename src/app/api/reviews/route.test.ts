import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  rateLimit: vi.fn(),
  guardMutationRequest: vi.fn(),
}));

vi.mock("@/lib/rate-limit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rate-limit")>("@/lib/rate-limit");
  return {
    ...actual,
    rateLimit: mocks.rateLimit,
  };
});

vi.mock("@/lib/security/request-guard", () => ({
  guardMutationRequest: mocks.guardMutationRequest,
}));

import { POST } from "./route";

describe("POST /api/reviews", () => {
  beforeEach(() => {
    mocks.rateLimit.mockReset();
    mocks.guardMutationRequest.mockReset();
    mocks.guardMutationRequest.mockReturnValue(null);
    mocks.rateLimit.mockResolvedValue({ success: true, remaining: 19 });
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it("returns 429 when rate limited", async () => {
    mocks.rateLimit.mockResolvedValue({ success: false, retryAfter: 5 });

    const request = new Request("http://localhost:3000/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ target_type: "skill", target_id: "1", rating: 5 }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("5");
  });

  it("returns 503 when db is not configured", async () => {
    const request = new Request("http://localhost:3000/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ target_type: "skill", target_id: "1", rating: 5 }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(503);
  });
});
