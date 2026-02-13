import { SKILLS as STATIC_SKILLS } from "@/data/skills";
import type { Skill } from "@/data/skills";

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

export interface SkillFilters {
  search?: string;
  security?: string;
  category?: string;
  source?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

function mapDbToSkill(row: Record<string, unknown>): Skill {
  return {
    id: typeof row.id === "string" ? row.id.charCodeAt(0) : (row.id as number),
    slug: row.slug as string,
    name: row.name as string,
    desc: (row.description as string) || "",
    source: row.source as string,
    installs: (row.installs as number) || 0,
    rating: Number(row.rating) || 0,
    reviews: (row.review_count as number) || 0,
    security: row.security as Skill["security"],
    category: row.category as Skill["category"],
    permissions: (row.permissions as string[]) || [],
    platforms: (row.platforms as string[]) || [],
    protocols: (row.protocols as Skill["protocols"]) || ["MCP"],
    lastUpdated: (row.last_updated as string) || new Date().toISOString().slice(0, 10),
    maintainerActivity: (row.maintainer_activity as Skill["maintainerActivity"]) || "moderate",
  };
}

export async function getSkills(filters: SkillFilters = {}): Promise<Skill[]> {
  const supabase = await getSupabase();

  if (!supabase) {
    return filterStaticSkills(filters);
  }

  try {
    let query = supabase.from("skills").select("*");

    if (filters.search) {
      query = query.textSearch("search_vector", filters.search, { type: "websearch" });
    }
    if (filters.security && filters.security !== "all") {
      query = query.eq("security", filters.security);
    }
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }
    if (filters.source && filters.source !== "all") {
      query = query.eq("source", filters.source);
    }

    switch (filters.sort) {
      case "rating":
        query = query.order("rating", { ascending: false });
        break;
      case "name":
        query = query.order("name", { ascending: true });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "security":
        query = query.order("security", { ascending: true });
        break;
      default:
        query = query.order("installs", { ascending: false });
    }

    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);

    const { data, error } = await query;
    if (error || !data) return filterStaticSkills(filters);

    return data.map(mapDbToSkill);
  } catch {
    return filterStaticSkills(filters);
  }
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  const supabase = await getSupabase();

  if (!supabase) {
    return STATIC_SKILLS.find((s) => s.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return STATIC_SKILLS.find((s) => s.slug === slug) || null;
    return mapDbToSkill(data);
  } catch {
    return STATIC_SKILLS.find((s) => s.slug === slug) || null;
  }
}

function filterStaticSkills(filters: SkillFilters): Skill[] {
  let result = [...STATIC_SKILLS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (s) => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
    );
  }
  if (filters.security && filters.security !== "all") {
    result = result.filter((s) => s.security === filters.security);
  }
  if (filters.category && filters.category !== "all") {
    result = result.filter((s) => s.category === filters.category);
  }
  if (filters.source && filters.source !== "all") {
    result = result.filter((s) => s.source === filters.source);
  }

  const SECURITY_ORDER: Record<string, number> = { verified: 0, reviewed: 1, unreviewed: 2, flagged: 3, blocked: 4 };
  switch (filters.sort) {
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      result.sort((a, b) => b.id - a.id);
      break;
    case "security":
      result.sort((a, b) => (SECURITY_ORDER[a.security] ?? 9) - (SECURITY_ORDER[b.security] ?? 9));
      break;
    default:
      result.sort((a, b) => b.installs - a.installs);
  }

  if (filters.offset) result = result.slice(filters.offset);
  if (filters.limit) result = result.slice(0, filters.limit);

  return result;
}
