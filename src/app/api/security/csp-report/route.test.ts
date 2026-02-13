import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getClientIp: vi.fn(),
  rateLimit: vi.fn(),
}));

vi.mock("@/lib/rate-limit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rate-limit")>("@/lib/rate-limit");
  return {
    ...actual,
    getClientIp: mocks.getClientIp,
    rateLimit: mocks.rateLimit,
  };
});

import { POST } from "./route";

describe("POST /api/security/csp-report", () => {
  beforeEach(() => {
    mocks.getClientIp.mockReset();
    mocks.rateLimit.mockReset();
    mocks.getClientIp.mockReturnValue("203.0.113.10");
    mocks.rateLimit.mockResolvedValue({ success: true, remaining: 119 });
    vi.restoreAllMocks();
  });

  it("returns 429 when rate limited", async () => {
    mocks.rateLimit.mockResolvedValue({ success: false, retryAfter: 45 });

    const request = new Request("http://localhost:3000/api/security/csp-report", {
      method: "POST",
      headers: { "content-type": "application/csp-report" },
      body: JSON.stringify({
        "csp-report": {
          "document-uri": "https://example.com",
          "violated-directive": "script-src",
        },
      }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("45");
  });

  it("accepts legacy csp-report payload and logs normalized report", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const request = new Request("http://localhost:3000/api/security/csp-report", {
      method: "POST",
      headers: {
        "content-type": "application/csp-report",
        "user-agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        "csp-report": {
          "document-uri": "https://example.com/page",
          "effective-directive": "script-src-elem",
          "blocked-uri": "https://cdn.bad.test/script.js",
          "source-file": "https://example.com/app.js",
          "line-number": 33,
          "status-code": 200,
        },
      }),
    });

    const response = await POST(request as never);

    expect(response.status).toBe(204);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.[0]).toBe("[security] CSP violation report");
  });

  it("accepts report-to array payload", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const request = new Request("http://localhost:3000/api/security/csp-report", {
      method: "POST",
      headers: { "content-type": "application/reports+json" },
      body: JSON.stringify([
        {
          type: "csp-violation",
          url: "https://example.com/page",
          body: {
            "effective-directive": "img-src",
            "blocked-uri": "https://tracker.test/pixel.png",
            "status-code": 200,
          },
        },
      ]),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(204);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("returns 400 for invalid json", async () => {
    const request = new Request("http://localhost:3000/api/security/csp-report", {
      method: "POST",
      headers: { "content-type": "application/csp-report" },
      body: "not-json",
    });

    const response = await POST(request as never);
    expect(response.status).toBe(400);
  });
});
