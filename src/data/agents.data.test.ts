import { describe, it, expect } from "vitest";
import {
  AGENTS,
  AGENT_TYPES,
  AGENT_ROLES,
  AGENT_TYPE_CONFIG,
  AGENT_ROLE_CONFIG,
  COMPLEXITY_CONFIG,
  FORMAT_CONFIG,
} from "./agents";
import type { SecurityLevel } from "./skills";

const VALID_SECURITY: SecurityLevel[] = ["verified", "reviewed", "unreviewed", "flagged", "blocked"];

// Derive valid values from source-of-truth config objects
const VALID_TYPES = Object.keys(AGENT_TYPE_CONFIG);
const VALID_ROLES = Object.keys(AGENT_ROLE_CONFIG);
const VALID_COMPLEXITIES = Object.keys(COMPLEXITY_CONFIG);
const VALID_FORMATS = Object.keys(FORMAT_CONFIG);

describe("AGENTS data integrity", () => {
  it("should have all unique ids", () => {
    const ids = AGENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have all unique slugs", () => {
    const slugs = AGENTS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("should have valid type values", () => {
    for (const agent of AGENTS) {
      expect(VALID_TYPES).toContain(agent.type);
    }
  });

  it("should have valid role values", () => {
    for (const agent of AGENTS) {
      expect(VALID_ROLES).toContain(agent.role);
    }
  });

  it("should have valid security values", () => {
    for (const agent of AGENTS) {
      expect(VALID_SECURITY).toContain(agent.security);
    }
  });

  it("should have valid complexity values", () => {
    for (const agent of AGENTS) {
      expect(VALID_COMPLEXITIES).toContain(agent.complexity);
    }
  });

  it("should have valid config format values", () => {
    for (const agent of AGENTS) {
      expect(VALID_FORMATS).toContain(agent.configFormat);
    }
  });

  it("should have ratings between 0 and 5", () => {
    for (const agent of AGENTS) {
      expect(agent.rating).toBeGreaterThanOrEqual(0);
      expect(agent.rating).toBeLessThanOrEqual(5);
    }
  });

  it("should have non-negative download counts", () => {
    for (const agent of AGENTS) {
      expect(agent.downloads).toBeGreaterThanOrEqual(0);
    }
  });

  it("should have positive agent count", () => {
    for (const agent of AGENTS) {
      expect(agent.agentCount).toBeGreaterThanOrEqual(1);
    }
  });

  // Use minimum-count assertion so adding new agents never breaks the test.
  it("should have at least 20 agents", () => {
    expect(AGENTS.length).toBeGreaterThanOrEqual(20);
  });

  it("should have non-empty required fields", () => {
    for (const agent of AGENTS) {
      expect(agent.slug).toBeTruthy();
      expect(agent.name).toBeTruthy();
      expect(agent.desc).toBeTruthy();
      expect(agent.source).toBeTruthy();
      expect(agent.author).toBeTruthy();
      expect(agent.frameworks.length).toBeGreaterThan(0);
      expect(agent.tags.length).toBeGreaterThan(0);
      expect(agent.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("should have AGENT_TYPES entries match AGENT_TYPE_CONFIG keys", () => {
    const typeIds = AGENT_TYPES.filter((t) => t.id !== "all").map((t) => t.id);
    for (const typeId of typeIds) {
      expect(VALID_TYPES).toContain(typeId);
    }
  });

  it("should have AGENT_ROLES entries match AGENT_ROLE_CONFIG keys", () => {
    const roleIds = AGENT_ROLES.filter((r) => r.id !== "all").map((r) => r.id);
    for (const roleId of roleIds) {
      expect(VALID_ROLES).toContain(roleId);
    }
  });

  it("should have at least one agent of each type", () => {
    const usedTypes = new Set<string>(AGENTS.map((a) => a.type));
    for (const t of VALID_TYPES) {
      expect(usedTypes.has(t)).toBe(true);
    }
  });
});
