"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PROJECTS, LAYERS, ProjectLayer } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

const ECOSYSTEM_STATS = [
  { label: "GitHub Stars", value: "182K+" },
  { label: "ClawHub Skills", value: "5,705" },
  { label: "Moltbook Agents", value: "37K+" },
  { label: "Deploy Options", value: "10+" },
];

export default function ProjectsPage() {
  const [layerFilter, setLayerFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (layerFilter === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.layer === layerFilter);
  }, [layerFilter]);

  return (
    <div>
      <div className="mb-7">
        <h1
          className="font-display mb-1.5 text-[28px] font-bold"
        >
          Project Directory
        </h1>
        <p className="text-sm text-text-secondary">
          The complete OpenClaw ecosystem map. From core to experimental
          projects.
        </p>
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
            <div
              className="font-display text-xl font-bold text-text-primary"
            >
              {s.value}
            </div>
            <div className="mt-0.5 text-[11px] text-text-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {/* Submit CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/submit"
          className="inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-5 py-2 text-[13px] text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
        >
          Submit a project →
        </Link>
      </div>
    </div>
  );
}
