import { describe, it, expect } from "vitest";
import { SKILLS } from "./skills";
import type { SecurityLevel, SkillCategory } from "./skills";

const VALID_SECURITY: SecurityLevel[] = ["verified", "reviewed", "unreviewed", "flagged", "blocked"];
const VALID_CATEGORIES: SkillCategory[] = [
  "browser", "productivity", "media", "design", "communication",
  "agent", "social", "finance", "iot", "utility",
];

describe("SKILLS data integrity", () => {
  it("should have all unique ids", () => {
    const ids = SKILLS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have all unique slugs", () => {
    const slugs = SKILLS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("should have valid security values", () => {
    for (const skill of SKILLS) {
      expect(VALID_SECURITY).toContain(skill.security);
    }
  });

  it("should have valid category values", () => {
    for (const skill of SKILLS) {
      expect(VALID_CATEGORIES).toContain(skill.category);
    }
  });

  it("should have ratings between 0 and 5", () => {
    for (const skill of SKILLS) {
      expect(skill.rating).toBeGreaterThanOrEqual(0);
      expect(skill.rating).toBeLessThanOrEqual(5);
    }
  });

  it("should have non-negative install counts", () => {
    for (const skill of SKILLS) {
      expect(skill.installs).toBeGreaterThanOrEqual(0);
    }
  });

  it("should have 53 skills total", () => {
    expect(SKILLS).toHaveLength(53);
  });
});
