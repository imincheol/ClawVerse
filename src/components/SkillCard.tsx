"use client";

import Link from "next/link";
import { Skill, SECURITY_CONFIG, PERMISSION_LABELS } from "@/data/skills";
import SecurityBadge from "./SecurityBadge";

export default function SkillCard({ skill }: { skill: Skill }) {
  const sec = SECURITY_CONFIG[skill.security];
  const isBlocked = skill.security === "blocked";

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group relative block overflow-hidden rounded-[14px] border p-5 no-underline transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: isBlocked ? "rgba(153,27,27,0.08)" : "rgba(255,255,255,0.03)",
        borderColor: isBlocked ? "rgba(153,27,27,0.3)" : "rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = sec.color + "60";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = isBlocked
          ? "rgba(153,27,27,0.3)"
          : "rgba(255,255,255,0.07)";
      }}
    >
      <div className="mb-2 flex items-start justify-between">
        <code className="font-code text-[15px] font-bold text-text-primary">
          {skill.name}
        </code>
        <SecurityBadge level={skill.security} />
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-text-secondary">
        {skill.desc}
      </p>

      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {skill.permissions.map((p) => (
          <span
            key={p}
            className="rounded-md border border-white/[0.08] bg-white/[0.06] px-2 py-0.5 text-[11px] text-text-secondary"
          >
            {PERMISSION_LABELS[p] || p}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{skill.installs.toLocaleString()} installs</span>
        <span>
          {skill.rating} ({skill.reviews})
        </span>
        <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px]">
          {skill.source}
        </span>
      </div>

      {isBlocked && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(153,27,27,0.05) 10px, rgba(153,27,27,0.05) 20px)",
          }}
        />
      )}
    </Link>
  );
}
