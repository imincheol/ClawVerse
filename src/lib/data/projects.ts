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

export async function getProjects(layer?: string): Promise<Project[]> {
  const supabase = await getSupabase();

  if (!supabase) {
    if (layer && layer !== "all") return STATIC_PROJECTS.filter((p) => p.layer === layer);
    return STATIC_PROJECTS;
  }

  try {
    let query = supabase.from("projects").select("*").order("is_official", { ascending: false });
    if (layer && layer !== "all") query = query.eq("layer", layer);

    const { data, error } = await query;
    if (error || !data) {
      if (layer && layer !== "all") return STATIC_PROJECTS.filter((p) => p.layer === layer);
      return STATIC_PROJECTS;
    }

    return data.map(mapDbToProject);
  } catch {
    return STATIC_PROJECTS;
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
