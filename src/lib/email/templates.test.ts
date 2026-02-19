import { describe, it, expect } from "vitest";
import {
  submissionConfirmation,
  submissionApproved,
  submissionRejected,
  securityAlert,
  weeklyNewsletter,
} from "./templates";

describe("submissionConfirmation", () => {
  it("should return subject and html", () => {
    const result = submissionConfirmation("test-skill", "skill");
    expect(result.subject).toContain("Skill");
    expect(result.subject).toContain("submission received");
    expect(result.html).toContain("test-skill");
  });

  it("should format security_report type label correctly", () => {
    const result = submissionConfirmation("bad-skill", "security_report");
    expect(result.subject).toContain("Security Report");
  });

  it("should include HTML layout structure", () => {
    const result = submissionConfirmation("my-skill", "skill");
    expect(result.html).toContain("<!DOCTYPE html>");
    expect(result.html).toContain("ClawVerse");
  });
});

describe("submissionApproved", () => {
  it("should return approved message for skill", () => {
    const result = submissionApproved("browser-tool", "skill");
    expect(result.subject).toContain("approved");
    expect(result.html).toContain("browser-tool");
    expect(result.html).toContain("Approved");
  });

  it("should link to correct section for project type", () => {
    const result = submissionApproved("my-project", "project");
    expect(result.html).toContain("/projects");
  });

  it("should link to deploy for deploy type", () => {
    const result = submissionApproved("my-deploy", "deploy");
    expect(result.html).toContain("/deploy");
  });
});

describe("submissionRejected", () => {
  it("should return rejection message", () => {
    const result = submissionRejected("bad-skill", "skill");
    expect(result.subject).toContain("Update");
    expect(result.html).toContain("bad-skill");
    expect(result.html).toContain("not approved");
  });

  it("should include reason if provided", () => {
    const result = submissionRejected("bad-skill", "skill", "Violates policy");
    expect(result.html).toContain("Violates policy");
  });

  it("should work without reason", () => {
    const result = submissionRejected("bad-skill", "skill");
    expect(result.html).not.toContain("Reason:");
  });
});

describe("securityAlert", () => {
  it("should return alert with severity", () => {
    const result = securityAlert("malware-skill", "critical", "Steals API keys");
    expect(result.subject).toContain("CRITICAL");
    expect(result.subject).toContain("malware-skill");
    expect(result.html).toContain("Steals API keys");
  });

  it("should use correct color for high severity", () => {
    const result = securityAlert("bad-skill", "high", "Test");
    expect(result.html).toContain("#ef4444");
  });

  it("should handle unknown severity gracefully", () => {
    const result = securityAlert("skill", "unknown", "Test");
    expect(result.subject).toContain("UNKNOWN");
    expect(result.html).toBeTruthy();
  });
});

describe("weeklyNewsletter", () => {
  it("should return newsletter with all sections", () => {
    const result = weeklyNewsletter(
      [{ name: "Pick 1", description: "Great skill" }],
      [{ title: "Alert 1", severity: "high" }],
      [{ name: "New Skill", description: "Brand new" }],
      "https://clawverse.io/unsubscribe/123"
    );
    expect(result.subject).toContain("Weekly");
    expect(result.html).toContain("Pick 1");
    expect(result.html).toContain("Alert 1");
    expect(result.html).toContain("New Skill");
    expect(result.html).toContain("Unsubscribe");
  });

  it("should handle empty picks", () => {
    const result = weeklyNewsletter([], [], [], "https://example.com/unsub");
    expect(result.html).toContain("No picks this week");
    expect(result.html).toContain("No security alerts");
    expect(result.html).toContain("No new skills");
  });

  it("should include pick URLs when provided", () => {
    const result = weeklyNewsletter(
      [{ name: "Pick", description: "Desc", url: "https://example.com" }],
      [],
      [],
      "https://example.com/unsub"
    );
    expect(result.html).toContain("https://example.com");
  });

  it("should format subject with correct counts", () => {
    const result = weeklyNewsletter(
      [],
      [{ title: "A1", severity: "high" }, { title: "A2", severity: "low" }],
      [{ name: "S1", description: "D1" }],
      "https://example.com/unsub"
    );
    expect(result.subject).toContain("2 Alerts");
    expect(result.subject).toContain("1 New Skill");
  });
});
