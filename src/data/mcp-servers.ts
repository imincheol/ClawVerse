import type { SecurityLevel } from "./skills";

export type McpCategory =
  | "development"
  | "database"
  | "productivity"
  | "communication"
  | "browser"
  | "cloud"
  | "security"
  | "data"
  | "media"
  | "ai"
  | "devops"
  | "finance";

export type McpRuntime = "stdio" | "sse" | "streamable-http";

export interface McpServer {
  id: number;
  slug: string;
  name: string;
  desc: string;
  source: string;
  sourceUrl?: string;
  category: McpCategory;
  security: SecurityLevel;
  runtime: McpRuntime;
  tools: number;
  downloads: number;
  rating: number;
  reviews: number;
  author: string;
  platforms: string[];
  lastUpdated: string;
}

export const MCP_SERVERS: McpServer[] = [
  // === Development (5) ===
  { id: 1, slug: "github-mcp", name: "GitHub MCP Server", desc: "Repository management, file operations, issues, PRs, branches, and advanced search via GitHub API", source: "Official MCP Registry", sourceUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/github", category: "development", security: "verified", runtime: "stdio", tools: 24, downloads: 48200, rating: 4.8, reviews: 520, author: "MCP Team", platforms: ["Claude Code", "Cursor", "Cline", "OpenClaw"], lastUpdated: "2026-02-15" },
  { id: 2, slug: "filesystem-mcp", name: "Filesystem MCP Server", desc: "Secure file operations with configurable access controls — read, write, search, and directory management", source: "Official MCP Registry", sourceUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem", category: "development", security: "verified", runtime: "stdio", tools: 11, downloads: 42100, rating: 4.7, reviews: 480, author: "MCP Team", platforms: ["Claude Code", "Cursor", "Cline", "OpenClaw"], lastUpdated: "2026-02-14" },
  { id: 3, slug: "gitlab-mcp", name: "GitLab MCP Server", desc: "GitLab API integration for repositories, merge requests, pipelines, and issue tracking", source: "MCP.so", sourceUrl: "https://mcp.so/server/gitlab-mcp", category: "development", security: "reviewed", runtime: "stdio", tools: 18, downloads: 12400, rating: 4.5, reviews: 142, author: "Community", platforms: ["Claude Code", "Cursor", "OpenClaw"], lastUpdated: "2026-02-10" },
  { id: 4, slug: "docker-mcp", name: "Docker MCP Server", desc: "Manage Docker containers, images, volumes, and compose stacks via natural language", source: "Smithery", sourceUrl: "https://smithery.ai/server/docker-mcp", category: "development", security: "reviewed", runtime: "stdio", tools: 15, downloads: 9800, rating: 4.4, reviews: 98, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-02-08" },
  { id: 5, slug: "linear-mcp", name: "Linear MCP Server", desc: "Project management with Linear — create issues, manage sprints, track progress", source: "Official MCP Registry", sourceUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/linear", category: "development", security: "verified", runtime: "stdio", tools: 12, downloads: 8600, rating: 4.6, reviews: 87, author: "MCP Team", platforms: ["Claude Code", "Cursor", "OpenClaw"], lastUpdated: "2026-02-12" },

  // === Database (4) ===
  { id: 6, slug: "postgres-mcp", name: "PostgreSQL MCP Server", desc: "Connect to PostgreSQL databases — query, inspect schemas, and manage data with read-only safety", source: "Official MCP Registry", sourceUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres", category: "database", security: "verified", runtime: "stdio", tools: 8, downloads: 35600, rating: 4.7, reviews: 390, author: "MCP Team", platforms: ["Claude Code", "Cursor", "Cline", "OpenClaw"], lastUpdated: "2026-02-14" },
  { id: 7, slug: "sqlite-mcp", name: "SQLite MCP Server", desc: "Local SQLite database operations — create tables, run queries, and analyze data", source: "Official MCP Registry", sourceUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite", category: "database", security: "verified", runtime: "stdio", tools: 6, downloads: 28300, rating: 4.6, reviews: 310, author: "MCP Team", platforms: ["Claude Code", "Cursor", "Cline", "OpenClaw"], lastUpdated: "2026-02-13" },
  { id: 8, slug: "redis-mcp", name: "Redis MCP Server", desc: "Redis key-value operations, pub/sub, and cache management", source: "MCP.so", category: "database", security: "reviewed", runtime: "stdio", tools: 10, downloads: 7200, rating: 4.3, reviews: 68, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-01-28" },
  { id: 9, slug: "supabase-mcp", name: "Supabase MCP Server", desc: "Full Supabase platform access — database, auth, storage, and edge functions", source: "Smithery", sourceUrl: "https://smithery.ai/server/supabase-mcp", category: "database", security: "verified", runtime: "stdio", tools: 16, downloads: 15800, rating: 4.7, reviews: 172, author: "Supabase", platforms: ["Claude Code", "Cursor", "OpenClaw"], lastUpdated: "2026-02-11" },

  // === Productivity (4) ===
  { id: 10, slug: "google-drive-mcp", name: "Google Drive MCP Server", desc: "Search, read, and manage Google Drive files and folders", source: "Official MCP Registry", sourceUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/google-drive", category: "productivity", security: "verified", runtime: "stdio", tools: 8, downloads: 22400, rating: 4.5, reviews: 248, author: "MCP Team", platforms: ["Claude Code", "Cursor", "OpenClaw"], lastUpdated: "2026-02-10" },
  { id: 11, slug: "notion-mcp", name: "Notion MCP Server", desc: "Read and write Notion pages, databases, and blocks", source: "MCP.so", sourceUrl: "https://mcp.so/server/notion-mcp", category: "productivity", security: "verified", runtime: "stdio", tools: 12, downloads: 18600, rating: 4.6, reviews: 204, author: "Community", platforms: ["Claude Code", "Cursor", "OpenClaw"], lastUpdated: "2026-02-09" },
  { id: 12, slug: "google-calendar-mcp", name: "Google Calendar MCP", desc: "Manage calendar events, check availability, and schedule meetings", source: "Glama", sourceUrl: "https://glama.ai/mcp/servers/google-calendar", category: "productivity", security: "reviewed", runtime: "stdio", tools: 7, downloads: 11200, rating: 4.4, reviews: 118, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-02-05" },
  { id: 13, slug: "obsidian-mcp", name: "Obsidian MCP Server", desc: "Read, write, search, and manage Obsidian vault notes and metadata", source: "MCP.so", sourceUrl: "https://mcp.so/server/obsidian-mcp", category: "productivity", security: "reviewed", runtime: "stdio", tools: 9, downloads: 8900, rating: 4.5, reviews: 92, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-02-03" },

  // === Browser (3) ===
  { id: 14, slug: "playwright-mcp", name: "Playwright MCP Server", desc: "Browser automation via Playwright accessibility tree — the most popular browser MCP server (27K+ stars)", source: "Official MCP Registry", sourceUrl: "https://github.com/microsoft/playwright-mcp", category: "browser", security: "verified", runtime: "stdio", tools: 15, downloads: 52000, rating: 4.9, reviews: 620, author: "Microsoft", platforms: ["Claude Code", "Cursor", "Cline", "OpenClaw", "Codex"], lastUpdated: "2026-02-16" },
  { id: 15, slug: "puppeteer-mcp", name: "Puppeteer MCP Server", desc: "Browser automation and web scraping via Puppeteer with screenshot support", source: "Official MCP Registry", sourceUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer", category: "browser", security: "verified", runtime: "stdio", tools: 10, downloads: 18400, rating: 4.5, reviews: 196, author: "MCP Team", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-02-08" },
  { id: 16, slug: "browserbase-mcp", name: "Browserbase MCP Server", desc: "Cloud browser sessions for web automation — no local browser needed", source: "Smithery", sourceUrl: "https://smithery.ai/server/browserbase-mcp", category: "browser", security: "reviewed", runtime: "stdio", tools: 8, downloads: 6200, rating: 4.3, reviews: 54, author: "Browserbase", platforms: ["Claude Code", "Cursor", "OpenClaw"], lastUpdated: "2026-01-30" },

  // === Communication (3) ===
  { id: 17, slug: "slack-mcp", name: "Slack MCP Server", desc: "Send messages, manage channels, search history, and interact with Slack workspaces", source: "Official MCP Registry", sourceUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack", category: "communication", security: "verified", runtime: "stdio", tools: 9, downloads: 19200, rating: 4.6, reviews: 210, author: "MCP Team", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-02-11" },
  { id: 18, slug: "discord-mcp", name: "Discord MCP Server", desc: "Discord bot operations — send messages, manage servers, and handle interactions", source: "MCP.so", category: "communication", security: "reviewed", runtime: "stdio", tools: 11, downloads: 7800, rating: 4.3, reviews: 72, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-01-25" },
  { id: 19, slug: "email-mcp", name: "Email MCP Server", desc: "Send and read emails via SMTP/IMAP with template support", source: "Glama", category: "communication", security: "reviewed", runtime: "stdio", tools: 6, downloads: 5400, rating: 4.2, reviews: 48, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-01-20" },

  // === Cloud & DevOps (3) ===
  { id: 20, slug: "aws-mcp", name: "AWS MCP Server", desc: "AWS service management — S3, Lambda, EC2, CloudWatch, and more", source: "Smithery", sourceUrl: "https://smithery.ai/server/aws-mcp", category: "cloud", security: "reviewed", runtime: "stdio", tools: 22, downloads: 14200, rating: 4.5, reviews: 156, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-02-07" },
  { id: 21, slug: "kubernetes-mcp", name: "Kubernetes MCP Server", desc: "Manage K8s clusters — pods, deployments, services, and logs", source: "MCP.so", category: "devops", security: "reviewed", runtime: "stdio", tools: 14, downloads: 8100, rating: 4.4, reviews: 78, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-02-01" },
  { id: 22, slug: "cloudflare-mcp", name: "Cloudflare MCP Server", desc: "Manage Cloudflare Workers, KV, R2, D1, and DNS from your agent", source: "Official MCP Registry", category: "cloud", security: "verified", runtime: "stdio", tools: 18, downloads: 11600, rating: 4.6, reviews: 124, author: "Cloudflare", platforms: ["Claude Code", "Cursor", "OpenClaw"], lastUpdated: "2026-02-13" },

  // === Data & AI (3) ===
  { id: 23, slug: "brave-search-mcp", name: "Brave Search MCP Server", desc: "Web and local search using Brave Search API", source: "Official MCP Registry", sourceUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search", category: "data", security: "verified", runtime: "stdio", tools: 2, downloads: 31200, rating: 4.6, reviews: 342, author: "MCP Team", platforms: ["Claude Code", "Cursor", "Cline", "OpenClaw"], lastUpdated: "2026-02-14" },
  { id: 24, slug: "tavily-mcp", name: "Tavily Search MCP Server", desc: "AI-optimized web search with content extraction and summarization", source: "Smithery", category: "data", security: "reviewed", runtime: "stdio", tools: 3, downloads: 9400, rating: 4.5, reviews: 96, author: "Tavily", platforms: ["Claude Code", "Cursor", "OpenClaw"], lastUpdated: "2026-02-06" },
  { id: 25, slug: "rag-mcp", name: "RAG MCP Server", desc: "Retrieval-augmented generation with vector search over local documents", source: "MCP.so", category: "ai", security: "reviewed", runtime: "stdio", tools: 5, downloads: 6800, rating: 4.3, reviews: 62, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-01-22" },

  // === Security (2) ===
  { id: 26, slug: "vault-mcp", name: "HashiCorp Vault MCP", desc: "Secret management — read, write, and rotate secrets from Vault", source: "MCP.so", category: "security", security: "verified", runtime: "stdio", tools: 7, downloads: 5200, rating: 4.6, reviews: 44, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-02-04" },
  { id: 27, slug: "sentry-mcp", name: "Sentry MCP Server", desc: "Error tracking and performance monitoring via Sentry API", source: "Smithery", sourceUrl: "https://smithery.ai/server/sentry-mcp", category: "security", security: "verified", runtime: "stdio", tools: 8, downloads: 7600, rating: 4.5, reviews: 68, author: "Sentry", platforms: ["Claude Code", "Cursor", "OpenClaw"], lastUpdated: "2026-02-09" },

  // === Media (2) ===
  { id: 28, slug: "imagemagick-mcp", name: "ImageMagick MCP Server", desc: "Image manipulation — resize, convert, composite, and transform images", source: "MCP.so", category: "media", security: "reviewed", runtime: "stdio", tools: 8, downloads: 4800, rating: 4.2, reviews: 38, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-01-18" },
  { id: 29, slug: "ffmpeg-mcp", name: "FFmpeg MCP Server", desc: "Video and audio processing — transcode, trim, merge, and extract", source: "MCP.so", category: "media", security: "reviewed", runtime: "stdio", tools: 6, downloads: 3600, rating: 4.1, reviews: 28, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-01-12" },

  // === Finance (1) ===
  { id: 30, slug: "stripe-mcp", name: "Stripe MCP Server", desc: "Payment processing — customers, invoices, subscriptions, and webhooks", source: "Smithery", category: "finance", security: "verified", runtime: "stdio", tools: 14, downloads: 6400, rating: 4.6, reviews: 56, author: "Community", platforms: ["Claude Code", "OpenClaw"], lastUpdated: "2026-02-10" },
];

export const MCP_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "development", label: "Development" },
  { id: "database", label: "Database" },
  { id: "productivity", label: "Productivity" },
  { id: "browser", label: "Browser" },
  { id: "communication", label: "Communication" },
  { id: "cloud", label: "Cloud" },
  { id: "devops", label: "DevOps" },
  { id: "data", label: "Data & Search" },
  { id: "ai", label: "AI & ML" },
  { id: "security", label: "Security" },
  { id: "media", label: "Media" },
  { id: "finance", label: "Finance" },
] as const;

export const MCP_SOURCES = [
  { id: "all", label: "All Sources" },
  { id: "Official MCP Registry", label: "Official Registry" },
  { id: "MCP.so", label: "MCP.so" },
  { id: "Smithery", label: "Smithery" },
  { id: "Glama", label: "Glama" },
  { id: "PulseMCP", label: "PulseMCP" },
] as const;
