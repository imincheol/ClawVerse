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

export interface SubmissionInput {
  type: "skill" | "project" | "deploy" | "security_report";
  name: string;
  url?: string;
  description?: string;
  category?: string;
  severity?: string;
}

export interface Submission extends SubmissionInput {
  id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export async function createSubmission(input: SubmissionInput): Promise<{ success: boolean; error?: string }> {
  const supabase = await getSupabase();

  if (!supabase) {
    // No DB — return success as mock
    return { success: true };
  }

  try {
    const { error } = await supabase.from("submissions").insert({
      type: input.type,
      name: input.name,
      url: input.url || null,
      description: input.description || null,
      category: input.category || null,
      severity: input.severity || null,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function getSubmissions(status?: string): Promise<Submission[]> {
  const supabase = await getSupabase();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") query = query.eq("status", status);

    const { data, error } = await query;
    if (error || !data) return [];

    return data as Submission[];
  } catch {
    return [];
  }
}

export async function updateSubmissionStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await getSupabase();
  if (!supabase) return { success: false, error: "No database connection" };

  try {
    const { error } = await supabase
      .from("submissions")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
