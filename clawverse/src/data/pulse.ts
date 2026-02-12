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
];

export const PULSE_TAG_CONFIG: Record<PulseTag, { label: string; color: string }> = {
  security: { label: "SECURITY", color: "#ef4444" },
  release: { label: "RELEASE", color: "#8b5cf6" },
  trending: { label: "TRENDING", color: "#22c55e" },
  new: { label: "NEW", color: "#38bdf8" },
  partner: { label: "PARTNER", color: "#fbbf24" },
  event: { label: "EVENT", color: "#f97316" },
};
