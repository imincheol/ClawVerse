export type PulseTag = "security" | "release" | "trending" | "new" | "partner" | "event";

export interface PulseItem {
  id: number;
  tag: PulseTag;
  title: string;
  desc: string;
  date: string;
  url?: string;
}

export const PULSE_ITEMS: PulseItem[] = [
  {
    id: 1,
    tag: "security",
    title: "400+ Malicious Skills Discovered on ClawHub/GitHub",
    desc: "Skills disguised as useful tools were found stealing API keys, SSH credentials, browser passwords, and crypto wallets. VirusTotal partnership scanning has begun.",
    date: "2026-02-07",
  },
  {
    id: 2,
    tag: "release",
    title: "OpenClaw 2026.2.3 Released",
    desc: "Security hardening, sandbox file handling, prompt protection, and workflow stability improvements.",
    date: "2026-02-09",
  },
  {
    id: 3,
    tag: "event",
    title: "ClawCon 2026 — First Community Meetup in SF",
    desc: "OpenClaw developer community first Show & Tell event held at Frontier Tower.",
    date: "2026-02-04",
  },
  {
    id: 4,
    tag: "trending",
    title: "Moltbook Passes 37K+ Agents",
    desc: "AI agent-only social network goes viral. Agents discussing encrypted channels among themselves.",
    date: "2026-02-02",
  },
  {
    id: 5,
    tag: "new",
    title: "Cloudflare Moltworker Officially Launched",
    desc: "Run OpenClaw on Cloudflare Workers. Edge security + browser automation support.",
    date: "2026-02-01",
  },
  {
    id: 6,
    tag: "partner",
    title: "DigitalOcean 1-Click Deploy Official Partnership",
    desc: "Production deployment with security-enhanced images starting from $12/month.",
    date: "2026-01-30",
  },
  {
    id: 7,
    tag: "security",
    title: "OWASP Publishes MCP Top 10 Security Risks",
    desc: "Tool Poisoning ranked #1, followed by Rug Pull and Transitive Access Abuse. ClawVerse now maps security ratings to the OWASP MCP Top 10 framework.",
    date: "2026-02-12",
  },
  {
    id: 8,
    tag: "security",
    title: "Critical RCE in mcp-remote Package (CVSS 9.6)",
    desc: "The widely-used mcp-remote package (500K+ downloads) has a critical remote code execution vulnerability. Update immediately or remove from your stack.",
    date: "2026-02-11",
  },
  {
    id: 9,
    tag: "security",
    title: "92% Exploit Probability for MCP Stacks with 10+ Plugins",
    desc: "VentureBeat research reveals that the probability of at least one exploitable vulnerability reaches 92% when using 10 or more MCP plugins in a stack.",
    date: "2026-02-10",
  },
  {
    id: 10,
    tag: "security",
    title: "3 RCE Vulnerabilities Found in Anthropic Git MCP Server",
    desc: "Security researchers discovered three remote code execution vulnerabilities in Anthropic's official Git MCP server. Patches available in v2.1.4+.",
    date: "2026-02-06",
  },
  {
    id: 11,
    tag: "security",
    title: "Tool Poisoning Campaign Targets Finance Skills",
    desc: "A coordinated campaign of trojanized finance-related skills detected. crypto-wallet-sync and defi-token-tracker have been flagged. Check your stacks for affected tools.",
    date: "2026-02-03",
  },
  {
    id: 12,
    tag: "security",
    title: "Queen's University Study: 7.2% of MCP Servers Have Vulnerabilities",
    desc: "Academic research finds 7.2% of MCP servers contain general vulnerabilities and 5.5% are susceptible to tool poisoning attacks. Only 6% of enterprises have advanced AI security.",
    date: "2026-01-28",
  },
  {
    id: 13,
    tag: "release",
    title: "Google A2A Protocol Joins Linux Foundation",
    desc: "Agent-to-Agent protocol backed by 150+ organizations transitions to Linux Foundation governance. Enables secure inter-agent communication.",
    date: "2026-02-05",
  },
  {
    id: 14,
    tag: "trending",
    title: "Prompt Injection Detector Hits 4,500 Installs",
    desc: "Security-focused skill for detecting and blocking prompt injection attacks becomes fastest-growing agent skill on ClawHub.",
    date: "2026-02-08",
  },
  {
    id: 15,
    tag: "new",
    title: "EU AI Act Full Enforcement Countdown: 170 Days",
    desc: "The EU AI Act reaches full enforcement on August 2, 2026. Organizations using AI agents must ensure compliance with risk management and transparency requirements.",
    date: "2026-02-13",
  },
  {
    id: 16,
    tag: "new",
    title: "ZeroClaw Launches — Zero-Config Agent Runtime",
    desc: "ZeroClaw brings zero-configuration agent deployment: single binary, no setup files, no dependencies. Download and run. Already 4.2K GitHub stars in the first week.",
    date: "2026-02-14",
  },
  {
    id: 17,
    tag: "new",
    title: "PicoClaw: Sub-1MB Runtime for Edge Deployments",
    desc: "PicoClaw enables OpenClaw agents on Cloudflare Workers, AWS Lambda, and Deno Deploy with sub-50ms cold starts. WebAssembly-compiled core runtime under 1MB.",
    date: "2026-02-14",
  },
  {
    id: 18,
    tag: "trending",
    title: "KimiClaw Integrates 2M Token Context Window",
    desc: "KimiClaw, powered by Kimi AI's long-context engine, enables document-heavy agent workflows with a 2M token window. Growing fast in enterprise and research use cases.",
    date: "2026-02-15",
  },
  {
    id: 19,
    tag: "release",
    title: "OpenClaw Canvas + A2UI Protocol Go Live",
    desc: "OpenClaw's native visual workspace (Canvas) and Google's A2UI protocol are now production-ready. Agents can render interactive charts, dashboards, and forms in real-time via WebSocket.",
    date: "2026-02-15",
  },
  {
    id: 20,
    tag: "trending",
    title: "Visualize Category Explodes — chart-image Hits 5.8K Installs",
    desc: "The new Visualize skill category on ClawHub is booming. chart-image leads with 5.8K installs, followed by a2ui-canvas-renderer and excalidraw-flowchart.",
    date: "2026-02-16",
  },
  {
    id: 21,
    tag: "new",
    title: "MicroClaw & TurboClaw Enter Research Phase",
    desc: "Two new Claw variants: MicroClaw (microservices-oriented with gRPC) and TurboClaw (GPU-accelerated inference). Both in early research phase.",
    date: "2026-02-16",
  },
];

export const PULSE_TAG_CONFIG: Record<PulseTag, { label: string; color: string }> = {
  security: { label: "SECURITY", color: "#ef4444" },
  release: { label: "RELEASE", color: "#8b5cf6" },
  trending: { label: "TRENDING", color: "#22c55e" },
  new: { label: "NEW", color: "#38bdf8" },
  partner: { label: "PARTNER", color: "#fbbf24" },
  event: { label: "EVENT", color: "#f97316" },
};
