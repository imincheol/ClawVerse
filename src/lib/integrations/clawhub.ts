/**
 * ClawHub API integration — sync skills from clawhub.ai
 */

interface ClawHubSkill {
  name: string;
  description?: string;
  category?: string;
  installs?: number;
  rating?: number;
  permissions?: string[];
}

export async function fetchClawHubSkills(
  page = 1,
  limit = 50
): Promise<ClawHubSkill[]> {
  try {
    const res = await fetch(
      `https://api.clawhub.ai/v1/skills?page=${page}&limit=${limit}`,
      {
        headers: {
          Accept: "application/json",
          ...(process.env.CLAWHUB_API_KEY
            ? { Authorization: `Bearer ${process.env.CLAWHUB_API_KEY}` }
            : {}),
        },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.skills || data.data || [];
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncClawHubSkills(supabase: any) {
  let synced = 0;
  let errors = 0;
  let page = 1;
  const maxPages = 10;

  while (page <= maxPages) {
    const skills = await fetchClawHubSkills(page, 50);
    if (skills.length === 0) break;

    for (const skill of skills) {
      const slug = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { error } = await supabase.from("skills").upsert(
        {
          slug,
          name: skill.name,
          description: skill.description || "",
          source: "ClawHub",
          category: skill.category || "utility",
          security: "unreviewed",
          permissions: skill.permissions || [],
          platforms: ["OpenClaw"],
          installs: skill.installs || 0,
          rating: skill.rating || 0,
        },
        { onConflict: "slug" }
      );

      if (error) errors++;
      else synced++;
    }

    page++;
    await new Promise((r) => setTimeout(r, 500));
  }

  return { synced, errors };
}
