"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PROJECTS, LAYERS, ProjectLayer } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

const ECOSYSTEM_STATS = [
  { label: "GitHub Stars", value: "182K+" },
  { label: "ClawHub Skills", value: "5,705" },
  { label: "Moltbook Agents", value: "2.5M+" },
  { label: "Deploy Options", value: "17+" },
];

const STATUS_FILTERS = [
  { value: "all", label: "Status: All" },
  { value: "active", label: "Active" },
  { value: "viral", label: "Viral" },
  { value: "research", label: "Research" },
  { value: "inactive", label: "Inactive" },
] as const;

const SORT_OPTIONS = [
  { value: "stars", label: "Stars" },
  { value: "name", label: "Name (A-Z)" },
  { value: "newest", label: "Newest" },
  { value: "status", label: "Status" },
] as const;

const STATUS_ORDER: Record<string, number> = {
  viral: 0,
  active: 1,
  research: 2,
  inactive: 3,
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [layerFilter, setLayerFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("stars");

  const filtered = useMemo(() => {
    const result = PROJECTS.filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.desc.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (layerFilter !== "all" && p.layer !== layerFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return b.id - a.id;
        case "status":
          return (
            (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
          );
        case "stars":
        default:
          return (b.stars ?? 0) - (a.stars ?? 0);
      }
    });
  }, [search, layerFilter, statusFilter, sortBy]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-display mb-1.5 text-[28px] font-bold">
          Project Directory
        </h1>
        <p className="text-sm text-text-secondary">
          The complete OpenClaw ecosystem map. From core to experimental
          projects.
        </p>
      </div>

      {/* Search + Filters Row */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects... (name, description)"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-4 pr-3.5 text-sm text-text-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="cursor-pointer rounded-xl border border-border bg-void py-2.5 pl-3.5 pr-8 text-[13px] text-text-primary"
        >
          {STATUS_FILTERS.map((f) => (
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

      {/* Layer Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setLayerFilter("all")}
          className={`rounded-full border px-4 py-1.5 text-xs transition-all ${
            layerFilter === "all"
              ? "border-accent-purple/40 bg-accent-purple/[0.12] text-accent-violet"
              : "border-border text-text-secondary hover:border-border-hover"
          }`}
        >
          All ({PROJECTS.length})
        </button>
        {(Object.entries(LAYERS) as [ProjectLayer, (typeof LAYERS)[ProjectLayer]][]).map(
          ([key, layer]) => {
            const count = PROJECTS.filter((p) => p.layer === key).length;
            return (
              <button
                key={key}
                onClick={() => setLayerFilter(key)}
                className="rounded-full border px-4 py-1.5 text-xs transition-all"
                style={{
                  borderColor:
                    layerFilter === key
                      ? layer.color + "60"
                      : "rgba(255,255,255,0.07)",
                  background:
                    layerFilter === key ? layer.color + "18" : "transparent",
                  color: layerFilter === key ? layer.color : "#94a3b8",
                }}
              >
                {layer.label} ({count})
              </button>
            );
          }
        )}
      </div>

      {/* Ecosystem Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ECOSYSTEM_STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <div className="font-display text-xl font-bold text-text-primary">
              {s.value}
            </div>
            <div className="mt-0.5 text-[11px] text-text-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-3.5 text-xs text-text-muted">
        Showing {filtered.length} of {PROJECTS.length} projects
      </div>

      {/* Projects Grid */}
      <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-16 text-center text-text-muted">
          <p className="text-sm">No projects found matching your criteria.</p>
          <Link
            href="/submit"
            className="mt-3 inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-5 py-2 text-[13px] text-[#fb923c] no-underline"
          >
            Submit a project →
          </Link>
        </div>
      )}

      {/* Submit CTA */}
      {filtered.length > 0 && (
        <div className="mt-6 text-center">
          <Link
            href="/submit"
            className="inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-5 py-2 text-[13px] text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
          >
            Submit a project →
          </Link>
        </div>
      )}
    </div>
  );
}
