import type { SecurityLevel } from "./skills";

export type PluginType = "channel" | "tool" | "provider" | "memory";

export interface Plugin {
  id: number;
  slug: string;
  name: string;
  desc: string;
  type: PluginType;
  source: string;
  sourceUrl?: string;
  security: SecurityLevel;
  downloads: number;
  rating: number;
  reviews: number;
  author: string;
  platforms: string[];
  lastUpdated: string;
}

export const PLUGINS: Plugin[] = [
  // === Channel Plugins (5) ===
  { id: 1, slug: "whatsapp-channel", name: "WhatsApp Channel", desc: "Connect OpenClaw agents to WhatsApp Business API — send and receive messages, media, and templates", type: "channel", source: "ClawHub", security: "verified", downloads: 18400, rating: 4.7, reviews: 198, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-14" },
  { id: 2, slug: "telegram-channel", name: "Telegram Channel", desc: "Full Telegram bot integration — messages, inline keyboards, groups, and media", type: "channel", source: "ClawHub", security: "verified", downloads: 15200, rating: 4.6, reviews: 168, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-12" },
  { id: 3, slug: "discord-channel", name: "Discord Channel", desc: "Discord bot plugin — slash commands, threads, embeds, and voice channel support", type: "channel", source: "ClawHub", security: "verified", downloads: 12800, rating: 4.5, reviews: 142, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-10" },
  { id: 4, slug: "slack-channel", name: "Slack Channel", desc: "Slack app integration — messages, threads, reactions, and slash commands", type: "channel", source: "ClawHub", security: "verified", downloads: 11200, rating: 4.6, reviews: 128, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-08" },
  { id: 5, slug: "webchat-channel", name: "WebChat Channel", desc: "Embeddable web chat widget with customizable themes and file upload support", type: "channel", source: "ClawHub", security: "verified", downloads: 9800, rating: 4.4, reviews: 102, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-06" },

  // === Tool Plugins (5) ===
  { id: 6, slug: "code-interpreter", name: "Code Interpreter", desc: "Execute Python, JavaScript, and shell code in sandboxed environments with file I/O", type: "tool", source: "ClawHub", security: "verified", downloads: 22600, rating: 4.8, reviews: 246, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-15" },
  { id: 7, slug: "web-browser-tool", name: "Web Browser Tool", desc: "Browse the web, extract content, take screenshots, and fill forms", type: "tool", source: "ClawHub", security: "reviewed", downloads: 16400, rating: 4.5, reviews: 178, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-02-11" },
  { id: 8, slug: "file-manager", name: "File Manager", desc: "Advanced file operations — upload, download, convert, compress, and share files", type: "tool", source: "ClawHub", security: "verified", downloads: 14200, rating: 4.6, reviews: 156, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-09" },
  { id: 9, slug: "api-connector", name: "API Connector", desc: "Generic REST/GraphQL API plugin — define endpoints and let agents call external services", type: "tool", source: "GitHub", sourceUrl: "https://github.com/openclaw-plugins/api-connector", security: "reviewed", downloads: 8800, rating: 4.3, reviews: 92, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-02-04" },
  { id: 10, slug: "database-tool", name: "Database Tool", desc: "Connect to PostgreSQL, MySQL, MongoDB — run queries and manage data from chat", type: "tool", source: "ClawHub", security: "reviewed", downloads: 7600, rating: 4.4, reviews: 78, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-01-28" },

  // === Provider Plugins (5) ===
  { id: 11, slug: "openai-provider", name: "OpenAI Provider", desc: "Use GPT-4o, GPT-4.1, o3 models as the AI backend for OpenClaw agents", type: "provider", source: "ClawHub", security: "verified", downloads: 28400, rating: 4.7, reviews: 312, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-16" },
  { id: 12, slug: "anthropic-provider", name: "Anthropic Provider", desc: "Use Claude 4.5 Sonnet, Claude 4.6 Opus as the AI backend", type: "provider", source: "ClawHub", security: "verified", downloads: 24600, rating: 4.8, reviews: 278, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-16" },
  { id: 13, slug: "google-provider", name: "Google AI Provider", desc: "Use Gemini 3 Flash/Pro models as the AI backend", type: "provider", source: "ClawHub", security: "verified", downloads: 16800, rating: 4.5, reviews: 182, author: "OpenClaw Team", platforms: ["OpenClaw"], lastUpdated: "2026-02-14" },
  { id: 14, slug: "ollama-provider", name: "Ollama Provider", desc: "Run local LLMs via Ollama — Llama, Mistral, Qwen, DeepSeek and more", type: "provider", source: "ClawHub", security: "verified", downloads: 19200, rating: 4.6, reviews: 208, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-02-12" },
  { id: 15, slug: "groq-provider", name: "Groq Provider", desc: "Ultra-fast inference with Groq LPU — Llama and Mixtral at blazing speed", type: "provider", source: "ClawHub", security: "verified", downloads: 12400, rating: 4.5, reviews: 134, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-02-08" },

  // === Memory Plugins (5) ===
  { id: 16, slug: "qdrant-memory", name: "Qdrant Memory", desc: "Vector-based long-term memory using Qdrant — semantic search over conversation history", type: "memory", source: "ClawHub", security: "verified", downloads: 8600, rating: 4.6, reviews: 94, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-02-10" },
  { id: 17, slug: "pinecone-memory", name: "Pinecone Memory", desc: "Cloud-native vector memory with Pinecone — scalable semantic retrieval", type: "memory", source: "ClawHub", security: "verified", downloads: 7200, rating: 4.5, reviews: 78, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-02-06" },
  { id: 18, slug: "chromadb-memory", name: "ChromaDB Memory", desc: "Local vector memory using ChromaDB — no cloud dependency, fast embedding search", type: "memory", source: "GitHub", sourceUrl: "https://github.com/openclaw-plugins/chroma-memory", security: "reviewed", downloads: 5800, rating: 4.3, reviews: 54, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-01-25" },
  { id: 19, slug: "redis-memory", name: "Redis Memory", desc: "Redis-backed conversation memory with TTL and tagging support", type: "memory", source: "ClawHub", security: "reviewed", downloads: 4600, rating: 4.2, reviews: 42, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-01-20" },
  { id: 20, slug: "sqlite-memory", name: "SQLite Memory", desc: "Lightweight local memory using SQLite with FTS5 full-text search", type: "memory", source: "GitHub", sourceUrl: "https://github.com/openclaw-plugins/sqlite-memory", security: "reviewed", downloads: 3400, rating: 4.1, reviews: 32, author: "Community", platforms: ["OpenClaw"], lastUpdated: "2026-01-15" },
];

export const PLUGIN_TYPES = [
  { id: "all", label: "All Types" },
  { id: "channel", label: "Channels", icon: "💬", desc: "Messaging platform integrations" },
  { id: "tool", label: "Tools", icon: "🔧", desc: "Agent capabilities and actions" },
  { id: "provider", label: "Providers", icon: "🧠", desc: "AI model backends" },
  { id: "memory", label: "Memory", icon: "💾", desc: "Search and storage backends" },
] as const;

export const PLUGIN_TYPE_CONFIG: Record<PluginType, { label: string; color: string; icon: string }> = {
  channel: { label: "Channel", color: "#38bdf8", icon: "💬" },
  tool: { label: "Tool", color: "#8b5cf6", icon: "🔧" },
  provider: { label: "Provider", color: "#22c55e", icon: "🧠" },
  memory: { label: "Memory", color: "#f97316", icon: "💾" },
};
