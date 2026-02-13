"use client";

import Link from "next/link";
import { Skill, SECURITY_CONFIG, PROTOCOL_CONFIG, MAINTAINER_CONFIG } from "@/data/skills";
import SecurityBadge from "./SecurityBadge";
import AddToStackButton from "./AddToStackButton";
import PermissionTooltip from "./PermissionTooltip";

export default function SkillCard({ skill }: { skill: Skill }) {
  const sec = SECURITY_CONFIG[skill.security];
  const isBlocked = skill.security === "blocked";
  const maint = MAINTAINER_CONFIG[skill.maintainerActivity];

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
        <div className="flex items-center gap-1.5">
          <AddToStackButton itemType="skill" itemSlug={skill.slug} />
          <SecurityBadge level={skill.security} />
        </div>
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-text-secondary">
        {skill.desc}
      </p>

      {/* Permissions with risk tooltips */}
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        {skill.permissions.map((p) => (
          <PermissionTooltip key={p} permission={p} compact />
        ))}
      </div>

      {/* Protocol badges */}
      {skill.protocols.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1">
          {skill.protocols.map((proto) => {
            const pc = PROTOCOL_CONFIG[proto];
            return (
              <span
                key={proto}
                className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                style={{
                  color: pc.color,
                  background: pc.bg,
                  border: `1px solid ${pc.color}25`,
                }}
              >
                {pc.label}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{skill.installs.toLocaleString()} installs</span>
        <span>
          {skill.rating} ({skill.reviews})
        </span>
        <div className="flex items-center gap-2">
          {/* Health indicator */}
          <span
            className="flex items-center gap-1 text-[10px]"
            style={{ color: maint.color }}
            title={`Maintainer: ${maint.label} | Updated: ${skill.lastUpdated}`}
          >
            {maint.icon}
          </span>
          <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px]">
            {skill.source}
          </span>
        </div>
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
