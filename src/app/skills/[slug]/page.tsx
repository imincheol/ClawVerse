import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  SKILLS,
  SECURITY_CONFIG,
  PERMISSION_LABELS,
  CATEGORIES,
  VT_STATUS_CONFIG,
} from "@/data/skills";
import SecurityBadge from "@/components/SecurityBadge";
import SkillCard from "@/components/SkillCard";
import ReviewSection from "@/components/ReviewSection";

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

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = SKILLS.find((s) => s.slug === slug);
  if (!skill) notFound();

  const sec = SECURITY_CONFIG[skill.security];

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/skills"
        className="mb-6 inline-block text-sm text-text-muted no-underline hover:text-text-secondary"
      >
        ← Back to Skills
      </Link>

      <div className="rounded-2xl border p-8" style={{ borderColor: sec.color + "30" }}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <code
              className="text-xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-code)" }}
            >
              {skill.name}
            </code>
            <div className="mt-2">
              <SecurityBadge level={skill.security} />
            </div>
          </div>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-text-secondary">
          {skill.desc}
        </p>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-2 gap-3">
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
              ★ {skill.rating}{" "}
              <span className="text-[13px] text-text-secondary">
                ({skill.reviews})
              </span>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Required Permissions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skill.permissions.map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/[0.08] bg-white/[0.06] px-2 py-0.5 text-[11px] text-text-secondary"
              >
                {PERMISSION_LABELS[p] || p}
              </span>
            ))}
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

        {/* Report Button */}
        <Link
          href="/submit"
          className="mt-2 inline-block rounded-[10px] border border-sec-red/30 bg-sec-red/10 px-4 py-2 text-[13px] text-[#fca5a5] no-underline transition-colors hover:bg-sec-red/20"
        >
          Report Security Issue
        </Link>

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
