"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DEPLOY_OPTIONS } from "@/data/deploy";

type SortKey = "name" | "level" | "cost" | "security" | "scalability";

const SECURITY_ORDER: Record<string, number> = {
  "Very High": 5,
  High: 4,
  Medium: 3,
  Low: 2,
  Varies: 1,
};

const SCALABILITY_ORDER: Record<string, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
  "N/A": 0,
};

function getSecurityColor(security: string): string {
  if (security === "Very High") return "#22c55e";
  if (security === "High") return "#4ade80";
  if (security === "Medium") return "#eab308";
  return "#f97316";
}

export default function ComparePage() {
  const [sortKey, setSortKey] = useState<SortKey>("level");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    return [...DEPLOY_OPTIONS].sort((a, b) => {
      let diff = 0;
      switch (sortKey) {
        case "name":
          diff = a.name.localeCompare(b.name);
          break;
        case "level":
          diff = a.level - b.level;
          break;
        case "cost":
          diff = a.cost.localeCompare(b.cost);
          break;
        case "security":
          diff =
            (SECURITY_ORDER[a.security] ?? 0) -
            (SECURITY_ORDER[b.security] ?? 0);
          break;
        case "scalability":
          diff =
            (SCALABILITY_ORDER[a.scalability] ?? 0) -
            (SCALABILITY_ORDER[b.scalability] ?? 0);
          break;
      }
      return sortAsc ? diff : -diff;
    });
  }, [sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const SortHeader = ({
    label,
    col,
  }: {
    label: string;
    col: SortKey;
  }) => (
    <th
      className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted transition-colors hover:text-text-primary"
      onClick={() => handleSort(col)}
    >
      {label} {sortKey === col ? (sortAsc ? "▲" : "▼") : ""}
    </th>
  );

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/deploy"
          className="text-sm text-text-muted no-underline hover:text-text-secondary"
        >
          &larr; Back to Deploy Hub
        </Link>
      </div>

      <div className="mb-7">
        <h1
          className="mb-1.5 text-[28px] font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Compare Deploy Options
        </h1>
        <p className="text-sm text-text-secondary">
          Side-by-side comparison of all 10 deployment options. Click column
          headers to sort.
        </p>
      </div>

      <div className="-mx-6 overflow-x-auto px-6">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <SortHeader label="Provider" col="name" />
              <SortHeader label="Level" col="level" />
              <SortHeader label="Cost" col="cost" />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                Setup
              </th>
              <SortHeader label="Security" col="security" />
              <SortHeader label="Scale" col="scalability" />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                Best For
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((opt) => (
              <tr
                key={opt.id}
                className="border-b border-border transition-colors hover:bg-white/[0.02]"
              >
                <td className="sticky left-0 bg-void px-4 py-3">
                  <Link
                    href={`/deploy/${opt.slug}`}
                    className="text-sm font-semibold text-accent-violet no-underline hover:underline"
                  >
                    {opt.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-accent-purple">
                  {"★".repeat(opt.level)}
                </td>
                <td className="px-4 py-3 text-sm text-text-primary">
                  {opt.cost}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {opt.setup}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-sm font-medium"
                    style={{ color: getSecurityColor(opt.security) }}
                  >
                    {opt.security}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {opt.scalability}
                </td>
                <td className="px-4 py-3 text-xs text-text-muted">
                  {opt.bestFor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
