import { PROJECTS as STATIC_PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";

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

function mapDbToProject(row: Record<string, unknown>): Project {
  return {
    id: typeof row.id === "string" ? row.id.charCodeAt(0) : (row.id as number),
    slug: row.slug as string,
    name: row.name as string,
    desc: (row.description as string) || "",
    layer: row.layer as Project["layer"],
    stars: (row.github_stars as number) || null,
    status: (row.status as Project["status"]) || "active",
    official: (row.is_official as boolean) || false,
    url: (row.url as string) || null,
  };
}

export interface ProjectFilters {
  search?: string;
  layer?: string;
  status?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProjectQueryResult {
  projects: Project[];
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

const STATUS_ORDER: Record<string, number> = {
  viral: 0,
  active: 1,
  research: 2,
  inactive: 3,
};

function sortProjects(items: Project[], sort: string): Project[] {
  const result = [...items];
  switch (sort) {
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      result.sort((a, b) => b.id - a.id);
      break;
    case "status":
      result.sort(
        (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
      );
      break;
    case "stars":
    default:
      result.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
  }
  return result;
}

function filterStaticProjects(filters: ProjectFilters): ProjectQueryResult {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 20));
  const search = (filters.search || "").trim().toLowerCase();

  let result = [...STATIC_PROJECTS];

  if (filters.layer && filters.layer !== "all") {
    result = result.filter((p) => p.layer === filters.layer);
  }
  if (filters.status && filters.status !== "all") {
    result = result.filter((p) => p.status === filters.status);
  }
  if (search) {
    result = result.filter((p) => {
      const url = (p.url || "").toLowerCase();
      return (
        p.name.toLowerCase().includes(search) ||
        p.desc.toLowerCase().includes(search) ||
        p.slug.toLowerCase().includes(search) ||
        url.includes(search)
      );
    });
  }

  result = sortProjects(result, filters.sort || "stars");

  const count = result.length;
  const offset = (page - 1) * limit;
  const projects = result.slice(offset, offset + limit);
  return { projects, count, page, limit, hasMore: offset + limit < count };
}

export async function getProjects(filters: ProjectFilters = {}): Promise<ProjectQueryResult> {
  const supabase = await getSupabase();

  if (!supabase) {
    return filterStaticProjects(filters);
  }

  try {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 20));
    const offset = (page - 1) * limit;
    const search = (filters.search || "").trim();

    let query = supabase.from("projects").select("*", { count: "exact" });

    if (filters.layer && filters.layer !== "all") query = query.eq("layer", filters.layer);
    if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
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
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "status":
        query = query.order("status", { ascending: true });
        break;
      case "stars":
      default:
        query = query.order("github_stars", { ascending: false, nullsFirst: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error || !data) return filterStaticProjects(filters);

    let projects = data.map(mapDbToProject);
    if (filters.sort === "status") {
      projects = sortProjects(projects, "status");
    }

    return {
      projects,
      count: count ?? projects.length,
      page,
      limit,
      hasMore: offset + projects.length < (count ?? projects.length),
    };
  } catch {
    return filterStaticProjects(filters);
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await getSupabase();

  if (!supabase) {
    return STATIC_PROJECTS.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return STATIC_PROJECTS.find((p) => p.slug === slug) || null;
    return mapDbToProject(data);
  } catch {
    return STATIC_PROJECTS.find((p) => p.slug === slug) || null;
  }
}
