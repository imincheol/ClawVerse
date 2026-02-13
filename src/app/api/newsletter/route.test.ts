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

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    mocks.rateLimit.mockReset();
    mocks.guardMutationRequest.mockReset();
    mocks.guardMutationRequest.mockReturnValue(null);
    mocks.rateLimit.mockResolvedValue({ success: true, remaining: 4 });
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it("returns 400 on invalid email", async () => {
    const request = new Request("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "bad" }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(400);
  });

  it("returns 400 for disposable domains", async () => {
    const request = new Request("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "user@mailinator.com" }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    mocks.rateLimit.mockResolvedValue({ success: false, retryAfter: 30 });

    const request = new Request("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "user@example.com" }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("30");
  });

  it("accepts valid email when DB is unavailable", async () => {
    const request = new Request("http://localhost:3000/api/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "user@example.com" }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });
});
