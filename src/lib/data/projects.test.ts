import { describe, it, expect } from "vitest";
import { getProjects, getProjectBySlug } from "./projects";

describe("getProjects", () => {
  it("should return all projects when no filter", async () => {
    const projects = await getProjects();
    expect(projects.length).toBeGreaterThan(0);
  });

  it('should filter by layer "core"', async () => {
    const core = await getProjects("core");
    expect(core.length).toBeGreaterThan(0);
    expect(core.every((p) => p.layer === "core")).toBe(true);
  });

  it('should filter by layer "trust"', async () => {
    const trust = await getProjects("trust");
    expect(trust.length).toBeGreaterThan(0);
    expect(trust.every((p) => p.layer === "trust")).toBe(true);
  });

  it('"all" filter should return everything', async () => {
    const all = await getProjects("all");
    const unfiltered = await getProjects();
    expect(all.length).toBe(unfiltered.length);
  });

  it("should return empty for non-existent layer", async () => {
    const result = await getProjects("nonexistent");
    expect(result).toHaveLength(0);
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
