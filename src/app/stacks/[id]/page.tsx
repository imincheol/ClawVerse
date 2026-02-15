"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { withCsrfHeaders } from "@/lib/security/csrf";

interface StackDetail {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  owner_name: string;
  is_owner: boolean;
  created_at: string;
}

interface StackItem {
  id: string;
  item_type: "skill" | "project";
  item_slug: string;
  note: string | null;
  added_at: string;
  name?: string;
  description?: string;
}

export default function StackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stackId = params.id as string;
  const [stack, setStack] = useState<StackDetail | null>(null);
  const [items, setItems] = useState<StackItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPublic, setEditPublic] = useState(true);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/stacks/${stackId}`)
      .then((r) => r.json())
      .then((data) => {
        setStack(data.stack || null);
        setItems(data.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [stackId]);

  const startEditing = () => {
    if (!stack) return;
    setEditName(stack.name);
    setEditDesc(stack.description || "");
    setEditPublic(stack.is_public);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/stacks/${stackId}`, {
        method: "PATCH",
        headers: withCsrfHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          name: editName,
          description: editDesc || null,
          is_public: editPublic,
        }),
      });

      if (res.ok) {
        setStack((prev) =>
          prev
            ? {
                ...prev,
                name: editName.trim(),
                description: editDesc.trim() || null,
                is_public: editPublic,
              }
            : prev
        );
        setEditing(false);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/stacks/${stackId}`, {
        method: "DELETE",
        headers: withCsrfHeaders(),
      });
      if (res.ok) {
        router.push("/stacks");
      }
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/stacks/${stackId}/items?item_id=${itemId}`, {
        method: "DELETE",
        headers: withCsrfHeaders(),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      }
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-text-muted">Loading stack...</div>
    );
  }

  if (!stack) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-2 text-xl font-bold text-text-primary">
          Stack not found
        </h1>
        <Link
          href="/stacks"
          className="text-sm text-accent-violet no-underline hover:underline"
        >
          Browse all stacks
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/stacks"
        className="mb-6 inline-block text-sm text-text-muted no-underline hover:text-text-secondary"
      >
        &larr; Back to Stacks
      </Link>

      {/* Stack Header */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        {editing ? (
          /* Edit Form */
          <div>
            <div className="mb-3">
              <label className="mb-1 block text-xs text-text-muted">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-lg border border-border bg-void px-3 py-2 text-sm text-text-primary"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-xs text-text-muted">
                Description
              </label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-void px-3 py-2 text-sm text-text-primary"
              />
            </div>
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-public"
                checked={editPublic}
                onChange={(e) => setEditPublic(e.target.checked)}
                className="h-3.5 w-3.5 accent-accent-purple"
              />
              <label htmlFor="edit-public" className="text-xs text-text-secondary">
                Public stack
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !editName.trim()}
                className="rounded-lg bg-accent-purple/20 px-4 py-1.5 text-xs font-semibold text-accent-violet hover:bg-accent-purple/30 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-xs text-text-secondary hover:border-border-hover"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Display */
          <>
            <div className="mb-2 flex items-start justify-between">
              <h1
                className="font-display text-2xl font-bold text-text-primary"
              >
                {stack.name}
              </h1>
              {stack.is_owner && (
                <div className="flex gap-2">
                  <button
                    onClick={startEditing}
                    className="rounded-lg border border-border px-3 py-1 text-xs text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-lg border border-sec-red/30 px-3 py-1 text-xs text-sec-red transition-colors hover:bg-sec-red/10"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            {stack.description && (
              <p className="mb-3 text-sm text-text-secondary">
                {stack.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>by {stack.owner_name}</span>
              <span>{items.length} items</span>
              <span>
                Created {new Date(stack.created_at).toLocaleDateString()}
              </span>
              {!stack.is_public && (
                <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px]">
                  Private
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-border bg-[#12121a] p-6">
            <h2 className="mb-2 text-lg font-bold text-text-primary">
              Delete Stack?
            </h2>
            <p className="mb-5 text-sm text-text-secondary">
              This will permanently delete &ldquo;{stack.name}&rdquo; and all its
              items. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-xs text-text-secondary hover:border-border-hover"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-sec-red/20 px-4 py-1.5 text-xs font-semibold text-sec-red hover:bg-sec-red/30 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-center text-sm text-text-muted">
          This stack is empty. Add skills and projects from their detail pages.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl border border-border bg-card no-underline transition-colors hover:border-white/10"
            >
              <Link
                href={
                  item.item_type === "skill"
                    ? `/skills/${item.item_slug}`
                    : `/projects/${item.item_slug}`
                }
                className="block p-4 no-underline"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                    style={{
                      color:
                        item.item_type === "skill" ? "#8b5cf6" : "#38bdf8",
                      background:
                        item.item_type === "skill"
                          ? "rgba(139,92,246,0.1)"
                          : "rgba(56,189,248,0.1)",
                    }}
                  >
                    {item.item_type}
                  </span>
                  <span className="font-semibold text-text-primary">
                    {item.name || item.item_slug}
                  </span>
                </div>
                {item.description && (
                  <p className="mb-1 text-[13px] text-text-secondary line-clamp-1">
                    {item.description}
                  </p>
                )}
                {item.note && (
                  <p className="text-[11px] italic text-text-muted">
                    &ldquo;{item.note}&rdquo;
                  </p>
                )}
              </Link>
              {stack.is_owner && (
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-text-muted opacity-0 transition-all hover:bg-sec-red/15 hover:text-sec-red group-hover:opacity-100"
                  title="Remove from stack"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
