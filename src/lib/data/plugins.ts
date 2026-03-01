import { PLUGINS as STATIC_PLUGINS } from "@/data/plugins";
import type { Plugin } from "@/data/plugins";
import { uuidToNumericId } from "./uuid-id";

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

function mapDbToPlugin(row: Record<string, unknown>): Plugin {
  return {
    id: typeof row.id === "string" ? uuidToNumericId(row.id) : (row.id as number),
    slug: row.slug as string,
    name: row.name as string,
    desc: (row.description as string) || "",
    type: row.type as Plugin["type"],
    source: (row.source as string) || "",
    sourceUrl: (row.source_url as string) || undefined,
    security: row.security as Plugin["security"],
    downloads: (row.downloads as number) || 0,
    rating: Number(row.rating) || 0,
    reviews: (row.review_count as number) || 0,
    author: (row.author as string) || "",
    platforms: (row.platforms as string[]) || [],
    lastUpdated: (row.last_updated as string) || new Date().toISOString().slice(0, 10),
  };
}

export interface PluginFilters {
  search?: string;
  type?: string;
  source?: string;
  security?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export async function getPlugins(filters: PluginFilters = {}): Promise<Plugin[]> {
  const supabase = await getSupabase();

  if (!supabase) {
    return filterStaticPlugins(filters);
  }

  try {
    let query = supabase.from("plugins").select("*");

    if (filters.search) {
      query = query.textSearch("search_vector", filters.search, { type: "websearch" });
    }
    if (filters.type && filters.type !== "all") {
      query = query.eq("type", filters.type);
    }
    if (filters.source && filters.source !== "all") {
      query = query.eq("source", filters.source);
    }
    if (filters.security && filters.security !== "all") {
      query = query.eq("security", filters.security);
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
      case "downloads":
      default:
        query = query.order("downloads", { ascending: false });
    }

    const effectiveLimit = filters.limit || 50;
    const start = filters.offset || 0;
    query = query.range(start, start + effectiveLimit - 1);

    const { data, error } = await query;
    if (error || !data) return filterStaticPlugins(filters);

    return data.map(mapDbToPlugin);
  } catch {
    return filterStaticPlugins(filters);
  }
}

export async function getPluginBySlug(slug: string): Promise<Plugin | null> {
  const supabase = await getSupabase();

  if (!supabase) {
    return STATIC_PLUGINS.find((p) => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("plugins")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return STATIC_PLUGINS.find((p) => p.slug === slug) || null;
    return mapDbToPlugin(data);
  } catch {
    return STATIC_PLUGINS.find((p) => p.slug === slug) || null;
  }
}

function filterStaticPlugins(filters: PluginFilters): Plugin[] {
  let result = [...STATIC_PLUGINS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
    );
  }
  if (filters.type && filters.type !== "all") {
    result = result.filter((p) => p.type === filters.type);
  }
  if (filters.source && filters.source !== "all") {
    result = result.filter((p) => p.source === filters.source);
  }
  if (filters.security && filters.security !== "all") {
    result = result.filter((p) => p.security === filters.security);
  }

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
    case "downloads":
    default:
      result.sort((a, b) => b.downloads - a.downloads);
  }

  if (filters.offset) result = result.slice(filters.offset);
  if (filters.limit) result = result.slice(0, filters.limit);

  return result;
}
