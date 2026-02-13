import Link from "next/link";
import type { Metadata } from "next";
import { SKILLS, SECURITY_CONFIG } from "@/data/skills";
import { PULSE_ITEMS, PULSE_TAG_CONFIG } from "@/data/pulse";
import {
  OWASP_MCP_TOP10,
  OWASP_RISK_CONFIG,
  THREAT_STATS,
  PERMISSION_RISK_INFO,
  PERMISSION_RISK_COLORS,
} from "@/data/owasp";
import SecurityBadge from "@/components/SecurityBadge";

export const metadata: Metadata = {
  title: "Security Intelligence Center — ClawVerse",
  description:
    "AI agent ecosystem security dashboard: OWASP MCP Top 10, threat statistics, security alerts, and permission risk analysis.",
};

export default function SecurityIntelligencePage() {
  const securityAlerts = PULSE_ITEMS.filter((p) => p.tag === "security").sort(
    (a, b) => b.date.localeCompare(a.date)
  );

  // Compute stats from skill data
  const totalSkills = SKILLS.length;
  const blockedCount = SKILLS.filter((s) => s.security === "blocked").length;
  const flaggedCount = SKILLS.filter((s) => s.security === "flagged").length;
  const verifiedCount = SKILLS.filter((s) => s.security === "verified").length;

  // Permission distribution
  const permCounts: Record<string, number> = {};
  SKILLS.forEach((s) =>
    s.permissions.forEach((p) => {
      permCounts[p] = (permCounts[p] || 0) + 1;
    })
  );

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Link
            href="/pulse"
            className="text-sm text-text-muted no-underline hover:text-text-secondary"
          >
            &larr; Pulse
          </Link>
        </div>
        <h1 className="font-display mb-2 text-[28px] font-bold text-text-primary">
          Security Intelligence Center
        </h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          Real-time security overview for the OpenClaw ecosystem. Powered by
          VirusTotal scanning, OWASP MCP Top 10 framework, and community
          reports.
        </p>
      </div>

      {/* Threat Stats Banner */}
      <div className="mb-8 rounded-2xl border border-sec-red/20 bg-sec-red/[0.04] p-6">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-sec-red">
          Ecosystem Threat Overview
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <StatCard
            label="Malicious Skills Found"
            value={`${THREAT_STATS.totalMaliciousDiscovered}+`}
            color="#ef4444"
          />
          <StatCard
            label="MCP Exploit Probability"
            value={`${THREAT_STATS.mcpExploitProbability}%`}
            sublabel="with 10+ plugins"
            color="#ef4444"
          />
          <StatCard
            label="MCP Vulnerability Rate"
            value={`${THREAT_STATS.mcpVulnerabilityRate}%`}
            sublabel="of servers affected"
            color="#f97316"
          />
          <StatCard
            label="Tool Poisoning Rate"
            value={`${THREAT_STATS.toolPoisoningRate}%`}
            sublabel="of MCP servers"
            color="#f97316"
          />
          <StatCard
            label="Enterprise AI Security"
            value={`${THREAT_STATS.enterpriseWithAdvancedSecurity}%`}
            sublabel="have advanced strategy"
            color="#eab308"
          />
          <StatCard
            label="Blocked on ClawVerse"
            value={String(blockedCount)}
            sublabel={`of ${totalSkills} skills`}
            color="#991b1b"
          />
          <StatCard
            label="Flagged on ClawVerse"
            value={String(flaggedCount)}
            sublabel="under investigation"
            color="#ef4444"
          />
          <StatCard
            label="Verified Safe"
            value={String(verifiedCount)}
            sublabel={`of ${totalSkills} skills`}
            color="#22c55e"
          />
        </div>
        <div className="mt-3 text-[10px] text-text-muted">
          Last updated: {THREAT_STATS.lastUpdated} | Sources: VentureBeat,
          Queen&apos;s University, OWASP, ClawVerse scans
        </div>
      </div>

      {/* Security Rating Distribution */}
      <div className="mb-8">
        <h2 className="font-display mb-4 text-lg font-bold text-text-primary">
          ClawVerse Security Ratings
        </h2>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="space-y-3">
            {(
              [
                "verified",
                "reviewed",
                "unreviewed",
                "flagged",
                "blocked",
              ] as const
            ).map((level) => {
              const config = SECURITY_CONFIG[level];
              const count = SKILLS.filter(
                (s) => s.security === level
              ).length;
              const pct = Math.round((count / totalSkills) * 100);
              return (
                <div key={level} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <SecurityBadge level={level} />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: config.color + "40",
                          minWidth: count > 0 ? "8px" : "0",
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right text-[12px] text-text-secondary">
                    {count} ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* OWASP MCP Top 10 */}
      <div id="owasp" className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-display text-lg font-bold text-text-primary">
            OWASP MCP Top 10
          </h2>
          <span className="rounded-md bg-sec-red/10 px-2 py-0.5 text-[10px] font-bold text-sec-red">
            2025
          </span>
        </div>
        <p className="mb-4 text-[13px] text-text-secondary">
          The OWASP Model Context Protocol Top 10 identifies the most critical
          security risks in MCP-based agent tool ecosystems. ClawVerse maps
          its security ratings and permission analysis to this framework.
        </p>
        <div className="space-y-3">
          {OWASP_MCP_TOP10.map((cat) => {
            const riskConfig = OWASP_RISK_CONFIG[cat.risk];
            return (
              <div
                key={cat.id}
                className="rounded-xl border p-5 transition-colors hover:border-white/10"
                style={{
                  borderColor: riskConfig.color + "20",
                  background: riskConfig.color + "04",
                }}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                      style={{
                        background: riskConfig.color + "18",
                        color: riskConfig.color,
                      }}
                    >
                      #{cat.rank}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase" style={{ color: riskConfig.color }}>
                        {cat.id.toUpperCase()}
                      </span>
                      <h3 className="text-[14px] font-semibold text-text-primary">
                        {cat.title}
                      </h3>
                    </div>
                  </div>
                  <span
                    className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
                    style={{
                      color: riskConfig.color,
                      background: riskConfig.bg,
                    }}
                  >
                    {riskConfig.label}
                  </span>
                </div>
                <p className="mb-3 text-[12px] leading-relaxed text-text-secondary">
                  {cat.desc}
                </p>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Related Permissions:
                  </span>
                  {cat.relatedPermissions.map((p) => {
                    const info = PERMISSION_RISK_INFO[p];
                    const color = info
                      ? PERMISSION_RISK_COLORS[info.risk]
                      : "#64748b";
                    return (
                      <span
                        key={p}
                        className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                        style={{ color, background: color + "15" }}
                      >
                        {info?.label || p}
                      </span>
                    );
                  })}
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    Mitigations:
                  </span>
                  <ul className="mt-1 space-y-0.5">
                    {cat.mitigations.map((m, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-[11px] text-text-muted"
                      >
                        <span className="mt-0.5 text-[8px] text-sec-green">
                          &#9679;
                        </span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permission Risk Matrix */}
      <div className="mb-8">
        <h2 className="font-display mb-4 text-lg font-bold text-text-primary">
          Permission Risk Matrix
        </h2>
        <p className="mb-4 text-[13px] text-text-secondary">
          Understanding what each permission allows and the associated risk
          level. Skills requesting multiple high-risk permissions should be
          carefully evaluated.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(PERMISSION_RISK_INFO).map(([key, info]) => {
            const riskColor = PERMISSION_RISK_COLORS[info.risk];
            const count = permCounts[key] || 0;
            return (
              <div
                key={key}
                className="rounded-xl border p-4"
                style={{
                  borderColor: riskColor + "20",
                  background: riskColor + "04",
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-text-primary">
                    {info.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted">
                      {count} skills
                    </span>
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase"
                      style={{
                        color: riskColor,
                        background: riskColor + "18",
                      }}
                    >
                      {info.risk}
                    </span>
                  </div>
                </div>
                <p className="mb-2 text-[11px] leading-relaxed text-text-muted">
                  {info.desc}
                </p>
                <ul className="space-y-0.5">
                  {info.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1.5 text-[10px] text-text-secondary"
                    >
                      <span
                        className="mt-0.5 text-[8px]"
                        style={{ color: riskColor }}
                      >
                        &#9679;
                      </span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Security Alerts */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-text-primary">
            Recent Security Alerts
          </h2>
          <Link
            href="/pulse?tag=security"
            className="text-[12px] text-accent-cyan no-underline hover:underline"
          >
            View all in Pulse &rarr;
          </Link>
        </div>
        <div className="space-y-3">
          {securityAlerts.map((item) => {
            const tagConfig = PULSE_TAG_CONFIG[item.tag];
            return (
              <div
                key={item.id}
                className="rounded-[14px] border border-sec-red/15 bg-sec-red/[0.04] px-5 py-4"
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
                <h3 className="mb-1 text-[15px] font-semibold text-[#fca5a5]">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-text-secondary">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flagged & Blocked Skills */}
      <div className="mb-8">
        <h2 className="font-display mb-4 text-lg font-bold text-text-primary">
          Flagged & Blocked Skills
        </h2>
        <div className="space-y-2">
          {SKILLS.filter(
            (s) => s.security === "blocked" || s.security === "flagged"
          )
            .sort((a, b) => {
              if (a.security === "blocked" && b.security !== "blocked")
                return -1;
              if (a.security !== "blocked" && b.security === "blocked")
                return 1;
              return 0;
            })
            .map((skill) => {
              const sec = SECURITY_CONFIG[skill.security];
              return (
                <Link
                  key={skill.id}
                  href={`/skills/${skill.slug}`}
                  className="flex items-center justify-between rounded-xl border px-4 py-3 no-underline transition-colors hover:border-white/10"
                  style={{
                    borderColor: sec.color + "20",
                    background: sec.color + "06",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <SecurityBadge level={skill.security} />
                    <div>
                      <code className="font-code text-[13px] font-semibold text-text-primary">
                        {skill.name}
                      </code>
                      <p className="text-[11px] text-text-muted">
                        {skill.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1">
                    {skill.permissions.map((p) => {
                      const info = PERMISSION_RISK_INFO[p];
                      const color = info
                        ? PERMISSION_RISK_COLORS[info.risk]
                        : "#64748b";
                      return (
                        <span
                          key={p}
                          className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold"
                          style={{ color, background: color + "15" }}
                        >
                          {info?.label || p}
                        </span>
                      );
                    })}
                  </div>
                </Link>
              );
            })}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <h3 className="mb-2 text-base font-bold text-text-primary">
          Found a security issue?
        </h3>
        <p className="mb-4 text-[13px] text-text-secondary">
          Help protect the OpenClaw ecosystem by reporting malicious skills,
          vulnerabilities, or suspicious behavior.
        </p>
        <Link
          href="/submit"
          className="inline-block rounded-xl bg-sec-red/20 px-6 py-2.5 text-[13px] font-semibold text-[#fca5a5] no-underline transition-colors hover:bg-sec-red/30"
        >
          Report Security Issue
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: string;
  sublabel?: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-black/20 p-3" style={{ borderColor: color + "20" }}>
      <div className="mb-0.5 text-[10px] text-text-muted">{label}</div>
      <div className="text-xl font-bold" style={{ color }}>
        {value}
      </div>
      {sublabel && (
        <div className="text-[9px] text-text-muted">{sublabel}</div>
      )}
    </div>
  );
}
