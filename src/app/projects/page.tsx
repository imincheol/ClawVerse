"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LAYERS, type Project, type ProjectLayer } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

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

const PAGE_SIZE = 24;

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [layerFilter, setLayerFilter] = useState<string>(searchParams.get("layer") || "all");
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "stars");
  const [page, setPage] = useState<number>(Math.max(1, Number(searchParams.get("page") || "1")));

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [projects, setProjects] = useState<Project[]>([]);
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
    if (layerFilter !== "all") params.set("layer", layerFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (sortBy !== "stars") params.set("sort", sortBy);
    if (page > 1) params.set("page", String(page));
    const q = params.toString();
    router.replace(q ? `/projects?${q}` : "/projects", { scroll: false });
  }, [router, debouncedSearch, layerFilter, statusFilter, sortBy, page]);

  const loadProjects = useCallback(async (input: {
    page: number;
    sortBy: string;
    layerFilter: string;
    statusFilter: string;
    search: string;
  }) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    const params = new URLSearchParams({
      page: String(input.page),
      limit: String(PAGE_SIZE),
      sort: input.sortBy,
      layer: input.layerFilter,
      status: input.statusFilter,
    });
    if (input.search.trim()) params.set("search", input.search.trim());

    try {
      const r = await fetch(`/api/projects?${params.toString()}`);
      const data = await r.json();
      if (requestId === requestIdRef.current) {
        setProjects(data.projects || []);
        setCount(data.count || 0);
        setHasMore(Boolean(data.hasMore));
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setProjects([]);
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
    void loadProjects({
      page,
      sortBy,
      layerFilter,
      statusFilter,
      search: debouncedSearch,
    });
  }, [debouncedSearch, layerFilter, statusFilter, sortBy, page, loadProjects]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="font-display mb-1.5 text-[28px] font-bold">
          Project Directory
        </h1>
        <p className="text-sm text-text-secondary">
          Search by name, description, slug, or GitHub URL across the OpenClaw ecosystem.
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
            placeholder="Search projects... (name, description, slug, url)"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-4 pr-3.5 text-sm text-text-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
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
        <button
          onClick={() => {
            setLayerFilter("all");
            setPage(1);
          }}
          className={`rounded-full border px-4 py-1.5 text-xs transition-all ${
            layerFilter === "all"
              ? "border-accent-purple/40 bg-accent-purple/[0.12] text-accent-violet"
              : "border-border text-text-secondary hover:border-border-hover"
          }`}
        >
          All
        </button>
        {(Object.entries(LAYERS) as [
          ProjectLayer,
          (typeof LAYERS)[ProjectLayer],
        ][]).map(([key, layer]) => (
          <button
            key={key}
            onClick={() => {
              setLayerFilter(key);
              setPage(1);
            }}
            className="rounded-full border px-4 py-1.5 text-xs transition-all"
            style={{
              borderColor:
                layerFilter === key ? layer.color + "60" : "rgba(255,255,255,0.07)",
              background: layerFilter === key ? layer.color + "18" : "transparent",
              color: layerFilter === key ? layer.color : "#94a3b8",
            }}
          >
            {layer.label}
          </button>
        ))}
      </div>

      <div className="mb-3.5 text-xs text-text-muted">
        {loading ? "Loading..." : `Showing ${projects.length} of ${count} projects`}
      </div>

      {loading ? (
        <div className="py-16 text-center text-text-muted">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center text-text-muted">
          <p className="text-sm">No projects found matching your criteria.</p>
          <Link
            href="/submit"
            className="mt-3 inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-5 py-2 text-[13px] text-[#fb923c] no-underline"
          >
            Submit a project →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
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
