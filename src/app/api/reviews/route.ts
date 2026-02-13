import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";

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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const targetType = searchParams.get("target_type");
  const targetId = searchParams.get("target_id");
  const sort = searchParams.get("sort") || "newest";

  if (!targetType || !targetId) {
    return NextResponse.json(
      { error: "target_type and target_id are required" },
      { status: 400 }
    );
  }

  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ reviews: [], count: 0 });
  }

  // Get current user for vote status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("reviews")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  // Apply sort
  if (sort === "highest") {
    query = query.order("rating", { ascending: false });
  } else if (sort === "lowest") {
    query = query.order("rating", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ reviews: [], count: 0 });
  }

  // Enrich with vote counts and user's vote
  const enriched = await Promise.all(
    (data || []).map(async (review) => {
      const [{ count: helpfulCount }, { count: notHelpfulCount }] =
        await Promise.all([
          supabase
            .from("review_votes")
            .select("*", { count: "exact", head: true })
            .eq("review_id", review.id)
            .eq("vote", "helpful"),
          supabase
            .from("review_votes")
            .select("*", { count: "exact", head: true })
            .eq("review_id", review.id)
            .eq("vote", "not_helpful"),
        ]);

      let userVote: string | null = null;
      if (user) {
        const { data: vote } = await supabase
          .from("review_votes")
          .select("vote")
          .eq("review_id", review.id)
          .eq("user_id", user.id)
          .single();
        userVote = vote?.vote || null;
      }

      return {
        ...review,
        helpful_count: helpfulCount || 0,
        not_helpful_count: notHelpfulCount || 0,
        user_vote: userVote,
      };
    })
  );

  // Sort by most_helpful after enrichment
  if (sort === "most_helpful") {
    enriched.sort((a, b) => b.helpful_count - a.helpful_count);
  }

  return NextResponse.json({ reviews: enriched, count: enriched.length });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`reviews:${ip}`, RATE_LIMITS.reviews);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.target_type || !body.target_id || !body.rating) {
      return NextResponse.json(
        { error: "target_type, target_id, and rating are required" },
        { status: 400 }
      );
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("reviews").insert({
      target_type: body.target_type,
      target_id: body.target_id,
      user_id: user.id,
      rating: body.rating,
      comment: body.comment || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
