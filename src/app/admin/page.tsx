"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface Submission {
  id: string;
  type: string;
  name: string;
  url?: string;
  description?: string;
  category?: string;
  severity?: string;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f97316",
  approved: "#22c55e",
  rejected: "#ef4444",
};

const TYPE_LABELS: Record<string, string> = {
  skill: "Skill",
  project: "Project",
  deploy: "Deploy",
  security_report: "Security Report",
};

const PAGE_SIZE = 10;

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchSubmissions();
    setSelectedIds(new Set());
    setPage(0);
  }, [fetchSubmissions]);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: action }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    } catch {
      // ignore
    }
  };

  const handleBulkAction = async (action: "approved" | "rejected") => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    await Promise.all(ids.map((id) => handleAction(id, action)));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedSubmissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedSubmissions.map((s) => s.id)));
    }
  };

  // Filter + sort
  const filteredSubmissions = useMemo(() => {
    let list = submissions;

    if (typeFilter !== "all") {
      list = list.filter((s) => s.type === typeFilter);
    }

    list = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [submissions, typeFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / PAGE_SIZE));
  const paginatedSubmissions = filteredSubmissions.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  return (
    <div>
      <div className="mb-7">
        <h1
          className="font-display mb-1.5 text-[28px] font-bold"
        >
          Admin — Submission Queue
        </h1>
        <p className="text-sm text-text-secondary">
          Review and manage user submissions.
        </p>
      </div>

      {/* Filters Row */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {/* Status Filter */}
        <div className="flex gap-2">
          {["pending", "approved", "rejected", "all"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={`rounded-full border px-4 py-1.5 text-xs capitalize transition-all ${
                statusFilter === s
                  ? "border-accent-purple/40 bg-accent-purple/[0.12] text-accent-violet"
                  : "border-border text-text-secondary hover:border-border-hover"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex gap-1.5">
          <span className="self-center text-[11px] text-text-muted">Type:</span>
          {["all", "skill", "project", "deploy", "security_report"].map((t) => (
            <button
              key={t}
              onClick={() => { setTypeFilter(t); setPage(0); }}
              className={`rounded-md px-2.5 py-1 text-[11px] transition-colors ${
                typeFilter === t
                  ? "bg-accent-purple/15 text-accent-violet"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {t === "all" ? "All" : TYPE_LABELS[t] || t}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-1.5">
          <span className="self-center text-[11px] text-text-muted">Sort:</span>
          {([["newest", "Newest"], ["oldest", "Oldest"], ["name", "Name"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSortBy(val)}
              className={`rounded-md px-2.5 py-1 text-[11px] transition-colors ${
                sortBy === val
                  ? "bg-accent-purple/15 text-accent-violet"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && statusFilter === "pending" && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-accent-purple/20 bg-accent-purple/[0.06] px-4 py-2.5">
          <span className="text-xs text-text-secondary">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => handleBulkAction("approved")}
            className="rounded-lg bg-sec-green/15 px-3 py-1 text-xs font-semibold text-sec-green hover:bg-sec-green/25"
          >
            Approve Selected
          </button>
          <button
            onClick={() => handleBulkAction("rejected")}
            className="rounded-lg bg-sec-red/15 px-3 py-1 text-xs font-semibold text-sec-red hover:bg-sec-red/25"
          >
            Reject Selected
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-text-muted">Loading...</div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="py-12 text-center text-text-muted">
          <p className="text-sm">No {typeFilter !== "all" ? TYPE_LABELS[typeFilter] + " " : ""}{statusFilter !== "all" ? statusFilter + " " : ""}submissions.</p>
        </div>
      ) : (
        <>
          {/* Select All */}
          {statusFilter === "pending" && (
            <div className="mb-2 flex items-center gap-2 px-1">
              <input
                type="checkbox"
                checked={selectedIds.size === paginatedSubmissions.length && paginatedSubmissions.length > 0}
                onChange={toggleSelectAll}
                className="h-3.5 w-3.5 accent-accent-purple"
              />
              <span className="text-[11px] text-text-muted">Select all on page</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {paginatedSubmissions.map((s) => (
              <div
                key={s.id}
                className="rounded-[14px] border border-border bg-card p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {statusFilter === "pending" && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(s.id)}
                        onChange={() => toggleSelect(s.id)}
                        className="h-3.5 w-3.5 accent-accent-purple"
                      />
                    )}
                    <button
                      onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                      className="text-[15px] font-bold text-text-primary hover:text-accent-violet transition-colors"
                    >
                      {s.name}
                    </button>
                    <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-text-muted">
                      {TYPE_LABELS[s.type] || s.type}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{
                        color: STATUS_COLORS[s.status] || "#94a3b8",
                        background: (STATUS_COLORS[s.status] || "#94a3b8") + "18",
                      }}
                    >
                      {s.status}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Expanded Detail */}
                {expandedId === s.id ? (
                  <div className="mb-3 rounded-[10px] border border-border bg-void p-4">
                    {s.description ? (
                      <p className="mb-2 text-[13px] text-text-secondary whitespace-pre-wrap">
                        {s.description}
                      </p>
                    ) : (
                      <p className="mb-2 text-[13px] italic text-text-muted">
                        No description provided.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                      {s.url && <span>URL: <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">{s.url}</a></span>}
                      {s.category && <span>Category: {s.category}</span>}
                      {s.severity && (
                        <span className="text-sec-red">Severity: {s.severity}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  s.description && (
                    <p className="mb-2 text-[13px] text-text-secondary line-clamp-1">
                      {s.description}
                    </p>
                  )
                )}

                {!expandedId || expandedId !== s.id ? (
                  <div className="mb-3 flex flex-wrap gap-3 text-xs text-text-muted">
                    {s.url && <span>URL: {s.url}</span>}
                    {s.category && <span>Category: {s.category}</span>}
                    {s.severity && (
                      <span className="text-sec-red">Severity: {s.severity}</span>
                    )}
                  </div>
                ) : null}

                {s.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(s.id, "approved")}
                      className="rounded-lg bg-sec-green/15 px-4 py-1.5 text-xs font-semibold text-sec-green transition-colors hover:bg-sec-green/25"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(s.id, "rejected")}
                      className="rounded-lg bg-sec-red/15 px-4 py-1.5 text-xs font-semibold text-sec-red transition-colors hover:bg-sec-red/25"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-border-hover disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-text-muted">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-border-hover disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
