import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: vi.fn(),
}));

import { createServiceRoleClient } from "@/lib/supabase/server";
import { getPageViewStatsForPath, getProjectGrowthBySlug } from "./metrics";

const createProjectsQuery = (rows: Array<{ id: string }>) => {
  const query: Record<string, unknown> = {};
  query.select = vi.fn(() => query);
  query.ilike = vi.fn(() => query);
  query.limit = vi.fn(() => Promise.resolve({ data: rows, error: null }));
  return query as { select: () => typeof query; ilike: () => typeof query; limit: () => Promise<unknown> };
};

const createGrowthQuery = (rows: Array<{ snapshot_date: string; stars: number; source?: string }>) => {
  const query: Record<string, unknown> = {};
  query.select = vi.fn(() => query);
  query.eq = vi.fn(() => query);
  query.gte = vi.fn(() => query);
  query.order = vi.fn(() => Promise.resolve({ data: rows, error: null }));
  return query as {
    select: () => typeof query;
    eq: () => typeof query;
    gte: () => typeof query;
    order: () => Promise<unknown>;
  };
};

const createPageViewTotalQuery = (count: number) => {
  const query: Record<string, unknown> = {};
  query.select = vi.fn(() => query);
  query.eq = vi.fn(() => Promise.resolve({ count, data: null }));
  return query as { select: () => typeof query; eq: () => Promise<unknown> };
};

const createPageViewRecentQuery = (count: number) => {
  const query: Record<string, unknown> = {};
  query.select = vi.fn(() => query);
  query.eq = vi.fn(() => query);
  query.gte = vi.fn(() => Promise.resolve({ count, data: null }));
  return query as {
    select: () => typeof query;
    eq: () => typeof query;
    gte: () => Promise<unknown>;
  };
};

describe("metrics data utilities", () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "svc-key";
    vi.mocked(createServiceRoleClient).mockReset();
  });

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    }
    if (originalKey === undefined) {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    } else {
      process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
    }
  });

  it("falls back to an empty array when env credentials are missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const growth = await getProjectGrowthBySlug("openclaw");
    const views = await getPageViewStatsForPath("/projects/openclaw");

    expect(growth).toEqual([]);
    expect(views).toEqual({
      path: "/projects/openclaw",
      totalViews: 0,
      recentViews: 0,
      windowDays: 30,
    });
  });

  it("returns growth snapshots and delta deltas", async () => {
    vi.mocked(createServiceRoleClient).mockResolvedValue({
      from: vi
        .fn()
        .mockReturnValueOnce(createProjectsQuery([{ id: "proj-1" }]))
        .mockReturnValueOnce(
          createGrowthQuery([
            { snapshot_date: "2026-02-14", stars: 10, source: "github-api" },
            { snapshot_date: "2026-02-15", stars: 13, source: "github-api" },
          ])
        ),
    } as never);

    const growth = await getProjectGrowthBySlug("openclaw", 7);

    expect(growth).toEqual([
      { snapshotDate: "2026-02-14", stars: 10, source: "github-api", delta: 0 },
      { snapshotDate: "2026-02-15", stars: 13, source: "github-api", delta: 3 },
    ]);
  });

  it("returns page view counts from two query variants", async () => {
    vi.mocked(createServiceRoleClient).mockResolvedValue({
      from: vi
        .fn()
        .mockReturnValueOnce(createPageViewTotalQuery(120))
        .mockReturnValueOnce(createPageViewRecentQuery(12)),
    } as never);

    const stats = await getPageViewStatsForPath("/projects/openclaw", 14);

    expect(stats).toEqual({
      path: "/projects/openclaw",
      totalViews: 120,
      recentViews: 12,
      windowDays: 14,
    });
  });

  it("returns zeroed page view stats on query error", async () => {
    vi.mocked(createServiceRoleClient).mockResolvedValue({
      from: vi.fn(() => {
        throw new Error("db-failed");
      }),
    } as never);

    const stats = await getPageViewStatsForPath("/projects/openclaw", 14);

    expect(stats).toEqual({
      path: "/projects/openclaw",
      totalViews: 0,
      recentViews: 0,
      windowDays: 14,
    });
  });
});
