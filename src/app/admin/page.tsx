"use client";

import { useState, useEffect, useCallback } from "react";

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

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

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
      }
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h1
          className="mb-1.5 text-[28px] font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Admin — Submission Queue
        </h1>
        <p className="text-sm text-text-secondary">
          Review and manage user submissions.
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2">
        {["pending", "approved", "rejected", "all"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
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

      {loading ? (
        <div className="py-12 text-center text-text-muted">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="py-12 text-center text-text-muted">
          <p className="text-sm">No {statusFilter} submissions.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="rounded-[14px] border border-border bg-card p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-text-primary">
                    {s.name}
                  </span>
                  <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-text-muted">
                    {s.type}
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

              {s.description && (
                <p className="mb-2 text-[13px] text-text-secondary">
                  {s.description}
                </p>
              )}

              <div className="mb-3 flex flex-wrap gap-3 text-xs text-text-muted">
                {s.url && <span>URL: {s.url}</span>}
                {s.category && <span>Category: {s.category}</span>}
                {s.severity && (
                  <span className="text-sec-red">Severity: {s.severity}</span>
                )}
              </div>

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
      )}
    </div>
  );
}
