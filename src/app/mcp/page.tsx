"use client";

import { useState, useMemo } from "react";
import { MCP_SERVERS, MCP_CATEGORIES, MCP_SOURCES } from "@/data/mcp-servers";
import McpServerCard from "@/components/McpServerCard";

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
  { value: "tools", label: "Most Tools" },
  { value: "name", label: "Name (A-Z)" },
] as const;

export default function McpPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [srcFilter, setSrcFilter] = useState("all");
  const [secFilter, setSecFilter] = useState("all");
  const [sortBy, setSortBy] = useState("downloads");

  const filtered = useMemo(() => {
    const list = MCP_SERVERS.filter((s) => {
      if (
        search &&
        !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.desc.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (catFilter !== "all" && s.category !== catFilter) return false;
      if (srcFilter !== "all" && s.source !== srcFilter) return false;
      if (secFilter !== "all" && s.security !== secFilter) return false;
      return true;
    });

    return list.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id - a.id;
        case "tools":
          return b.tools - a.tools;
        case "name":
          return a.name.localeCompare(b.name);
        case "downloads":
        default:
          return b.downloads - a.downloads;
      }
    });
  }, [search, catFilter, srcFilter, secFilter, sortBy]);

  const stats = useMemo(() => {
    const verified = MCP_SERVERS.filter((s) => s.security === "verified").length;
    const totalTools = MCP_SERVERS.reduce((sum, s) => sum + s.tools, 0);
    return { verified, totalTools };
  }, []);

  return (
    <div>
      <div className="mb-7">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-display mb-1.5 text-[28px] font-bold">
            MCP Servers
          </h1>
          <span className="shrink-0 text-[11px] text-text-muted">
            {MCP_SERVERS.length} servers
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          Model Context Protocol servers aggregated from Official Registry,
          MCP.so, Smithery, Glama, and community sources.
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-accent-cyan/15 bg-accent-cyan/[0.06] px-4 py-3">
        <span className="text-lg">&#x1F50C;</span>
        <div className="flex-1">
          <span className="text-[13px] font-semibold text-[#38bdf8]">
            MCP Protocol:{" "}
          </span>
          <span className="text-[13px] text-text-secondary">
            Standardized protocol for connecting AI agents to external tools and
            data sources. {stats.verified} verified servers with {stats.totalTools}+ tools.
          </span>
        </div>
      </div>

      {/* External Directory Links */}
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { label: "MCP.so (17K+)", url: "https://mcp.so" },
          { label: "Smithery", url: "https://smithery.ai" },
          { label: "Glama", url: "https://glama.ai/mcp/servers" },
          { label: "PulseMCP (8.6K+)", url: "https://pulsemcp.com/servers" },
          { label: "Official Registry", url: "https://registry.modelcontextprotocol.io" },
        ].map((d) => (
          <a
            key={d.label}
            href={d.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] text-text-secondary no-underline transition-colors hover:border-accent-cyan/30 hover:text-[#38bdf8]"
          >
            {d.label} &#x2197;
          </a>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search MCP servers..."
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
          value={srcFilter}
          onChange={(e) => setSrcFilter(e.target.value)}
          className="cursor-pointer rounded-xl border border-border bg-void py-2.5 pl-3.5 pr-8 text-[13px] text-text-primary"
        >
          {MCP_SOURCES.map((f) => (
            <option key={f.id} value={f.id}>
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

      {/* Category Pills */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {MCP_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCatFilter(c.id)}
            className={`rounded-full border px-3.5 py-1 text-xs transition-all ${
              catFilter === c.id
                ? "border-accent-cyan/40 bg-accent-cyan/[0.12] text-[#38bdf8]"
                : "border-border text-text-secondary hover:border-border-hover"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-3.5 text-xs text-text-muted">
        {filtered.length} server{filtered.length !== 1 ? "s" : ""} shown
      </div>

      {/* Server Grid */}
      <div className="grid gap-3.5 md:grid-cols-2">
        {filtered.map((s) => (
          <McpServerCard key={s.id} server={s} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-text-muted">
          <p className="text-sm">No MCP servers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
