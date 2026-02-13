"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DEPLOY_OPTIONS } from "@/data/deploy";
import DeployCard from "@/components/DeployCard";

const LEVEL_FILTERS = [
  { value: "all", label: "All" },
  { value: "1", label: "★ Beginner (One-click)" },
  { value: "2", label: "★★ Intermediate" },
  { value: "3", label: "★★★ Advanced" },
  { value: "4", label: "★★★★ Expert" },
];

const SECURITY_FILTERS = [
  { value: "all", label: "Security: All" },
  { value: "Very High", label: "Very High" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
] as const;

const SORT_OPTIONS = [
  { value: "level", label: "Level" },
  { value: "cost", label: "Cost" },
  { value: "setup", label: "Setup Time" },
  { value: "name", label: "Name (A-Z)" },
  { value: "security", label: "Security" },
] as const;

const SECURITY_ORDER: Record<string, number> = {
  "Very High": 0,
  "High": 1,
  "Medium": 2,
  "Low": 3,
  "Varies": 4,
  "N/A": 5,
};

const COST_ORDER: Record<string, number> = {
  "Free": 0,
  "Free+": 1,
  "$5/mo+": 2,
  "$12/mo+": 3,
  "Paid": 4,
};

export default function DeployPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [secFilter, setSecFilter] = useState("all");
  const [sortBy, setSortBy] = useState("level");

  const filtered = useMemo(() => {
    const result = DEPLOY_OPTIONS.filter((d) => {
      if (
        search &&
        !d.name.toLowerCase().includes(search.toLowerCase()) &&
        !d.desc.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (levelFilter !== "all" && d.level !== parseInt(levelFilter))
        return false;
      if (secFilter !== "all" && d.security !== secFilter) return false;
      return true;
    });

    return result.sort((a, b) => {
      switch (sortBy) {
        case "cost":
          return (COST_ORDER[a.cost] ?? 9) - (COST_ORDER[b.cost] ?? 9);
        case "setup":
          return parseSetup(a.setup) - parseSetup(b.setup);
        case "name":
          return a.name.localeCompare(b.name);
        case "security":
          return (
            (SECURITY_ORDER[a.security] ?? 9) -
            (SECURITY_ORDER[b.security] ?? 9)
          );
        case "level":
        default:
          return a.level - b.level;
      }
    });
  }, [search, levelFilter, secFilter, sortBy]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-display mb-1.5 text-[28px] font-bold">
          Deploy Hub
        </h1>
        <p className="text-sm text-text-secondary">
          {DEPLOY_OPTIONS.length} deployment options compared neutrally. Find the
          right method for you.
        </p>
      </div>

      {/* Search + Filters Row */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deploy options... (name, description)"
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

      {/* Level Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {LEVEL_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setLevelFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 text-xs transition-all ${
              levelFilter === f.value
                ? "border-accent-purple/40 bg-accent-purple/[0.12] text-accent-violet"
                : "border-border text-text-secondary hover:border-border-hover"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Quick Recommendation */}
      <div
        className="mb-6 rounded-[14px] border border-accent-purple/15 p-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(249,115,22,0.05))",
        }}
      >
        <div className="mb-2 text-sm font-semibold text-[#c084fc]">
          Quick Recommendation
        </div>
        <div className="grid gap-4 text-[13px] md:grid-cols-3">
          <div>
            <span className="text-text-muted">First time?</span>
            <br />
            <span className="font-semibold text-text-primary">
              SimpleClaw
            </span>{" "}
            — 1 min deploy
          </div>
          <div>
            <span className="text-text-muted">Production?</span>
            <br />
            <span className="font-semibold text-text-primary">
              DigitalOcean
            </span>{" "}
            — Official partner
          </div>
          <div>
            <span className="text-text-muted">Max security?</span>
            <br />
            <span className="font-semibold text-text-primary">
              NanoClaw
            </span>{" "}
            — Container isolation
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-3.5 text-xs text-text-muted">
        Showing {filtered.length} of {DEPLOY_OPTIONS.length} deploy options
      </div>

      {/* Deploy Grid */}
      <div className="grid gap-3.5 md:grid-cols-2">
        {filtered.map((d) => (
          <DeployCard key={d.id} opt={d} />
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-16 text-center text-text-muted">
          <p className="text-sm">No deploy options found matching your criteria.</p>
          <Link
            href="/submit"
            className="mt-3 inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-5 py-2 text-[13px] text-[#fb923c] no-underline"
          >
            Submit a deploy service →
          </Link>
        </div>
      )}

      {/* Quiz + Submit CTA */}
      {filtered.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/deploy/quiz"
            className="inline-block rounded-[10px] border border-accent-purple/40 bg-accent-purple/10 px-5 py-2 text-[13px] text-accent-violet no-underline transition-colors hover:bg-accent-purple/20"
          >
            Take the Deploy Quiz →
          </Link>
          <Link
            href="/submit"
            className="inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-5 py-2 text-[13px] text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
          >
            Submit a deploy service →
          </Link>
        </div>
      )}
    </div>
  );
}

/** Parse setup time string to minutes for sorting */
function parseSetup(s: string): number {
  if (s.includes("min")) {
    const n = parseInt(s);
    return isNaN(n) ? 5 : n;
  }
  if (s.includes("hr")) {
    const n = parseInt(s);
    return isNaN(n) ? 60 : n * 60;
  }
  return 999;
}
