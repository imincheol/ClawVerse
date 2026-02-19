"use client";

import { Plugin, PLUGIN_TYPE_CONFIG } from "@/data/plugins";
import { SECURITY_CONFIG } from "@/data/skills";
import SecurityBadge from "./SecurityBadge";

export default function PluginCard({ plugin }: { plugin: Plugin }) {
  const sec = SECURITY_CONFIG[plugin.security];
  const typeConfig = PLUGIN_TYPE_CONFIG[plugin.type];

  return (
    <div
      className="group relative block overflow-hidden rounded-[14px] border p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = sec.color + "60";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,255,255,0.07)";
      }}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{typeConfig.icon}</span>
          <code className="font-code text-[15px] font-bold text-text-primary">
            {plugin.name}
          </code>
        </div>
        <SecurityBadge level={plugin.security} />
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-text-secondary">
        {plugin.desc}
      </p>

      {/* Type badge */}
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        <span
          className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            color: typeConfig.color,
            background: typeConfig.color + "18",
            border: `1px solid ${typeConfig.color}25`,
          }}
        >
          {typeConfig.label}
        </span>
        <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-text-muted">
          {plugin.source}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{plugin.downloads.toLocaleString()} downloads</span>
        <span>
          {plugin.rating} ({plugin.reviews})
        </span>
        <span className="text-[10px]">{plugin.author}</span>
      </div>
    </div>
  );
}
