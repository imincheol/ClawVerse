import { describe, it, expect } from "vitest";
import { generatePageMetadata } from "./seo";

describe("generatePageMetadata", () => {
  it('should format title as "Title | ClawVerse"', () => {
    const meta = generatePageMetadata("Skills Hub");
    expect(meta.title).toBe("Skills Hub | ClawVerse");
  });

  it("should use default description when none provided", () => {
    const meta = generatePageMetadata("Home");
    expect(meta.description).toBe(
      "Discover, share, and connect every project built on the OpenClaw universe."
    );
  });

  it("should use custom description when provided", () => {
    const meta = generatePageMetadata("Deploy", "Compare deploy options");
    expect(meta.description).toBe("Compare deploy options");
  });

  it("should construct URL from path", () => {
    const meta = generatePageMetadata("Skills", undefined, "/skills");
    expect(meta.openGraph?.url).toBe("https://clawverse.io/skills");
  });

  it("should use base URL when no path is provided", () => {
    const meta = generatePageMetadata("Home");
    expect(meta.openGraph?.url).toBe("https://clawverse.io");
  });

  it("should include openGraph fields", () => {
    const meta = generatePageMetadata("Projects", "All projects", "/projects");
    const og = meta.openGraph;
    expect(og).toBeDefined();
    expect(og?.title).toBe("Projects | ClawVerse");
    expect(og?.description).toBe("All projects");
    expect(og?.siteName).toBe("ClawVerse");
    expect(og?.type).toBe("website");
    expect(og?.images).toHaveLength(1);
  });

  it("should include twitter card fields", () => {
    const meta = generatePageMetadata("Pulse");
    const tw = meta.twitter;
    expect(tw).toBeDefined();
    expect(tw?.card).toBe("summary_large_image");
    expect(tw?.title).toBe("Pulse | ClawVerse");
    expect(tw?.images).toHaveLength(1);
  });
});
