"use client";

import { useState, useRef, useEffect } from "react";
import { PERMISSION_LABELS } from "@/data/skills";
import { PERMISSION_RISK_INFO, PERMISSION_RISK_COLORS } from "@/data/owasp";

interface PermissionTooltipProps {
  permission: string;
  compact?: boolean;
}

export default function PermissionTooltip({ permission, compact }: PermissionTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const info = PERMISSION_RISK_INFO[permission];
  const label = PERMISSION_LABELS[permission] || permission;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!info) {
    return (
      <span className="rounded-md border border-white/[0.08] bg-white/[0.06] px-2 py-0.5 text-[11px] text-text-secondary">
        {label}
      </span>
    );
  }

  const riskColor = PERMISSION_RISK_COLORS[info.risk];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] transition-colors"
        style={{
          borderColor: open ? riskColor + "40" : "rgba(255,255,255,0.08)",
          background: open ? riskColor + "10" : "rgba(255,255,255,0.06)",
          color: open ? riskColor : "#94a3b8",
        }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: riskColor }}
        />
        {label}
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-xl border p-4 shadow-xl"
          style={{
            background: "#12121a",
            borderColor: riskColor + "30",
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-text-primary">
              {info.label}
            </span>
            <span
              className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
              style={{
                color: riskColor,
                background: riskColor + "18",
              }}
            >
              {info.risk} risk
            </span>
          </div>

          <p className="mb-3 text-[12px] leading-relaxed text-text-secondary">
            {info.desc}
          </p>

          {!compact && (
            <>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                What this enables
              </div>
              <ul className="mb-3 space-y-1">
                {info.examples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-text-secondary">
                    <span className="mt-0.5 text-[9px]" style={{ color: riskColor }}>&#9679;</span>
                    {ex}
                  </li>
                ))}
              </ul>

              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                OWASP MCP references
              </div>
              <div className="flex flex-wrap gap-1">
                {info.owaspRefs.map((ref) => (
                  <a
                    key={ref}
                    href="/pulse/security#owasp"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-accent-cyan no-underline hover:bg-white/[0.08]"
                  >
                    {ref.toUpperCase()}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
