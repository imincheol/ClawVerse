"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SKILLS, CATEGORIES } from "@/data/skills";
import SkillCard from "@/components/SkillCard";

const SECURITY_FILTERS = [
  { value: "all", label: "Security: All" },
  { value: "verified", label: "Verified" },
  { value: "reviewed", label: "Reviewed" },
  { value: "unreviewed", label: "Unreviewed" },
  { value: "flagged", label: "Flagged" },
  { value: "blocked", label: "Blocked" },
] as const;

const SOURCE_FILTERS = [
  { value: "all", label: "Source: All" },
  { value: "ClawHub", label: "ClawHub" },
  { value: "GitHub", label: "GitHub" },
  { value: "Community", label: "Community" },
] as const;

const SORT_OPTIONS = [
  { value: "installs", label: "Most Installs" },
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

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const [secFilter, setSecFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("installs");

  const stats = useMemo(
    () => ({
      verified: SKILLS.filter((s) => s.security === "verified").length,
      flagged: SKILLS.filter(
        (s) => s.security === "flagged" || s.security === "blocked"
      ).length,
    }),
    []
  );

  const filteredSkills = useMemo(() => {
    const filtered = SKILLS.filter((s) => {
      if (
        search &&
        !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.desc.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (secFilter !== "all" && s.security !== secFilter) return false;
      if (catFilter !== "all" && s.category !== catFilter) return false;
      if (sourceFilter !== "all" && s.source !== sourceFilter) return false;
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
          return (SECURITY_ORDER[a.security] ?? 9) - (SECURITY_ORDER[b.security] ?? 9);
        case "installs":
        default:
          return b.installs - a.installs;
      }
    });
  }, [search, secFilter, catFilter, sourceFilter, sortBy]);

  return (
    <div>
      <div className="mb-7">
        <h1
          className="font-display mb-1.5 text-[28px] font-bold"
        >
          Skills Hub
        </h1>
        <p className="text-sm text-text-secondary">
          ClawHub + GitHub + Community — all skills in one place. Security
          verified.
        </p>
      </div>

      {/* Security Alert Banner */}
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-sec-red/15 bg-sec-red/[0.06] px-4 py-3">
        <span className="text-lg">&#x1F6E1;&#xFE0F;</span>
        <div className="flex-1">
          <span className="text-[13px] font-semibold text-[#fca5a5]">
            Security Alert:{" "}
          </span>
          <span className="text-[13px] text-text-secondary">
            400+ malicious skills found on ClawHub/GitHub stealing API keys,
            SSH credentials, and crypto wallets. Check ClawVerse security
            ratings.
          </span>
        </div>
        <span className="hidden text-xs text-text-muted md:inline">
          {stats.verified} verified · {stats.flagged} flagged
        </span>
      </div>

      {/* Search + Filters Row */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills... (name, description)"
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
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="cursor-pointer rounded-xl border border-border bg-void py-2.5 pl-3.5 pr-8 text-[13px] text-text-primary"
        >
          {SOURCE_FILTERS.map((f) => (
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

      {/* Category Pills */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCatFilter(c.id)}
            className={`rounded-full border px-3.5 py-1 text-xs transition-all ${
              catFilter === c.id
                ? "border-accent-purple/40 bg-accent-purple/[0.12] text-accent-violet"
                : "border-border text-text-secondary hover:border-border-hover"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="mb-3.5 text-xs text-text-muted">
        {filteredSkills.length} skill{filteredSkills.length !== 1 ? "s" : ""}{" "}
        shown
      </div>

      {/* Skill Grid */}
      <div className="grid gap-3.5 md:grid-cols-2">
        {filteredSkills.map((s) => (
          <SkillCard key={s.id} skill={s} />
        ))}
      </div>

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <div className="py-16 text-center text-text-muted">
          <p className="text-sm">No skills found matching your criteria.</p>
          <Link
            href="/submit"
            className="mt-3 inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-5 py-2 text-[13px] text-[#fb923c] no-underline"
          >
            Submit a skill →
          </Link>
        </div>
      )}
    </div>
  );
}
