import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { validateApiKey, rateLimitHeaders } from "./api-auth";

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest("https://clawverse.io/api/test", { headers });
}

describe("validateApiKey", () => {
  it("should return valid when key is not required and not provided", () => {
    const result = validateApiKey(makeRequest());
    expect(result.valid).toBe(true);
    expect(result.key).toBeNull();
    expect(result.agentId).toBeNull();
    expect(result.response).toBeUndefined();
  });

  it("should return valid when key is provided", () => {
    const result = validateApiKey(
      makeRequest({ "x-clawverse-key": "test-key-123" })
    );
    expect(result.valid).toBe(true);
    expect(result.key).toBe("test-key-123");
  });

  it("should extract agent ID from header", () => {
    const result = validateApiKey(
      makeRequest({
        "x-clawverse-key": "key-123",
        "x-agent-id": "agent-456",
      })
    );
    expect(result.valid).toBe(true);
    expect(result.agentId).toBe("agent-456");
  });

  it("should return invalid when key is required but missing", () => {
    const result = validateApiKey(makeRequest(), { required: true });
    expect(result.valid).toBe(false);
    expect(result.response).toBeDefined();
  });

  it("should return 401 status when key is required but missing", async () => {
    const result = validateApiKey(makeRequest(), { required: true });
    expect(result.response?.status).toBe(401);
    const body = await result.response?.json();
    expect(body.error).toBe("API key required");
  });

  it("should return valid when key is required and provided", () => {
    const result = validateApiKey(
      makeRequest({ "x-clawverse-key": "my-key" }),
      { required: true }
    );
    expect(result.valid).toBe(true);
    expect(result.key).toBe("my-key");
  });
});

describe("rateLimitHeaders", () => {
  it("should return standard rate limit headers", () => {
    const headers = rateLimitHeaders();
    expect(headers["X-RateLimit-Limit"]).toBe("100");
    expect(headers["X-RateLimit-Remaining"]).toBe("100");
    expect(headers["X-RateLimit-Reset"]).toBeTruthy();
  });

  it("should use custom remaining count", () => {
    const headers = rateLimitHeaders(42);
    expect(headers["X-RateLimit-Remaining"]).toBe("42");
  });

  it("should set reset timestamp in the future", () => {
    const headers = rateLimitHeaders();
    const reset = Number(headers["X-RateLimit-Reset"]);
    expect(reset).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});
