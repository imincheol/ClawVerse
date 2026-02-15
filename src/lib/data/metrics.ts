import { createServiceRoleClient } from "@/lib/supabase/server";

function parseDays(raw: string | null): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return 30;
  return Math.min(Math.max(Math.floor(parsed), 1), 365);
}

export interface ProjectGrowthPoint {
  snapshotDate: string;
  stars: number;
  source: string;
  delta: number;
}

export interface PageViewStats {
  path: string;
  totalViews: number;
  recentViews: number;
  windowDays: number;
}

function normalizePath(path: string) {
  if (!path || !path.trim()) return "/";
  const cleaned = path.trim();
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}

async function getServiceClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  try {
    return createServiceRoleClient();
  } catch {
    return null;
  }
}

export async function getProjectGrowthBySlug(
  slug: string,
  days = 30
): Promise<ProjectGrowthPoint[]> {
  const supabase = await getServiceClient();
  if (!supabase) return [];

  try {
    const safeDays = parseDays(String(days));
    const safeSlug = slug.toLowerCase();

    const { data: projectRows, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .ilike("slug", safeSlug)
      .limit(1);

    if (projectError || !projectRows?.length) return [];

    const project = projectRows[0];
    const sinceDate = new Date();
    sinceDate.setUTCDate(sinceDate.getUTCDate() - (safeDays - 1));

    const { data, error } = await supabase
      .from("project_growth_snapshots")
      .select("snapshot_date,stars,source,created_at")
      .eq("project_id", project.id)
      .gte("snapshot_date", sinceDate.toISOString().slice(0, 10))
      .order("snapshot_date", { ascending: true });

    if (error || !data?.length) return [];

    let prev = data[0]?.stars as number | null;
    return data.map((row: Record<string, unknown>) => {
      const stars = Number(row.stars ?? 0);
      const delta = typeof prev === "number" ? stars - prev : 0;
      prev = stars;
      return {
        snapshotDate: String(row.snapshot_date),
        stars,
        source: String(row.source || "unknown"),
        delta,
      };
    });
  } catch {
    return [];
  }
}

export async function getPageViewStatsForPath(
  path: string,
  days = 30
): Promise<PageViewStats> {
  const supabase = await getServiceClient();
  const normalizedPath = normalizePath(path);

  if (!supabase) {
    return { path: normalizedPath, totalViews: 0, recentViews: 0, windowDays: parseDays(String(days)) };
  }

  try {
    const safeDays = parseDays(String(days));
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - (safeDays - 1));
    const iso = since.toISOString();

    const [{ count: totalCount }, { count: recentCount }] = await Promise.all([
      supabase
        .from("page_view_events")
        .select("*", { count: "exact", head: true })
        .eq("path", normalizedPath),
      supabase
        .from("page_view_events")
        .select("*", { count: "exact", head: true })
        .eq("path", normalizedPath)
        .gte("viewed_at", iso),
    ]);

    const total = Number(totalCount || 0);
    const recent = Number(recentCount || 0);
    return {
      path: normalizedPath,
      totalViews: total,
      recentViews: recent,
      windowDays: safeDays,
    };
  } catch {
    return { path: normalizedPath, totalViews: 0, recentViews: 0, windowDays: parseDays(String(days)) };
  }
}
