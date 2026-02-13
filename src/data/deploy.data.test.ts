import { describe, it, expect } from "vitest";
import { DEPLOY_OPTIONS } from "./deploy";

describe("DEPLOY_OPTIONS data integrity", () => {
  it("should have all unique ids", () => {
    const ids = DEPLOY_OPTIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have all unique slugs", () => {
    const slugs = DEPLOY_OPTIONS.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("should have levels between 1 and 4", () => {
    for (const option of DEPLOY_OPTIONS) {
      expect(option.level).toBeGreaterThanOrEqual(1);
      expect(option.level).toBeLessThanOrEqual(4);
    }
  });

  it("should have 22 deploy options total", () => {
    expect(DEPLOY_OPTIONS).toHaveLength(22);
  });
});
