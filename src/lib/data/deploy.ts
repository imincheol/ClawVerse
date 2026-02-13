import { DEPLOY_OPTIONS as STATIC_DEPLOY } from "@/data/deploy";
import type { DeployOption } from "@/data/deploy";

let supabaseModule: typeof import("@/lib/supabase/server") | null = null;

async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!supabaseModule) {
    supabaseModule = await import("@/lib/supabase/server");
  }
  try {
    return await supabaseModule.createServerSupabaseClient();
  } catch {
    return null;
  }
}

function mapDbToDeploy(row: Record<string, unknown>): DeployOption {
  return {
    id: typeof row.id === "string" ? row.id.charCodeAt(0) : (row.id as number),
    slug: row.slug as string,
    name: row.name as string,
    desc: (row.description as string) || "",
    level: (row.skill_level as number) || 1,
    cost: (row.cost as string) || "",
    setup: (row.setup_time as string) || "",
    security: (row.security as string) || "",
    scalability: (row.scalability as string) || "",
    bestFor: (row.best_for as string) || "",
    url: (row.url as string) || "",
    pros: (row.pros as string[]) || [],
    cons: (row.cons as string[]) || [],
  };
}

export interface DeployFilters {
  search?: string;
  level?: number;
  security?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface DeployQueryResult {
  options: DeployOption[];
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

const SECURITY_ORDER: Record<string, number> = {
  "Very High": 0,
  High: 1,
  Medium: 2,
  Low: 3,
  Varies: 4,
  "N/A": 5,
};

function parseSetupMinutes(s: string): number {
  if (s.includes("min")) {
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? 5 : n;
  }
  if (s.includes("hr")) {
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? 60 : n * 60;
  }
  return 999;
}

function sortDeploy(items: DeployOption[], sort: string): DeployOption[] {
  const result = [...items];
  switch (sort) {
    case "cost":
      result.sort((a, b) => a.cost.localeCompare(b.cost));
      break;
    case "setup":
      result.sort((a, b) => parseSetupMinutes(a.setup) - parseSetupMinutes(b.setup));
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "security":
      result.sort(
        (a, b) => (SECURITY_ORDER[a.security] ?? 9) - (SECURITY_ORDER[b.security] ?? 9)
      );
      break;
    case "level":
    default:
      result.sort((a, b) => a.level - b.level);
  }
  return result;
}

function filterStaticDeploy(filters: DeployFilters): DeployQueryResult {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 20));
  const search = (filters.search || "").trim().toLowerCase();

  let result = [...STATIC_DEPLOY];
  if (filters.level) result = result.filter((d) => d.level === filters.level);
  if (filters.security && filters.security !== "all") {
    result = result.filter((d) => d.security === filters.security);
  }
  if (search) {
    result = result.filter((d) => {
      const url = (d.url || "").toLowerCase();
      return (
        d.name.toLowerCase().includes(search) ||
        d.desc.toLowerCase().includes(search) ||
        d.slug.toLowerCase().includes(search) ||
        url.includes(search)
      );
    });
  }

  result = sortDeploy(result, filters.sort || "level");
  const count = result.length;
  const offset = (page - 1) * limit;
  const options = result.slice(offset, offset + limit);
  return { options, count, page, limit, hasMore: offset + limit < count };
}

export async function getDeployOptions(filters: DeployFilters = {}): Promise<DeployQueryResult> {
  const supabase = await getSupabase();

  if (!supabase) {
    return filterStaticDeploy(filters);
  }

  try {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 20));
    const offset = (page - 1) * limit;
    const search = (filters.search || "").trim();

    let query = supabase.from("deploy_options").select("*", { count: "exact" });
    if (filters.level) query = query.eq("skill_level", filters.level);
    if (filters.security && filters.security !== "all") {
      query = query.eq("security", filters.security);
    }
    if (search) {
      const safe = search.replace(/,/g, " ");
      query = query.or(
        `name.ilike.%${safe}%,description.ilike.%${safe}%,slug.ilike.%${safe}%,url.ilike.%${safe}%`
      );
    }

    switch (filters.sort) {
      case "name":
        query = query.order("name", { ascending: true });
        break;
      case "cost":
        query = query.order("cost", { ascending: true });
        break;
      case "setup":
        query = query.order("setup_time", { ascending: true });
        break;
      case "security":
        query = query.order("security", { ascending: true });
        break;
      case "level":
      default:
        query = query.order("skill_level", { ascending: true });
    }
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error || !data) return filterStaticDeploy(filters);

    let options = data.map(mapDbToDeploy);
    if (filters.sort === "setup" || filters.sort === "security" || filters.sort === "cost") {
      options = sortDeploy(options, filters.sort);
    }

    return {
      options,
      count: count ?? options.length,
      page,
      limit,
      hasMore: offset + options.length < (count ?? options.length),
    };
  } catch {
    return filterStaticDeploy(filters);
  }
}

export async function getDeployBySlug(slug: string): Promise<DeployOption | null> {
  const supabase = await getSupabase();

  if (!supabase) {
    return STATIC_DEPLOY.find((d) => d.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("deploy_options")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return STATIC_DEPLOY.find((d) => d.slug === slug) || null;
    return mapDbToDeploy(data);
  } catch {
    return STATIC_DEPLOY.find((d) => d.slug === slug) || null;
  }
}
