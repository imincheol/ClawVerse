import { NextResponse } from "next/server";

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

export async function GET() {
  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ stacks: [] });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ stacks: [] });
  }

  const { data: stacks } = await supabase
    .from("user_stacks")
    .select("id, name, description, is_public, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!stacks) return NextResponse.json({ stacks: [] });

  // Get item counts
  const stacksWithCounts = await Promise.all(
    stacks.map(async (stack) => {
      const { count } = await supabase
        .from("stack_items")
        .select("*", { count: "exact", head: true })
        .eq("stack_id", stack.id);
      return { ...stack, item_count: count || 0 };
    })
  );

  return NextResponse.json({ stacks: stacksWithCounts });
}
