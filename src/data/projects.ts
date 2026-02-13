export type ProjectLayer = "core" | "social" | "collab" | "trust" | "experimental";
export type ProjectStatus = "active" | "viral" | "research" | "inactive";

export interface Project {
  id: number;
  slug: string;
  name: string;
  desc: string;
  layer: ProjectLayer;
  stars: number | null;
  status: ProjectStatus;
  official: boolean;
  url: string | null;
}

export const PROJECTS: Project[] = [
  // === Core (5) ===
  { id: 1, slug: "openclaw", name: "OpenClaw", desc: "Core open-source AI agent framework with 182K+ stars", layer: "core", stars: 190370, status: "active", official: true, url: "github.com/openclaw/openclaw" },
  { id: 2, slug: "clawhub", name: "ClawHub", desc: "Official skill registry with 5,705+ verified skills", layer: "core", stars: null, status: "active", official: true, url: "clawhub.ai" },
  { id: 3, slug: "onlycrabs", name: "OnlyCrabs", desc: "SOUL.md registry — agent persona sharing and discovery", layer: "core", stars: null, status: "active", official: true, url: "onlycrabs.ai" },
  { id: 4, slug: "pi-mono", name: "Pi (Pi-Mono)", desc: "Minimal agent runtime inside OpenClaw for lightweight deployments", layer: "core", stars: null, status: "active", official: true, url: "openclaw.ai" },
  { id: 5, slug: "openclaw-desktop", name: "OpenClaw Desktop", desc: "Official desktop application for Windows, macOS, and Linux", layer: "core", stars: 12400, status: "active", official: true, url: "github.com/openclaw/openclaw-desktop" },

  // === Social (5) ===
  { id: 6, slug: "moltbook", name: "Moltbook", desc: "AI agent-only social network with 2.5M+ active agents", layer: "social", stars: null, status: "viral", official: false, url: "moltbook.com" },
  { id: 7, slug: "clankedin", name: "ClankedIn", desc: "LinkedIn for AI agents — profiles, networking, and job matching", layer: "social", stars: null, status: "active", official: false, url: null },
  { id: 8, slug: "clawverse-app", name: "ClawVerse.app", desc: "Mobile companion app for browsing the OpenClaw ecosystem", layer: "social", stars: 340, status: "active", official: false, url: "clawverse.app" },
  { id: 9, slug: "agent-forum", name: "Agent Forum", desc: "Community discussion board for OpenClaw developers and users", layer: "social", stars: null, status: "active", official: false, url: null },
  { id: 10, slug: "claw-digest", name: "Claw Digest", desc: "Weekly newsletter and blog covering OpenClaw ecosystem news", layer: "social", stars: null, status: "active", official: false, url: null },

  // === Collaboration (5) ===
  { id: 11, slug: "claw-swarm", name: "Claw-Swarm", desc: "Multi-agent swarm orchestration with AuthGuardian security", layer: "collab", stars: 5, status: "active", official: false, url: "github.com/jovanSAPFIONEER/Network-AI" },
  { id: 12, slug: "clawork", name: "Clawork", desc: "Job board and task marketplace for AI agents", layer: "collab", stars: null, status: "active", official: false, url: null },
  { id: 13, slug: "composio", name: "Composio", desc: "Integration platform connecting OpenClaw to 200+ external services", layer: "collab", stars: 15200, status: "active", official: false, url: "composio.dev" },
  { id: 14, slug: "agent-protocol", name: "Agent Protocol", desc: "Standardized communication protocol for inter-agent messaging", layer: "collab", stars: 2100, status: "active", official: false, url: null },
  { id: 15, slug: "claw-flow", name: "Claw Flow", desc: "Visual workflow builder for chaining agent tasks", layer: "collab", stars: 670, status: "active", official: false, url: null },

  // === Trust (5) ===
  { id: 16, slug: "clawprint", name: "ClawPrint", desc: "Skill extraction, distribution, and agent identity verification", layer: "trust", stars: null, status: "active", official: false, url: "clawprint.xyz" },
  { id: 17, slug: "crustafarian", name: "Crustafarian", desc: "Agent continuity, cognitive health monitoring, and state persistence", layer: "trust", stars: null, status: "active", official: false, url: null },
  { id: 18, slug: "skill-auditor", name: "Skill Auditor", desc: "Automated security scanning and code review for ClawHub skills", layer: "trust", stars: 1500, status: "active", official: false, url: null },
  { id: 19, slug: "agent-id", name: "Agent ID", desc: "Decentralized identity system for verifying agent authenticity", layer: "trust", stars: 780, status: "research", official: false, url: null },
  { id: 20, slug: "permission-guard", name: "Permission Guard", desc: "Runtime permission monitoring and anomaly detection for skills", layer: "trust", stars: 450, status: "active", official: false, url: null },

  // === Experimental (6) ===
  { id: 21, slug: "gibberlink", name: "Gibberlink", desc: "AI-to-AI audio communication protocol using sonic data transfer", layer: "experimental", stars: null, status: "research", official: false, url: null },
  { id: 22, slug: "clawgrid", name: "ClawGrid", desc: "1000x1000 grid environment for hosting and visualizing OpenClaw agents", layer: "experimental", stars: null, status: "active", official: false, url: "claw-grid.com" },
  { id: 23, slug: "nanobot", name: "NanoBot", desc: "Ultra-lightweight multi-provider AI assistant with Docker and vLLM support (~4,000 lines)", layer: "experimental", stars: null, status: "active", official: false, url: null },
  { id: 24, slug: "claw-vision", name: "Claw Vision", desc: "Computer vision pipeline enabling agents to process images and video", layer: "experimental", stars: 1200, status: "research", official: false, url: null },
  { id: 25, slug: "neural-shell", name: "Neural Shell", desc: "Natural language terminal that translates commands to shell operations", layer: "experimental", stars: 3400, status: "active", official: false, url: null },
  { id: 26, slug: "claw-benchmark", name: "Claw Benchmark", desc: "Standardized benchmark suite for comparing agent performance", layer: "experimental", stars: 560, status: "research", official: false, url: null },

  // === New additions (Sprint 5) ===
  { id: 27, slug: "botmadang", name: "Botmadang", desc: "Korean AI agent social community by Upstage CEO", layer: "social", stars: null, status: "active", official: false, url: "botmadang.org" },
  { id: 28, slug: "openclaw-directory", name: "OpenClaw Directory", desc: "Independent community skill/plugin/job directory", layer: "core", stars: null, status: "active", official: false, url: "openclawdir.com" },
  { id: 29, slug: "openclawd-ai", name: "OpenClawd AI", desc: "One-click managed hosting platform for OpenClaw", layer: "collab", stars: null, status: "active", official: false, url: "openclawd.ai" },
  { id: 30, slug: "composio-secure-openclaw", name: "Composio Secure-OpenClaw", desc: "24/7 AI assistant for messaging platforms with 500+ app integrations", layer: "collab", stars: null, status: "active", official: false, url: "github.com/ComposioHQ/secure-openclaw" },
  { id: 31, slug: "botmadang-mcp", name: "Botmadang MCP Server", desc: "MCP bridge for AI agent-Botmadang integration", layer: "collab", stars: null, status: "active", official: false, url: "github.com/serithemage/botmadang-mcp" },
  { id: 32, slug: "memu", name: "Memu", desc: "Competing local AI agent (OpenClaw alternative)", layer: "experimental", stars: null, status: "active", official: false, url: null },
  { id: 33, slug: "openclawskill-ai", name: "OpenClawSkill.ai", desc: "Vector search-based AI skill registry and marketplace", layer: "core", stars: null, status: "active", official: false, url: "openclawskill.ai" },
  { id: 34, slug: "clawra", name: "Clawra", desc: "Open-source AI virtual companion built on OpenClaw with selfie generation, long-term memory, and video calls", layer: "social", stars: null, status: "active", official: false, url: "clawra.club" },
  { id: 35, slug: "clawhost", name: "ClawHost", desc: "Open-source self-hostable cloud platform for one-click OpenClaw deployment on Hetzner/DigitalOcean VPS", layer: "collab", stars: null, status: "active", official: false, url: "clawhost.cloud" },
  { id: 36, slug: "kiloclaw", name: "KiloClaw", desc: "Hosted OpenClaw by Kilo AI — 60-second deploy, 1.4M+ user infrastructure, zero token markup", layer: "collab", stars: null, status: "active", official: false, url: "kilo.ai/kiloclaw" },
];

export const LAYERS: Record<ProjectLayer, { label: string; color: string; icon: string }> = {
  core: { label: "Core", color: "#c084fc", icon: "lobster" },
  social: { label: "Social", color: "#38bdf8", icon: "handshake" },
  collab: { label: "Collaboration", color: "#34d399", icon: "refresh" },
  trust: { label: "Trust", color: "#fbbf24", icon: "lock" },
  experimental: { label: "Experimental", color: "#f472b6", icon: "flask" },
};
