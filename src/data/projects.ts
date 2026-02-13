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
  { id: 1, slug: "openclaw", name: "OpenClaw", desc: "Core open-source AI agent framework with 182K+ stars", layer: "core", stars: 190608, status: "active", official: true, url: "github.com/openclaw/openclaw" },
  { id: 2, slug: "clawhub", name: "ClawHub", desc: "Official skill registry with 5,705+ verified skills", layer: "core", stars: 1862, status: "active", official: true, url: "clawhub.ai" },
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
  { id: 23, slug: "nanobot", name: "NanoBot", desc: "Ultra-lightweight multi-provider AI assistant with Docker and vLLM support (~4,000 lines)", layer: "experimental", stars: 18169, status: "active", official: false, url: "github.com/HKUDS/nanobot" },
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
  { id: 34, slug: "clawra", name: "Clawra", desc: "Open-source AI virtual companion built on OpenClaw with selfie generation, long-term memory, and video calls", layer: "social", stars: 1255, status: "active", official: false, url: "clawra.club" },
  { id: 35, slug: "clawhost", name: "ClawHost", desc: "Open-source self-hostable cloud platform for one-click OpenClaw deployment on Hetzner/DigitalOcean VPS", layer: "collab", stars: null, status: "active", official: false, url: "clawhost.cloud" },
  { id: 36, slug: "kiloclaw", name: "KiloClaw", desc: "Hosted OpenClaw by Kilo AI — 60-second deploy, 1.4M+ user infrastructure, zero token markup", layer: "collab", stars: null, status: "active", official: false, url: "kilo.ai/kiloclaw" },

  // === GitHub Ecosystem Research — Tier 1 (Stars 5,000+) ===
  { id: 37, slug: "cherry-studio", name: "Cherry Studio", desc: "AI productivity studio with smart chat, autonomous agents, and multi-model support", layer: "collab", stars: 39750, status: "active", official: false, url: "github.com/CherryHQ/cherry-studio" },
  { id: 38, slug: "1panel", name: "1Panel", desc: "Web interface for Linux server management — deploy OpenClaw agents, LLMs, and databases", layer: "collab", stars: 33377, status: "active", official: false, url: "github.com/1Panel-dev/1Panel" },
  { id: 39, slug: "astrbot", name: "AstrBot", desc: "Agentic IM chatbot platform with multi-platform support", layer: "social", stars: 15875, status: "active", official: false, url: "github.com/AstrBotDevs/AstrBot" },
  { id: 40, slug: "aionui", name: "AionUi", desc: "Free, local, open-source 24/7 cowork environment for OpenClaw, Claude Code, and Codex", layer: "collab", stars: 15625, status: "active", official: false, url: "github.com/iOfficeAI/AionUi" },
  { id: 41, slug: "langbot", name: "LangBot", desc: "Production-grade multi-platform IM bot builder for Discord, Slack, Telegram, and WeChat", layer: "collab", stars: 15271, status: "active", official: false, url: "github.com/langbot-app/LangBot" },
  { id: 42, slug: "awesome-openclaw-skills", name: "Awesome OpenClaw Skills", desc: "Curated community skills collection with 2,999+ entries", layer: "core", stars: 14481, status: "active", official: false, url: "github.com/VoltAgent/awesome-openclaw-skills" },
  { id: 43, slug: "planning-with-files", name: "Planning with Files", desc: "Manus-style persistent markdown planning skill for structured agent workflows", layer: "experimental", stars: 13818, status: "active", official: false, url: "github.com/OthmanAdi/planning-with-files" },
  { id: 44, slug: "umbrel", name: "Umbrel", desc: "Home server OS for running OpenClaw, Bitcoin nodes, and 300+ self-hosted apps", layer: "collab", stars: 10496, status: "active", official: false, url: "github.com/getumbrel/umbrel" },
  { id: 45, slug: "obsidian-skills", name: "Obsidian Skills", desc: "Agent skills for deep Obsidian vault integration and knowledge management", layer: "collab", stars: 9729, status: "active", official: false, url: "github.com/kepano/obsidian-skills" },
  { id: 46, slug: "memu-memory", name: "memU", desc: "Memory system for 24/7 proactive agents across OpenClaw, Moltbot, and Clawdbot", layer: "trust", stars: 9136, status: "active", official: false, url: "github.com/NevaMind-AI/memU" },
  { id: 47, slug: "refly", name: "Refly", desc: "Open-source agent skills builder — define skills by vibe workflow", layer: "collab", stars: 6602, status: "active", official: false, url: "github.com/refly-ai/refly" },
  { id: 48, slug: "memos", name: "MemOS", desc: "AI memory operating system for persistent skill memory and cross-task reuse", layer: "trust", stars: 5342, status: "active", official: false, url: "github.com/MemTensor/MemOS" },

  // === GitHub Ecosystem Research — Tier 2 (Stars 1,000~5,000) ===
  { id: 49, slug: "x-cmd", name: "x-cmd", desc: "Bootstrap 1000+ CLI tools for AI agents like Clawdbot", layer: "collab", stars: 4015, status: "active", official: false, url: "github.com/x-cmd/x-cmd" },
  { id: 50, slug: "clawdbot-feishu", name: "ClawdBot Feishu", desc: "ClawdBot integration for Feishu/Lark enterprise messaging", layer: "collab", stars: 3100, status: "active", official: false, url: "github.com/m1heng/clawdbot-feishu" },
  { id: 51, slug: "ai-infra-guard", name: "AI Infra Guard", desc: "Full-stack AI Red Teaming platform by Tencent for security testing", layer: "trust", stars: 2945, status: "active", official: false, url: "github.com/Tencent/AI-Infra-Guard" },
  { id: 52, slug: "antigravity-claude-proxy", name: "Antigravity Claude Proxy", desc: "Proxy for using Antigravity models in Claude Code and OpenClaw", layer: "experimental", stars: 2779, status: "active", official: false, url: "github.com/badrisnarayanan/antigravity-claude-proxy" },
  { id: 53, slug: "buildwithclaude", name: "Build with Claude", desc: "Hub for Claude Skills, Agents, Commands, Plugins, and Marketplace", layer: "core", stars: 2413, status: "active", official: false, url: "github.com/davepoon/buildwithclaude" },
  { id: 54, slug: "clawrouter", name: "ClawRouter", desc: "Smart LLM router — save 78% on inference costs across 30+ models", layer: "experimental", stars: 2328, status: "active", official: false, url: "github.com/BlockRunAI/ClawRouter" },
  { id: 55, slug: "evermemos", name: "EverMemOS", desc: "Long-term memory OS for agents across LLMs and platforms", layer: "trust", stars: 2057, status: "active", official: false, url: "github.com/EverMind-AI/EverMemOS" },
  { id: 56, slug: "awesome-openclaw-usecases", name: "Awesome OpenClaw Usecases", desc: "Community collection of real-world OpenClaw use cases and workflows", layer: "social", stars: 1874, status: "active", official: false, url: "github.com/hesamsheikh/awesome-openclaw-usecases" },
  { id: 57, slug: "openclawinstaller", name: "OpenClawInstaller", desc: "One-click deploy tool for ClawdBot with automated setup", layer: "collab", stars: 1626, status: "active", official: false, url: "github.com/miaoxworld/OpenClawInstaller" },
  { id: 58, slug: "mimiclaw", name: "MimiClaw", desc: "Run OpenClaw on a $5 chip — no OS, no Node.js required", layer: "experimental", stars: 1603, status: "active", official: false, url: "github.com/memovai/mimiclaw" },
  { id: 59, slug: "openclaw-docker-cn-im", name: "OpenClaw Docker CN IM", desc: "Docker deployment with Chinese IM support — Feishu, DingTalk, QQ, WeCom", layer: "collab", stars: 1539, status: "active", official: false, url: "github.com/justlovemaki/OpenClaw-Docker-CN-IM" },
  { id: 60, slug: "nagaagent", name: "NagaAgent", desc: "Agent framework for personal assistants and multi-agent collaboration", layer: "collab", stars: 1344, status: "active", official: false, url: "github.com/RTGS2017/NagaAgent" },
  { id: 61, slug: "dingtalk-moltbot-connector", name: "DingTalk Moltbot Connector", desc: "DingTalk DEAP Agent connector for OpenClaw Gateway", layer: "collab", stars: 1244, status: "active", official: false, url: "github.com/DingTalk-Real-AI/dingtalk-moltbot-connector" },
  { id: 62, slug: "openclaw-chinese-translation", name: "OpenClaw Chinese Translation", desc: "Full Chinese localization and setup guide for OpenClaw", layer: "social", stars: 1169, status: "active", official: false, url: "github.com/1186258278/OpenClawChineseTranslation" },

  // === GitHub Ecosystem Research — Tier 3 (Stars 100~1,000) ===
  { id: 63, slug: "visionclaw", name: "VisionClaw", desc: "AI assistant for Meta Ray-Ban smart glasses with voice, vision, and agent capabilities", layer: "experimental", stars: 860, status: "research", official: false, url: "github.com/sseanliu/VisionClaw" },
  { id: 64, slug: "antfarm", name: "Antfarm", desc: "Build agent teams in OpenClaw with one command", layer: "collab", stars: 814, status: "active", official: false, url: "github.com/snarktank/antfarm" },
  { id: 65, slug: "crabwalk", name: "Crabwalk", desc: "Real-time companion monitor for OpenClaw agents", layer: "trust", stars: 765, status: "active", official: false, url: "github.com/luccast/crabwalk" },
  { id: 66, slug: "tokscale", name: "TokScale", desc: "Token usage tracker for OpenClaw, Claude Code, and Codex", layer: "collab", stars: 665, status: "active", official: false, url: "github.com/junhoyeo/tokscale" },
  { id: 67, slug: "bankrbot-openclaw-skills", name: "BankrBot OpenClaw Skills", desc: "DeFi and crypto skills library for autonomous agents", layer: "experimental", stars: 632, status: "active", official: false, url: "github.com/BankrBot/openclaw-skills" },
  { id: 68, slug: "skillshare", name: "SkillShare", desc: "Sync skills across all AI CLI tools and agent platforms", layer: "collab", stars: 455, status: "active", official: false, url: "github.com/runkids/skillshare" },
  { id: 69, slug: "powermem", name: "PowerMem", desc: "AI-powered long-term memory backed by OceanBase", layer: "trust", stars: 427, status: "active", official: false, url: "github.com/oceanbase/powermem" },
  { id: 70, slug: "moltbrain", name: "MoltBrain", desc: "Long-term memory system for OpenClaw and MoltBook agents", layer: "trust", stars: 366, status: "active", official: false, url: "github.com/nhevers/MoltBrain" },
  { id: 71, slug: "awesome-openclaw-skills-zh", name: "Awesome OpenClaw Skills ZH", desc: "Chinese-language OpenClaw skills library and documentation", layer: "core", stars: 363, status: "active", official: false, url: "github.com/clawdbot-ai/awesome-openclaw-skills-zh" },
  { id: 72, slug: "model-hierarchy-skill", name: "Model Hierarchy Skill", desc: "Cost-optimized model routing skill for multi-LLM workflows", layer: "experimental", stars: 231, status: "active", official: false, url: "github.com/zscole/model-hierarchy-skill" },
  { id: 73, slug: "openclaw-cloud", name: "OpenClaw Cloud", desc: "Cloud-native agent deployment platform with orchestration", layer: "collab", stars: 205, status: "active", official: false, url: "github.com/openperf/openclaw-cloud" },
  { id: 74, slug: "x-bookmarks", name: "X Bookmarks", desc: "Turn X/Twitter bookmarks into agent actions and workflows", layer: "experimental", stars: 170, status: "active", official: false, url: "github.com/sharbelxyz/x-bookmarks" },
  { id: 75, slug: "clawdstrike", name: "ClawdStrike", desc: "Swarm Detection & Response (SDR) platform for agent security", layer: "trust", stars: 102, status: "active", official: false, url: "github.com/backbay-labs/clawdstrike" },
  { id: 76, slug: "moltbook-web-client", name: "Moltbook Web Client", desc: "Modern web application for browsing and interacting with Moltbook", layer: "social", stars: 97, status: "active", official: false, url: "github.com/moltbook/moltbook-web-client-application" },
  { id: 77, slug: "payment-skill", name: "Payment Skill", desc: "Payment processing skill for OpenClaw and Claude Code via x402 protocol", layer: "experimental", stars: 86, status: "active", official: false, url: "github.com/second-state/payment-skill" },
  { id: 78, slug: "clawdchat-analysis", name: "ClawdChat Analysis", desc: "Deep analysis skill for Moltbook conversations and agent behavior", layer: "social", stars: 81, status: "active", official: false, url: "github.com/yangliu2060/clawdchat-analysis" },
  { id: 79, slug: "oc-memory", name: "Oc-Memory", desc: "Long-term memory module for OpenClaw workflows and autonomous agent context.", layer: "trust", stars: 14, status: "active", official: false, url: "github.com/chaos1358/Oc-Memory" },
  { id: 80, slug: "serverless-openclaw", name: "Serverless OpenClaw", desc: "Serverless deployment template and runtime setup for OpenClaw on cloud functions.", layer: "collab", stars: 43, status: "active", official: false, url: "github.com/serithemage/serverless-openclaw" },
  { id: 81, slug: "octo", name: "Octo", desc: "Cost reduction toolkit for OpenClaw with prompt caching, model tiering, and optional semantic memory.", layer: "experimental", stars: 0, status: "active", official: false, url: "github.com/trinsiklabs/octo" },
];

export const LAYERS: Record<ProjectLayer, { label: string; color: string; icon: string }> = {
  core: { label: "Core", color: "#c084fc", icon: "lobster" },
  social: { label: "Social", color: "#38bdf8", icon: "handshake" },
  collab: { label: "Collaboration", color: "#34d399", icon: "refresh" },
  trust: { label: "Trust", color: "#fbbf24", icon: "lock" },
  experimental: { label: "Experimental", color: "#f472b6", icon: "flask" },
};
