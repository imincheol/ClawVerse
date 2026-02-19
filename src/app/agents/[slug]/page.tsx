import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  AGENTS,
  AGENT_TYPE_CONFIG,
  AGENT_ROLE_CONFIG,
  COMPLEXITY_CONFIG,
  FORMAT_CONFIG,
} from "@/data/agents";
import { SECURITY_CONFIG } from "@/data/skills";
import SecurityBadge from "@/components/SecurityBadge";
import AgentCard from "@/components/AgentCard";
import ReviewSection from "@/components/ReviewSection";
import AddToStackButton from "@/components/AddToStackButton";

export function generateStaticParams() {
  return AGENTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agent = AGENTS.find((a) => a.slug === slug);
  if (!agent) return { title: "Agent Not Found — ClawVerse" };
  return {
    title: `${agent.name} — ClawVerse Agents`,
    description: agent.desc,
  };
}

function daysAgo(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = AGENTS.find((a) => a.slug === slug);
  if (!agent) notFound();

  const typeConfig = AGENT_TYPE_CONFIG[agent.type];
  const roleConfig = AGENT_ROLE_CONFIG[agent.role];
  const complexityConfig = COMPLEXITY_CONFIG[agent.complexity];
  const formatConfig = FORMAT_CONFIG[agent.configFormat];
  const sec = SECURITY_CONFIG[agent.security];
  const days = daysAgo(agent.lastUpdated);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/agents"
        className="mb-6 inline-block text-sm text-text-muted no-underline hover:text-text-secondary"
      >
        &larr; Back to Agents
      </Link>

      <div
        className="rounded-2xl border p-8"
        style={{ borderColor: typeConfig.color + "30" }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{typeConfig.icon}</span>
              <span className="text-xl font-bold text-text-primary">
                {agent.name}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <SecurityBadge level={agent.security} />
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                style={{
                  color: typeConfig.color,
                  background: typeConfig.bg,
                  border: `1px solid ${typeConfig.color}30`,
                }}
              >
                {typeConfig.label}
              </span>
              <span
                className="rounded-md px-2 py-0.5 text-[11px] font-semibold"
                style={{
                  color: roleConfig.color,
                  background: roleConfig.color + "15",
                  border: `1px solid ${roleConfig.color}30`,
                }}
              >
                {roleConfig.label}
              </span>
            </div>
          </div>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-text-secondary">
          {agent.desc}
        </p>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">Downloads</div>
            <div className="text-lg font-bold text-text-primary">
              {agent.downloads.toLocaleString()}
            </div>
          </div>
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">
              Rating / Reviews
            </div>
            <div className="text-lg font-bold text-[#fbbf24]">
              &#9733; {agent.rating}{" "}
              <span className="text-[13px] text-text-secondary">
                ({agent.reviews})
              </span>
            </div>
          </div>
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">Last Updated</div>
            <div className="text-sm font-bold text-text-primary">
              {days === 0
                ? "Today"
                : days === 1
                  ? "Yesterday"
                  : `${days}d ago`}
            </div>
            <div className="text-[10px] text-text-muted">
              {agent.lastUpdated}
            </div>
          </div>
        </div>

        {/* Complexity & Agent Count */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Complexity
          </div>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
              style={{
                color: complexityConfig.color,
                background: complexityConfig.color + "15",
                border: `1px solid ${complexityConfig.color}30`,
              }}
            >
              {complexityConfig.icon} {complexityConfig.label}
            </span>
            {agent.agentCount > 1 && (
              <span className="text-xs text-text-secondary">
                {agent.agentCount} agents in this{" "}
                {agent.type === "crew" ? "team" : "pipeline"}
              </span>
            )}
          </div>
        </div>

        {/* Config Format */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Configuration Format
          </div>
          <span
            className="rounded-md px-2.5 py-1 text-xs font-semibold"
            style={{
              color: formatConfig.color,
              background: formatConfig.color + "15",
              border: `1px solid ${formatConfig.color}30`,
            }}
          >
            {formatConfig.label}
          </span>
        </div>

        {/* Compatible Frameworks */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Compatible Frameworks
          </div>
          <div className="flex flex-wrap gap-1.5">
            {agent.frameworks.map((fw) => (
              <span
                key={fw}
                className="rounded-md border border-accent-purple/20 bg-accent-purple/10 px-2.5 py-1 text-xs text-accent-violet"
              >
                {fw}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Tags
          </div>
          <div className="flex flex-wrap gap-1.5">
            {agent.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs text-text-secondary"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Source & Author */}
        <div className="mb-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Source
          </div>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span>{agent.source}</span>
            {agent.sourceUrl && (
              <a
                href={agent.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-cyan no-underline hover:underline"
              >
                View source &rarr;
              </a>
            )}
          </div>
          <div className="mt-1 text-xs text-text-muted">
            by {agent.author}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <AddToStackButton itemType="agent" itemSlug={agent.slug} />
          <Link
            href="/submit"
            className="inline-block rounded-[10px] border border-sec-red/30 bg-sec-red/10 px-4 py-2 text-[13px] text-[#fca5a5] no-underline transition-colors hover:bg-sec-red/20"
          >
            Report Issue
          </Link>
        </div>

        {/* Reviews */}
        <ReviewSection targetType="agent" targetId={agent.slug} />
      </div>

      {/* Similar Agents */}
      {(() => {
        const similarAgents = AGENTS.filter(
          (a) =>
            a.id !== agent.id &&
            (a.role === agent.role || a.type === agent.type)
        ).slice(0, 4);
        if (similarAgents.length === 0) return null;
        return (
          <div className="mt-8">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Similar Agents
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {similarAgents.map((a) => (
                <AgentCard key={a.id} agent={a} />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
