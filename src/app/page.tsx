import Link from "next/link";
import WeeklyPicksBanner from "@/components/WeeklyPicksBanner";
import CosmicBackground from "@/components/CosmicBackground";
import { DATA_LAST_UPDATED, DATA_COUNTS } from "@/data/metadata";
import { compactNumber } from "@/lib/format";

const STATS = [
  { label: "Skills", value: compactNumber(DATA_COUNTS.skills) },
  { label: "MCP Servers", value: compactNumber(DATA_COUNTS.mcpServers) },
  { label: "Plugins", value: compactNumber(DATA_COUNTS.plugins) },
  { label: "Agents", value: compactNumber(DATA_COUNTS.agents) },
  { label: "Deploy Options", value: compactNumber(DATA_COUNTS.deployOptions) },
  { label: "Projects", value: compactNumber(DATA_COUNTS.projects) },
];

const SECTIONS = [
  {
    href: "/skills",
    title: "Skills Hub",
    desc: "Unified search across ClawHub, GitHub, and community skills. Security verified.",
    accent: "#8b5cf6",
  },
  {
    href: "/mcp",
    title: "MCP Servers",
    desc: "Model Context Protocol servers from Official Registry, MCP.so, Smithery, and Glama.",
    accent: "#38bdf8",
  },
  {
    href: "/plugins",
    title: "Plugins",
    desc: "OpenClaw plugins — channels, tools, AI providers, and memory backends.",
    accent: "#a78bfa",
  },
  {
    href: "/agents",
    title: "Agents Hub",
    desc: "AI agent personas, crew templates, and orchestration workflows.",
    accent: "#22c55e",
  },
  {
    href: "/deploy",
    title: "Deploy Hub",
    desc: `${DATA_COUNTS.deployOptions} deployment options compared neutrally. Find the right fit.`,
    accent: "#f97316",
  },
  {
    href: "/projects",
    title: "Project Directory",
    desc: "Every project in the OpenClaw ecosystem, from core to experimental.",
    accent: "#fbbf24",
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

        <p className="mb-6 text-[11px] text-text-muted">
          Data last updated: {DATA_LAST_UPDATED}
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
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 md:grid-cols-6">
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
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Registry API */}
      <section className="mt-10">
        <div className="rounded-[14px] border border-accent-cyan/20 bg-accent-cyan/[0.04] p-6">
          <h2 className="font-display mb-2 text-lg font-bold text-[#38bdf8]">
            Skill Registry API
          </h2>
          <p className="mb-4 text-sm text-text-secondary">
            Use ClawVerse as a unified skill discovery endpoint. Search {DATA_COUNTS.skills} skills
            aggregated from ClawHub, awesome-openclaw-skills, Moltbooks, OpenClawSkill.ai,
            and GitHub — with security ratings and one-click install commands.
          </p>
          <div className="space-y-2">
            <div className="rounded-lg bg-void/80 px-4 py-2.5">
              <code className="font-code text-xs text-accent-cyan">
                GET /api/v1/registry
              </code>
              <span className="ml-3 text-xs text-text-muted">
                Registry manifest, sources, capabilities
              </span>
            </div>
            <div className="rounded-lg bg-void/80 px-4 py-2.5">
              <code className="font-code text-xs text-accent-cyan">
                GET /api/v1/registry?action=search&amp;q=chart&amp;security=verified
              </code>
              <span className="ml-3 text-xs text-text-muted">
                Search with filters
              </span>
            </div>
            <div className="rounded-lg bg-void/80 px-4 py-2.5">
              <code className="font-code text-xs text-[#a78bfa]">
                GET /api/skills/&#123;slug&#125;/install
              </code>
              <span className="ml-3 text-xs text-text-muted">
                Install commands from all sources
              </span>
            </div>
            <div className="rounded-lg bg-void/80 px-4 py-2.5">
              <code className="font-code text-xs text-[#a78bfa]">
                GET /api/skills/&#123;slug&#125;/manifest
              </code>
              <span className="ml-3 text-xs text-text-muted">
                MCP-compatible skill manifest
              </span>
            </div>
            <div className="rounded-lg bg-void/80 px-4 py-2.5">
              <code className="font-code text-xs text-[#f97316]">
                POST /api/v1/webhooks
              </code>
              <span className="ml-3 text-xs text-text-muted">
                Subscribe to new skills &amp; security alerts
              </span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-text-muted">
            Auto-discovery: <code className="font-code text-[11px] text-accent-cyan">/.well-known/openclaw-registry.json</code>
            {" | "}Auth: <code className="font-code text-[11px] text-accent-violet">X-ClawVerse-Key</code>
          </p>
        </div>
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
