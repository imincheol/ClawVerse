import { describe, it, expect } from "vitest";
import { SOURCE_REGISTRY, getSource, getEffectiveSources, getInstallCommands } from "./sources";

describe("SOURCE_REGISTRY", () => {
  it("should have known sources", () => {
    expect(SOURCE_REGISTRY.clawhub).toBeDefined();
    expect(SOURCE_REGISTRY.github).toBeDefined();
    expect(SOURCE_REGISTRY.community).toBeDefined();
    expect(SOURCE_REGISTRY.moltbooks).toBeDefined();
    expect(SOURCE_REGISTRY.openclawskill).toBeDefined();
  });
});

describe("getSource", () => {
  it("should return source for valid ID", () => {
    const source = getSource("clawhub");
    expect(source).not.toBeNull();
    expect(source!.name).toBe("ClawHub");
  });

  it("should normalize case", () => {
    const source = getSource("GitHub");
    expect(source).not.toBeNull();
    expect(source!.id).toBe("github");
  });

  it("should return null for unknown source", () => {
    expect(getSource("nonexistent")).toBeNull();
  });
});

describe("getEffectiveSources", () => {
  it("should return explicit sources if provided", () => {
    const refs = getEffectiveSources({
      source: "clawhub",
      sources: [{ sourceId: "clawhub" }],
      installs: 100,
      security: "verified",
    });
    expect(refs).toEqual([{ sourceId: "clawhub" }]);
  });

  it("should infer awesome-openclaw-skills for popular ClawHub skills", () => {
    const refs = getEffectiveSources({
      source: "clawhub",
      installs: 5000,
      security: "verified",
    });
    const sourceIds = refs.map((r) => r.sourceId);
    expect(sourceIds).toContain("clawhub");
    expect(sourceIds).toContain("awesome-openclaw-skills");
  });

  it("should infer moltbooks for verified clawhub skills with 3000+ installs", () => {
    const refs = getEffectiveSources({
      source: "clawhub",
      installs: 5000,
      security: "verified",
    });
    const sourceIds = refs.map((r) => r.sourceId);
    expect(sourceIds).toContain("moltbooks");
  });

  it("should not include awesome-openclaw-skills for blocked skills", () => {
    const refs = getEffectiveSources({
      source: "clawhub",
      installs: 5000,
      security: "blocked",
    });
    const sourceIds = refs.map((r) => r.sourceId);
    expect(sourceIds).not.toContain("awesome-openclaw-skills");
  });
});

describe("getInstallCommands", () => {
  it("should return install commands for known sources", () => {
    const commands = getInstallCommands("browser-automation", [{ sourceId: "clawhub" }]);
    expect(commands).toHaveLength(1);
    expect(commands[0].command).toContain("browser-automation");
    expect(commands[0].source.id).toBe("clawhub");
  });

  it("should skip unknown sources", () => {
    const commands = getInstallCommands("test", [{ sourceId: "unknown-source" }]);
    expect(commands).toHaveLength(0);
  });

  it("should use fallback comment when no install command exists", () => {
    const commands = getInstallCommands("test-skill", [{ sourceId: "community" }]);
    expect(commands).toHaveLength(1);
    expect(commands[0].command).toContain("# Visit");
  });
});
