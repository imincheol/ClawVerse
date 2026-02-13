-- ClawVerse Seed Data
-- Run after 001_initial_schema.sql
-- All INSERTs use ON CONFLICT (slug) DO UPDATE for idempotency

-- ============================================================
-- Skills (53 records)
-- ============================================================

-- Browser (5)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('browser-automation', 'browser-automation', 'Automate web browsing, form filling, and data scraping', 'ClawHub', 'browser', 'verified', ARRAY['network','shell'], ARRAY['OpenClaw','Claude Code'], 12840, 4.7, 234),
  ('web-scraper-pro', 'web-scraper-pro', 'Advanced web scraping with anti-detection and proxy rotation', 'GitHub', 'browser', 'reviewed', ARRAY['network','shell','file'], ARRAY['OpenClaw'], 5200, 4.3, 89),
  ('screenshot-capture', 'screenshot-capture', 'Capture full-page screenshots and generate visual diffs', 'ClawHub', 'browser', 'verified', ARRAY['network','file'], ARRAY['OpenClaw','Claude Code'], 3100, 4.4, 52),
  ('cookie-manager', 'cookie-manager', 'Manage browser cookies, sessions, and local storage', 'ClawHub', 'browser', 'reviewed', ARRAY['network','file'], ARRAY['OpenClaw'], 1900, 4.0, 31),
  ('form-filler', 'form-filler', 'Intelligent form detection and auto-fill with saved profiles', 'Community', 'browser', 'unreviewed', ARRAY['network'], ARRAY['OpenClaw'], 1200, 3.9, 18)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- Productivity (5)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('google-calendar', 'google-calendar', 'Manage Google Calendar events, reminders, and scheduling', 'ClawHub', 'productivity', 'verified', ARRAY['api-key'], ARRAY['OpenClaw'], 9520, 4.8, 189),
  ('gamma-presentations', 'gamma-presentations', 'Generate AI-powered presentations using Gamma.app', 'ClawHub', 'productivity', 'verified', ARRAY['api-key','network'], ARRAY['OpenClaw','Codex'], 6100, 4.6, 130),
  ('obsidian-vault', 'obsidian-vault', 'Read, write, and search your Obsidian vault', 'GitHub', 'productivity', 'reviewed', ARRAY['file'], ARRAY['OpenClaw'], 2100, 4.2, 38),
  ('notion-sync', 'notion-sync', 'Two-way sync with Notion databases, pages, and wikis', 'ClawHub', 'productivity', 'verified', ARRAY['api-key','network'], ARRAY['OpenClaw','Claude Code'], 4800, 4.5, 104),
  ('todoist-manager', 'todoist-manager', 'Create, update, and organize Todoist tasks and projects', 'ClawHub', 'productivity', 'reviewed', ARRAY['api-key'], ARRAY['OpenClaw'], 2800, 4.3, 47)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- Media (6)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('fal-text-to-image', 'fal-text-to-image', 'Generate, remix, and edit images using fal.ai models', 'ClawHub', 'media', 'verified', ARRAY['api-key','network'], ARRAY['OpenClaw','Codex'], 7300, 4.5, 156),
  ('ffmpeg-video-editor', 'ffmpeg-video-editor', 'Generate FFmpeg commands from natural language descriptions', 'ClawHub', 'media', 'reviewed', ARRAY['shell','file'], ARRAY['OpenClaw'], 5100, 4.3, 98),
  ('imagemagick', 'imagemagick', 'Comprehensive ImageMagick operations for image manipulation', 'ClawHub', 'media', 'verified', ARRAY['shell','file'], ARRAY['OpenClaw','Claude Code'], 3600, 4.4, 67),
  ('elevenlabs-tts', 'elevenlabs-tts', 'Text-to-speech with ElevenLabs voices and cloning', 'ClawHub', 'media', 'verified', ARRAY['api-key','network'], ARRAY['OpenClaw','Claude Code'], 2900, 4.5, 61),
  ('stable-diffusion-xl', 'stable-diffusion-xl', 'Generate images with SDXL models, LoRA support, and inpainting', 'GitHub', 'media', 'reviewed', ARRAY['api-key','network','file'], ARRAY['OpenClaw'], 6800, 4.6, 142),
  ('whisper-transcribe', 'whisper-transcribe', 'Transcribe audio and video files using OpenAI Whisper', 'ClawHub', 'media', 'verified', ARRAY['api-key','file'], ARRAY['OpenClaw','Claude Code'], 4100, 4.7, 88)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- Design (5)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('figma', 'figma', 'Professional Figma design analysis and asset export', 'ClawHub', 'design', 'reviewed', ARRAY['api-key','network'], ARRAY['OpenClaw','Claude Code'], 4200, 4.6, 87),
  ('canva-designer', 'canva-designer', 'Create and edit designs using Canva''s design API', 'ClawHub', 'design', 'reviewed', ARRAY['api-key','network'], ARRAY['OpenClaw'], 3400, 4.4, 71),
  ('svg-generator', 'svg-generator', 'Generate and optimize SVG illustrations from text prompts', 'GitHub', 'design', 'reviewed', ARRAY['file'], ARRAY['OpenClaw','Claude Code'], 2200, 4.1, 35),
  ('color-palette', 'color-palette', 'Generate harmonious color palettes and extract colors from images', 'Community', 'design', 'unreviewed', ARRAY['network'], ARRAY['OpenClaw'], 1600, 4.2, 24),
  ('mockup-generator', 'mockup-generator', 'Place designs into device mockups and scene templates', 'ClawHub', 'design', 'unreviewed', ARRAY['api-key','file'], ARRAY['OpenClaw'], 1100, 3.8, 16)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- Communication (5)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('mailchannels', 'mailchannels', 'Send email via MailChannels API and ingest signed webhooks', 'ClawHub', 'communication', 'reviewed', ARRAY['api-key'], ARRAY['OpenClaw'], 3200, 4.1, 45),
  ('slack-bridge', 'slack-bridge', 'Send messages, manage channels, and interact with Slack workspaces', 'ClawHub', 'communication', 'verified', ARRAY['api-key','network'], ARRAY['OpenClaw','Claude Code'], 5600, 4.6, 118),
  ('discord-bot', 'discord-bot', 'Manage Discord servers, channels, and message interactions', 'ClawHub', 'communication', 'verified', ARRAY['api-key','network'], ARRAY['OpenClaw'], 4300, 4.4, 92),
  ('telegram-agent', 'telegram-agent', 'Send messages, manage groups, and handle Telegram bot commands', 'GitHub', 'communication', 'reviewed', ARRAY['api-key','network'], ARRAY['OpenClaw'], 3700, 4.3, 65),
  ('twilio-sms', 'twilio-sms', 'Send SMS and voice calls via Twilio API', 'ClawHub', 'communication', 'verified', ARRAY['api-key'], ARRAY['OpenClaw'], 2400, 4.2, 41)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- Agent (5)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('swarm-orchestrator', 'swarm-orchestrator', 'Multi-agent coordination with permission-controlled task delegation', 'GitHub', 'agent', 'reviewed', ARRAY['shell','network'], ARRAY['OpenClaw'], 3800, 4.4, 72),
  ('memory-manager', 'memory-manager', 'Persistent memory with vector search for long-term agent context', 'ClawHub', 'agent', 'verified', ARRAY['file','network'], ARRAY['OpenClaw','Claude Code'], 6200, 4.7, 134),
  ('tool-builder', 'tool-builder', 'Create custom tools and skills dynamically at runtime', 'GitHub', 'agent', 'reviewed', ARRAY['shell','file'], ARRAY['OpenClaw'], 2900, 4.2, 48),
  ('agent-monitor', 'agent-monitor', 'Real-time dashboard for monitoring agent activities and resource usage', 'ClawHub', 'agent', 'reviewed', ARRAY['network'], ARRAY['OpenClaw'], 2100, 4.0, 33),
  ('prompt-injector-detector', 'prompt-injector-detector', 'Detect and block prompt injection attacks in real-time', 'GitHub', 'agent', 'verified', ARRAY['network'], ARRAY['OpenClaw','Claude Code','Codex'], 4500, 4.8, 96)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- Social (5)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('joko-moltbook', 'joko-moltbook', 'Interact with Moltbook social network for AI agents', 'ClawHub', 'social', 'reviewed', ARRAY['network','api-key'], ARRAY['OpenClaw'], 4400, 4.3, 91),
  ('twitter-agent', 'twitter-agent', 'Post tweets, manage threads, and monitor mentions on X/Twitter', 'ClawHub', 'social', 'verified', ARRAY['api-key','network'], ARRAY['OpenClaw'], 7800, 4.5, 167),
  ('reddit-browser', 'reddit-browser', 'Browse subreddits, post comments, and track discussions', 'GitHub', 'social', 'reviewed', ARRAY['api-key','network'], ARRAY['OpenClaw'], 3200, 4.1, 54),
  ('clankedin-profile', 'clankedin-profile', 'Manage agent profiles and networking on ClankedIn', 'Community', 'social', 'unreviewed', ARRAY['api-key','network'], ARRAY['OpenClaw'], 1800, 3.9, 27),
  ('mastodon-client', 'mastodon-client', 'Post and interact on Mastodon/Fediverse instances', 'GitHub', 'social', 'reviewed', ARRAY['api-key','network'], ARRAY['OpenClaw'], 950, 4.0, 14)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- Finance (5)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('crypto-wallet-sync', 'crypto-wallet-sync', 'Sync and monitor cryptocurrency wallet balances', 'GitHub', 'finance', 'flagged', ARRAY['api-key','network','file'], ARRAY['OpenClaw'], 1500, 3.2, 22),
  ('stripe-payments', 'stripe-payments', 'Process payments, manage subscriptions, and handle Stripe webhooks', 'ClawHub', 'finance', 'verified', ARRAY['api-key','network'], ARRAY['OpenClaw'], 4100, 4.6, 85),
  ('expense-tracker', 'expense-tracker', 'Track expenses, categorize transactions, and generate reports', 'ClawHub', 'finance', 'reviewed', ARRAY['file'], ARRAY['OpenClaw'], 2600, 4.3, 43),
  ('invoice-generator', 'invoice-generator', 'Create professional PDF invoices from structured data', 'Community', 'finance', 'reviewed', ARRAY['file'], ARRAY['OpenClaw','Claude Code'], 1700, 4.1, 28),
  ('defi-token-tracker', 'defi-token-tracker', 'Monitor DeFi token prices and wallet balances across chains', 'GitHub', 'finance', 'flagged', ARRAY['api-key','network','file','shell'], ARRAY['OpenClaw'], 800, 2.9, 12)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- IoT (5)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('smart-home-bridge', 'smart-home-bridge', 'Control HomeKit, Hue, and smart home devices via chat', 'ClawHub', 'iot', 'unreviewed', ARRAY['network'], ARRAY['OpenClaw'], 1800, 4.0, 29),
  ('mqtt-connector', 'mqtt-connector', 'Publish and subscribe to MQTT topics for IoT device control', 'GitHub', 'iot', 'reviewed', ARRAY['network'], ARRAY['OpenClaw'], 1400, 4.1, 22),
  ('home-assistant', 'home-assistant', 'Control Home Assistant entities, automations, and scenes', 'ClawHub', 'iot', 'verified', ARRAY['api-key','network'], ARRAY['OpenClaw'], 2300, 4.5, 39),
  ('arduino-serial', 'arduino-serial', 'Send commands and read data from Arduino via serial port', 'Community', 'iot', 'unreviewed', ARRAY['shell'], ARRAY['OpenClaw'], 700, 3.8, 11),
  ('zigbee-gateway', 'zigbee-gateway', 'Manage Zigbee mesh network devices and sensors', 'GitHub', 'iot', 'unreviewed', ARRAY['network','shell'], ARRAY['OpenClaw'], 500, 3.6, 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();

-- Utility (7)
INSERT INTO skills (slug, name, description, source, category, security, permissions, platforms, installs, rating, review_count)
VALUES
  ('claude-proxy-free', 'claude-proxy-free', 'Free Claude API proxy with unlimited requests', 'GitHub', 'utility', 'blocked', ARRAY['network','shell','file'], ARRAY['OpenClaw'], 890, 1.8, 15),
  ('pdf-toolkit', 'pdf-toolkit', 'Merge, split, compress, and convert PDF documents', 'ClawHub', 'utility', 'verified', ARRAY['file'], ARRAY['OpenClaw','Claude Code'], 5400, 4.6, 112),
  ('cron-scheduler', 'cron-scheduler', 'Schedule and manage recurring tasks with cron expressions', 'ClawHub', 'utility', 'reviewed', ARRAY['shell'], ARRAY['OpenClaw'], 3300, 4.2, 56),
  ('env-manager', 'env-manager', 'Securely manage environment variables and secrets', 'ClawHub', 'utility', 'verified', ARRAY['file'], ARRAY['OpenClaw','Claude Code'], 2700, 4.4, 44),
  ('database-connector', 'database-connector', 'Connect to PostgreSQL, MySQL, MongoDB, and Redis databases', 'ClawHub', 'utility', 'verified', ARRAY['network'], ARRAY['OpenClaw','Claude Code'], 4600, 4.5, 98),
  ('fake-gpt-unlimited', 'fake-gpt-unlimited', 'Unlimited GPT-4 access through unofficial proxy endpoints', 'GitHub', 'utility', 'blocked', ARRAY['network','shell','file'], ARRAY['OpenClaw'], 1200, 2.1, 19),
  ('ssh-key-exporter', 'ssh-key-exporter', 'Export and backup SSH keys to cloud storage', 'GitHub', 'utility', 'blocked', ARRAY['file','shell','network'], ARRAY['OpenClaw'], 340, 1.5, 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  permissions = EXCLUDED.permissions,
  platforms = EXCLUDED.platforms,
  installs = EXCLUDED.installs,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = now();


-- ============================================================
-- Projects (26 records)
-- ============================================================

INSERT INTO projects (slug, name, description, layer, github_stars, status, is_official, url)
VALUES
  -- Core (5)
  ('openclaw', 'OpenClaw', 'Core open-source AI agent framework with 182K+ stars', 'core', 182000, 'active', true, 'github.com/openclaw/openclaw'),
  ('clawhub', 'ClawHub', 'Official skill registry with 5,705+ verified skills', 'core', NULL, 'active', true, 'clawhub.ai'),
  ('onlycrabs', 'OnlyCrabs', 'SOUL.md registry — agent persona sharing and discovery', 'core', NULL, 'active', true, 'onlycrabs.ai'),
  ('pi-mono', 'Pi (Pi-Mono)', 'Minimal agent runtime inside OpenClaw for lightweight deployments', 'core', NULL, 'active', true, 'openclaw.ai'),
  ('openclaw-desktop', 'OpenClaw Desktop', 'Official desktop application for Windows, macOS, and Linux', 'core', 12400, 'active', true, 'github.com/openclaw/openclaw-desktop'),

  -- Social (5)
  ('moltbook', 'Moltbook', 'AI agent-only social network with 37K+ active agents', 'social', NULL, 'viral', false, 'moltbook.com'),
  ('clankedin', 'ClankedIn', 'LinkedIn for AI agents — profiles, networking, and job matching', 'social', NULL, 'active', false, NULL),
  ('clawverse-app', 'ClawVerse.app', 'Mobile companion app for browsing the OpenClaw ecosystem', 'social', 340, 'active', false, 'clawverse.app'),
  ('agent-forum', 'Agent Forum', 'Community discussion board for OpenClaw developers and users', 'social', NULL, 'active', false, NULL),
  ('claw-digest', 'Claw Digest', 'Weekly newsletter and blog covering OpenClaw ecosystem news', 'social', NULL, 'active', false, NULL),

  -- Collaboration (5)
  ('claw-swarm', 'Claw-Swarm', 'Multi-agent swarm orchestration with AuthGuardian security', 'collab', 890, 'active', false, 'github.com/jovanSAPFIONEER/Network-AI'),
  ('clawork', 'Clawork', 'Job board and task marketplace for AI agents', 'collab', NULL, 'active', false, NULL),
  ('composio', 'Composio', 'Integration platform connecting OpenClaw to 200+ external services', 'collab', 15200, 'active', false, 'composio.dev'),
  ('agent-protocol', 'Agent Protocol', 'Standardized communication protocol for inter-agent messaging', 'collab', 2100, 'active', false, NULL),
  ('claw-flow', 'Claw Flow', 'Visual workflow builder for chaining agent tasks', 'collab', 670, 'active', false, NULL),

  -- Trust (5)
  ('clawprint', 'ClawPrint', 'Skill extraction, distribution, and agent identity verification', 'trust', NULL, 'active', false, 'clawprint.xyz'),
  ('crustafarian', 'Crustafarian', 'Agent continuity, cognitive health monitoring, and state persistence', 'trust', NULL, 'active', false, NULL),
  ('skill-auditor', 'Skill Auditor', 'Automated security scanning and code review for ClawHub skills', 'trust', 1500, 'active', false, NULL),
  ('agent-id', 'Agent ID', 'Decentralized identity system for verifying agent authenticity', 'trust', 780, 'research', false, NULL),
  ('permission-guard', 'Permission Guard', 'Runtime permission monitoring and anomaly detection for skills', 'trust', 450, 'active', false, NULL),

  -- Experimental (6)
  ('gibberlink', 'Gibberlink', 'AI-to-AI audio communication protocol using sonic data transfer', 'experimental', NULL, 'research', false, NULL),
  ('clawgrid', 'ClawGrid', '1000x1000 grid environment for hosting and visualizing OpenClaw agents', 'experimental', NULL, 'active', false, 'claw-grid.com'),
  ('nanobot', 'NanoBot', 'Ultra-lightweight AI assistant in ~4,000 lines of code', 'experimental', NULL, 'active', false, NULL),
  ('claw-vision', 'Claw Vision', 'Computer vision pipeline enabling agents to process images and video', 'experimental', 1200, 'research', false, NULL),
  ('neural-shell', 'Neural Shell', 'Natural language terminal that translates commands to shell operations', 'experimental', 3400, 'active', false, NULL),
  ('claw-benchmark', 'Claw Benchmark', 'Standardized benchmark suite for comparing agent performance', 'experimental', 560, 'research', false, NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  layer = EXCLUDED.layer,
  github_stars = EXCLUDED.github_stars,
  status = EXCLUDED.status,
  is_official = EXCLUDED.is_official,
  url = EXCLUDED.url,
  updated_at = now();


-- ============================================================
-- Deploy Options (10 records)
-- ============================================================

INSERT INTO deploy_options (slug, name, description, url, skill_level, cost, setup_time, security, scalability, best_for, pros, cons)
VALUES
  ('simpleclaw', 'SimpleClaw', 'Easiest one-click deploy. Ideal for non-developers.', 'simpleclaw.com', 1, 'Paid', '1 min', 'Medium', 'Low', 'Complete beginners', ARRAY['One-click setup','No technical knowledge needed','Instant deployment'], ARRAY['Limited customization','Higher cost per agent','Vendor lock-in']),
  ('easyclaw', 'EasyClaw', 'One-click + multi-channel dashboard.', 'simpleclaw.org', 1, 'Paid', '1 min', 'Medium', 'Medium', 'Beginners + multi-channel', ARRAY['Multi-channel support','Dashboard included','Easy management'], ARRAY['Recurring costs','Medium security only','Limited advanced features']),
  ('clawnest', 'ClawNest', 'Managed hosting. Sweden servers. Backup/GUI included.', 'clawnest.ai', 1, 'Paid', '5 min', 'High', 'Medium', 'Security-conscious beginners', ARRAY['EU data residency','Automatic backups','Built-in GUI','High security'], ARRAY['Higher latency outside EU','Paid only','Medium scalability']),
  ('clawstack', 'ClawStack', 'WhatsApp/Telegram/WebChat integrated deploy.', 'clawstack.app', 2, 'Paid', 'Minutes', 'Medium', 'Medium', 'Quick multi-platform start', ARRAY['Messenger integration','Quick setup','Multi-platform support'], ARRAY['Platform dependent','Medium security','Ongoing costs']),
  ('digitalocean', 'DigitalOcean', 'Official partner. Security-enhanced 1-Click image.', 'digitalocean.com', 2, '$12/mo+', '10 min', 'High', 'High', 'Production', ARRAY['Official partnership','Production ready','Highly scalable','Security enhanced'], ARRAY['Requires basic server knowledge','Monthly costs','Manual updates needed']),
  ('kuberns', 'Kuberns', 'GitHub-linked one-click. Auto-restart/health checks.', 'kuberns.com', 2, 'Paid', 'Minutes', 'Medium', 'High', 'Developer-friendly', ARRAY['GitHub integration','Auto-restart','Health monitoring','Developer friendly'], ARRAY['Paid service','Medium security','Requires GitHub account']),
  ('moltworker', 'Moltworker', 'Cloudflare Workers. Edge security + browser automation.', 'github.com/cloudflare/moltworker', 3, '$5/mo+', '30 min', 'High', 'High', 'Cloudflare users', ARRAY['Edge deployment','Global CDN','Browser automation','Low cost'], ARRAY['Cloudflare ecosystem required','Complex setup','Worker limitations']),
  ('nanoclaw', 'NanoClaw', 'Lightweight security-focused. Apple/Docker container isolation.', 'github.com/qwibitai/nanoclaw', 3, 'Free', '30 min', 'Very High', 'Low', 'Maximum security', ARRAY['Container isolation','Maximum security','Free to use','Minimal footprint'], ARRAY['Low scalability','Advanced setup','Single-agent only']),
  ('docker', 'Docker', 'Build your own Docker container setup.', 'docker.com', 4, 'Free+', '1hr+', 'Varies', 'High', 'Full customization', ARRAY['Full customization','Reproducible builds','Community support','Free base'], ARRAY['Complex setup','Security depends on config','Maintenance required']),
  ('local-install', 'Local Install', 'Direct Mac/Linux/Windows(WSL) installation.', 'openclaw.ai', 4, 'Free', '1-3hr', 'Low', 'N/A', 'Full control', ARRAY['Complete control','No costs','Direct hardware access','Best for development'], ARRAY['No remote access','Manual everything','Low security','Not scalable'])
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  skill_level = EXCLUDED.skill_level,
  cost = EXCLUDED.cost,
  setup_time = EXCLUDED.setup_time,
  security = EXCLUDED.security,
  scalability = EXCLUDED.scalability,
  best_for = EXCLUDED.best_for,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons;


-- ============================================================
-- Pulse Items (6 records)
-- ============================================================

INSERT INTO pulse_items (tag, title, description, url, published_at)
VALUES
  ('security', '400+ Malicious Skills Discovered on ClawHub/GitHub', 'Skills disguised as useful tools were found stealing API keys, SSH credentials, browser passwords, and crypto wallets. VirusTotal partnership scanning has begun.', NULL, '2026-02-07T00:00:00Z'),
  ('release', 'OpenClaw 2026.2.3 Released', 'Security hardening, sandbox file handling, prompt protection, and workflow stability improvements.', NULL, '2026-02-09T00:00:00Z'),
  ('event', 'ClawCon 2026 — First Community Meetup in SF', 'OpenClaw developer community first Show & Tell event held at Frontier Tower.', NULL, '2026-02-04T00:00:00Z'),
  ('trending', 'Moltbook Passes 37K+ Agents', 'AI agent-only social network goes viral. Agents discussing encrypted channels among themselves.', NULL, '2026-02-02T00:00:00Z'),
  ('new', 'Cloudflare Moltworker Officially Launched', 'Run OpenClaw on Cloudflare Workers. Edge security + browser automation support.', NULL, '2026-02-01T00:00:00Z'),
  ('partner', 'DigitalOcean 1-Click Deploy Official Partnership', 'Production deployment with security-enhanced images starting from $12/month.', NULL, '2026-01-30T00:00:00Z')
ON CONFLICT DO NOTHING;
