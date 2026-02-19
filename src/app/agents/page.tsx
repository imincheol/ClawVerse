"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AGENTS,
  AGENT_TYPES,
  AGENT_ROLES,
  AGENT_TYPE_CONFIG,
} from "@/data/agents";
import AgentCard from "@/components/AgentCard";

const SECURITY_FILTERS = [
  { value: "all", label: "Security: All" },
  { value: "verified", label: "Verified" },
  { value: "reviewed", label: "Reviewed" },
  { value: "unreviewed", label: "Unreviewed" },
] as const;

const FRAMEWORK_FILTERS = [
  { value: "all", label: "Framework: All" },
  { value: "OpenClaw", label: "OpenClaw" },
  { value: "Claude Code", label: "Claude Code" },
  { value: "CrewAI", label: "CrewAI" },
  { value: "LangGraph", label: "LangGraph" },
  { value: "AutoGen", label: "AutoGen" },
  { value: "Codex", label: "Codex" },
] as const;

const SORT_OPTIONS = [
  { value: "downloads", label: "Most Downloads" },
  { value: "rating", label: "Highest Rating" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A-Z)" },
  { value: "security", label: "Security Level" },
] as const;

const SECURITY_ORDER: Record<string, number> = {
  verified: 0,
  reviewed: 1,
  unreviewed: 2,
  flagged: 3,
  blocked: 4,
};

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [secFilter, setSecFilter] = useState<string>("all");
  const [frameworkFilter, setFrameworkFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("downloads");

  const stats = useMemo(
    () => ({
      personas: AGENTS.filter((a) => a.type === "persona").length,
      crews: AGENTS.filter((a) => a.type === "crew").length,
      workflows: AGENTS.filter((a) => a.type === "workflow").length,
    }),
    []
  );

  const filteredAgents = useMemo(() => {
    const filtered = AGENTS.filter((a) => {
      if (
        search &&
        !a.name.toLowerCase().includes(search.toLowerCase()) &&
        !a.desc.toLowerCase().includes(search.toLowerCase()) &&
        !a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
        return false;
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (roleFilter !== "all" && a.role !== roleFilter) return false;
      if (secFilter !== "all" && a.security !== secFilter) return false;
      if (
        frameworkFilter !== "all" &&
        !a.frameworks.some(
          (fw) => fw.toLowerCase() === frameworkFilter.toLowerCase()
        )
      )
        return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id - a.id;
        case "name":
          return a.name.localeCompare(b.name);
        case "security":
          return (
            (SECURITY_ORDER[a.security] ?? 9) -
            (SECURITY_ORDER[b.security] ?? 9)
          );
        case "downloads":
        default:
          return b.downloads - a.downloads;
      }
    });
  }, [search, typeFilter, roleFilter, secFilter, frameworkFilter, sortBy]);

  return (
    <div>
      <div className="mb-7">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display mb-1.5 text-[28px] font-bold">
            Agents Hub
          </h1>
          <span className="shrink-0 text-[11px] text-text-muted">
            {AGENTS.length} agent templates
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          Discover and share AI agent personas, crew templates, and orchestration
          workflows. SOUL.md + CrewAI + LangGraph — all in one place.
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-accent-purple/15 bg-accent-purple/[0.06] px-4 py-3">
        <span className="text-lg">&#x1F916;</span>
        <div className="flex-1">
          <span className="text-[13px] font-semibold text-accent-violet">
            Agent Templates:{" "}
          </span>
          <span className="text-[13px] text-text-secondary">
            Pre-configured agent personas, multi-agent team setups, and
            orchestration patterns ready to use with OpenClaw, CrewAI, and more.
          </span>
        </div>
        <span className="hidden text-xs text-text-muted md:inline">
          {stats.personas} personas · {stats.crews} crews · {stats.workflows}{" "}
          workflows
        </span>
      </div>

      {/* Search + Filters Row */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents... (name, description, tags)"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-4 pr-3.5 text-sm text-text-primary"
          />
        </div>
        <select
          value={secFilter}
          onChange={(e) => setSecFilter(e.target.value)}
          className="cursor-pointer rounded-xl border border-border bg-void py-2.5 pl-3.5 pr-8 text-[13px] text-text-primary"
        >
          {SECURITY_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          value={frameworkFilter}
          onChange={(e) => setFrameworkFilter(e.target.value)}
          className="cursor-pointer rounded-xl border border-border bg-void py-2.5 pl-3.5 pr-8 text-[13px] text-text-primary"
        >
          {FRAMEWORK_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="cursor-pointer rounded-xl border border-border bg-void py-2.5 pl-3.5 pr-8 text-[13px] text-text-primary"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Type Pills */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {AGENT_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTypeFilter(t.id)}
            className={`rounded-full border px-3.5 py-1 text-xs transition-all ${
              typeFilter === t.id
                ? "border-accent-purple/40 bg-accent-purple/[0.12] text-accent-violet"
                : "border-border text-text-secondary hover:border-border-hover"
            }`}
          >
            {t.id !== "all" && (
              <span className="mr-1">
                {AGENT_TYPE_CONFIG[t.id as keyof typeof AGENT_TYPE_CONFIG]?.icon}
              </span>
            )}
            {t.label}
          </button>
        ))}
      </div>

      {/* Role Pills */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {AGENT_ROLES.map((r) => (
          <button
            key={r.id}
            onClick={() => setRoleFilter(r.id)}
            className={`rounded-full border px-3.5 py-1 text-xs transition-all ${
              roleFilter === r.id
                ? "border-accent-purple/40 bg-accent-purple/[0.12] text-accent-violet"
                : "border-border text-text-secondary hover:border-border-hover"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-3.5 text-xs text-text-muted">
        {filteredAgents.length} agent{filteredAgents.length !== 1 ? "s" : ""}{" "}
        shown
      </div>

      {/* Agent Grid */}
      <div className="grid gap-3.5 md:grid-cols-2">
        {filteredAgents.map((a) => (
          <AgentCard key={a.id} agent={a} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <div className="py-16 text-center text-text-muted">
          <p className="text-sm">No agents found matching your criteria.</p>
          <Link
            href="/submit"
            className="mt-3 inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-5 py-2 text-[13px] text-[#fb923c] no-underline"
          >
            Submit an agent template →
          </Link>
        </div>
      )}
    </div>
  );
}
