"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { PULSE_ITEMS, PULSE_TAG_CONFIG, type PulseTag } from "@/data/pulse";

const ALL_TAGS: (PulseTag | "all")[] = [
  "all",
  "security",
  "release",
  "trending",
  "new",
  "partner",
  "event",
];

function PulseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = (searchParams.get("tag") as PulseTag | null) ?? "all";

  const filteredItems =
    activeTag === "all"
      ? PULSE_ITEMS
      : PULSE_ITEMS.filter((item) => item.tag === activeTag);

  function handleTagClick(tag: PulseTag | "all") {
    if (tag === "all") {
      router.push("/pulse");
    } else {
      router.push(`/pulse?tag=${tag}`);
    }
  }

  return (
    <div>
      <div className="mb-7">
        <h1
          className="font-display mb-1.5 text-[28px] font-bold"
        >
          Pulse
        </h1>
        <p className="text-sm text-text-secondary">
          OpenClaw ecosystem news, trends, and security alerts.
        </p>
      </div>

      {/* Tag Filter Buttons */}
      <div className="mb-5 flex flex-wrap gap-2">
        {ALL_TAGS.map((tag) => {
          const isActive = activeTag === tag;
          const tagColor =
            tag === "all" ? "#8b5cf6" : PULSE_TAG_CONFIG[tag].color;
          const label =
            tag === "all" ? "ALL" : PULSE_TAG_CONFIG[tag].label;

          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all duration-200"
              style={
                isActive
                  ? {
                      background: tagColor + "28",
                      color: tagColor,
                      boxShadow: `0 0 0 1px ${tagColor}50`,
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#94a3b8",
                    }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Pulse Items */}
      {filteredItems.length === 0 && (
        <p className="py-8 text-center text-sm text-text-muted">
          No items found for this filter.
        </p>
      )}

      {filteredItems.map((item) => {
        const tagConfig = PULSE_TAG_CONFIG[item.tag];
        const isSecurityItem = item.tag === "security";

        return (
          <div
            key={item.id}
            className={
              isSecurityItem
                ? "mb-4 rounded-[14px] border border-sec-red/15 bg-sec-red/[0.06] px-5 py-4"
                : "mb-3 rounded-[14px] border border-border bg-card px-5 py-4 transition-colors duration-200 hover:border-white/10"
            }
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="rounded-md px-2.5 py-0.5 text-[11px] font-bold"
                style={{
                  background: tagConfig.color + "18",
                  color: tagConfig.color,
                }}
              >
                {tagConfig.label}
              </span>
              <span className="text-xs text-text-muted">{item.date}</span>
            </div>
            <h3
              className={
                isSecurityItem
                  ? "mb-1 text-[15px] font-semibold text-[#fca5a5]"
                  : "mb-1 text-[15px] text-text-primary"
              }
            >
              {item.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-text-secondary">
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function PulsePage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-text-muted">
          Loading...
        </div>
      }
    >
      <PulseContent />
    </Suspense>
  );
}
