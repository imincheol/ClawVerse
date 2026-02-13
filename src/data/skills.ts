export type SecurityLevel = "verified" | "reviewed" | "unreviewed" | "flagged" | "blocked";
export type SkillCategory = "browser" | "productivity" | "media" | "design" | "communication" | "agent" | "social" | "finance" | "iot" | "utility";

export interface Skill {
  id: number;
  slug: string;
  name: string;
  desc: string;
  source: string;
  installs: number;
  rating: number;
  reviews: number;
  security: SecurityLevel;
  category: SkillCategory;
  permissions: string[];
  platforms: string[];
}

export const SKILLS: Skill[] = [
  { id: 1, slug: "browser-automation", name: "browser-automation", desc: "Automate web browsing, form filling, and data scraping", source: "ClawHub", installs: 12840, rating: 4.7, reviews: 234, security: "verified", category: "browser", permissions: ["network", "shell"], platforms: ["OpenClaw", "Claude Code"] },
  { id: 2, slug: "google-calendar", name: "google-calendar", desc: "Manage Google Calendar events, reminders, and scheduling", source: "ClawHub", installs: 9520, rating: 4.8, reviews: 189, security: "verified", category: "productivity", permissions: ["api-key"], platforms: ["OpenClaw"] },
  { id: 3, slug: "fal-text-to-image", name: "fal-text-to-image", desc: "Generate, remix, and edit images using fal.ai models", source: "ClawHub", installs: 7300, rating: 4.5, reviews: 156, security: "verified", category: "media", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Codex"] },
  { id: 4, slug: "gamma-presentations", name: "gamma-presentations", desc: "Generate AI-powered presentations using Gamma.app", source: "ClawHub", installs: 6100, rating: 4.6, reviews: 130, security: "verified", category: "productivity", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Codex"] },
  { id: 5, slug: "ffmpeg-video-editor", name: "ffmpeg-video-editor", desc: "Generate FFmpeg commands from natural language descriptions", source: "ClawHub", installs: 5100, rating: 4.3, reviews: 98, security: "reviewed", category: "media", permissions: ["shell", "file"], platforms: ["OpenClaw"] },
  { id: 6, slug: "joko-moltbook", name: "joko-moltbook", desc: "Interact with Moltbook social network for AI agents", source: "ClawHub", installs: 4400, rating: 4.3, reviews: 91, security: "reviewed", category: "social", permissions: ["network", "api-key"], platforms: ["OpenClaw"] },
  { id: 7, slug: "figma", name: "figma", desc: "Professional Figma design analysis and asset export", source: "ClawHub", installs: 4200, rating: 4.6, reviews: 87, security: "reviewed", category: "design", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Claude Code"] },
  { id: 8, slug: "swarm-orchestrator", name: "swarm-orchestrator", desc: "Multi-agent coordination with permission-controlled task delegation", source: "GitHub", installs: 3800, rating: 4.4, reviews: 72, security: "reviewed", category: "agent", permissions: ["shell", "network"], platforms: ["OpenClaw"] },
  { id: 9, slug: "imagemagick", name: "imagemagick", desc: "Comprehensive ImageMagick operations for image manipulation", source: "ClawHub", installs: 3600, rating: 4.4, reviews: 67, security: "verified", category: "media", permissions: ["shell", "file"], platforms: ["OpenClaw", "Claude Code"] },
  { id: 10, slug: "mailchannels", name: "mailchannels", desc: "Send email via MailChannels API and ingest signed webhooks", source: "ClawHub", installs: 3200, rating: 4.1, reviews: 45, security: "reviewed", category: "communication", permissions: ["api-key"], platforms: ["OpenClaw"] },
  { id: 11, slug: "elevenlabs-tts", name: "elevenlabs-tts", desc: "Text-to-speech with ElevenLabs voices and cloning", source: "ClawHub", installs: 2900, rating: 4.5, reviews: 61, security: "verified", category: "media", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Claude Code"] },
  { id: 12, slug: "obsidian-vault", name: "obsidian-vault", desc: "Read, write, and search your Obsidian vault", source: "GitHub", installs: 2100, rating: 4.2, reviews: 38, security: "reviewed", category: "productivity", permissions: ["file"], platforms: ["OpenClaw"] },
  { id: 13, slug: "smart-home-bridge", name: "smart-home-bridge", desc: "Control HomeKit, Hue, and smart home devices via chat", source: "ClawHub", installs: 1800, rating: 4.0, reviews: 29, security: "unreviewed", category: "iot", permissions: ["network"], platforms: ["OpenClaw"] },
  { id: 14, slug: "crypto-wallet-sync", name: "crypto-wallet-sync", desc: "Sync and monitor cryptocurrency wallet balances", source: "GitHub", installs: 1500, rating: 3.2, reviews: 22, security: "flagged", category: "finance", permissions: ["api-key", "network", "file"], platforms: ["OpenClaw"] },
  { id: 15, slug: "claude-proxy-free", name: "claude-proxy-free", desc: "Free Claude API proxy with unlimited requests", source: "GitHub", installs: 890, rating: 1.8, reviews: 15, security: "blocked", category: "utility", permissions: ["network", "shell", "file"], platforms: ["OpenClaw"] },
];

export const CATEGORIES = [
  { id: "all", label: "All", icon: "globe" },
  { id: "browser", label: "Browser", icon: "globe" },
  { id: "productivity", label: "Productivity", icon: "zap" },
  { id: "media", label: "Media", icon: "palette" },
  { id: "design", label: "Design", icon: "pencil" },
  { id: "communication", label: "Communication", icon: "message-circle" },
  { id: "agent", label: "Agent", icon: "bot" },
  { id: "social", label: "Social", icon: "users" },
  { id: "finance", label: "Finance", icon: "coins" },
  { id: "iot", label: "IoT", icon: "home" },
  { id: "utility", label: "Utility", icon: "wrench" },
] as const;

export const SECURITY_CONFIG: Record<SecurityLevel, { label: string; color: string; bg: string }> = {
  verified: { label: "Verified", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  reviewed: { label: "Reviewed", color: "#eab308", bg: "rgba(234,179,8,0.1)" },
  unreviewed: { label: "Unreviewed", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  flagged: { label: "Flagged", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  blocked: { label: "Blocked", color: "#991b1b", bg: "rgba(153,27,27,0.15)" },
};

export const PERMISSION_LABELS: Record<string, string> = {
  "api-key": "API Key",
  shell: "Shell",
  file: "File System",
  network: "Network",
};
