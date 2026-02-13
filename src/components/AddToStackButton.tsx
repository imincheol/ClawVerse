"use client";

import { useState, useEffect } from "react";

interface Stack {
  id: string;
  name: string;
}

export default function AddToStackButton({
  itemType,
  itemSlug,
}: {
  itemType: "skill" | "project";
  itemSlug: string;
}) {
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    if (showDropdown && stacks.length === 0) {
      fetch("/api/profile/stacks")
        .then((r) => r.json())
        .then((data) => setStacks(data.stacks || []))
        .catch(() => {});
    }
  }, [showDropdown, stacks.length]);

  const handleAdd = async (stackId: string) => {
    try {
      const res = await fetch(`/api/stacks/${stackId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_type: itemType, item_slug: itemSlug }),
      });
      if (res.ok) {
        setAdded(stackId);
        setTimeout(() => {
          setShowDropdown(false);
          setAdded(null);
        }, 1000);
      }
    } catch {
      // silent
    }
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-xs text-text-muted transition-colors hover:border-accent-purple/40 hover:text-accent-violet"
        title="Add to stack"
      >
        +
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 top-8 z-50 min-w-[160px] rounded-lg border border-border bg-void p-1.5 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {stacks.length === 0 ? (
            <p className="px-2 py-1 text-[11px] text-text-muted">
              No stacks yet. Create one first.
            </p>
          ) : (
            stacks.map((stack) => (
              <button
                key={stack.id}
                onClick={(e) => {
                  e.preventDefault();
                  handleAdd(stack.id);
                }}
                className={`block w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                  added === stack.id
                    ? "text-[#22c55e]"
                    : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                }`}
              >
                {added === stack.id ? "Added!" : stack.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
