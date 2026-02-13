"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stack {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  item_count: number;
  owner_name: string;
  created_at: string;
}

export default function StacksPage() {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/stacks")
      .then((r) => r.json())
      .then((data) => setStacks(data.stacks || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/stacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc || undefined }),
      });

      if (res.ok) {
        const data = await res.json();
        setStacks((prev) => [{ ...data.stack, item_count: 0, owner_name: "You" }, ...prev]);
        setNewName("");
        setNewDesc("");
        setShowCreate(false);
      }
    } catch {
      // silent
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Community Stacks
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Curated collections of skills and projects
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="rounded-[10px] border border-accent-purple/40 bg-accent-purple/10 px-4 py-1.5 text-[13px] font-semibold text-accent-violet transition-colors hover:bg-accent-purple/20"
        >
          {showCreate ? "Cancel" : "+ Create Stack"}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3">
            <label className="mb-1 block text-xs text-text-muted">
              Stack Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="My AI Toolkit"
              className="w-full rounded-lg border border-border bg-void px-3 py-2 text-sm text-text-primary"
            />
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-xs text-text-muted">
              Description (optional)
            </label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What's this stack about?"
              rows={2}
              className="w-full resize-none rounded-lg border border-border bg-void px-3 py-2 text-sm text-text-primary"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="rounded-lg bg-accent-purple/20 px-4 py-1.5 text-xs font-semibold text-accent-violet hover:bg-accent-purple/30 disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Stack"}
          </button>
        </div>
      )}

      {/* Stack List */}
      {loading ? (
        <div className="py-12 text-center text-text-muted">
          Loading stacks...
        </div>
      ) : stacks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="mb-2 text-text-secondary">
            No public stacks yet.
          </p>
          <p className="text-xs text-text-muted">
            Create the first one and start curating your favorite skills and
            projects!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {stacks.map((stack) => (
            <Link
              key={stack.id}
              href={`/stacks/${stack.id}`}
              className="group rounded-xl border border-border bg-card p-5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-white/10"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-base font-bold text-text-primary">
                  {stack.name}
                </span>
                <span className="text-xs text-text-muted">
                  {stack.item_count} items
                </span>
              </div>
              {stack.description && (
                <p className="mb-2 text-sm text-text-secondary">
                  {stack.description}
                </p>
              )}
              <div className="flex items-center gap-3 text-[11px] text-text-muted">
                <span>by {stack.owner_name}</span>
                <span>
                  {new Date(stack.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
