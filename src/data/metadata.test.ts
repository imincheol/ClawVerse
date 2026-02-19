import { describe, it, expect } from "vitest";
import { DATA_LAST_UPDATED, DATA_COUNTS } from "./metadata";

describe("DATA_LAST_UPDATED", () => {
  it("should be a valid date string", () => {
    expect(DATA_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  it("should not be 'unknown'", () => {
    expect(DATA_LAST_UPDATED).not.toBe("unknown");
  });
});

describe("DATA_COUNTS", () => {
  it("should have positive skill count", () => {
    expect(DATA_COUNTS.skills).toBeGreaterThan(0);
  });

  it("should have positive project count", () => {
    expect(DATA_COUNTS.projects).toBeGreaterThan(0);
  });

  it("should have positive deploy options count", () => {
    expect(DATA_COUNTS.deployOptions).toBeGreaterThan(0);
  });

  it("should have non-negative pulse items count", () => {
    expect(DATA_COUNTS.pulseItems).toBeGreaterThanOrEqual(0);
  });
});
