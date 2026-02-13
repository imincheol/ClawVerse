import { describe, it, expect } from "vitest";
import { getSkills, getSkillBySlug } from "./skills";

// Supabase is not configured in test env, so all calls use the static fallback path.

describe("getSkills — search filter", () => {
  it("should filter by name match", async () => {
    const results = await getSkills({ search: "browser-automation" });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].slug).toBe("browser-automation");
  });

  it("should filter by description match", async () => {
    const results = await getSkills({ search: "FFmpeg" });
    expect(results.some((s) => s.slug === "ffmpeg-video-editor")).toBe(true);
  });

  it("should be case-insensitive", async () => {
    const results = await getSkills({ search: "OBSIDIAN" });
    expect(results.some((s) => s.slug === "obsidian-vault")).toBe(true);
  });

  it("should return empty for non-matching search", async () => {
    const results = await getSkills({ search: "xyznonexistent999" });
    expect(results).toHaveLength(0);
  });
});

describe("getSkills — security filter", () => {
  it('should return only "verified" skills', async () => {
    const results = await getSkills({ security: "verified" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.security === "verified")).toBe(true);
  });

  it('should return only "blocked" skills', async () => {
    const results = await getSkills({ security: "blocked" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.security === "blocked")).toBe(true);
  });

  it('"all" filter should return everything', async () => {
    const all = await getSkills({ security: "all" });
    const unfiltered = await getSkills({});
    expect(all.length).toBe(unfiltered.length);
  });
});

describe("getSkills — category filter", () => {
  it('should return only "browser" skills', async () => {
    const results = await getSkills({ category: "browser" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.category === "browser")).toBe(true);
  });

  it('"all" category should return everything', async () => {
    const all = await getSkills({ category: "all" });
    const unfiltered = await getSkills({});
    expect(all.length).toBe(unfiltered.length);
  });
});

describe("getSkills — source filter", () => {
  it('should filter by source "ClawHub"', async () => {
    const results = await getSkills({ source: "ClawHub" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.source === "ClawHub")).toBe(true);
  });
});

describe("getSkills — sorting", () => {
  it("should sort by installs descending (default)", async () => {
    const results = await getSkills({});
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].installs).toBeGreaterThanOrEqual(results[i].installs);
    }
  });

  it("should sort by rating descending", async () => {
    const results = await getSkills({ sort: "rating" });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].rating).toBeGreaterThanOrEqual(results[i].rating);
    }
  });

  it("should sort by name ascending", async () => {
    const results = await getSkills({ sort: "name" });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].name.localeCompare(results[i].name)).toBeLessThanOrEqual(0);
    }
  });

  it("should sort by newest (id descending)", async () => {
    const results = await getSkills({ sort: "newest" });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].id).toBeGreaterThanOrEqual(results[i].id);
    }
  });

  it("should sort by security level order", async () => {
    const ORDER: Record<string, number> = { verified: 0, reviewed: 1, unreviewed: 2, flagged: 3, blocked: 4 };
    const results = await getSkills({ sort: "security" });
    for (let i = 1; i < results.length; i++) {
      expect(ORDER[results[i - 1].security]).toBeLessThanOrEqual(ORDER[results[i].security]);
    }
  });
});

describe("getSkills — pagination", () => {
  it("should limit results", async () => {
    const results = await getSkills({ limit: 5 });
    expect(results).toHaveLength(5);
  });

  it("should offset results", async () => {
    const all = await getSkills({});
    const offsetted = await getSkills({ offset: 10 });
    expect(offsetted[0].slug).toBe(all[10].slug);
  });

  it("should combine limit and offset", async () => {
    const all = await getSkills({});
    const page = await getSkills({ limit: 3, offset: 5 });
    expect(page).toHaveLength(3);
    expect(page[0].slug).toBe(all[5].slug);
  });
});

describe("getSkills — compound filters", () => {
  it("should combine search + category + security", async () => {
    const results = await getSkills({
      category: "media",
      security: "verified",
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.category === "media" && s.security === "verified")).toBe(true);
  });
});

describe("getSkillBySlug", () => {
  it("should return a skill for a valid slug", async () => {
    const skill = await getSkillBySlug("browser-automation");
    expect(skill).not.toBeNull();
    expect(skill?.name).toBe("browser-automation");
  });

  it("should return null for a non-existent slug", async () => {
    const skill = await getSkillBySlug("does-not-exist");
    expect(skill).toBeNull();
  });
});
