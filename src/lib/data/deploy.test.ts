import { describe, it, expect } from "vitest";
import { getDeployOptions, getDeployBySlug } from "./deploy";

describe("getDeployOptions", () => {
  it("should return all deploy options when no filter", async () => {
    const result = await getDeployOptions();
    expect(result.options.length).toBeGreaterThan(0);
    expect(result.count).toBeGreaterThan(0);
  });

  it("should filter by level", async () => {
    const level1 = await getDeployOptions({ level: 1 });
    expect(level1.options.length).toBeGreaterThan(0);
    expect(level1.options.every((d) => d.level === 1)).toBe(true);
  });

  it("should return different results for different levels", async () => {
    const level1 = await getDeployOptions({ level: 1 });
    const level4 = await getDeployOptions({ level: 4 });
    expect(level1.count).not.toBe(level4.count);
  });

  it("should return empty for non-existent level", async () => {
    const result = await getDeployOptions({ level: 99 });
    expect(result.options).toHaveLength(0);
  });
});

describe("getDeployBySlug", () => {
  it("should return a deploy option for a valid slug", async () => {
    const option = await getDeployBySlug("docker");
    expect(option).not.toBeNull();
    expect(option?.name).toBe("Docker");
  });

  it("should return null for non-existent slug", async () => {
    const option = await getDeployBySlug("does-not-exist");
    expect(option).toBeNull();
  });
});
