"use client";

import type { Skill } from "@/data/skills";
import { getSource, type SourceRef } from "@/data/sources";

function getEffectiveSources(skill: Skill): SourceRef[] {
  if (skill.sources && skill.sources.length > 0) return skill.sources;
  const normalized = skill.source.toLowerCase().replace(/\s+/g, "-");
  const sourceId = normalized === "clawhub" ? "clawhub" : normalized === "github" ? "github" : "community";
  return [{ sourceId }];
}

export default function SourceBadges({
  skill,
  compact = false,
}: {
  skill: Skill;
  compact?: boolean;
}) {
  const sources = getEffectiveSources(skill);

  if (compact) {
    // Compact: show short names inline
    return (
      <div className="flex items-center gap-1">
        {sources.map((ref) => {
          const source = getSource(ref.sourceId);
          if (!source) return null;
          return (
            <span
              key={source.id}
              className="flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold"
              style={{ background: source.color + "20", color: source.color }}
              title={source.name}
            >
              {source.icon}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {sources.map((ref) => {
        const source = getSource(ref.sourceId);
        if (!source) return null;
        return (
          <span
            key={source.id}
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
            style={{
              color: source.color,
              background: source.color + "12",
              border: `1px solid ${source.color}25`,
            }}
          >
            <span className="text-[9px]">{source.icon}</span>
            {source.shortName}
          </span>
        );
      })}
    </div>
  );
}
