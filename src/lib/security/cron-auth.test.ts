import { describe, it, expect, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { verifyCronSecret } from "./cron-auth";

describe("verifyCronSecret", () => {
  const originalEnv = process.env.CRON_SECRET;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.CRON_SECRET = originalEnv;
    } else {
      delete process.env.CRON_SECRET;
    }
  });

  function makeRequest(authHeader?: string): NextRequest {
    const headers = new Headers();
    if (authHeader) {
      headers.set("authorization", authHeader);
    }
    return new NextRequest("https://example.com/api/cron/test", { headers });
  }

  it("rejects when CRON_SECRET is not set", () => {
    delete process.env.CRON_SECRET;
    const result = verifyCronSecret(makeRequest("Bearer some-token"));
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("rejects when CRON_SECRET is empty string", () => {
    process.env.CRON_SECRET = "";
    const result = verifyCronSecret(makeRequest("Bearer "));
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("rejects when no authorization header is present", () => {
    process.env.CRON_SECRET = "test-secret";
    const result = verifyCronSecret(makeRequest());
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("rejects when authorization header has wrong format", () => {
    process.env.CRON_SECRET = "test-secret";
    const result = verifyCronSecret(makeRequest("Basic dGVzdA=="));
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("rejects when token is wrong", () => {
    process.env.CRON_SECRET = "correct-secret";
    const result = verifyCronSecret(makeRequest("Bearer wrong-secret-"));
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("rejects when token length differs from secret", () => {
    process.env.CRON_SECRET = "short";
    const result = verifyCronSecret(makeRequest("Bearer very-long-different-token"));
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("returns null (valid) when token matches secret", () => {
    process.env.CRON_SECRET = "my-cron-secret-123";
    const result = verifyCronSecret(makeRequest("Bearer my-cron-secret-123"));
    expect(result).toBeNull();
  });

  it("is case-sensitive for token comparison", () => {
    process.env.CRON_SECRET = "CaseSensitive";
    const result = verifyCronSecret(makeRequest("Bearer casesensitive"));
    // Different lengths means early rejection; same length means timingSafeEqual comparison
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });
});
