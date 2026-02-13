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

// Get stack detail with items
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ stack: null, items: [] });
  }

  const { data: stack } = await supabase
    .from("user_stacks")
    .select("id, name, description, user_id, is_public, created_at")
    .eq("id", id)
    .single();

  if (!stack) {
    return NextResponse.json({ stack: null, items: [] });
  }

  const [{ data: items }, { data: profile }] = await Promise.all([
    supabase
      .from("stack_items")
      .select("*")
      .eq("stack_id", id)
      .order("added_at", { ascending: false }),
    supabase
      .from("user_profiles")
      .select("display_name, username")
      .eq("id", stack.user_id)
      .single(),
  ]);

  return NextResponse.json({
    stack: {
      ...stack,
      owner_name: profile?.display_name || profile?.username || "Anonymous",
    },
    items: items || [],
  });
}

// Add item to stack
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  // Verify ownership
  const { data: stack } = await supabase
    .from("user_stacks")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!stack || stack.user_id !== user.id) {
    return NextResponse.json({ error: "Not your stack" }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (!body.item_type || !body.item_slug) {
      return NextResponse.json(
        { error: "item_type and item_slug are required" },
        { status: 400 }
      );
    }

    const { data: item, error } = await supabase
      .from("stack_items")
      .upsert(
        {
          stack_id: id,
          item_type: body.item_type,
          item_slug: body.item_slug,
          note: body.note || null,
        },
        { onConflict: "stack_id,item_type,item_slug" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
