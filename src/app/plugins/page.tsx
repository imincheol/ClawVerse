"use client";

import { useState, useMemo } from "react";
import { PLUGINS, PLUGIN_TYPES, PLUGIN_TYPE_CONFIG } from "@/data/plugins";
import PluginCard from "@/components/PluginCard";

const SECURITY_FILTERS = [
  { value: "all", label: "Security: All" },
  { value: "verified", label: "Verified" },
  { value: "reviewed", label: "Reviewed" },
  { value: "unreviewed", label: "Unreviewed" },
] as const;

const SORT_OPTIONS = [
  { value: "downloads", label: "Most Downloads" },
  { value: "rating", label: "Highest Rating" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A-Z)" },
] as const;

export default function PluginsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [secFilter, setSecFilter] = useState("all");
  const [sortBy, setSortBy] = useState("downloads");

  const filtered = useMemo(() => {
    const list = PLUGINS.filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.desc.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (secFilter !== "all" && p.security !== secFilter) return false;
      return true;
    });

    return list.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id - a.id;
        case "name":
          return a.name.localeCompare(b.name);
        case "downloads":
        default:
          return b.downloads - a.downloads;
      }
    });
  }, [search, typeFilter, secFilter, sortBy]);

  const stats = useMemo(
    () => ({
      channels: PLUGINS.filter((p) => p.type === "channel").length,
      tools: PLUGINS.filter((p) => p.type === "tool").length,
      providers: PLUGINS.filter((p) => p.type === "provider").length,
      memory: PLUGINS.filter((p) => p.type === "memory").length,
    }),
    []
  );

  return (
    <div>
      <div className="mb-7">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display mb-1.5 text-[28px] font-bold">
            Plugins
          </h1>
          <span className="shrink-0 text-[11px] text-text-muted">
            {PLUGINS.length} plugins
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          OpenClaw Gateway plugins — channels, tools, AI providers, and memory
          backends to extend your agent.
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-accent-purple/15 bg-accent-purple/[0.06] px-4 py-3">
        <span className="text-lg">&#x1F9E9;</span>
        <div className="flex-1">
          <span className="text-[13px] font-semibold text-accent-violet">
            Plugin Types:{" "}
          </span>
          <span className="text-[13px] text-text-secondary">
            Channels connect messaging platforms. Tools add agent capabilities.
            Providers switch AI backends. Memory enables persistent knowledge.
          </span>
        </div>
        <span className="hidden text-xs text-text-muted md:inline">
          {stats.channels} channels · {stats.tools} tools · {stats.providers}{" "}
          providers · {stats.memory} memory
        </span>
      </div>

      {/* Search + Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plugins..."
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
      <div className="mb-6 flex flex-wrap gap-1.5">
        {PLUGIN_TYPES.map((t) => (
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
                {PLUGIN_TYPE_CONFIG[t.id as keyof typeof PLUGIN_TYPE_CONFIG]?.icon}
              </span>
            )}
            {t.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-3.5 text-xs text-text-muted">
        {filtered.length} plugin{filtered.length !== 1 ? "s" : ""} shown
      </div>

      {/* Plugin Grid */}
      <div className="grid gap-3.5 md:grid-cols-2">
        {filtered.map((p) => (
          <PluginCard key={p.id} plugin={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-text-muted">
          <p className="text-sm">No plugins found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
