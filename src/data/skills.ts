export type SecurityLevel = "verified" | "reviewed" | "unreviewed" | "flagged" | "blocked";
export type SkillCategory = "browser" | "productivity" | "media" | "design" | "communication" | "agent" | "social" | "finance" | "iot" | "utility";

export type VirusTotalStatus = "clean" | "suspicious" | "malicious" | "pending" | "unscanned";
export type Protocol = "MCP" | "A2A" | "REST" | "GraphQL" | "WebSocket";
export type MaintainerActivity = "active" | "moderate" | "inactive" | "abandoned";

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
  virustotal_status?: VirusTotalStatus;
  protocols: Protocol[];
  lastUpdated: string;
  maintainerActivity: MaintainerActivity;
}

export const SKILLS: Skill[] = [
  // === Browser (5) ===
  { id: 1, slug: "browser-automation", name: "browser-automation", desc: "Automate web browsing, form filling, and data scraping", source: "ClawHub", installs: 12840, rating: 4.7, reviews: 234, security: "verified", category: "browser", permissions: ["network", "shell"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-02-10", maintainerActivity: "active" },
  { id: 16, slug: "web-scraper-pro", name: "web-scraper-pro", desc: "Advanced web scraping with anti-detection and proxy rotation", source: "GitHub", installs: 5200, rating: 4.3, reviews: 89, security: "reviewed", category: "browser", permissions: ["network", "shell", "file"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-01-28", maintainerActivity: "active" },
  { id: 17, slug: "screenshot-capture", name: "screenshot-capture", desc: "Capture full-page screenshots and generate visual diffs", source: "ClawHub", installs: 3100, rating: 4.4, reviews: 52, security: "verified", category: "browser", permissions: ["network", "file"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-02-05", maintainerActivity: "active" },
  { id: 18, slug: "cookie-manager", name: "cookie-manager", desc: "Manage browser cookies, sessions, and local storage", source: "ClawHub", installs: 1900, rating: 4.0, reviews: 31, security: "reviewed", category: "browser", permissions: ["network", "file"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-01-15", maintainerActivity: "moderate" },
  { id: 19, slug: "form-filler", name: "form-filler", desc: "Intelligent form detection and auto-fill with saved profiles", source: "Community", installs: 1200, rating: 3.9, reviews: 18, security: "unreviewed", category: "browser", permissions: ["network"], platforms: ["OpenClaw"], virustotal_status: "pending", protocols: ["MCP"], lastUpdated: "2026-01-02", maintainerActivity: "moderate" },

  // === Productivity (5) ===
  { id: 2, slug: "google-calendar", name: "google-calendar", desc: "Manage Google Calendar events, reminders, and scheduling", source: "ClawHub", installs: 9520, rating: 4.8, reviews: 189, security: "verified", category: "productivity", permissions: ["api-key"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-02-08", maintainerActivity: "active" },
  { id: 4, slug: "gamma-presentations", name: "gamma-presentations", desc: "Generate AI-powered presentations using Gamma.app", source: "ClawHub", installs: 6100, rating: 4.6, reviews: 130, security: "verified", category: "productivity", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Codex"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-02-01", maintainerActivity: "active" },
  { id: 12, slug: "obsidian-vault", name: "obsidian-vault", desc: "Read, write, and search your Obsidian vault", source: "GitHub", installs: 2100, rating: 4.2, reviews: 38, security: "reviewed", category: "productivity", permissions: ["file"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-01-20", maintainerActivity: "moderate" },
  { id: 20, slug: "notion-sync", name: "notion-sync", desc: "Two-way sync with Notion databases, pages, and wikis", source: "ClawHub", installs: 4800, rating: 4.5, reviews: 104, security: "verified", category: "productivity", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP", "REST", "WebSocket"], lastUpdated: "2026-02-11", maintainerActivity: "active" },
  { id: 21, slug: "todoist-manager", name: "todoist-manager", desc: "Create, update, and organize Todoist tasks and projects", source: "ClawHub", installs: 2800, rating: 4.3, reviews: 47, security: "reviewed", category: "productivity", permissions: ["api-key"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-01-18", maintainerActivity: "active" },

  // === Media (6) ===
  { id: 3, slug: "fal-text-to-image", name: "fal-text-to-image", desc: "Generate, remix, and edit images using fal.ai models", source: "ClawHub", installs: 7300, rating: 4.5, reviews: 156, security: "verified", category: "media", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Codex"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-02-09", maintainerActivity: "active" },
  { id: 5, slug: "ffmpeg-video-editor", name: "ffmpeg-video-editor", desc: "Generate FFmpeg commands from natural language descriptions", source: "ClawHub", installs: 5100, rating: 4.3, reviews: 98, security: "reviewed", category: "media", permissions: ["shell", "file"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-01-25", maintainerActivity: "active" },
  { id: 9, slug: "imagemagick", name: "imagemagick", desc: "Comprehensive ImageMagick operations for image manipulation", source: "ClawHub", installs: 3600, rating: 4.4, reviews: 67, security: "verified", category: "media", permissions: ["shell", "file"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-02-03", maintainerActivity: "active" },
  { id: 11, slug: "elevenlabs-tts", name: "elevenlabs-tts", desc: "Text-to-speech with ElevenLabs voices and cloning", source: "ClawHub", installs: 2900, rating: 4.5, reviews: 61, security: "verified", category: "media", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP", "REST", "WebSocket"], lastUpdated: "2026-02-06", maintainerActivity: "active" },
  { id: 22, slug: "stable-diffusion-xl", name: "stable-diffusion-xl", desc: "Generate images with SDXL models, LoRA support, and inpainting", source: "GitHub", installs: 6800, rating: 4.6, reviews: 142, security: "reviewed", category: "media", permissions: ["api-key", "network", "file"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-01-30", maintainerActivity: "active" },
  { id: 23, slug: "whisper-transcribe", name: "whisper-transcribe", desc: "Transcribe audio and video files using OpenAI Whisper", source: "ClawHub", installs: 4100, rating: 4.7, reviews: 88, security: "verified", category: "media", permissions: ["api-key", "file"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-02-07", maintainerActivity: "active" },

  // === Design (5) ===
  { id: 7, slug: "figma", name: "figma", desc: "Professional Figma design analysis and asset export", source: "ClawHub", installs: 4200, rating: 4.6, reviews: 87, security: "reviewed", category: "design", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP", "REST", "GraphQL"], lastUpdated: "2026-02-04", maintainerActivity: "active" },
  { id: 24, slug: "canva-designer", name: "canva-designer", desc: "Create and edit designs using Canva's design API", source: "ClawHub", installs: 3400, rating: 4.4, reviews: 71, security: "reviewed", category: "design", permissions: ["api-key", "network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-01-22", maintainerActivity: "active" },
  { id: 25, slug: "svg-generator", name: "svg-generator", desc: "Generate and optimize SVG illustrations from text prompts", source: "GitHub", installs: 2200, rating: 4.1, reviews: 35, security: "reviewed", category: "design", permissions: ["file"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-01-10", maintainerActivity: "moderate" },
  { id: 26, slug: "color-palette", name: "color-palette", desc: "Generate harmonious color palettes and extract colors from images", source: "Community", installs: 1600, rating: 4.2, reviews: 24, security: "unreviewed", category: "design", permissions: ["network"], platforms: ["OpenClaw"], virustotal_status: "unscanned", protocols: ["REST"], lastUpdated: "2025-12-15", maintainerActivity: "moderate" },
  { id: 27, slug: "mockup-generator", name: "mockup-generator", desc: "Place designs into device mockups and scene templates", source: "ClawHub", installs: 1100, rating: 3.8, reviews: 16, security: "unreviewed", category: "design", permissions: ["api-key", "file"], platforms: ["OpenClaw"], virustotal_status: "pending", protocols: ["MCP"], lastUpdated: "2025-12-20", maintainerActivity: "inactive" },

  // === Communication (5) ===
  { id: 10, slug: "mailchannels", name: "mailchannels", desc: "Send email via MailChannels API and ingest signed webhooks", source: "ClawHub", installs: 3200, rating: 4.1, reviews: 45, security: "reviewed", category: "communication", permissions: ["api-key"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-01-14", maintainerActivity: "moderate" },
  { id: 28, slug: "slack-bridge", name: "slack-bridge", desc: "Send messages, manage channels, and interact with Slack workspaces", source: "ClawHub", installs: 5600, rating: 4.6, reviews: 118, security: "verified", category: "communication", permissions: ["api-key", "network"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP", "REST", "WebSocket"], lastUpdated: "2026-02-12", maintainerActivity: "active" },
  { id: 29, slug: "discord-bot", name: "discord-bot", desc: "Manage Discord servers, channels, and message interactions", source: "ClawHub", installs: 4300, rating: 4.4, reviews: 92, security: "verified", category: "communication", permissions: ["api-key", "network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST", "WebSocket"], lastUpdated: "2026-02-08", maintainerActivity: "active" },
  { id: 30, slug: "telegram-agent", name: "telegram-agent", desc: "Send messages, manage groups, and handle Telegram bot commands", source: "GitHub", installs: 3700, rating: 4.3, reviews: 65, security: "reviewed", category: "communication", permissions: ["api-key", "network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-01-29", maintainerActivity: "active" },
  { id: 31, slug: "twilio-sms", name: "twilio-sms", desc: "Send SMS and voice calls via Twilio API", source: "ClawHub", installs: 2400, rating: 4.2, reviews: 41, security: "verified", category: "communication", permissions: ["api-key"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-01-20", maintainerActivity: "active" },

  // === Agent (5) ===
  { id: 8, slug: "swarm-orchestrator", name: "swarm-orchestrator", desc: "Multi-agent coordination with permission-controlled task delegation", source: "GitHub", installs: 3800, rating: 4.4, reviews: 72, security: "reviewed", category: "agent", permissions: ["shell", "network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "A2A"], lastUpdated: "2026-02-11", maintainerActivity: "active" },
  { id: 32, slug: "memory-manager", name: "memory-manager", desc: "Persistent memory with vector search for long-term agent context", source: "ClawHub", installs: 6200, rating: 4.7, reviews: 134, security: "verified", category: "agent", permissions: ["file", "network"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-02-10", maintainerActivity: "active" },
  { id: 33, slug: "tool-builder", name: "tool-builder", desc: "Create custom tools and skills dynamically at runtime", source: "GitHub", installs: 2900, rating: 4.2, reviews: 48, security: "reviewed", category: "agent", permissions: ["shell", "file"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "A2A"], lastUpdated: "2026-01-28", maintainerActivity: "active" },
  { id: 34, slug: "agent-monitor", name: "agent-monitor", desc: "Real-time dashboard for monitoring agent activities and resource usage", source: "ClawHub", installs: 2100, rating: 4.0, reviews: 33, security: "reviewed", category: "agent", permissions: ["network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST", "WebSocket"], lastUpdated: "2026-01-15", maintainerActivity: "moderate" },
  { id: 35, slug: "prompt-injector-detector", name: "prompt-injector-detector", desc: "Detect and block prompt injection attacks in real-time", source: "GitHub", installs: 4500, rating: 4.8, reviews: 96, security: "verified", category: "agent", permissions: ["network"], platforms: ["OpenClaw", "Claude Code", "Codex"], virustotal_status: "clean", protocols: ["MCP", "A2A"], lastUpdated: "2026-02-12", maintainerActivity: "active" },

  // === Social (5) ===
  { id: 6, slug: "joko-moltbook", name: "joko-moltbook", desc: "Interact with Moltbook social network for AI agents", source: "ClawHub", installs: 4400, rating: 4.3, reviews: 91, security: "reviewed", category: "social", permissions: ["network", "api-key"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-01-25", maintainerActivity: "active" },
  { id: 36, slug: "twitter-agent", name: "twitter-agent", desc: "Post tweets, manage threads, and monitor mentions on X/Twitter", source: "ClawHub", installs: 7800, rating: 4.5, reviews: 167, security: "verified", category: "social", permissions: ["api-key", "network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-02-09", maintainerActivity: "active" },
  { id: 37, slug: "reddit-browser", name: "reddit-browser", desc: "Browse subreddits, post comments, and track discussions", source: "GitHub", installs: 3200, rating: 4.1, reviews: 54, security: "reviewed", category: "social", permissions: ["api-key", "network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-01-18", maintainerActivity: "moderate" },
  { id: 38, slug: "clankedin-profile", name: "clankedin-profile", desc: "Manage agent profiles and networking on ClankedIn", source: "Community", installs: 1800, rating: 3.9, reviews: 27, security: "unreviewed", category: "social", permissions: ["api-key", "network"], platforms: ["OpenClaw"], virustotal_status: "unscanned", protocols: ["REST"], lastUpdated: "2025-12-10", maintainerActivity: "inactive" },
  { id: 39, slug: "mastodon-client", name: "mastodon-client", desc: "Post and interact on Mastodon/Fediverse instances", source: "GitHub", installs: 950, rating: 4.0, reviews: 14, security: "reviewed", category: "social", permissions: ["api-key", "network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-01-05", maintainerActivity: "moderate" },

  // === Finance (5) ===
  { id: 14, slug: "crypto-wallet-sync", name: "crypto-wallet-sync", desc: "Sync and monitor cryptocurrency wallet balances", source: "GitHub", installs: 1500, rating: 3.2, reviews: 22, security: "flagged", category: "finance", permissions: ["api-key", "network", "file"], platforms: ["OpenClaw"], virustotal_status: "suspicious", protocols: ["REST"], lastUpdated: "2025-11-20", maintainerActivity: "inactive" },
  { id: 40, slug: "stripe-payments", name: "stripe-payments", desc: "Process payments, manage subscriptions, and handle Stripe webhooks", source: "ClawHub", installs: 4100, rating: 4.6, reviews: 85, security: "verified", category: "finance", permissions: ["api-key", "network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST", "WebSocket"], lastUpdated: "2026-02-10", maintainerActivity: "active" },
  { id: 41, slug: "expense-tracker", name: "expense-tracker", desc: "Track expenses, categorize transactions, and generate reports", source: "ClawHub", installs: 2600, rating: 4.3, reviews: 43, security: "reviewed", category: "finance", permissions: ["file"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-01-12", maintainerActivity: "moderate" },
  { id: 42, slug: "invoice-generator", name: "invoice-generator", desc: "Create professional PDF invoices from structured data", source: "Community", installs: 1700, rating: 4.1, reviews: 28, security: "reviewed", category: "finance", permissions: ["file"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-01-08", maintainerActivity: "moderate" },
  { id: 43, slug: "defi-token-tracker", name: "defi-token-tracker", desc: "Monitor DeFi token prices and wallet balances across chains", source: "GitHub", installs: 800, rating: 2.9, reviews: 12, security: "flagged", category: "finance", permissions: ["api-key", "network", "file", "shell"], platforms: ["OpenClaw"], virustotal_status: "suspicious", protocols: ["REST"], lastUpdated: "2025-10-15", maintainerActivity: "abandoned" },

  // === IoT (5) ===
  { id: 13, slug: "smart-home-bridge", name: "smart-home-bridge", desc: "Control HomeKit, Hue, and smart home devices via chat", source: "ClawHub", installs: 1800, rating: 4.0, reviews: 29, security: "unreviewed", category: "iot", permissions: ["network"], platforms: ["OpenClaw"], virustotal_status: "pending", protocols: ["MCP", "REST"], lastUpdated: "2025-12-28", maintainerActivity: "moderate" },
  { id: 44, slug: "mqtt-connector", name: "mqtt-connector", desc: "Publish and subscribe to MQTT topics for IoT device control", source: "GitHub", installs: 1400, rating: 4.1, reviews: 22, security: "reviewed", category: "iot", permissions: ["network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "WebSocket"], lastUpdated: "2026-01-22", maintainerActivity: "active" },
  { id: 45, slug: "home-assistant", name: "home-assistant", desc: "Control Home Assistant entities, automations, and scenes", source: "ClawHub", installs: 2300, rating: 4.5, reviews: 39, security: "verified", category: "iot", permissions: ["api-key", "network"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP", "REST", "WebSocket"], lastUpdated: "2026-02-05", maintainerActivity: "active" },
  { id: 46, slug: "arduino-serial", name: "arduino-serial", desc: "Send commands and read data from Arduino via serial port", source: "Community", installs: 700, rating: 3.8, reviews: 11, security: "unreviewed", category: "iot", permissions: ["shell"], platforms: ["OpenClaw"], virustotal_status: "unscanned", protocols: ["REST"], lastUpdated: "2025-11-10", maintainerActivity: "inactive" },
  { id: 47, slug: "zigbee-gateway", name: "zigbee-gateway", desc: "Manage Zigbee mesh network devices and sensors", source: "GitHub", installs: 500, rating: 3.6, reviews: 8, security: "unreviewed", category: "iot", permissions: ["network", "shell"], platforms: ["OpenClaw"], virustotal_status: "unscanned", protocols: ["MCP"], lastUpdated: "2025-11-25", maintainerActivity: "inactive" },

  // === Utility (7) ===
  { id: 15, slug: "claude-proxy-free", name: "claude-proxy-free", desc: "Free Claude API proxy with unlimited requests", source: "GitHub", installs: 890, rating: 1.8, reviews: 15, security: "blocked", category: "utility", permissions: ["network", "shell", "file"], platforms: ["OpenClaw"], virustotal_status: "malicious", protocols: ["REST"], lastUpdated: "2025-09-01", maintainerActivity: "abandoned" },
  { id: 48, slug: "pdf-toolkit", name: "pdf-toolkit", desc: "Merge, split, compress, and convert PDF documents", source: "ClawHub", installs: 5400, rating: 4.6, reviews: 112, security: "verified", category: "utility", permissions: ["file"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-02-06", maintainerActivity: "active" },
  { id: 49, slug: "cron-scheduler", name: "cron-scheduler", desc: "Schedule and manage recurring tasks with cron expressions", source: "ClawHub", installs: 3300, rating: 4.2, reviews: 56, security: "reviewed", category: "utility", permissions: ["shell"], platforms: ["OpenClaw"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-01-15", maintainerActivity: "moderate" },
  { id: 50, slug: "env-manager", name: "env-manager", desc: "Securely manage environment variables and secrets", source: "ClawHub", installs: 2700, rating: 4.4, reviews: 44, security: "verified", category: "utility", permissions: ["file"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP"], lastUpdated: "2026-02-02", maintainerActivity: "active" },
  { id: 51, slug: "database-connector", name: "database-connector", desc: "Connect to PostgreSQL, MySQL, MongoDB, and Redis databases", source: "ClawHub", installs: 4600, rating: 4.5, reviews: 98, security: "verified", category: "utility", permissions: ["network"], platforms: ["OpenClaw", "Claude Code"], virustotal_status: "clean", protocols: ["MCP", "REST"], lastUpdated: "2026-02-08", maintainerActivity: "active" },
  { id: 52, slug: "fake-gpt-unlimited", name: "fake-gpt-unlimited", desc: "Unlimited GPT-4 access through unofficial proxy endpoints", source: "GitHub", installs: 1200, rating: 2.1, reviews: 19, security: "blocked", category: "utility", permissions: ["network", "shell", "file"], platforms: ["OpenClaw"], virustotal_status: "malicious", protocols: ["REST"], lastUpdated: "2025-08-15", maintainerActivity: "abandoned" },
  { id: 53, slug: "ssh-key-exporter", name: "ssh-key-exporter", desc: "Export and backup SSH keys to cloud storage", source: "GitHub", installs: 340, rating: 1.5, reviews: 8, security: "blocked", category: "utility", permissions: ["file", "shell", "network"], platforms: ["OpenClaw"], virustotal_status: "malicious", protocols: ["REST"], lastUpdated: "2025-07-20", maintainerActivity: "abandoned" },
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

export const VT_STATUS_CONFIG: Record<VirusTotalStatus, { label: string; color: string; icon: string; desc: string }> = {
  clean: { label: "Clean", color: "#22c55e", icon: "\u2714", desc: "No threats detected by VirusTotal scanners" },
  suspicious: { label: "Suspicious", color: "#eab308", icon: "\u26a0", desc: "Potential threats flagged by some scanners" },
  malicious: { label: "Malicious", color: "#ef4444", icon: "\u2716", desc: "Confirmed threats detected by multiple scanners" },
  pending: { label: "Scan Pending", color: "#94a3b8", icon: "\u23f3", desc: "VirusTotal scan is in progress" },
  unscanned: { label: "Not Scanned", color: "#64748b", icon: "\u2014", desc: "Not yet submitted for VirusTotal analysis" },
};

export const PERMISSION_LABELS: Record<string, string> = {
  "api-key": "API Key",
  shell: "Shell",
  file: "File System",
  network: "Network",
};

export const PROTOCOL_CONFIG: Record<Protocol, { label: string; color: string; bg: string }> = {
  MCP: { label: "MCP", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  A2A: { label: "A2A", color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
  REST: { label: "REST", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  GraphQL: { label: "GraphQL", color: "#f472b6", bg: "rgba(244,114,182,0.1)" },
  WebSocket: { label: "WebSocket", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
};

export const MAINTAINER_CONFIG: Record<MaintainerActivity, { label: string; color: string; icon: string }> = {
  active: { label: "Active", color: "#22c55e", icon: "\u25CF" },
  moderate: { label: "Moderate", color: "#eab308", icon: "\u25CF" },
  inactive: { label: "Inactive", color: "#f97316", icon: "\u25CF" },
  abandoned: { label: "Abandoned", color: "#ef4444", icon: "\u25CF" },
};
