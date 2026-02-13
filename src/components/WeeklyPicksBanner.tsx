"use client";

import Link from "next/link";
import { SKILLS } from "@/data/skills";
import { PROJECTS } from "@/data/projects";

// Editor's picks — rotated weekly via DB in production
const WEEKLY_PICKS = [
  { type: "skill" as const, slug: "browser-automation", reason: "Most installed skill this week" },
  { type: "project" as const, slug: "moltbook", reason: "Fastest growing project" },
  { type: "skill" as const, slug: "memory-manager", reason: "Top rated by community" },
  { type: "project" as const, slug: "claw-swarm", reason: "Trending in collaboration" },
];

export default function WeeklyPicksBanner() {
  const picks = WEEKLY_PICKS.map((pick) => {
    if (pick.type === "skill") {
      const skill = SKILLS.find((s) => s.slug === pick.slug);
      return skill
        ? {
            ...pick,
            name: skill.name,
            desc: skill.desc,
            href: `/skills/${skill.slug}`,
            accent: "#8b5cf6",
          }
        : null;
    }
    const project = PROJECTS.find((p) => p.slug === pick.slug);
    return project
      ? {
          ...pick,
          name: project.name,
          desc: project.desc,
          href: `/projects/${project.slug}`,
          accent: "#38bdf8",
        }
      : null;
  }).filter(Boolean) as {
    type: string;
    slug: string;
    reason: string;
    name: string;
    desc: string;
    href: string;
    accent: string;
  }[];

  if (picks.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <span
          className="font-display text-sm font-bold uppercase tracking-wider"
          style={{
            background: "linear-gradient(135deg, #fbbf24, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Weekly Picks
        </span>
        <span className="rounded-full bg-[#fbbf24]/15 px-2 py-0.5 text-[10px] font-semibold text-[#fbbf24]">
          Editor&apos;s Choice
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {picks.map((pick) => (
          <Link
            key={pick.slug}
            href={pick.href}
            className="group rounded-xl border border-[#fbbf24]/15 bg-[#fbbf24]/[0.04] p-4 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#fbbf24]/30 hover:bg-[#fbbf24]/[0.07]"
          >
            <div className="mb-1 flex items-center gap-2">
              <span
                className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                style={{
                  color: pick.accent,
                  background: pick.accent + "18",
                }}
              >
                {pick.type}
              </span>
            </div>
            <div className="mb-1 text-sm font-bold text-text-primary">
              {pick.name}
            </div>
            <p className="mb-2 text-[11px] leading-snug text-text-secondary line-clamp-2">
              {pick.desc}
            </p>
            <span className="text-[10px] italic text-[#fbbf24]/70">
              {pick.reason}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
