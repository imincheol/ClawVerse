import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  createSubmission: vi.fn(),
  rateLimit: vi.fn(),
  guardMutationRequest: vi.fn(),
}));

vi.mock("@/lib/data/submissions", () => ({
  createSubmission: mocks.createSubmission,
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

describe("POST /api/submit", () => {
  beforeEach(() => {
    mocks.createSubmission.mockReset();
    mocks.rateLimit.mockReset();
    mocks.guardMutationRequest.mockReset();
    mocks.guardMutationRequest.mockReturnValue(null);
    mocks.rateLimit.mockResolvedValue({ success: true, remaining: 9 });
  });

  it("returns 400 when required fields are missing", async () => {
    const request = new Request("http://localhost:3000/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "x" }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(400);
  });

  it("returns 429 when rate limited", async () => {
    mocks.rateLimit.mockResolvedValue({ success: false, retryAfter: 12 });

    const request = new Request("http://localhost:3000/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "skill", name: "x" }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("12");
  });

  it("returns 201 when submission succeeds", async () => {
    mocks.createSubmission.mockResolvedValue({ success: true });

    const request = new Request("http://localhost:3000/api/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "skill", name: "demo" }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ success: true });
  });
});
