import { describe, it, expect } from "vitest";
import { SKILLS, CATEGORIES } from "./skills";
import type { SecurityLevel } from "./skills";

const VALID_SECURITY: SecurityLevel[] = ["verified", "reviewed", "unreviewed", "flagged", "blocked"];

// Derive valid categories from the CATEGORIES constant (source of truth)
// so the test never falls out of sync when new categories are added.
const VALID_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all").map((c) => c.id);

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

  // Use minimum-count assertion so adding new skills never breaks the test.
  // Update the floor whenever a new batch is intentionally added.
  it("should have at least 65 skills", () => {
    expect(SKILLS.length).toBeGreaterThanOrEqual(65);
  });

  it("should have non-empty required fields", () => {
    for (const skill of SKILLS) {
      expect(skill.slug).toBeTruthy();
      expect(skill.name).toBeTruthy();
      expect(skill.desc).toBeTruthy();
      expect(skill.source).toBeTruthy();
      expect(skill.platforms.length).toBeGreaterThan(0);
      expect(skill.protocols.length).toBeGreaterThan(0);
      expect(skill.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("should have every category in CATEGORIES represented by at least one skill", () => {
    const usedCategories = new Set(SKILLS.map((s) => s.category));
    for (const cat of VALID_CATEGORIES) {
      expect(usedCategories.has(cat)).toBe(true);
    }
  });
});
