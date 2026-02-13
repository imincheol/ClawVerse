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
    const { review_id, vote } = body;

    if (!review_id || !vote || !["helpful", "not_helpful"].includes(vote)) {
      return NextResponse.json(
        { error: "review_id and vote (helpful/not_helpful) are required" },
        { status: 400 }
      );
    }

    // Check for existing vote
    const { data: existing } = await supabase
      .from("review_votes")
      .select("id, vote")
      .eq("review_id", review_id)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      if (existing.vote === vote) {
        // Same vote = remove it (toggle)
        await supabase.from("review_votes").delete().eq("id", existing.id);
        return NextResponse.json({ action: "removed" });
      }
      // Different vote = update
      await supabase
        .from("review_votes")
        .update({ vote })
        .eq("id", existing.id);
      return NextResponse.json({ action: "updated" });
    }

    // New vote
    const { error } = await supabase.from("review_votes").insert({
      review_id,
      user_id: user.id,
      vote,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ action: "created" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
