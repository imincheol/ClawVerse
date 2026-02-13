import { describe, expect, it, beforeEach } from "vitest";
import {
  getCsrfCookieName,
  getCsrfHeaderName,
  getCsrfToken,
  withCsrfHeaders,
} from "./csrf";

describe("csrf helpers", () => {
  beforeEach(() => {
    document.cookie = `${getCsrfCookieName()}=; Max-Age=0; path=/`;
  });

  it("reads csrf token from cookie", () => {
    document.cookie = `${getCsrfCookieName()}=token-1; path=/`;
    expect(getCsrfToken()).toBe("token-1");
  });

  it("adds csrf header when token exists", () => {
    document.cookie = `${getCsrfCookieName()}=token-2; path=/`;
    const headers = withCsrfHeaders({ "Content-Type": "application/json" });
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(headers.get(getCsrfHeaderName())).toBe("token-2");
  });

  it("does not add csrf header when cookie is missing", () => {
    const headers = withCsrfHeaders();
    expect(headers.get(getCsrfHeaderName())).toBeNull();
  });
});
