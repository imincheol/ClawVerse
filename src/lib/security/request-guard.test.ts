import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  assertAllowedOrigin,
  assertCsrf,
  assertJsonRequest,
  guardMutationRequest,
  SECURITY_CONSTANTS,
} from "./request-guard";

describe("request guard", () => {
  it("allows trusted origin", () => {
    const request = new NextRequest("http://localhost:3000/api/reviews", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
        "content-type": "application/json",
      },
    });

    expect(() => assertAllowedOrigin(request)).not.toThrow();
  });

  it("blocks untrusted origin", () => {
    const request = new NextRequest("http://localhost:3000/api/reviews", {
      method: "POST",
      headers: {
        origin: "https://evil.example",
      },
    });

    expect(() => assertAllowedOrigin(request)).toThrow("Origin not allowed");
  });

  it("requires application/json", () => {
    const request = new NextRequest("http://localhost:3000/api/reviews", {
      method: "POST",
      headers: {
        "content-type": "text/plain",
      },
    });

    expect(() => assertJsonRequest(request)).toThrow("Content-Type must be application/json");
  });

  it("validates matching csrf cookie/header", () => {
    const request = new NextRequest("http://localhost:3000/api/reviews", {
      method: "POST",
      headers: {
        cookie: `${SECURITY_CONSTANTS.csrfCookieName}=abc123`,
        [SECURITY_CONSTANTS.csrfHeaderName]: "abc123",
      },
    });

    expect(() => assertCsrf(request)).not.toThrow();
  });

  it("blocks csrf mismatch", () => {
    const request = new NextRequest("http://localhost:3000/api/reviews", {
      method: "POST",
      headers: {
        cookie: `${SECURITY_CONSTANTS.csrfCookieName}=abc123`,
        [SECURITY_CONSTANTS.csrfHeaderName]: "zzz",
      },
    });

    expect(() => assertCsrf(request)).toThrow("CSRF validation failed");
  });

  it("guardMutationRequest returns json error response", async () => {
    const request = new NextRequest("http://localhost:3000/api/reviews", {
      method: "POST",
      headers: {
        origin: "https://evil.example",
        "content-type": "application/json",
      },
    });

    const response = guardMutationRequest(request, { requireCsrf: false });
    expect(response?.status).toBe(403);
    const body = await response?.json();
    expect(body).toEqual({ error: "Origin not allowed" });
  });
});
