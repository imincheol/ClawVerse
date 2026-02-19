"use client";

import { useState } from "react";
import type { Skill } from "@/data/skills";
import { getInstallCommands, getEffectiveSources } from "@/data/sources";

export default function InstallButton({ skill }: { skill: Skill }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const isBlocked = skill.security === "blocked";
  const isFlagged = skill.security === "flagged";

  const sources = getEffectiveSources(skill);
  const commands = getInstallCommands(skill.slug, sources);

  async function handleCopy(command: string, sourceId: string) {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(sourceId);
      setTimeout(() => setCopied(null), 2000);

      // Fire install tracking (best-effort)
      fetch(`/api/skills/${skill.slug}/install`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: sourceId, platform: "unknown" }),
      }).catch(() => {});
    } catch {
      // Clipboard may not be available
    }
  }

  if (isBlocked) {
    return (
      <div className="rounded-lg border border-sec-dark/30 bg-sec-dark/10 px-4 py-2.5 text-[12px] text-[#fca5a5]">
        Install blocked — this skill is confirmed malicious
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-2 text-[13px] font-semibold text-[#38bdf8] transition-colors hover:bg-accent-cyan/20"
      >
        Install Skill
        <span className="ml-1.5 text-[11px] text-text-muted">
          ({commands.length} {commands.length === 1 ? "source" : "sources"})
        </span>
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-border bg-[#0f0f18] p-4">
          {isFlagged && (
            <div className="mb-3 rounded-lg border border-sec-red/20 bg-sec-red/[0.06] px-3 py-2 text-[11px] text-[#fca5a5]">
              This skill has security warnings. Install at your own risk.
            </div>
          )}

          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            Available from {commands.length} {commands.length === 1 ? "source" : "sources"}
          </div>

          <div className="space-y-2">
            {commands.map(({ source, command, url }) => (
              <div
                key={source.id}
                className="rounded-lg border border-border bg-void/80 p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
                      style={{ background: source.color + "20", color: source.color }}
                    >
                      {source.icon}
                    </span>
                    <span className="text-[12px] font-semibold text-text-primary">
                      {source.name}
                    </span>
                    {source.hasSecurityScan && (
                      <span className="rounded px-1.5 py-0.5 text-[9px] text-sec-green" style={{ background: "rgba(34,197,94,0.1)" }}>
                        Scanned
                      </span>
                    )}
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-accent-cyan no-underline hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View &rarr;
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <code className="font-code flex-1 truncate rounded bg-white/[0.03] px-2 py-1 text-[11px] text-text-secondary">
                    {command}
                  </code>
                  <button
                    onClick={() => handleCopy(command, source.id)}
                    className="shrink-0 rounded border border-border px-2 py-1 text-[10px] text-text-muted transition-colors hover:border-accent-cyan/30 hover:text-accent-cyan"
                  >
                    {copied === source.id ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {skill.githubUrl && (
            <div className="mt-3 text-[11px] text-text-muted">
              Source: <a href={skill.githubUrl} target="_blank" rel="noopener noreferrer" className="text-accent-cyan no-underline hover:underline">{skill.githubUrl}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
