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

async function getServiceSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!supabaseModule) {
    supabaseModule = await import("@/lib/supabase/server");
  }
  try {
    return supabaseModule.createServiceRoleClient();
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
  submitted_by?: string;
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
      submitted_by: input.submitted_by || null,
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

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const supabase = await getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as Submission;
  } catch {
    return null;
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

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function processApprovedSubmission(
  submission: Submission
): Promise<{ success: boolean; error?: string }> {
  const supabase = await getServiceSupabase();
  if (!supabase) return { success: false, error: "No database connection" };

  try {
    switch (submission.type) {
      case "skill": {
        const { error } = await supabase.from("skills").insert({
          slug: slugify(submission.name),
          name: submission.name,
          description: submission.description || null,
          source: "community",
          source_url: submission.url || null,
          category: submission.category || "utility",
          security: "unreviewed",
          permissions: [],
          platforms: ["OpenClaw"],
          installs: 0,
          rating: 0,
          review_count: 0,
        });
        if (error) return { success: false, error: error.message };

        await createPulseAlert(
          `New skill: ${submission.name}`,
          submission.description || `${submission.name} has been added to ClawVerse.`,
          "new"
        );
        break;
      }
      case "project": {
        const { error } = await supabase.from("projects").insert({
          slug: slugify(submission.name),
          name: submission.name,
          description: submission.description || null,
          layer: submission.category || "experimental",
          url: submission.url || null,
          is_official: false,
          status: "active",
        });
        if (error) return { success: false, error: error.message };

        await createPulseAlert(
          `New project: ${submission.name}`,
          submission.description || `${submission.name} has joined the ClawVerse ecosystem.`,
          "new"
        );
        break;
      }
      case "deploy": {
        const { error } = await supabase.from("deploy_options").insert({
          slug: slugify(submission.name),
          name: submission.name,
          description: submission.description || null,
          url: submission.url || null,
          skill_level: 2,
          cost: "Unknown",
          setup_time: "Unknown",
          security: "Medium",
          scalability: "Medium",
          best_for: submission.description || "",
        });
        if (error) return { success: false, error: error.message };
        break;
      }
      case "security_report": {
        await flagSkillByName(submission.name);
        await createPulseAlert(
          `Security alert: ${submission.name}`,
          submission.description || `A security issue has been reported for ${submission.name}.`,
          "security"
        );
        break;
      }
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function flagSkillByName(
  name: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await getServiceSupabase();
  if (!supabase) return { success: false, error: "No database connection" };

  try {
    // Try exact match first, then slug match
    const slug = slugify(name);
    const { error } = await supabase
      .from("skills")
      .update({ security: "flagged", updated_at: new Date().toISOString() })
      .or(`name.ilike.%${name}%,slug.eq.${slug}`);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function createPulseAlert(
  title: string,
  description: string,
  tag: string = "security"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await getServiceSupabase();
  if (!supabase) return { success: false, error: "No database connection" };

  try {
    const { error } = await supabase.from("pulse_items").insert({
      tag,
      title,
      description,
      published_at: new Date().toISOString(),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
