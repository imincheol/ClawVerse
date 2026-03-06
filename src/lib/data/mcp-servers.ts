import { MCP_SERVERS as STATIC_MCP } from "@/data/mcp-servers";
import type { McpServer } from "@/data/mcp-servers";
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

function mapDbToMcp(row: Record<string, unknown>): McpServer {
  return {
    id: typeof row.id === "string" ? uuidToNumericId(row.id) : (row.id as number),
    slug: row.slug as string,
    name: row.name as string,
    desc: (row.description as string) || "",
    source: (row.source as string) || "",
    sourceUrl: (row.source_url as string) || undefined,
    category: row.category as McpServer["category"],
    security: row.security as McpServer["security"],
    runtime: (row.runtime as McpServer["runtime"]) || "stdio",
    tools: (row.tools as number) || 0,
    downloads: (row.downloads as number) || 0,
    rating: Number(row.rating) || 0,
    reviews: (row.review_count as number) || 0,
    author: (row.author as string) || "",
    platforms: (row.platforms as string[]) || [],
    lastUpdated: (row.last_updated as string) || new Date().toISOString().slice(0, 10),
  };
}

export interface McpFilters {
  search?: string;
  category?: string;
  source?: string;
  security?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export async function getMcpServers(filters: McpFilters = {}): Promise<McpServer[]> {
  const supabase = await getSupabase();

  if (!supabase) {
    return filterStaticMcp(filters);
  }

  try {
    let query = supabase.from("mcp_servers").select("*");

    if (filters.search) {
      query = query.textSearch("search_vector", filters.search, { type: "websearch" });
    }
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
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
      case "tools":
        query = query.order("tools", { ascending: false });
        break;
      case "downloads":
      default:
        query = query.order("downloads", { ascending: false });
    }

    const effectiveLimit = filters.limit || 50;
    const start = filters.offset || 0;
    query = query.range(start, start + effectiveLimit - 1);

    const { data, error } = await query;
    if (error || !data) return filterStaticMcp(filters);

    return data.map(mapDbToMcp);
  } catch {
    return filterStaticMcp(filters);
  }
}

export async function getMcpServerBySlug(slug: string): Promise<McpServer | null> {
  const supabase = await getSupabase();

  if (!supabase) {
    return STATIC_MCP.find((m) => m.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("mcp_servers")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return STATIC_MCP.find((m) => m.slug === slug) || null;
    return mapDbToMcp(data);
  } catch {
    return STATIC_MCP.find((m) => m.slug === slug) || null;
  }
}

function filterStaticMcp(filters: McpFilters): McpServer[] {
  let result = [...STATIC_MCP];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }
  if (filters.category && filters.category !== "all") {
    result = result.filter((m) => m.category === filters.category);
  }
  if (filters.source && filters.source !== "all") {
    result = result.filter((m) => m.source === filters.source);
  }
  if (filters.security && filters.security !== "all") {
    result = result.filter((m) => m.security === filters.security);
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
    case "tools":
      result.sort((a, b) => b.tools - a.tools);
      break;
    case "downloads":
    default:
      result.sort((a, b) => b.downloads - a.downloads);
  }

  if (filters.offset) result = result.slice(filters.offset);
  if (filters.limit) result = result.slice(0, filters.limit);

  return result;
}
