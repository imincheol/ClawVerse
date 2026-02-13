"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface StackDetail {
  id: string;
  name: string;
  description: string | null;
  owner_name: string;
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
  const stackId = params.id as string;
  const [stack, setStack] = useState<StackDetail | null>(null);
  const [items, setItems] = useState<StackItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        <h1
          className="mb-2 text-2xl font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {stack.name}
        </h1>
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
        </div>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <p className="text-center text-sm text-text-muted">
          This stack is empty. Add skills and projects from their detail pages.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={
                item.item_type === "skill"
                  ? `/skills/${item.item_slug}`
                  : `/projects/${item.item_slug}`
              }
              className="group rounded-xl border border-border bg-card p-4 no-underline transition-colors hover:border-white/10"
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
          ))}
        </div>
      )}
    </div>
  );
}
