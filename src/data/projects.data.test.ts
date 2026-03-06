import { describe, it, expect } from "vitest";
import { PROJECTS, LAYERS } from "./projects";
import type { ProjectStatus } from "./projects";

// Derive valid layers from LAYERS constant (source of truth)
const VALID_LAYERS = Object.keys(LAYERS);
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

  // Use minimum-count assertion so adding new projects never breaks the test.
  it("should have at least 99 projects", () => {
    expect(PROJECTS.length).toBeGreaterThanOrEqual(99);
  });

  it("should have non-empty required fields", () => {
    for (const project of PROJECTS) {
      expect(project.slug).toBeTruthy();
      expect(project.name).toBeTruthy();
      expect(project.desc).toBeTruthy();
      expect(project.layer).toBeTruthy();
      expect(project.status).toBeTruthy();
    }
  });

  it("should have every layer represented by at least one project", () => {
    const usedLayers = new Set<string>(PROJECTS.map((p) => p.layer));
    for (const layer of VALID_LAYERS) {
      expect(usedLayers.has(layer)).toBe(true);
    }
  });
});
