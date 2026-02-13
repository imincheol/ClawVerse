import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { guardMutationRequest } from "@/lib/security/request-guard";

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
    return NextResponse.json({ profile: null });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ profile: null });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Auto-create profile from GitHub data
    const meta = user.user_metadata;
    const username =
      meta?.user_name || meta?.preferred_username || user.email?.split("@")[0] || "user";
    const newProfile = {
      id: user.id,
      username,
      display_name: meta?.full_name || meta?.name || username,
      avatar_url: meta?.avatar_url || null,
      github_username: meta?.user_name || null,
      bio: null,
    };

    const { data: created } = await supabase
      .from("user_profiles")
      .upsert(newProfile, { onConflict: "id" })
      .select()
      .single();

    return NextResponse.json({ profile: created || newProfile });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(request: NextRequest) {
  const guard = await guardMutationRequest(request, { requireCsrf: true });
  if (guard) return guard;

  const ip = getClientIp(request);
  const rl = await rateLimit(`profile:${ip}`, RATE_LIMITS.profileWrite);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const supabase = await getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, string> = {};
    if (body.display_name !== undefined) updates.display_name = body.display_name;
    if (body.bio !== undefined) updates.bio = body.bio;

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
