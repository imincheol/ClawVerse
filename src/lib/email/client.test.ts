import { describe, it, expect, vi } from "vitest";
import { sendEmail, sendBatchEmails } from "./client";

// In test env, RESEND_API_KEY is not set, so all calls use the fallback path.

describe("sendEmail — fallback (no Resend key)", () => {
  it("should return success when Resend is not configured", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await sendEmail({
      to: "test@example.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    });
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    consoleSpy.mockRestore();
  });

  it("should log email details in fallback mode", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await sendEmail({
      to: "user@test.com",
      subject: "Fallback Test",
      html: "<p>Content</p>",
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("user@test.com")
    );
    consoleSpy.mockRestore();
  });
});

describe("sendBatchEmails — fallback (no Resend key)", () => {
  it("should return success with correct sent count", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = await sendBatchEmails([
      { to: "a@test.com", subject: "A", html: "<p>A</p>" },
      { to: "b@test.com", subject: "B", html: "<p>B</p>" },
      { to: "c@test.com", subject: "C", html: "<p>C</p>" },
    ]);
    expect(result.success).toBe(true);
    expect(result.sent).toBe(3);
    consoleSpy.mockRestore();
  });

  it("should log each email in fallback mode", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await sendBatchEmails([
      { to: "x@test.com", subject: "X", html: "<p>X</p>" },
      { to: "y@test.com", subject: "Y", html: "<p>Y</p>" },
    ]);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    consoleSpy.mockRestore();
  });
});
