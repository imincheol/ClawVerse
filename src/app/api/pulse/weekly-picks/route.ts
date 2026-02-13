import { NextResponse } from "next/server";
import { SKILLS } from "@/data/skills";
import { PROJECTS } from "@/data/projects";

// Static weekly picks — will be replaced with DB query when Supabase is connected
const WEEKLY_PICKS_DATA = [
  { type: "skill" as const, slug: "browser-automation", reason: "Most installed skill this week" },
  { type: "project" as const, slug: "moltbook", reason: "Fastest growing project" },
  { type: "skill" as const, slug: "memory-manager", reason: "Top rated by community" },
  { type: "project" as const, slug: "claw-swarm", reason: "Trending in collaboration" },
];

export async function GET() {
  // TODO: When Supabase is connected, query weekly_picks table instead
  // const supabase = await getSupabase();
  // if (supabase) {
  //   const { data } = await supabase
  //     .from("weekly_picks")
  //     .select("*")
  //     .eq("active", true)
  //     .order("display_order");
  //   if (data?.length) return NextResponse.json({ picks: data });
  // }

  const picks = WEEKLY_PICKS_DATA.map((pick) => {
    if (pick.type === "skill") {
      const skill = SKILLS.find((s) => s.slug === pick.slug);
      if (!skill) return null;
      return {
        type: pick.type,
        slug: pick.slug,
        name: skill.name,
        description: skill.desc,
        reason: pick.reason,
        href: `/skills/${skill.slug}`,
      };
    }
    const project = PROJECTS.find((p) => p.slug === pick.slug);
    if (!project) return null;
    return {
      type: pick.type,
      slug: pick.slug,
      name: project.name,
      description: project.desc,
      reason: pick.reason,
      href: `/projects/${project.slug}`,
    };
  }).filter(Boolean);

  return NextResponse.json({ picks });
}
