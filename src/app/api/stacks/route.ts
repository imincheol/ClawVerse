import { NextRequest, NextResponse } from "next/server";

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

// List public stacks
export async function GET() {
  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ stacks: [], has_user: false });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: stacks } = await supabase
    .from("user_stacks")
    .select("id, name, description, is_public, user_id, created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!stacks) return NextResponse.json({ stacks: [], has_user: !!user });

  // Enrich with owner names and item counts
  const enriched = await Promise.all(
    stacks.map(async (stack) => {
      const [{ data: profile }, { count }] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("display_name, username")
          .eq("id", stack.user_id)
          .single(),
        supabase
          .from("stack_items")
          .select("*", { count: "exact", head: true })
          .eq("stack_id", stack.id),
      ]);

      return {
        ...stack,
        owner_name: profile?.display_name || profile?.username || "Anonymous",
        item_count: count || 0,
        is_mine: user?.id === stack.user_id,
      };
    })
  );

  return NextResponse.json({ stacks: enriched, has_user: !!user });
}

// Create a new stack
export async function POST(request: NextRequest) {
  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data: stack, error } = await supabase
      .from("user_stacks")
      .insert({
        user_id: user.id,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        is_public: body.is_public !== false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stack }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
