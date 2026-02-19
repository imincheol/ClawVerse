import { describe, it, expect } from "vitest";
import { DATA_LAST_UPDATED, DATA_COUNTS } from "./metadata";

describe("metadata", () => {
  it("should compute DATA_LAST_UPDATED as a non-empty string", () => {
    expect(typeof DATA_LAST_UPDATED).toBe("string");
    expect(DATA_LAST_UPDATED.length).toBeGreaterThan(0);
    expect(DATA_LAST_UPDATED).not.toBe("unknown");
  });

  it("should have correct DATA_COUNTS structure", () => {
    expect(DATA_COUNTS.skills).toBeGreaterThan(0);
    expect(DATA_COUNTS.projects).toBeGreaterThan(0);
    expect(DATA_COUNTS.deployOptions).toBeGreaterThan(0);
    expect(DATA_COUNTS.pulseItems).toBeGreaterThan(0);
  });
});
