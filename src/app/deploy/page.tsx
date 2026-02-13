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

export default function DeployPage() {
  const [levelFilter, setLevelFilter] = useState("all");

  const filtered = useMemo(() => {
    if (levelFilter === "all") return DEPLOY_OPTIONS;
    return DEPLOY_OPTIONS.filter((d) => d.level === parseInt(levelFilter));
  }, [levelFilter]);

  return (
    <div>
      <div className="mb-7">
        <h1
          className="mb-1.5 text-[28px] font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Deploy Hub
        </h1>
        <p className="text-sm text-text-secondary">
          10+ deployment options compared neutrally. Find the right method for
          you.
        </p>
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

      {/* Deploy Grid */}
      <div className="grid gap-3.5 md:grid-cols-2">
        {filtered.map((d) => (
          <DeployCard key={d.id} opt={d} />
        ))}
      </div>

      {/* Quiz + Submit CTA */}
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
    </div>
  );
}
