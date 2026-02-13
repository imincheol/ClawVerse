import { describe, it, expect } from "vitest";
import { getProjects, getProjectBySlug } from "./projects";

describe("getProjects", () => {
  it("should return all projects when no filter", async () => {
    const result = await getProjects();
    expect(result.projects.length).toBeGreaterThan(0);
    expect(result.count).toBeGreaterThan(0);
  });

  it('should filter by layer "core"', async () => {
    const core = await getProjects({ layer: "core" });
    expect(core.projects.length).toBeGreaterThan(0);
    expect(core.projects.every((p) => p.layer === "core")).toBe(true);
  });

  it('should filter by layer "trust"', async () => {
    const trust = await getProjects({ layer: "trust" });
    expect(trust.projects.length).toBeGreaterThan(0);
    expect(trust.projects.every((p) => p.layer === "trust")).toBe(true);
  });

  it('"all" filter should return everything', async () => {
    const all = await getProjects({ layer: "all" });
    const unfiltered = await getProjects();
    expect(all.count).toBe(unfiltered.count);
  });

  it("should return empty for non-existent layer", async () => {
    const result = await getProjects({ layer: "nonexistent" });
    expect(result.projects).toHaveLength(0);
  });
});

describe("getProjectBySlug", () => {
  it("should return a project for a valid slug", async () => {
    const project = await getProjectBySlug("openclaw");
    expect(project).not.toBeNull();
    expect(project?.name).toBe("OpenClaw");
  });

  it("should return null for non-existent slug", async () => {
    const project = await getProjectBySlug("does-not-exist");
    expect(project).toBeNull();
  });
});
