import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  SKILLS,
  SECURITY_CONFIG,
  CATEGORIES,
  VT_STATUS_CONFIG,
  PROTOCOL_CONFIG,
  MAINTAINER_CONFIG,
} from "@/data/skills";
import { PERMISSION_RISK_INFO, PERMISSION_RISK_COLORS, OWASP_MCP_TOP10 } from "@/data/owasp";
import SecurityBadge from "@/components/SecurityBadge";
import SkillCard from "@/components/SkillCard";
import ReviewSection from "@/components/ReviewSection";
import AddToStackButton from "@/components/AddToStackButton";
import PermissionTooltip from "@/components/PermissionTooltip";

export function generateStaticParams() {
  return SKILLS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = SKILLS.find((s) => s.slug === slug);
  if (!skill) return { title: "Skill Not Found — ClawVerse" };
  return {
    title: `${skill.name} — ClawVerse Skills`,
    description: skill.desc,
  };
}

function daysAgo(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = SKILLS.find((s) => s.slug === slug);
  if (!skill) notFound();

  const sec = SECURITY_CONFIG[skill.security];
  const maint = MAINTAINER_CONFIG[skill.maintainerActivity];
  const days = daysAgo(skill.lastUpdated);

  // Find OWASP categories related to this skill's permissions
  const relatedOwasp = OWASP_MCP_TOP10.filter((cat) =>
    cat.relatedPermissions.some((p) => skill.permissions.includes(p))
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/skills"
        className="mb-6 inline-block text-sm text-text-muted no-underline hover:text-text-secondary"
      >
        &larr; Back to Skills
      </Link>

      <div className="rounded-2xl border p-8" style={{ borderColor: sec.color + "30" }}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <code
              className="font-code text-xl font-bold text-text-primary"
            >
              {skill.name}
            </code>
            <div className="mt-2 flex items-center gap-2">
              <SecurityBadge level={skill.security} />
              {/* Health indicator */}
              <span
                className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px]"
                style={{
                  color: maint.color,
                  background: maint.color + "15",
                  border: `1px solid ${maint.color}25`,
                }}
              >
                {maint.icon} {maint.label}
              </span>
            </div>
          </div>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-text-secondary">
          {skill.desc}
        </p>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">Installs</div>
            <div className="text-lg font-bold text-text-primary">
              {skill.installs.toLocaleString()}
            </div>
          </div>
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">
              Rating / Reviews
            </div>
            <div className="text-lg font-bold text-[#fbbf24]">
              &#9733; {skill.rating}{" "}
              <span className="text-[13px] text-text-secondary">
                ({skill.reviews})
              </span>
            </div>
          </div>
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">Last Updated</div>
            <div className="text-sm font-bold text-text-primary">
              {days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`}
            </div>
            <div className="text-[10px] text-text-muted">{skill.lastUpdated}</div>
          </div>
        </div>

        {/* Permissions with risk explanations */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Required Permissions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skill.permissions.map((p) => (
              <PermissionTooltip key={p} permission={p} />
            ))}
          </div>
          {/* Aggregate risk note */}
          {skill.permissions.length >= 3 && (
            <div className="mt-2 rounded-lg border border-sec-orange/20 bg-sec-orange/[0.06] px-3 py-2 text-[11px] text-[#fdba74]">
              This skill requests {skill.permissions.length} permissions. Skills with 3+ permissions have a higher risk profile per OWASP MCP-06 (Excessive Permission Scope).
            </div>
          )}
        </div>

        {/* Protocol Compatibility */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Protocol Support
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skill.protocols.map((proto) => {
              const pc = PROTOCOL_CONFIG[proto];
              return (
                <span
                  key={proto}
                  className="rounded-md px-2.5 py-1 text-xs font-semibold"
                  style={{
                    color: pc.color,
                    background: pc.bg,
                    border: `1px solid ${pc.color}30`,
                  }}
                >
                  {pc.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Platforms */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Compatible Platforms
          </div>
          <div className="flex gap-1.5">
            {skill.platforms.map((p) => (
              <span
                key={p}
                className="rounded-md border border-accent-purple/20 bg-accent-purple/10 px-2.5 py-1 text-xs text-accent-violet"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Source */}
        <div className="mb-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Source
          </div>
          <span className="text-[13px] text-text-secondary">
            {skill.source}
          </span>
        </div>

        {/* Warnings */}
        {skill.security === "blocked" && (
          <div className="mb-4 rounded-[10px] border border-sec-dark/30 bg-sec-dark/15 px-4 py-3">
            <span className="text-[13px] text-[#fca5a5]">
              This skill has been confirmed malicious and is blocked. Do not install.
            </span>
          </div>
        )}
        {skill.security === "flagged" && (
          <div className="mb-4 rounded-[10px] border border-sec-red/20 bg-sec-red/10 px-4 py-3">
            <span className="text-[13px] text-[#fca5a5]">
              Community security warnings have been reported for this skill. Use with caution.
            </span>
          </div>
        )}

        {/* VirusTotal Security Analysis */}
        {(() => {
          const vtStatus = skill.virustotal_status ?? "unscanned";
          const vt = VT_STATUS_CONFIG[vtStatus];
          return (
            <div className="mb-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Security Analysis
              </div>
              <div
                className="rounded-[10px] border p-4"
                style={{ borderColor: vt.color + "30", background: vt.color + "08" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: vt.color + "20", color: vt.color }}
                  >
                    {vt.icon}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: vt.color }}>
                    VirusTotal: {vt.label}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed text-text-muted">
                  {vt.desc}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-text-muted">Overall Security:</span>
                    <SecurityBadge level={skill.security} />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* OWASP MCP Top 10 Related Risks */}
        {relatedOwasp.length > 0 && (
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                OWASP MCP Risks
              </span>
              <Link
                href="/pulse/security#owasp"
                className="text-[10px] text-accent-cyan no-underline hover:underline"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="space-y-2">
              {relatedOwasp.map((cat) => {
                const riskColor = cat.risk === "critical" ? "#ef4444" : cat.risk === "high" ? "#f97316" : "#eab308";
                return (
                  <div
                    key={cat.id}
                    className="rounded-[10px] border px-4 py-3"
                    style={{ borderColor: riskColor + "20", background: riskColor + "06" }}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[11px] font-bold" style={{ color: riskColor }}>
                        {cat.id.toUpperCase()}
                      </span>
                      <span className="text-[12px] font-semibold text-text-primary">
                        {cat.title}
                      </span>
                      <span
                        className="ml-auto rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase"
                        style={{ color: riskColor, background: riskColor + "18" }}
                      >
                        {cat.risk}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-text-muted">
                      {cat.mitigations[0]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Permission Risk Breakdown (detail view) */}
        {skill.permissions.some((p) => PERMISSION_RISK_INFO[p]) && (
          <div className="mb-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Permission Risk Breakdown
            </div>
            <div className="space-y-2">
              {skill.permissions.map((p) => {
                const info = PERMISSION_RISK_INFO[p];
                if (!info) return null;
                const riskColor = PERMISSION_RISK_COLORS[info.risk];
                return (
                  <div
                    key={p}
                    className="rounded-[10px] border px-4 py-3"
                    style={{ borderColor: riskColor + "20", background: riskColor + "06" }}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-text-primary">
                        {info.label}
                      </span>
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase"
                        style={{ color: riskColor, background: riskColor + "18" }}
                      >
                        {info.risk}
                      </span>
                    </div>
                    <p className="mb-2 text-[11px] leading-relaxed text-text-muted">
                      {info.desc}
                    </p>
                    <ul className="space-y-0.5">
                      {info.examples.map((ex, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[10px] text-text-secondary">
                          <span className="mt-0.5 text-[8px]" style={{ color: riskColor }}>&#9679;</span>
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <AddToStackButton itemType="skill" itemSlug={skill.slug} />
          <Link
            href="/submit"
            className="inline-block rounded-[10px] border border-sec-red/30 bg-sec-red/10 px-4 py-2 text-[13px] text-[#fca5a5] no-underline transition-colors hover:bg-sec-red/20"
          >
            Report Security Issue
          </Link>
        </div>

        {/* Reviews */}
        <ReviewSection targetType="skill" targetId={skill.slug} />
      </div>

      {/* Similar Skills */}
      {(() => {
        const categoryLabel = CATEGORIES.find((c) => c.id === skill.category)?.label ?? skill.category;
        const similarSkills = SKILLS.filter(
          (s) => s.category === skill.category && s.id !== skill.id
        ).slice(0, 4);
        if (similarSkills.length === 0) return null;
        return (
          <div className="mt-8">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Similar {categoryLabel} Skills
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {similarSkills.map((s) => (
                <SkillCard key={s.id} skill={s} />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
