import { describe, expect, it, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  createCronSignature,
  resetCronReplayCacheForTest,
  verifyCronRequest,
} from "./cron-signature";

describe("cron-signature", () => {
  beforeEach(() => {
    process.env.CRON_SECRET = "test-secret";
    delete process.env.CRON_HMAC_SECRET;
    resetCronReplayCacheForTest();
  });

  it("verifies valid signed cron request", async () => {
    const ts = String(Math.floor(Date.now() / 1000));
    const sig = await createCronSignature("POST", "/api/cron/github-sync", ts, "test-secret");

    const req = new NextRequest("http://localhost:3000/api/cron/github-sync", {
      method: "POST",
      headers: {
        authorization: "Bearer test-secret",
        "x-cron-timestamp": ts,
        "x-cron-signature": sig,
      },
    });

    await expect(verifyCronRequest(req, "/api/cron/github-sync")).resolves.toBe(true);
  });

  it("rejects replayed request", async () => {
    const ts = String(Math.floor(Date.now() / 1000));
    const sig = await createCronSignature("POST", "/api/cron/github-sync", ts, "test-secret");

    const req = new NextRequest("http://localhost:3000/api/cron/github-sync", {
      method: "POST",
      headers: {
        authorization: "Bearer test-secret",
        "x-cron-timestamp": ts,
        "x-cron-signature": sig,
      },
    });

    expect(await verifyCronRequest(req, "/api/cron/github-sync")).toBe(true);
    expect(await verifyCronRequest(req, "/api/cron/github-sync")).toBe(false);
  });

  it("rejects expired timestamp", async () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now);

    const oldTs = String(Math.floor((now - 1000 * 1000) / 1000));
    const sig = await createCronSignature("POST", "/api/cron/github-sync", oldTs, "test-secret");

    const req = new NextRequest("http://localhost:3000/api/cron/github-sync", {
      method: "POST",
      headers: {
        authorization: "Bearer test-secret",
        "x-cron-timestamp": oldTs,
        "x-cron-signature": sig,
      },
    });

    await expect(verifyCronRequest(req, "/api/cron/github-sync")).resolves.toBe(false);
  });
});
