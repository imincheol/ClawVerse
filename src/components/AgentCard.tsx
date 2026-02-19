"use client";

import Link from "next/link";
import {
  Agent,
  AGENT_TYPE_CONFIG,
  AGENT_ROLE_CONFIG,
  COMPLEXITY_CONFIG,
  FORMAT_CONFIG,
} from "@/data/agents";
import { SECURITY_CONFIG } from "@/data/skills";
import SecurityBadge from "./SecurityBadge";
import AddToStackButton from "./AddToStackButton";

export default function AgentCard({ agent }: { agent: Agent }) {
  const typeConfig = AGENT_TYPE_CONFIG[agent.type];
  const roleConfig = AGENT_ROLE_CONFIG[agent.role];
  const complexityConfig = COMPLEXITY_CONFIG[agent.complexity];
  const formatConfig = FORMAT_CONFIG[agent.configFormat];
  const sec = SECURITY_CONFIG[agent.security];

  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="group block rounded-[14px] border border-border bg-card p-5 no-underline transition-all duration-200 hover:-translate-y-0.5"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = typeConfig.color + "60";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{typeConfig.icon}</span>
          <span className="text-[15px] font-bold text-text-primary">
            {agent.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <AddToStackButton itemType="agent" itemSlug={agent.slug} />
          <SecurityBadge level={agent.security} />
        </div>
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-text-secondary">
        {agent.desc}
      </p>

      {/* Type + Role + Complexity badges */}
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        <span
          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            color: typeConfig.color,
            background: typeConfig.bg,
            border: `1px solid ${typeConfig.color}25`,
          }}
        >
          {typeConfig.label}
        </span>
        <span
          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            color: roleConfig.color,
            background: roleConfig.color + "15",
            border: `1px solid ${roleConfig.color}25`,
          }}
        >
          {roleConfig.label}
        </span>
        <span
          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            color: formatConfig.color,
            background: formatConfig.color + "15",
            border: `1px solid ${formatConfig.color}25`,
          }}
        >
          {formatConfig.label}
        </span>
        {agent.agentCount > 1 && (
          <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-text-muted">
            {agent.agentCount} agents
          </span>
        )}
      </div>

      {/* Frameworks */}
      <div className="mb-2.5 flex flex-wrap gap-1">
        {agent.frameworks.map((fw) => (
          <span
            key={fw}
            className="rounded-md border border-accent-purple/20 bg-accent-purple/10 px-1.5 py-0.5 text-[10px] text-accent-violet"
          >
            {fw}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{agent.downloads.toLocaleString()} downloads</span>
        <span>
          {agent.rating} ({agent.reviews})
        </span>
        <span
          className="flex items-center gap-1 text-[10px]"
          style={{ color: complexityConfig.color }}
          title={complexityConfig.label}
        >
          {complexityConfig.icon}
        </span>
      </div>
    </Link>
  );
}
