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

// Delete a single item from a stack
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await guardMutationRequest(request, { requireCsrf: true, requireJson: false });
  if (guard) return guard;

  const ip = getClientIp(request);
  const rl = await rateLimit(`stack-item-delete:${ip}`, RATE_LIMITS.stacksWrite);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const { id: stackId } = await params;
  const itemId = request.nextUrl.searchParams.get("item_id");

  if (!itemId) {
    return NextResponse.json({ error: "item_id is required" }, { status: 400 });
  }

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

  // Verify stack ownership
  const { data: stack } = await supabase
    .from("user_stacks")
    .select("user_id")
    .eq("id", stackId)
    .single();

  if (!stack || stack.user_id !== user.id) {
    return NextResponse.json({ error: "Not your stack" }, { status: 403 });
  }

  const { error } = await supabase
    .from("stack_items")
    .delete()
    .eq("id", itemId)
    .eq("stack_id", stackId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
