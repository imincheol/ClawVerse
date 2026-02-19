import { describe, it, expect } from "vitest";
import { getAgents, getAgentBySlug } from "./agents";

// Supabase is not configured in test env, so all calls use the static fallback path.

describe("getAgents — search filter", () => {
  it("should filter by name match", async () => {
    const results = await getAgents({ search: "Full-Stack" });
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].slug).toBe("fullstack-engineer");
  });

  it("should filter by description match", async () => {
    const results = await getAgents({ search: "penetration" });
    expect(results.some((a) => a.slug === "security-penetration-tester")).toBe(true);
  });

  it("should filter by tag match", async () => {
    const results = await getAgents({ search: "rust" });
    expect(results.some((a) => a.slug === "rust-systems-dev")).toBe(true);
  });

  it("should be case-insensitive", async () => {
    const results = await getAgents({ search: "RESEARCH" });
    expect(results.some((a) => a.slug === "deep-research-analyst")).toBe(true);
  });

  it("should return empty for non-matching search", async () => {
    const results = await getAgents({ search: "xyznonexistent999" });
    expect(results).toHaveLength(0);
  });
});

describe("getAgents — type filter", () => {
  it('should return only "persona" agents', async () => {
    const results = await getAgents({ type: "persona" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.type === "persona")).toBe(true);
  });

  it('should return only "crew" agents', async () => {
    const results = await getAgents({ type: "crew" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.type === "crew")).toBe(true);
  });

  it('should return only "workflow" agents', async () => {
    const results = await getAgents({ type: "workflow" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.type === "workflow")).toBe(true);
  });

  it('"all" type should return everything', async () => {
    const all = await getAgents({ type: "all" });
    const unfiltered = await getAgents({});
    expect(all.length).toBe(unfiltered.length);
  });
});

describe("getAgents — role filter", () => {
  it('should return only "developer" agents', async () => {
    const results = await getAgents({ role: "developer" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.role === "developer")).toBe(true);
  });

  it('"all" role should return everything', async () => {
    const all = await getAgents({ role: "all" });
    const unfiltered = await getAgents({});
    expect(all.length).toBe(unfiltered.length);
  });
});

describe("getAgents — framework filter", () => {
  it("should filter by OpenClaw framework", async () => {
    const results = await getAgents({ framework: "OpenClaw" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.frameworks.some((f) => f === "OpenClaw"))).toBe(true);
  });

  it("should filter by CrewAI framework (case-insensitive)", async () => {
    const results = await getAgents({ framework: "crewai" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.frameworks.some((f) => f.toLowerCase() === "crewai"))).toBe(true);
  });

  it('"all" framework should return everything', async () => {
    const all = await getAgents({ framework: "all" });
    const unfiltered = await getAgents({});
    expect(all.length).toBe(unfiltered.length);
  });
});

describe("getAgents — security filter", () => {
  it('should return only "verified" agents', async () => {
    const results = await getAgents({ security: "verified" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.security === "verified")).toBe(true);
  });

  it('"all" security should return everything', async () => {
    const all = await getAgents({ security: "all" });
    const unfiltered = await getAgents({});
    expect(all.length).toBe(unfiltered.length);
  });
});

describe("getAgents — sorting", () => {
  it("should sort by downloads descending (default)", async () => {
    const results = await getAgents({});
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].downloads).toBeGreaterThanOrEqual(results[i].downloads);
    }
  });

  it("should sort by rating descending", async () => {
    const results = await getAgents({ sort: "rating" });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].rating).toBeGreaterThanOrEqual(results[i].rating);
    }
  });

  it("should sort by name ascending", async () => {
    const results = await getAgents({ sort: "name" });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].name.localeCompare(results[i].name)).toBeLessThanOrEqual(0);
    }
  });

  it("should sort by newest (id descending)", async () => {
    const results = await getAgents({ sort: "newest" });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].id).toBeGreaterThanOrEqual(results[i].id);
    }
  });

  it("should sort by security level order", async () => {
    const ORDER: Record<string, number> = { verified: 0, reviewed: 1, unreviewed: 2, flagged: 3, blocked: 4 };
    const results = await getAgents({ sort: "security" });
    for (let i = 1; i < results.length; i++) {
      expect(ORDER[results[i - 1].security]).toBeLessThanOrEqual(ORDER[results[i].security]);
    }
  });
});

describe("getAgents — pagination", () => {
  it("should limit results", async () => {
    const results = await getAgents({ limit: 3 });
    expect(results).toHaveLength(3);
  });

  it("should offset results", async () => {
    const all = await getAgents({});
    const offsetted = await getAgents({ offset: 5 });
    expect(offsetted[0].slug).toBe(all[5].slug);
  });

  it("should combine limit and offset", async () => {
    const all = await getAgents({});
    const page = await getAgents({ limit: 2, offset: 3 });
    expect(page).toHaveLength(2);
    expect(page[0].slug).toBe(all[3].slug);
  });
});

describe("getAgents — compound filters", () => {
  it("should combine type + role", async () => {
    const results = await getAgents({ type: "persona", role: "developer" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.type === "persona" && a.role === "developer")).toBe(true);
  });

  it("should combine type + security", async () => {
    const results = await getAgents({ type: "crew", security: "verified" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.type === "crew" && a.security === "verified")).toBe(true);
  });
});

describe("getAgentBySlug", () => {
  it("should return an agent for a valid slug", async () => {
    const agent = await getAgentBySlug("fullstack-engineer");
    expect(agent).not.toBeNull();
    expect(agent?.name).toBe("Full-Stack Engineer");
  });

  it("should return null for a non-existent slug", async () => {
    const agent = await getAgentBySlug("does-not-exist");
    expect(agent).toBeNull();
  });
});
