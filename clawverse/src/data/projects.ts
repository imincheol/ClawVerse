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
  { id: 1, slug: "openclaw", name: "OpenClaw", desc: "Core open-source AI agent framework", layer: "core", stars: 182000, status: "active", official: true, url: "github.com/openclaw/openclaw" },
  { id: 2, slug: "clawhub", name: "ClawHub", desc: "Official skill registry (5,705 skills)", layer: "core", stars: null, status: "active", official: true, url: "clawhub.ai" },
  { id: 3, slug: "onlycrabs", name: "OnlyCrabs", desc: "SOUL.md registry — agent persona sharing", layer: "core", stars: null, status: "active", official: true, url: "onlycrabs.ai" },
  { id: 4, slug: "pi-mono", name: "Pi (Pi-Mono)", desc: "Minimal agent runtime inside OpenClaw", layer: "core", stars: null, status: "active", official: true, url: "openclaw.ai" },
  { id: 5, slug: "moltbook", name: "Moltbook", desc: "AI agent-only social network (37K+ agents)", layer: "social", stars: null, status: "viral", official: false, url: "moltbook.com" },
  { id: 6, slug: "clankedin", name: "ClankedIn", desc: "LinkedIn for AI agents — profiles & networking", layer: "social", stars: null, status: "active", official: false, url: null },
  { id: 7, slug: "claw-swarm", name: "Claw-Swarm", desc: "Multi-agent swarm orchestration with AuthGuardian", layer: "collab", stars: 890, status: "active", official: false, url: "github.com/jovanSAPFIONEER/Network-AI" },
  { id: 8, slug: "clawork", name: "Clawork", desc: "Job board for AI agents", layer: "collab", stars: null, status: "active", official: false, url: null },
  { id: 9, slug: "clawprint", name: "ClawPrint", desc: "Skill extraction/distribution + agent identity", layer: "trust", stars: null, status: "active", official: false, url: "clawprint.xyz" },
  { id: 10, slug: "crustafarian", name: "Crustafarian", desc: "Agent continuity and cognitive health infrastructure", layer: "trust", stars: null, status: "active", official: false, url: null },
  { id: 11, slug: "gibberlink", name: "Gibberlink", desc: "AI-to-AI audio communication protocol", layer: "experimental", stars: null, status: "research", official: false, url: null },
  { id: 12, slug: "clawgrid", name: "ClawGrid", desc: "1000x1000 grid for hosting OpenClaw agents", layer: "experimental", stars: null, status: "active", official: false, url: "claw-grid.com" },
  { id: 13, slug: "nanobot", name: "NanoBot", desc: "Ultra-lightweight AI assistant (~4,000 lines)", layer: "experimental", stars: null, status: "active", official: false, url: null },
];

export const LAYERS: Record<ProjectLayer, { label: string; color: string; icon: string }> = {
  core: { label: "Core", color: "#c084fc", icon: "lobster" },
  social: { label: "Social", color: "#38bdf8", icon: "handshake" },
  collab: { label: "Collaboration", color: "#34d399", icon: "refresh" },
  trust: { label: "Trust", color: "#fbbf24", icon: "lock" },
  experimental: { label: "Experimental", color: "#f472b6", icon: "flask" },
};
