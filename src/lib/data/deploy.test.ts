import { describe, it, expect } from "vitest";
import { getDeployOptions, getDeployBySlug } from "./deploy";

describe("getDeployOptions", () => {
  it("should return all deploy options when no filter", async () => {
    const options = await getDeployOptions();
    expect(options.length).toBeGreaterThan(0);
  });

  it("should filter by level", async () => {
    const level1 = await getDeployOptions(1);
    expect(level1.length).toBeGreaterThan(0);
    expect(level1.every((d) => d.level === 1)).toBe(true);
  });

  it("should return different results for different levels", async () => {
    const level1 = await getDeployOptions(1);
    const level4 = await getDeployOptions(4);
    expect(level1.length).not.toBe(level4.length);
  });

  it("should return empty for non-existent level", async () => {
    const result = await getDeployOptions(99);
    expect(result).toHaveLength(0);
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
