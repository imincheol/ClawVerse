import Link from "next/link";
import WeeklyPicksBanner from "@/components/WeeklyPicksBanner";
import CosmicBackground from "@/components/CosmicBackground";

const STATS = [
  { label: "GitHub Stars", value: "182K+" },
  { label: "ClawHub Skills", value: "5,705" },
  { label: "Moltbook Agents", value: "37K+" },
  { label: "Deploy Options", value: "10+" },
];

const SECTIONS = [
  {
    href: "/skills",
    title: "Skills Hub",
    desc: "Unified search across ClawHub, GitHub, and community skills. Security verified.",
    accent: "#8b5cf6",
  },
  {
    href: "/deploy",
    title: "Deploy Hub",
    desc: "10+ deployment options compared neutrally. Find the right fit for you.",
    accent: "#f97316",
  },
  {
    href: "/projects",
    title: "Project Directory",
    desc: "Every project in the OpenClaw ecosystem, from core to experimental.",
    accent: "#38bdf8",
  },
  {
    href: "/pulse",
    title: "Pulse",
    desc: "News, trends, and security alerts from the OpenClaw ecosystem.",
    accent: "#22c55e",
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      <CosmicBackground />
      {/* Hero */}
      <section className="py-16 text-center">
        <div className="mb-4 text-5xl">&#x1F99E;</div>
        <h1
          className="font-display mb-4 text-4xl font-bold md:text-5xl"
          style={{
            background: "linear-gradient(135deg, #c084fc, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ClawVerse
        </h1>
        <p className="mb-2 text-lg text-text-secondary">
          Every Claw. One Universe.
        </p>
        <p className="mx-auto mb-8 max-w-xl text-sm text-text-muted">
          Discover, share, and connect every project built on the OpenClaw
          universe. Aggregated skills, verified security, neutral deploy
          comparison, and a complete project directory.
        </p>

        {/* Security Alert */}
        <div className="mx-auto mb-10 max-w-2xl rounded-xl border border-sec-red/15 bg-sec-red/[0.06] px-5 py-3 text-left">
          <span className="text-[13px] font-semibold text-[#fca5a5]">
            Security Alert:{" "}
          </span>
          <span className="text-[13px] text-text-secondary">
            400+ malicious skills found on ClawHub/GitHub stealing API keys,
            SSH credentials, and crypto wallets. Check security ratings on
            ClawVerse.
          </span>
        </div>

        {/* Stats */}
        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <div
                className="font-display text-2xl font-bold text-text-primary"
              >
                {s.value}
              </div>
              <div className="mt-0.5 text-[11px] text-text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Picks */}
      <WeeklyPicksBanner />

      {/* Section Cards */}
      <section className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((sec) => (
          <Link
            key={sec.href}
            href={sec.href}
            className="group block rounded-[14px] border border-border bg-card p-6 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-white/10"
          >
            <h2
              className="font-display mb-2 text-lg font-bold"
              style={{ color: sec.accent }}
            >
              {sec.title}
            </h2>
            <p className="text-sm text-text-secondary">{sec.desc}</p>
            <span
              className="mt-3 inline-block text-sm font-semibold"
              style={{ color: sec.accent }}
            >
              Explore →
            </span>
          </Link>
        ))}
      </section>

      {/* Submit CTA */}
      <section className="mt-12 text-center">
        <p className="mb-3 text-sm text-text-muted">
          Know a project, skill, or deploy option we&apos;re missing?
        </p>
        <Link
          href="/submit"
          className="inline-block rounded-xl border border-accent-orange/40 bg-accent-orange/10 px-6 py-2.5 text-sm font-semibold text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
        >
          + Submit to ClawVerse
        </Link>
      </section>
    </div>
  );
}
