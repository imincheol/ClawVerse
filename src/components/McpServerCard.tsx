"use client";

import Link from "next/link";
import { McpServer } from "@/data/mcp-servers";
import { SECURITY_CONFIG } from "@/data/skills";
import SecurityBadge from "./SecurityBadge";

export default function McpServerCard({ server }: { server: McpServer }) {
  const sec = SECURITY_CONFIG[server.security];

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
        <code className="font-code text-[15px] font-bold text-text-primary">
          {server.name}
        </code>
        <SecurityBadge level={server.security} />
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-text-secondary">
        {server.desc}
      </p>

      {/* Runtime & Tools */}
      <div className="mb-2.5 flex flex-wrap gap-1.5">
        <span className="rounded-md border border-accent-purple/25 bg-accent-purple/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent-violet">
          {server.runtime}
        </span>
        <span className="rounded-md border border-accent-cyan/25 bg-accent-cyan/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#38bdf8]">
          {server.tools} tools
        </span>
      </div>

      {/* Platforms */}
      <div className="mb-2.5 flex flex-wrap gap-1">
        {server.platforms.map((p) => (
          <span
            key={p}
            className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-text-muted"
          >
            {p}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{server.downloads.toLocaleString()} downloads</span>
        <span>
          {server.rating} ({server.reviews})
        </span>
        <span className="text-[10px]">{server.source}</span>
      </div>

      {server.sourceUrl && (
        <Link
          href={server.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
          aria-label={`View ${server.name}`}
        />
      )}
    </div>
  );
}
