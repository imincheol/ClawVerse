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
-- Projects (29 records)
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

  -- Experimental + recent additions (9)
  ('gibberlink', 'Gibberlink', 'AI-to-AI audio communication protocol using sonic data transfer', 'experimental', NULL, 'research', false, NULL),
  ('clawgrid', 'ClawGrid', '1000x1000 grid environment for hosting and visualizing OpenClaw agents', 'experimental', NULL, 'active', false, 'claw-grid.com'),
  ('nanobot', 'NanoBot', 'Ultra-lightweight AI assistant in ~4,000 lines of code', 'experimental', NULL, 'active', false, NULL),
  ('claw-vision', 'Claw Vision', 'Computer vision pipeline enabling agents to process images and video', 'experimental', 1200, 'research', false, NULL),
  ('neural-shell', 'Neural Shell', 'Natural language terminal that translates commands to shell operations', 'experimental', 3400, 'active', false, NULL),
  ('claw-benchmark', 'Claw Benchmark', 'Standardized benchmark suite for comparing agent performance', 'experimental', 560, 'research', false, NULL),
  ('oc-memory', 'Oc-Memory', 'Long-term memory module for OpenClaw workflows and autonomous agent context.', 'trust', 14, 'active', false, 'github.com/chaos1358/Oc-Memory'),
  ('serverless-openclaw', 'Serverless OpenClaw', 'Serverless deployment template and runtime setup for OpenClaw on cloud functions.', 'collab', 43, 'active', false, 'github.com/serithemage/serverless-openclaw'),
  ('octo', 'Octo', 'Cost reduction toolkit for OpenClaw with prompt caching, model tiering, and optional semantic memory.', 'experimental', 0, 'active', false, 'github.com/trinsiklabs/octo')
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


-- ============================================================
-- Agents (20 records)
-- ============================================================

INSERT INTO agents (slug, name, description, type, role, frameworks, complexity, agent_count, config_format, security, downloads, rating, review_count, source, source_url, tags, author, last_updated)
VALUES
  -- Persona: Researcher (3)
  ('deep-research-analyst', 'Deep Research Analyst', 'Multi-source research agent that synthesizes information from web, academic papers, and databases into structured reports with citations', 'persona', 'researcher', ARRAY['OpenClaw','Claude Code','LangGraph'], 'single', 1, 'markdown', 'verified', 8420, 4.8, 186, 'souls.directory', 'https://souls.directory/deep-research-analyst', ARRAY['research','citations','academic','synthesis'], 'ai-research-lab', '2026-02-15'),
  ('competitive-intel-agent', 'Competitive Intel Agent', 'Monitors competitor activities, pricing changes, and market movements. Generates weekly briefings with actionable insights', 'persona', 'researcher', ARRAY['OpenClaw','CrewAI'], 'single', 1, 'markdown', 'reviewed', 3210, 4.4, 67, 'GitHub', 'https://github.com/agent-templates/competitive-intel', ARRAY['competitive-analysis','market-research','briefing'], 'market-agents', '2026-02-08'),
  ('arxiv-paper-reviewer', 'arXiv Paper Reviewer', 'Reads and critiques academic papers from arXiv, providing structured summaries, methodology analysis, and reproducibility assessment', 'persona', 'researcher', ARRAY['OpenClaw','LangGraph'], 'single', 1, 'markdown', 'reviewed', 2780, 4.6, 52, 'Community', NULL, ARRAY['academic','papers','review','arXiv'], 'scholar-agents', '2026-01-28'),

  -- Persona: Developer (3)
  ('fullstack-engineer', 'Full-Stack Engineer', 'Implements features end-to-end with TypeScript, React, Node.js. Follows TDD, writes clean code, and creates PRs with proper descriptions', 'persona', 'developer', ARRAY['OpenClaw','Claude Code','Codex'], 'single', 1, 'markdown', 'verified', 12350, 4.7, 284, 'OnlyCrabs', 'https://onlycrabs.ai/fullstack-engineer', ARRAY['typescript','react','nodejs','tdd','fullstack'], 'dev-personas', '2026-02-16'),
  ('rust-systems-dev', 'Rust Systems Developer', 'Systems programming specialist focusing on memory safety, performance optimization, and async Rust patterns', 'persona', 'developer', ARRAY['OpenClaw','Claude Code'], 'single', 1, 'markdown', 'verified', 4890, 4.6, 98, 'souls.directory', NULL, ARRAY['rust','systems','performance','async'], 'rustacean-agents', '2026-02-10'),
  ('smart-contract-auditor', 'Smart Contract Auditor', 'Solidity/Vyper smart contract developer and auditor. Identifies vulnerabilities, gas optimizations, and follows OpenZeppelin patterns', 'persona', 'developer', ARRAY['OpenClaw'], 'single', 1, 'markdown', 'reviewed', 2340, 4.3, 41, 'GitHub', NULL, ARRAY['solidity','audit','web3','security'], 'web3-agents', '2026-01-22'),

  -- Persona: Reviewer (2)
  ('senior-code-reviewer', 'Senior Code Reviewer', 'Reviews pull requests with focus on architecture, security, performance, and maintainability. Provides actionable feedback with code suggestions', 'persona', 'reviewer', ARRAY['OpenClaw','Claude Code','Codex'], 'single', 1, 'markdown', 'verified', 9870, 4.8, 213, 'OnlyCrabs', NULL, ARRAY['code-review','architecture','best-practices'], 'review-agents', '2026-02-14'),
  ('technical-writer-reviewer', 'Technical Writing Reviewer', 'Reviews documentation for clarity, accuracy, and completeness. Checks code examples, API references, and suggests improvements', 'persona', 'reviewer', ARRAY['OpenClaw','Claude Code'], 'single', 1, 'markdown', 'reviewed', 1980, 4.4, 35, 'Community', NULL, ARRAY['documentation','writing','review','api-docs'], 'docs-team', '2026-02-01'),

  -- Persona: Writer (2)
  ('technical-blog-writer', 'Technical Blog Writer', 'Writes developer-focused blog posts with code examples, diagrams, and SEO optimization. Supports multiple frameworks and languages', 'persona', 'writer', ARRAY['OpenClaw','CrewAI'], 'single', 1, 'markdown', 'reviewed', 5670, 4.5, 124, 'souls.directory', NULL, ARRAY['blog','content','seo','technical-writing'], 'content-agents', '2026-02-09'),
  ('api-docs-generator', 'API Docs Generator', 'Generates comprehensive API documentation from code. Supports OpenAPI, GraphQL schemas, and creates interactive examples', 'persona', 'writer', ARRAY['OpenClaw','Claude Code'], 'single', 1, 'markdown', 'verified', 4120, 4.6, 87, 'ClawHub', NULL, ARRAY['api','documentation','openapi','graphql'], 'doc-agents', '2026-02-12'),

  -- Persona: Other roles (3)
  ('project-manager-agent', 'Project Manager', 'Breaks down epics into tasks, tracks progress, identifies blockers, and generates sprint reports. Integrates with Jira and Linear', 'persona', 'manager', ARRAY['OpenClaw','CrewAI','AutoGen'], 'single', 1, 'yaml', 'reviewed', 3450, 4.3, 72, 'CrewAI', 'https://marketplace.crewai.com/project-manager', ARRAY['project-management','sprint','jira','linear'], 'pm-agents', '2026-02-06'),
  ('security-penetration-tester', 'Security Penetration Tester', 'Performs automated security assessments on web applications. Checks OWASP Top 10, generates vulnerability reports with remediation steps', 'persona', 'security', ARRAY['OpenClaw','Claude Code'], 'single', 1, 'markdown', 'verified', 6780, 4.7, 156, 'GitHub', 'https://github.com/security-agents/pentest-agent', ARRAY['security','pentest','owasp','vulnerability'], 'sec-agents', '2026-02-13'),
  ('ui-ux-designer', 'UI/UX Designer', 'Creates wireframes, user flows, and design specifications. Generates Figma-compatible component specs and accessibility guidelines', 'persona', 'designer', ARRAY['OpenClaw'], 'single', 1, 'markdown', 'reviewed', 2890, 4.4, 58, 'souls.directory', NULL, ARRAY['design','wireframe','ux','accessibility','figma'], 'design-agents', '2026-01-30'),

  -- Crew Templates (4)
  ('code-review-team', 'Code Review Team', '3-agent team: Security Auditor scans for vulnerabilities, Style Enforcer checks conventions, Performance Analyst identifies bottlenecks', 'crew', 'reviewer', ARRAY['OpenClaw','CrewAI','LangGraph'], 'team', 4, 'yaml', 'verified', 7650, 4.8, 168, 'CrewAI', 'https://marketplace.crewai.com/code-review-team', ARRAY['code-review','security','performance','team'], 'crewai-official', '2026-02-17'),
  ('content-creation-crew', 'Content Creation Crew', '4-agent content pipeline: Researcher gathers data, Writer drafts content, Editor polishes, SEO Specialist optimizes', 'crew', 'writer', ARRAY['CrewAI','OpenClaw'], 'team', 4, 'yaml', 'reviewed', 5340, 4.5, 112, 'CrewAI', 'https://marketplace.crewai.com/content-creation', ARRAY['content','writing','seo','pipeline'], 'crewai-official', '2026-02-11'),
  ('startup-mvp-squad', 'Startup MVP Squad', '5-agent team for rapid prototyping: PM defines scope, Designer creates mockups, Frontend builds UI, Backend builds API, QA tests', 'crew', 'manager', ARRAY['OpenClaw','CrewAI','AutoGen'], 'team', 5, 'yaml', 'reviewed', 4210, 4.4, 89, 'GitHub', 'https://github.com/agent-crews/startup-mvp-squad', ARRAY['startup','mvp','rapid-prototyping','fullstack'], 'agent-crews', '2026-02-05'),
  ('incident-response-team', 'Incident Response Team', '3-agent security team: Detector monitors for anomalies, Analyzer investigates incidents, Responder executes playbooks', 'crew', 'security', ARRAY['OpenClaw','LangGraph'], 'team', 3, 'yaml', 'verified', 3890, 4.7, 82, 'GitHub', 'https://github.com/security-agents/incident-response', ARRAY['incident-response','security','monitoring','playbook'], 'sec-agents', '2026-02-14'),

  -- Workflow Patterns (3)
  ('research-synthesize-pipeline', 'Research-Synthesize Pipeline', 'Sequential workflow: Fan-out to 3-5 parallel researchers, collect results, synthesize into unified report with confidence scores', 'workflow', 'researcher', ARRAY['OpenClaw','LangGraph','Claude Code'], 'pipeline', 6, 'json', 'verified', 6120, 4.7, 134, 'GitHub', 'https://github.com/agent-workflows/research-pipeline', ARRAY['research','parallel','synthesis','pipeline'], 'workflow-labs', '2026-02-16'),
  ('ci-cd-agent-pipeline', 'CI/CD Agent Pipeline', 'Automated deployment workflow: Code Review -> Security Scan -> Build -> Test -> Stage -> Deploy with rollback capability', 'workflow', 'devops', ARRAY['OpenClaw','LangGraph'], 'pipeline', 6, 'yaml', 'reviewed', 3450, 4.5, 74, 'GitHub', NULL, ARRAY['ci-cd','deployment','devops','automation'], 'devops-agents', '2026-02-07'),
  ('evaluator-optimizer-loop', 'Evaluator-Optimizer Loop', 'Iterative improvement pattern: Executor generates output, Evaluator scores quality, loop continues until threshold met', 'workflow', 'general', ARRAY['OpenClaw','LangGraph','AutoGen','CrewAI'], 'pipeline', 2, 'json', 'verified', 5670, 4.6, 121, 'GitHub', 'https://github.com/agent-workflows/eval-optimize', ARRAY['optimization','iterative','quality','pattern'], 'workflow-labs', '2026-02-12')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  type = EXCLUDED.type,
  role = EXCLUDED.role,
  frameworks = EXCLUDED.frameworks,
  complexity = EXCLUDED.complexity,
  agent_count = EXCLUDED.agent_count,
  config_format = EXCLUDED.config_format,
  security = EXCLUDED.security,
  downloads = EXCLUDED.downloads,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  source = EXCLUDED.source,
  source_url = EXCLUDED.source_url,
  tags = EXCLUDED.tags,
  author = EXCLUDED.author,
  last_updated = EXCLUDED.last_updated,
  updated_at = now();


-- ============================================================
-- MCP Servers (30 records)
-- ============================================================

INSERT INTO mcp_servers (slug, name, description, source, source_url, category, security, runtime, tools, downloads, rating, review_count, author, platforms, last_updated)
VALUES
  -- Development (5)
  ('github-mcp', 'GitHub MCP Server', 'Repository management, file operations, issues, PRs, branches, and advanced search via GitHub API', 'Official MCP Registry', 'https://github.com/modelcontextprotocol/servers/tree/main/src/github', 'development', 'verified', 'stdio', 24, 48200, 4.8, 520, 'MCP Team', ARRAY['Claude Code','Cursor','Cline','OpenClaw'], '2026-02-15'),
  ('filesystem-mcp', 'Filesystem MCP Server', 'Secure file operations with configurable access controls — read, write, search, and directory management', 'Official MCP Registry', 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem', 'development', 'verified', 'stdio', 11, 42100, 4.7, 480, 'MCP Team', ARRAY['Claude Code','Cursor','Cline','OpenClaw'], '2026-02-14'),
  ('gitlab-mcp', 'GitLab MCP Server', 'GitLab API integration for repositories, merge requests, pipelines, and issue tracking', 'MCP.so', 'https://mcp.so/server/gitlab-mcp', 'development', 'reviewed', 'stdio', 18, 12400, 4.5, 142, 'Community', ARRAY['Claude Code','Cursor','OpenClaw'], '2026-02-10'),
  ('docker-mcp', 'Docker MCP Server', 'Manage Docker containers, images, volumes, and compose stacks via natural language', 'Smithery', 'https://smithery.ai/server/docker-mcp', 'development', 'reviewed', 'stdio', 15, 9800, 4.4, 98, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-02-08'),
  ('linear-mcp', 'Linear MCP Server', 'Project management with Linear — create issues, manage sprints, track progress', 'Official MCP Registry', 'https://github.com/modelcontextprotocol/servers/tree/main/src/linear', 'development', 'verified', 'stdio', 12, 8600, 4.6, 87, 'MCP Team', ARRAY['Claude Code','Cursor','OpenClaw'], '2026-02-12'),

  -- Database (4)
  ('postgres-mcp', 'PostgreSQL MCP Server', 'Connect to PostgreSQL databases — query, inspect schemas, and manage data with read-only safety', 'Official MCP Registry', 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres', 'database', 'verified', 'stdio', 8, 35600, 4.7, 390, 'MCP Team', ARRAY['Claude Code','Cursor','Cline','OpenClaw'], '2026-02-14'),
  ('sqlite-mcp', 'SQLite MCP Server', 'Local SQLite database operations — create tables, run queries, and analyze data', 'Official MCP Registry', 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite', 'database', 'verified', 'stdio', 6, 28300, 4.6, 310, 'MCP Team', ARRAY['Claude Code','Cursor','Cline','OpenClaw'], '2026-02-13'),
  ('redis-mcp', 'Redis MCP Server', 'Redis key-value operations, pub/sub, and cache management', 'MCP.so', NULL, 'database', 'reviewed', 'stdio', 10, 7200, 4.3, 68, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-01-28'),
  ('supabase-mcp', 'Supabase MCP Server', 'Full Supabase platform access — database, auth, storage, and edge functions', 'Smithery', 'https://smithery.ai/server/supabase-mcp', 'database', 'verified', 'stdio', 16, 15800, 4.7, 172, 'Supabase', ARRAY['Claude Code','Cursor','OpenClaw'], '2026-02-11'),

  -- Productivity (4)
  ('google-drive-mcp', 'Google Drive MCP Server', 'Search, read, and manage Google Drive files and folders', 'Official MCP Registry', 'https://github.com/modelcontextprotocol/servers/tree/main/src/google-drive', 'productivity', 'verified', 'stdio', 8, 22400, 4.5, 248, 'MCP Team', ARRAY['Claude Code','Cursor','OpenClaw'], '2026-02-10'),
  ('notion-mcp', 'Notion MCP Server', 'Read and write Notion pages, databases, and blocks', 'MCP.so', 'https://mcp.so/server/notion-mcp', 'productivity', 'verified', 'stdio', 12, 18600, 4.6, 204, 'Community', ARRAY['Claude Code','Cursor','OpenClaw'], '2026-02-09'),
  ('google-calendar-mcp', 'Google Calendar MCP', 'Manage calendar events, check availability, and schedule meetings', 'Glama', 'https://glama.ai/mcp/servers/google-calendar', 'productivity', 'reviewed', 'stdio', 7, 11200, 4.4, 118, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-02-05'),
  ('obsidian-mcp', 'Obsidian MCP Server', 'Read, write, search, and manage Obsidian vault notes and metadata', 'MCP.so', 'https://mcp.so/server/obsidian-mcp', 'productivity', 'reviewed', 'stdio', 9, 8900, 4.5, 92, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-02-03'),

  -- Browser (3)
  ('playwright-mcp', 'Playwright MCP Server', 'Browser automation via Playwright accessibility tree — the most popular browser MCP server', 'Official MCP Registry', 'https://github.com/microsoft/playwright-mcp', 'browser', 'verified', 'stdio', 15, 52000, 4.9, 620, 'Microsoft', ARRAY['Claude Code','Cursor','Cline','OpenClaw','Codex'], '2026-02-16'),
  ('puppeteer-mcp', 'Puppeteer MCP Server', 'Browser automation and web scraping via Puppeteer with screenshot support', 'Official MCP Registry', 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer', 'browser', 'verified', 'stdio', 10, 18400, 4.5, 196, 'MCP Team', ARRAY['Claude Code','OpenClaw'], '2026-02-08'),
  ('browserbase-mcp', 'Browserbase MCP Server', 'Cloud browser sessions for web automation — no local browser needed', 'Smithery', 'https://smithery.ai/server/browserbase-mcp', 'browser', 'reviewed', 'stdio', 8, 6200, 4.3, 54, 'Browserbase', ARRAY['Claude Code','Cursor','OpenClaw'], '2026-01-30'),

  -- Communication (3)
  ('slack-mcp', 'Slack MCP Server', 'Send messages, manage channels, search history, and interact with Slack workspaces', 'Official MCP Registry', 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack', 'communication', 'verified', 'stdio', 9, 19200, 4.6, 210, 'MCP Team', ARRAY['Claude Code','OpenClaw'], '2026-02-11'),
  ('discord-mcp', 'Discord MCP Server', 'Discord bot operations — send messages, manage servers, and handle interactions', 'MCP.so', NULL, 'communication', 'reviewed', 'stdio', 11, 7800, 4.3, 72, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-01-25'),
  ('email-mcp', 'Email MCP Server', 'Send and read emails via SMTP/IMAP with template support', 'Glama', NULL, 'communication', 'reviewed', 'stdio', 6, 5400, 4.2, 48, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-01-20'),

  -- Cloud & DevOps (3)
  ('aws-mcp', 'AWS MCP Server', 'AWS service management — S3, Lambda, EC2, CloudWatch, and more', 'Smithery', 'https://smithery.ai/server/aws-mcp', 'cloud', 'reviewed', 'stdio', 22, 14200, 4.5, 156, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-02-07'),
  ('kubernetes-mcp', 'Kubernetes MCP Server', 'Manage K8s clusters — pods, deployments, services, and logs', 'MCP.so', NULL, 'devops', 'reviewed', 'stdio', 14, 8100, 4.4, 78, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-02-01'),
  ('cloudflare-mcp', 'Cloudflare MCP Server', 'Manage Cloudflare Workers, KV, R2, D1, and DNS from your agent', 'Official MCP Registry', NULL, 'cloud', 'verified', 'stdio', 18, 11600, 4.6, 124, 'Cloudflare', ARRAY['Claude Code','Cursor','OpenClaw'], '2026-02-13'),

  -- Data & AI (3)
  ('brave-search-mcp', 'Brave Search MCP Server', 'Web and local search using Brave Search API', 'Official MCP Registry', 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search', 'data', 'verified', 'stdio', 2, 31200, 4.6, 342, 'MCP Team', ARRAY['Claude Code','Cursor','Cline','OpenClaw'], '2026-02-14'),
  ('tavily-mcp', 'Tavily Search MCP Server', 'AI-optimized web search with content extraction and summarization', 'Smithery', NULL, 'data', 'reviewed', 'stdio', 3, 9400, 4.5, 96, 'Tavily', ARRAY['Claude Code','Cursor','OpenClaw'], '2026-02-06'),
  ('rag-mcp', 'RAG MCP Server', 'Retrieval-augmented generation with vector search over local documents', 'MCP.so', NULL, 'ai', 'reviewed', 'stdio', 5, 6800, 4.3, 62, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-01-22'),

  -- Security (2)
  ('vault-mcp', 'HashiCorp Vault MCP', 'Secret management — read, write, and rotate secrets from Vault', 'MCP.so', NULL, 'security', 'verified', 'stdio', 7, 5200, 4.6, 44, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-02-04'),
  ('sentry-mcp', 'Sentry MCP Server', 'Error tracking and performance monitoring via Sentry API', 'Smithery', 'https://smithery.ai/server/sentry-mcp', 'security', 'verified', 'stdio', 8, 7600, 4.5, 68, 'Sentry', ARRAY['Claude Code','Cursor','OpenClaw'], '2026-02-09'),

  -- Media (2)
  ('imagemagick-mcp', 'ImageMagick MCP Server', 'Image manipulation — resize, convert, composite, and transform images', 'MCP.so', NULL, 'media', 'reviewed', 'stdio', 8, 4800, 4.2, 38, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-01-18'),
  ('ffmpeg-mcp', 'FFmpeg MCP Server', 'Video and audio processing — transcode, trim, merge, and extract', 'MCP.so', NULL, 'media', 'reviewed', 'stdio', 6, 3600, 4.1, 28, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-01-12'),

  -- Finance (1)
  ('stripe-mcp', 'Stripe MCP Server', 'Payment processing — customers, invoices, subscriptions, and webhooks', 'Smithery', NULL, 'finance', 'verified', 'stdio', 14, 6400, 4.6, 56, 'Community', ARRAY['Claude Code','OpenClaw'], '2026-02-10')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  source = EXCLUDED.source,
  source_url = EXCLUDED.source_url,
  category = EXCLUDED.category,
  security = EXCLUDED.security,
  runtime = EXCLUDED.runtime,
  tools = EXCLUDED.tools,
  downloads = EXCLUDED.downloads,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  author = EXCLUDED.author,
  platforms = EXCLUDED.platforms,
  last_updated = EXCLUDED.last_updated,
  updated_at = now();


-- ============================================================
-- Plugins (20 records)
-- ============================================================

INSERT INTO plugins (slug, name, description, type, source, source_url, security, downloads, rating, review_count, author, platforms, last_updated)
VALUES
  -- Channel Plugins (5)
  ('whatsapp-channel', 'WhatsApp Channel', 'Connect OpenClaw agents to WhatsApp Business API — send and receive messages, media, and templates', 'channel', 'ClawHub', NULL, 'verified', 18400, 4.7, 198, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-14'),
  ('telegram-channel', 'Telegram Channel', 'Full Telegram bot integration — messages, inline keyboards, groups, and media', 'channel', 'ClawHub', NULL, 'verified', 15200, 4.6, 168, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-12'),
  ('discord-channel', 'Discord Channel', 'Discord bot plugin — slash commands, threads, embeds, and voice channel support', 'channel', 'ClawHub', NULL, 'verified', 12800, 4.5, 142, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-10'),
  ('slack-channel', 'Slack Channel', 'Slack app integration — messages, threads, reactions, and slash commands', 'channel', 'ClawHub', NULL, 'verified', 11200, 4.6, 128, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-08'),
  ('webchat-channel', 'WebChat Channel', 'Embeddable web chat widget with customizable themes and file upload support', 'channel', 'ClawHub', NULL, 'verified', 9800, 4.4, 102, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-06'),

  -- Tool Plugins (5)
  ('code-interpreter', 'Code Interpreter', 'Execute Python, JavaScript, and shell code in sandboxed environments with file I/O', 'tool', 'ClawHub', NULL, 'verified', 22600, 4.8, 246, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-15'),
  ('web-browser-tool', 'Web Browser Tool', 'Browse the web, extract content, take screenshots, and fill forms', 'tool', 'ClawHub', NULL, 'reviewed', 16400, 4.5, 178, 'Community', ARRAY['OpenClaw'], '2026-02-11'),
  ('file-manager', 'File Manager', 'Advanced file operations — upload, download, convert, compress, and share files', 'tool', 'ClawHub', NULL, 'verified', 14200, 4.6, 156, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-09'),
  ('api-connector', 'API Connector', 'Generic REST/GraphQL API plugin — define endpoints and let agents call external services', 'tool', 'GitHub', 'https://github.com/openclaw-plugins/api-connector', 'reviewed', 8800, 4.3, 92, 'Community', ARRAY['OpenClaw'], '2026-02-04'),
  ('database-tool', 'Database Tool', 'Connect to PostgreSQL, MySQL, MongoDB — run queries and manage data from chat', 'tool', 'ClawHub', NULL, 'reviewed', 7600, 4.4, 78, 'Community', ARRAY['OpenClaw'], '2026-01-28'),

  -- Provider Plugins (5)
  ('openai-provider', 'OpenAI Provider', 'Use GPT-4o, GPT-4.1, o3 models as the AI backend for OpenClaw agents', 'provider', 'ClawHub', NULL, 'verified', 28400, 4.7, 312, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-16'),
  ('anthropic-provider', 'Anthropic Provider', 'Use Claude 4.5 Sonnet, Claude 4.6 Opus as the AI backend', 'provider', 'ClawHub', NULL, 'verified', 24600, 4.8, 278, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-16'),
  ('google-provider', 'Google AI Provider', 'Use Gemini 3 Flash/Pro models as the AI backend', 'provider', 'ClawHub', NULL, 'verified', 16800, 4.5, 182, 'OpenClaw Team', ARRAY['OpenClaw'], '2026-02-14'),
  ('ollama-provider', 'Ollama Provider', 'Run local LLMs via Ollama — Llama, Mistral, Qwen, DeepSeek and more', 'provider', 'ClawHub', NULL, 'verified', 19200, 4.6, 208, 'Community', ARRAY['OpenClaw'], '2026-02-12'),
  ('groq-provider', 'Groq Provider', 'Ultra-fast inference with Groq LPU — Llama and Mixtral at blazing speed', 'provider', 'ClawHub', NULL, 'verified', 12400, 4.5, 134, 'Community', ARRAY['OpenClaw'], '2026-02-08'),

  -- Memory Plugins (5)
  ('qdrant-memory', 'Qdrant Memory', 'Vector-based long-term memory using Qdrant — semantic search over conversation history', 'memory', 'ClawHub', NULL, 'verified', 8600, 4.6, 94, 'Community', ARRAY['OpenClaw'], '2026-02-10'),
  ('pinecone-memory', 'Pinecone Memory', 'Cloud-native vector memory with Pinecone — scalable semantic retrieval', 'memory', 'ClawHub', NULL, 'verified', 7200, 4.5, 78, 'Community', ARRAY['OpenClaw'], '2026-02-06'),
  ('chromadb-memory', 'ChromaDB Memory', 'Local vector memory using ChromaDB — no cloud dependency, fast embedding search', 'memory', 'GitHub', 'https://github.com/openclaw-plugins/chroma-memory', 'reviewed', 5800, 4.3, 54, 'Community', ARRAY['OpenClaw'], '2026-01-25'),
  ('redis-memory', 'Redis Memory', 'Redis-backed conversation memory with TTL and tagging support', 'memory', 'ClawHub', NULL, 'reviewed', 4600, 4.2, 42, 'Community', ARRAY['OpenClaw'], '2026-01-20'),
  ('sqlite-memory', 'SQLite Memory', 'Lightweight local memory using SQLite with FTS5 full-text search', 'memory', 'GitHub', 'https://github.com/openclaw-plugins/sqlite-memory', 'reviewed', 3400, 4.1, 32, 'Community', ARRAY['OpenClaw'], '2026-01-15')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  type = EXCLUDED.type,
  source = EXCLUDED.source,
  source_url = EXCLUDED.source_url,
  security = EXCLUDED.security,
  downloads = EXCLUDED.downloads,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  author = EXCLUDED.author,
  platforms = EXCLUDED.platforms,
  last_updated = EXCLUDED.last_updated,
  updated_at = now();
