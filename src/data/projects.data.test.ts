import { describe, it, expect } from "vitest";
import { PROJECTS } from "./projects";
import type { ProjectLayer, ProjectStatus } from "./projects";

const VALID_LAYERS: ProjectLayer[] = ["core", "social", "collab", "trust", "experimental"];
const VALID_STATUSES: ProjectStatus[] = ["active", "viral", "research", "inactive"];

describe("PROJECTS data integrity", () => {
  it("should have all unique ids", () => {
    const ids = PROJECTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have all unique slugs", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("should have valid layer values", () => {
    for (const project of PROJECTS) {
      expect(VALID_LAYERS).toContain(project.layer);
    }
  });

  it("should have valid status values", () => {
    for (const project of PROJECTS) {
      expect(VALID_STATUSES).toContain(project.status);
    }
  });

  it("should have 81 projects total", () => {
    expect(PROJECTS).toHaveLength(81);
  });
});
