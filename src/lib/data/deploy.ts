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

export async function getDeployOptions(level?: number): Promise<DeployOption[]> {
  const supabase = await getSupabase();

  if (!supabase) {
    if (level) return STATIC_DEPLOY.filter((d) => d.level === level);
    return STATIC_DEPLOY;
  }

  try {
    let query = supabase.from("deploy_options").select("*").order("skill_level", { ascending: true });
    if (level) query = query.eq("skill_level", level);

    const { data, error } = await query;
    if (error || !data) {
      if (level) return STATIC_DEPLOY.filter((d) => d.level === level);
      return STATIC_DEPLOY;
    }

    return data.map(mapDbToDeploy);
  } catch {
    return STATIC_DEPLOY;
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
