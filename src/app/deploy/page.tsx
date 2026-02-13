"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { DeployOption } from "@/data/deploy";
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

const PAGE_SIZE = 20;

export default function DeployPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [levelFilter, setLevelFilter] = useState(searchParams.get("level") || "all");
  const [secFilter, setSecFilter] = useState(searchParams.get("security") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "level");
  const [page, setPage] = useState<number>(Math.max(1, Number(searchParams.get("page") || "1")));

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [options, setOptions] = useState<DeployOption[]>([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (levelFilter !== "all") params.set("level", levelFilter);
    if (secFilter !== "all") params.set("security", secFilter);
    if (sortBy !== "level") params.set("sort", sortBy);
    if (page > 1) params.set("page", String(page));
    const q = params.toString();
    router.replace(q ? `/deploy?${q}` : "/deploy", { scroll: false });
  }, [router, debouncedSearch, levelFilter, secFilter, sortBy, page]);

  const loadDeployOptions = useCallback(async (input: {
    page: number;
    sortBy: string;
    levelFilter: string;
    secFilter: string;
    search: string;
  }) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    const params = new URLSearchParams({
      page: String(input.page),
      limit: String(PAGE_SIZE),
      sort: input.sortBy,
      level: input.levelFilter,
      security: input.secFilter,
    });
    if (input.search.trim()) params.set("search", input.search.trim());

    try {
      const r = await fetch(`/api/deploy?${params.toString()}`);
      const data = await r.json();
      if (requestId === requestIdRef.current) {
        setOptions(data.options || []);
        setCount(data.count || 0);
        setHasMore(Boolean(data.hasMore));
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setOptions([]);
        setCount(0);
        setHasMore(false);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadDeployOptions({
      page,
      sortBy,
      levelFilter,
      secFilter,
      search: debouncedSearch,
    });
  }, [debouncedSearch, levelFilter, secFilter, sortBy, page, loadDeployOptions]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-display mb-1.5 text-[28px] font-bold">
          Deploy Hub
        </h1>
        <p className="text-sm text-text-secondary">
          Search by name, description, slug, or URL across deploy options.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search deploy options... (name, description, slug, url)"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-4 pr-3.5 text-sm text-text-primary"
          />
        </div>
        <select
          value={secFilter}
          onChange={(e) => {
            setSecFilter(e.target.value);
            setPage(1);
          }}
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
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="cursor-pointer rounded-xl border border-border bg-void py-2.5 pl-3.5 pr-8 text-[13px] text-text-primary"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {LEVEL_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setLevelFilter(f.value);
              setPage(1);
            }}
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

      <div className="mb-3.5 text-xs text-text-muted">
        {loading ? "Loading..." : `Showing ${options.length} of ${count} deploy options`}
      </div>

      {loading ? (
        <div className="py-16 text-center text-text-muted">Loading deploy options...</div>
      ) : options.length === 0 ? (
        <div className="py-16 text-center text-text-muted">
          <p className="text-sm">No deploy options found matching your criteria.</p>
          <Link
            href="/submit"
            className="mt-3 inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-5 py-2 text-[13px] text-[#fb923c] no-underline"
          >
            Submit a deploy service →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3.5 md:grid-cols-2">
          {options.map((d) => (
            <DeployCard key={d.id} opt={d} />
          ))}
        </div>
      )}

      {!loading && count > PAGE_SIZE && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((v) => Math.max(1, v - 1))}
            disabled={page === 1}
            className="rounded-lg border border-border px-4 py-2 text-xs text-text-secondary disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-text-muted">Page {page}</span>
          <button
            onClick={() => setPage((v) => v + 1)}
            disabled={!hasMore}
            className="rounded-lg border border-border px-4 py-2 text-xs text-text-secondary disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
