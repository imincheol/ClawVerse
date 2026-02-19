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

  it("should have required fields for each source", () => {
    for (const [key, source] of Object.entries(SOURCE_REGISTRY)) {
      expect(source.id).toBe(key);
      expect(source.name).toBeTruthy();
      expect(source.shortName).toBeTruthy();
      expect(source.url).toBeTruthy();
      expect(source.color).toBeTruthy();
      expect(source.icon).toBeTruthy();
      expect(source.skillUrlPattern).toBeTruthy();
      expect(source.description).toBeTruthy();
      expect(typeof source.hasSecurityScan).toBe("boolean");
      expect(typeof source.totalSkills).toBe("number");
    }
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

  it("should handle source IDs with spaces", () => {
    const source = getSource("awesome openclaw skills");
    expect(source).not.toBeNull();
    expect(source?.id).toBe("awesome-openclaw-skills");
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

  it("should add openclawskill for popular skills with 4000+ installs", () => {
    const refs = getEffectiveSources({
      source: "ClawHub",
      installs: 5000,
      security: "verified",
    });
    expect(refs.some((s) => s.sourceId === "openclawskill")).toBe(true);
  });

  it("should not add openclawskill for blocked skills", () => {
    const refs = getEffectiveSources({
      source: "ClawHub",
      installs: 5000,
      security: "blocked",
    });
    expect(refs.some((s) => s.sourceId === "openclawskill")).toBe(false);
  });

  it("should add awesome-openclaw-skills for popular GitHub skills", () => {
    const refs = getEffectiveSources({
      source: "GitHub",
      installs: 2500,
      security: "reviewed",
    });
    expect(refs.some((s) => s.sourceId === "awesome-openclaw-skills")).toBe(true);
  });

  it("should not add awesome-openclaw-skills for flagged GitHub skills", () => {
    const refs = getEffectiveSources({
      source: "GitHub",
      installs: 3000,
      security: "flagged",
    });
    expect(refs.some((s) => s.sourceId === "awesome-openclaw-skills")).toBe(false);
  });

  it("should map Community source to community primary", () => {
    const refs = getEffectiveSources({
      source: "Community",
      installs: 100,
      security: "unreviewed",
    });
    expect(refs[0].sourceId).toBe("community");
  });
});

describe("getInstallCommands", () => {
  it("should return install commands for known sources", () => {
    const commands = getInstallCommands("browser-automation", [{ sourceId: "clawhub" }]);
    expect(commands).toHaveLength(1);
    expect(commands[0].command).toContain("browser-automation");
    expect(commands[0].source.id).toBe("clawhub");
  });

  it("should handle multiple sources", () => {
    const commands = getInstallCommands("test-skill", [
      { sourceId: "clawhub" },
      { sourceId: "github" },
    ]);
    expect(commands).toHaveLength(2);
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

  it("should use override URL if provided in SourceRef", () => {
    const commands = getInstallCommands("test-skill", [
      { sourceId: "clawhub", url: "https://custom.url/test" },
    ]);
    expect(commands[0].url).toBe("https://custom.url/test");
  });
});
