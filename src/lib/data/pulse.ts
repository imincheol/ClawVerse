import { PULSE_ITEMS as STATIC_PULSE } from "@/data/pulse";
import type { PulseItem } from "@/data/pulse";

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

function mapDbToPulse(row: Record<string, unknown>): PulseItem {
  return {
    id: typeof row.id === "string" ? row.id.charCodeAt(0) : (row.id as number),
    tag: row.tag as PulseItem["tag"],
    title: row.title as string,
    desc: (row.description as string) || "",
    date: ((row.published_at as string) || "").slice(0, 10),
    url: (row.url as string) || undefined,
  };
}

export async function getPulseItems(tag?: string): Promise<PulseItem[]> {
  const supabase = await getSupabase();

  if (!supabase) {
    if (tag && tag !== "all") return STATIC_PULSE.filter((p) => p.tag === tag);
    return STATIC_PULSE;
  }

  try {
    let query = supabase.from("pulse_items").select("*").order("published_at", { ascending: false });
    if (tag && tag !== "all") query = query.eq("tag", tag);

    const { data, error } = await query;
    if (error || !data) return STATIC_PULSE;

    return data.map(mapDbToPulse);
  } catch {
    return STATIC_PULSE;
  }
}
