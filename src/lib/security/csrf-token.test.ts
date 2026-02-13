import { describe, expect, it } from "vitest";
import {
  createSignedCsrfToken,
  verifySignedCsrfToken,
} from "./csrf-token";

describe("csrf-token", () => {
  it("creates and verifies a signed token", async () => {
    const token = await createSignedCsrfToken("sid-1");
    await expect(verifySignedCsrfToken(token, "sid-1")).resolves.toBe(true);
  });

  it("rejects token for different session", async () => {
    const token = await createSignedCsrfToken("sid-1");
    await expect(verifySignedCsrfToken(token, "sid-2")).resolves.toBe(false);
  });

  it("rejects malformed token", async () => {
    await expect(verifySignedCsrfToken("bad.token.value", "sid-1")).resolves.toBe(false);
  });
});
