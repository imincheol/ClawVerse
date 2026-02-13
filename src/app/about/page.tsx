import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1
        className="mb-6 text-[28px] font-bold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        About ClawVerse
      </h1>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <p>
          <strong className="text-text-primary">ClawVerse.io</strong> is a
          meta-platform for the OpenClaw ecosystem — a &ldquo;Product Hunt +
          Reddit + App Store&rdquo; that aggregates, verifies, and categorizes
          everything built on/for OpenClaw, the viral open-source AI agent
          framework with 182K+ GitHub stars.
        </p>

        <h2
          className="text-lg font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What We Do
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              title: "Aggregate",
              desc: "Skills are scattered across ClawHub (5,705), awesome-openclaw-skills (2,999), Moltbooks.app, and individual GitHub repos. We unify them.",
              color: "#8b5cf6",
            },
            {
              title: "Verify",
              desc: "400+ malicious skills have been found stealing API keys, SSH credentials, browser passwords, and crypto wallets. We provide security ratings.",
              color: "#ef4444",
            },
            {
              title: "Categorize",
              desc: "Deploy options, projects, tools are all on separate sites promoting themselves. We provide neutral comparison and classification.",
              color: "#38bdf8",
            },
            {
              title: "Connect",
              desc: "Users can submit/report projects, review them, and discover related tools across the ecosystem.",
              color: "#22c55e",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[14px] border border-border bg-card p-4"
            >
              <h3 className="mb-1 font-semibold" style={{ color: item.color }}>
                {item.title}
              </h3>
              <p className="text-[13px] text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2
          className="text-lg font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Security Rating System
        </h2>

        <div className="space-y-2">
          {[
            {
              badge: "Verified",
              color: "#22c55e",
              desc: "VirusTotal pass + code review + 100+ installs + 0 reports",
            },
            {
              badge: "Reviewed",
              color: "#eab308",
              desc: "VirusTotal pass + basic code check + 10+ installs",
            },
            {
              badge: "Unreviewed",
              color: "#f97316",
              desc: "New, auto-scan only",
            },
            {
              badge: "Flagged",
              color: "#ef4444",
              desc: "Security warning from community reports",
            },
            {
              badge: "Blocked",
              color: "#991b1b",
              desc: "Confirmed malicious (shown with warning, install link removed)",
            },
          ].map((item) => (
            <div key={item.badge} className="flex items-center gap-3">
              <span
                className="inline-block w-24 rounded-full px-2.5 py-0.5 text-center text-xs font-semibold"
                style={{
                  color: item.color,
                  background: item.color + "18",
                  border: `1px solid ${item.color}30`,
                }}
              >
                {item.badge}
              </span>
              <span className="text-[13px] text-text-secondary">
                {item.desc}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/submit"
            className="inline-block rounded-xl border border-accent-orange/40 bg-accent-orange/10 px-6 py-2.5 text-sm font-semibold text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
          >
            + Submit to ClawVerse
          </Link>
        </div>
      </div>
    </div>
  );
}
