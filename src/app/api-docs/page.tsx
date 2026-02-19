import Link from "next/link";

const ENDPOINTS = [
  {
    group: "Discovery",
    items: [
      {
        method: "GET",
        path: "/api/v1/registry",
        desc: "Registry manifest with metadata, capabilities, stats, and endpoint listing.",
        params: [],
        auth: false,
      },
      {
        method: "GET",
        path: "/api/v1/registry?action=search",
        desc: "Search skills with filters. Returns results consumable by agents and MCP clients.",
        params: [
          { name: "q", desc: "Search query (name, description)" },
          { name: "category", desc: "browser, productivity, media, design, communication, agent, social, finance, iot, utility, visualize" },
          { name: "security", desc: "verified, reviewed, unreviewed, flagged, blocked" },
          { name: "platform", desc: "OpenClaw, Claude Code, Codex" },
          { name: "source", desc: "clawhub, github, community, awesome-openclaw-skills, moltbooks, openclawskill" },
          { name: "sort", desc: "installs (default), rating, newest, name, security" },
          { name: "limit", desc: "Results per page (default: 50)" },
          { name: "offset", desc: "Pagination offset" },
        ],
        auth: false,
      },
      {
        method: "GET",
        path: "/api/v1/registry?action=sources",
        desc: "List all aggregated source registries with metadata.",
        params: [],
        auth: false,
      },
      {
        method: "GET",
        path: "/.well-known/openclaw-registry.json",
        desc: "Auto-discovery manifest for agents to find this registry.",
        params: [],
        auth: false,
      },
    ],
  },
  {
    group: "Skills",
    items: [
      {
        method: "GET",
        path: "/api/skills",
        desc: "List all skills with optional search and filter parameters.",
        params: [
          { name: "search", desc: "Search query" },
          { name: "category", desc: "Filter by category" },
          { name: "security", desc: "Filter by security level" },
        ],
        auth: false,
      },
      {
        method: "GET",
        path: "/api/skills/{slug}",
        desc: "Full skill detail including resolved sources, install commands, and navigation links.",
        params: [],
        auth: false,
      },
      {
        method: "GET",
        path: "/api/skills/{slug}/install",
        desc: "Install instructions for a skill across all available sources.",
        params: [],
        auth: false,
      },
      {
        method: "POST",
        path: "/api/skills/{slug}/install",
        desc: "Track an install event and return instructions. Supports source preference.",
        params: [
          { name: "source", desc: "Preferred source ID (body)" },
          { name: "platform", desc: "Installing platform (body)" },
          { name: "agent_id", desc: "Agent identifier (body)" },
        ],
        auth: "optional",
      },
      {
        method: "GET",
        path: "/api/skills/{slug}/manifest",
        desc: "MCP-compatible manifest with security, compatibility, and source metadata.",
        params: [],
        auth: false,
      },
    ],
  },
  {
    group: "Ecosystem",
    items: [
      {
        method: "GET",
        path: "/api/projects",
        desc: "List all ecosystem projects with layer and status filters.",
        params: [],
        auth: false,
      },
      {
        method: "GET",
        path: "/api/deploy",
        desc: "List all deploy options with comparison metadata.",
        params: [],
        auth: false,
      },
      {
        method: "POST",
        path: "/api/submit",
        desc: "Submit a new skill, project, deploy option, or security report.",
        params: [],
        auth: false,
      },
    ],
  },
  {
    group: "Webhooks",
    items: [
      {
        method: "GET",
        path: "/api/v1/webhooks",
        desc: "List available webhook event types and subscription schema.",
        params: [],
        auth: false,
      },
      {
        method: "POST",
        path: "/api/v1/webhooks",
        desc: "Subscribe to registry events (skill.new, skill.blocked, security.alert, etc.).",
        params: [
          { name: "url", desc: "Your webhook endpoint URL (body, required)" },
          { name: "events", desc: "Event types to subscribe to (body, required)" },
          { name: "secret", desc: "HMAC signature verification secret (body, optional)" },
        ],
        auth: "required",
      },
    ],
  },
];

const EVENTS = [
  { type: "skill.new", desc: "New skill added to the registry" },
  { type: "skill.updated", desc: "Existing skill metadata updated" },
  { type: "skill.flagged", desc: "Skill flagged for security issues by community" },
  { type: "skill.blocked", desc: "Skill confirmed malicious and blocked" },
  { type: "security.alert", desc: "General security advisory for the ecosystem" },
  { type: "pulse.new", desc: "New pulse item (news/update) published" },
];

const SECURITY_LEVELS = [
  { level: "verified", emoji: "green", desc: "VirusTotal pass + code review + 100+ installs + 0 reports" },
  { level: "reviewed", emoji: "yellow", desc: "VirusTotal pass + basic code check + 10+ installs" },
  { level: "unreviewed", emoji: "orange", desc: "New, auto-scan only" },
  { level: "flagged", emoji: "red", desc: "Security warning from community reports" },
  { level: "blocked", emoji: "dark", desc: "Confirmed malicious — do NOT install" },
];

const SECURITY_COLORS: Record<string, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
  dark: "#991b1b",
};

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "#22c55e",
    POST: "#38bdf8",
    PUT: "#fbbf24",
    DELETE: "#ef4444",
  };
  const color = colors[method] || "#94a3b8";
  return (
    <span
      className="inline-block rounded px-1.5 py-0.5 font-code text-[10px] font-bold"
      style={{ color, background: color + "18", border: `1px solid ${color}30` }}
    >
      {method}
    </span>
  );
}

function AuthBadge({ auth }: { auth: boolean | string }) {
  if (auth === false) return null;
  const color = auth === "required" ? "#ef4444" : "#fbbf24";
  return (
    <span
      className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase"
      style={{ color, background: color + "15" }}
    >
      Key {auth}
    </span>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display mb-2 text-[28px] font-bold">Registry API</h1>
      <p className="mb-8 text-sm text-text-secondary">
        ClawVerse provides an open REST API for agents, clients, and developers to discover,
        search, and install skills from across the OpenClaw ecosystem.
      </p>

      {/* Auth section */}
      <section className="mb-10">
        <h2 className="font-display mb-3 text-lg font-bold text-text-primary">Authentication</h2>
        <div className="rounded-xl border border-border bg-[#0f0f18] p-4 text-[13px]">
          <p className="mb-3 text-text-secondary">
            Most endpoints are publicly accessible. For tracked installs and webhook subscriptions,
            include your API key in the request header:
          </p>
          <code className="font-code block rounded bg-white/[0.03] px-3 py-2 text-[12px] text-accent-cyan">
            X-ClawVerse-Key: your_api_key_here
          </code>
          <p className="mt-3 text-[11px] text-text-muted">
            Register for a key at{" "}
            <Link href="/about" className="text-accent-cyan no-underline hover:underline">
              clawverse.io/api-keys
            </Link>
          </p>
        </div>
      </section>

      {/* Auto-discovery */}
      <section className="mb-10">
        <h2 className="font-display mb-3 text-lg font-bold text-text-primary">Agent Auto-Discovery</h2>
        <div className="rounded-xl border border-border bg-[#0f0f18] p-4 text-[13px]">
          <p className="mb-2 text-text-secondary">
            Agents can auto-discover this registry via the well-known endpoint:
          </p>
          <code className="font-code block rounded bg-white/[0.03] px-3 py-2 text-[12px] text-text-primary">
            GET /.well-known/openclaw-registry.json
          </code>
          <p className="mt-2 text-[11px] text-text-muted">
            This returns the registry URL, capabilities, and authentication requirements.
          </p>
        </div>
      </section>

      {/* Endpoints */}
      <section className="mb-10">
        <h2 className="font-display mb-4 text-lg font-bold text-text-primary">Endpoints</h2>
        <div className="space-y-8">
          {ENDPOINTS.map((group) => (
            <div key={group.group}>
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-text-muted">
                {group.group}
              </h3>
              <div className="space-y-3">
                {group.items.map((ep) => (
                  <div
                    key={ep.path + ep.method}
                    className="rounded-xl border border-border bg-[#0f0f18] p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <MethodBadge method={ep.method} />
                      <code className="font-code text-[12px] text-text-primary">{ep.path}</code>
                      <AuthBadge auth={ep.auth} />
                    </div>
                    <p className="text-[12px] text-text-secondary">{ep.desc}</p>
                    {ep.params.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                          Parameters
                        </div>
                        {ep.params.map((p) => (
                          <div key={p.name} className="flex items-start gap-2 text-[11px]">
                            <code className="font-code shrink-0 text-accent-violet">{p.name}</code>
                            <span className="text-text-muted">— {p.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security levels */}
      <section className="mb-10">
        <h2 className="font-display mb-3 text-lg font-bold text-text-primary">Security Levels</h2>
        <div className="rounded-xl border border-border bg-[#0f0f18] p-4">
          <div className="space-y-2">
            {SECURITY_LEVELS.map((s) => (
              <div key={s.level} className="flex items-start gap-3 text-[12px]">
                <span
                  className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: SECURITY_COLORS[s.emoji] }}
                />
                <div>
                  <span className="font-semibold text-text-primary">{s.level}</span>
                  <span className="ml-2 text-text-muted">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-text-muted">
            Based on OWASP Top 10 for Agentic Applications and OWASP MCP Top 10 frameworks.
          </p>
        </div>
      </section>

      {/* Webhook events */}
      <section className="mb-10">
        <h2 className="font-display mb-3 text-lg font-bold text-text-primary">Webhook Events</h2>
        <div className="rounded-xl border border-border bg-[#0f0f18] p-4">
          <div className="space-y-2">
            {EVENTS.map((e) => (
              <div key={e.type} className="flex items-start gap-3 text-[12px]">
                <code className="font-code shrink-0 text-accent-cyan">{e.type}</code>
                <span className="text-text-muted">{e.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example request */}
      <section className="mb-10">
        <h2 className="font-display mb-3 text-lg font-bold text-text-primary">Example: Search Skills</h2>
        <div className="rounded-xl border border-border bg-[#0f0f18] p-4">
          <code className="font-code block whitespace-pre-wrap rounded bg-white/[0.03] px-3 py-2 text-[11px] text-text-secondary">
{`curl -s "https://clawverse.io/api/v1/registry?action=search&q=chart&category=visualize&security=verified" \\
  -H "X-ClawVerse-Key: your_key" | jq .`}
          </code>
          <p className="mt-2 text-[11px] text-text-muted">
            Returns matching skills with sources, install commands, and navigation links.
          </p>
        </div>
      </section>

      {/* Example: Subscribe to webhooks */}
      <section className="mb-10">
        <h2 className="font-display mb-3 text-lg font-bold text-text-primary">Example: Subscribe to Webhooks</h2>
        <div className="rounded-xl border border-border bg-[#0f0f18] p-4">
          <code className="font-code block whitespace-pre-wrap rounded bg-white/[0.03] px-3 py-2 text-[11px] text-text-secondary">
{`curl -X POST "https://clawverse.io/api/v1/webhooks" \\
  -H "X-ClawVerse-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhooks/clawverse",
    "events": ["skill.new", "skill.blocked", "security.alert"],
    "secret": "whsec_your_secret"
  }'`}
          </code>
        </div>
      </section>

      {/* Aggregated sources */}
      <section className="mb-10">
        <h2 className="font-display mb-3 text-lg font-bold text-text-primary">Aggregated Sources</h2>
        <p className="mb-3 text-[12px] text-text-secondary">
          ClawVerse aggregates skills from these registries, with more being added:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { name: "ClawHub", skills: "5,705+", scan: true },
            { name: "Awesome OpenClaw Skills", skills: "2,999+", scan: false },
            { name: "Moltbooks.app", skills: "850+", scan: true },
            { name: "OpenClawSkill.ai", skills: "1,200+", scan: false },
            { name: "GitHub", skills: "Varies", scan: false },
            { name: "Community", skills: "Varies", scan: false },
          ].map((s) => (
            <div key={s.name} className="rounded-lg border border-border bg-void/80 p-3 text-[12px]">
              <div className="font-semibold text-text-primary">{s.name}</div>
              <div className="text-text-muted">
                {s.skills} skills
                {s.scan && <span className="ml-2 text-sec-green">Security scanned</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rate limits */}
      <section className="mb-6">
        <h2 className="font-display mb-3 text-lg font-bold text-text-primary">Rate Limits</h2>
        <div className="rounded-xl border border-border bg-[#0f0f18] p-4 text-[12px] text-text-secondary">
          <p>
            <strong className="text-text-primary">Without API key:</strong> 100 requests/hour
          </p>
          <p className="mt-1">
            <strong className="text-text-primary">With API key:</strong> 1,000 requests/hour
          </p>
          <p className="mt-2 text-[11px] text-text-muted">
            Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset) are included in responses.
          </p>
        </div>
      </section>
    </div>
  );
}
