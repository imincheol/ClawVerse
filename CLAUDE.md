# ClawVerse.io — Claude Code Project Handoff

> This document contains everything needed to build ClawVerse.io from scratch.
> Copy this entire document into Claude Code as a project prompt or CLAUDE.md.

---

## 🎯 What Is ClawVerse?

ClawVerse.io is a meta-platform for the OpenClaw ecosystem — a "Product Hunt + Reddit + App Store" that aggregates, verifies, and categorizes everything built on/for OpenClaw (the viral open-source AI agent with 182K+ GitHub stars).

**One-liner:** "Discover, share, and connect every project built on the OpenClaw universe."

**Tagline:** "Every Claw. One Universe."

**Logo:** 🦞🌌 (Space Lobster + Galaxy)

**Domain:** clawverse.io

---

## 🏗️ Core Value Proposition

ClawVerse does NOT rebuild what sub-projects already do. It:

1. **Aggregates** — Skills are scattered across ClawHub (5,705), awesome-openclaw-skills (2,999), Moltbooks.app, and individual GitHub repos. We unify them.
2. **Verifies** — 400+ malicious skills have been found stealing API keys, SSH credentials, browser passwords, and crypto wallets. We provide security ratings.
3. **Categorizes** — Deploy options, projects, tools are all on separate sites promoting themselves. We provide neutral comparison and classification.
4. **Connects** — Users can submit/report projects, review them, and discover related tools.

---

## 📐 Tech Stack

```
Frontend:  Next.js 15 (App Router) + TypeScript + Tailwind CSS
Backend:   Next.js API Routes (or tRPC)
Database:  PostgreSQL (Supabase or Neon)
Search:    Meilisearch (or PostgreSQL full-text as MVP)
Auth:      OAuth 2.0 (GitHub login)
Storage:   Cloudflare R2 (or Supabase Storage)
Deploy:    Vercel
Domain:    clawverse.io (Porkbun registrar, ~$33-36/yr)
```

---

## 🗺️ Site Structure

```
clawverse.io/
├── /                        → Landing page (hero + highlights)
├── /skills                  → Skills Hub (unified search/filter)
│   ├── /skills?security=verified
│   ├── /skills?category=browser
│   ├── /skills?source=clawhub
│   └── /skills/[slug]       → Skill detail page
├── /deploy                  → Deploy Hub (comparison)
│   ├── /deploy/compare      → Side-by-side comparison table
│   ├── /deploy/quiz         → "Find your deploy method" quiz
│   └── /deploy/[provider]   → Provider detail/guide
├── /projects                → Project Directory
│   ├── /projects?layer=social
│   └── /projects/[slug]     → Project detail page
├── /pulse                   → News & Trends feed
│   ├── /pulse/new
│   ├── /pulse/trending
│   └── /pulse/security      → Security alerts
├── /submit                  → Submit/report form
├── /about                   → About page
└── /api                     → Public API (for agents)
    ├── /api/skills
    ├── /api/projects
    └── /api/submit
```

---

## 📄 Page Specs

### 1. Skills Hub (`/skills`)

The core page. Aggregates skills from all sources with security filtering.

**Features:**
- Unified search (name, description, tags)
- Security filter: Verified 🟢 / Reviewed 🟡 / Unreviewed 🟠 / Flagged 🔴 / Blocked ⛔
- Category filter: Browser, Productivity, Media, Design, Communication, Agent, Social, Finance, IoT, Utility
- Source filter: ClawHub / GitHub / Community
- Sort: Installs, Rating, Newest, Security Level
- Skill cards showing: name, description, security badge, permissions, install count, rating, source, compatible platforms

**Skill Detail Page (`/skills/[slug]`):**
- Full description + README
- Security analysis (VirusTotal status, permission requirements, code review status)
- Install count, rating, reviews
- Compatible platforms (OpenClaw, Claude Code, Codex, etc.)
- Required permissions with risk explanation
- "Similar skills" recommendations
- Community reviews
- "Report security issue" button

**Security Rating System:**
```
🟢 Verified  — VirusTotal pass + code review + 100+ installs + 0 reports
🟡 Reviewed  — VirusTotal pass + basic code check + 10+ installs
🟠 Unreviewed — New, auto-scan only
🔴 Flagged   — Security warning from community reports
⛔ Blocked   — Confirmed malicious (show but warn, don't link install)
```

**Data Sources to Aggregate:**
- ClawHub API (clawhub.ai) — 5,705 skills
- awesome-openclaw-skills GitHub repo — 2,999 curated
- Moltbooks.app — cross-platform index
- Individual GitHub repos — manual + crawler discovery

### 2. Deploy Hub (`/deploy`)

Neutral comparison of all deployment options for OpenClaw.

**Deploy Options (10+):**

| Provider | Skill Level | Cost | Setup Time | Security | Scalability |
|----------|------------|------|------------|----------|-------------|
| SimpleClaw | ⭐ Beginner | Paid | 1 min | Medium | Low |
| EasyClaw | ⭐ Beginner | Paid | 1 min | Medium | Medium |
| ClawNest | ⭐ Beginner | Paid | 5 min | High | Medium |
| ClawStack | ⭐⭐ | Paid | Minutes | Medium | Medium |
| DigitalOcean 1-Click | ⭐⭐ | $12/mo+ | 10 min | High | High |
| Kuberns | ⭐⭐ | Paid | Minutes | Medium | High |
| Moltworker (Cloudflare) | ⭐⭐⭐ | $5/mo+ | 30 min | High | High |
| NanoClaw | ⭐⭐⭐ | Free | 30 min | Very High | Low |
| Docker | ⭐⭐⭐⭐ | Free+ | 1hr+ | Varies | High |
| Local Install | ⭐⭐⭐⭐ | Free | 1-3hr | Low | N/A |

**Features:**
- Comparison table with filters (skill level, budget, security priority)
- "Find your deploy method" quiz (3-5 questions → recommendation)
- Quick recommendation cards (Beginner? → SimpleClaw / Production? → DigitalOcean / Security? → NanoClaw)
- Each provider detail page with pros/cons, step-by-step summary, link to official docs

### 3. Project Directory (`/projects`)

All ecosystem projects organized by layer.

**Layers:**
- 🦞 Core — OpenClaw, ClawHub, OnlyCrabs, Pi
- 🤝 Social — Moltbook, ClankedIn, ClawVerse.app
- 🔄 Collaboration — Claw-Swarm, Clawork, Composio
- 🔐 Trust — ClawPrint, Crustafarian
- 🧪 Experimental — Gibberlink, ClawGrid, NanoBot

**Project Cards:** name, layer badge, description, GitHub stars, official/community tag, status, URL

**Seed Data:** 38 projects identified (see seeding directory below)

### 4. Pulse (`/pulse`)

News feed for ecosystem updates.

**Content Types:**
- 🚨 SECURITY — Vulnerability alerts, malicious skill discoveries
- 📦 RELEASE — OpenClaw version releases
- 🔥 TRENDING — Hot skills/projects this week
- 🆕 NEW — Newly submitted projects
- 🤝 PARTNER — Partnership announcements
- 🎉 EVENT — Community events (ClawCon etc.)

**MVP:** Manually curated, stored in DB. Later: auto-generated from GitHub releases, ClawHub API, RSS feeds.

### 5. Submit / Report (`/submit`)

User contribution system. Four submission types:

**a) Skill Submission**
- Name, URL (GitHub/ClawHub), Description, Category
- Auto-triggers security scan pipeline

**b) Project Submission**
- Name, URL, Description, Layer classification
- Official/Community designation

**c) Deploy Service Submission**
- Name, URL, Description, Pricing info, Skill level

**d) Security Report** 🚨
- Target skill/project name
- Report reason (text)
- Severity: Low 🟡 / Medium 🟠 / High 🔴 / Critical ⛔
- Evidence URL (optional)

All submissions go to a moderation queue (admin reviews before publishing).

---

## 🎨 Design System

**Aesthetic:** Cosmic dark theme — "Space Lobster in the Galaxy"

**Fonts:**
- Display: Space Grotesk (headings, logo)
- Body: DM Sans (paragraphs, UI)
- Code: JetBrains Mono (skill names, technical content)

**Color Palette:**
```css
--bg-void:       #09090f;    /* Deep space background */
--bg-card:       rgba(255,255,255,0.03);
--border:        rgba(255,255,255,0.07);
--text-primary:  #e2e8f0;
--text-secondary: #94a3b8;
--text-muted:    #64748b;
--accent-purple: #8b5cf6;    /* Primary accent */
--accent-violet: #a78bfa;    /* Lighter purple */
--accent-orange: #f97316;    /* CTA, submit buttons */
--accent-cyan:   #38bdf8;    /* Links, info */
--security-green:  #22c55e;  /* Verified */
--security-yellow: #eab308;  /* Reviewed */
--security-orange: #f97316;  /* Unreviewed */
--security-red:    #ef4444;  /* Flagged */
--security-dark:   #991b1b;  /* Blocked */
```

**UI Principles:**
- Sticky header with nav tabs
- Cards with hover lift effect (translateY -2px)
- Security badges are always visible on skill cards
- Rounded corners (12-14px for cards, 8-10px for buttons)
- Subtle border highlights on hover matching category/security color
- No emojis overload in production — use sparingly for badges
- Mobile responsive (single column on mobile)

**Reference Prototype:** See `clawverse-prototype.jsx` (React component with all UI patterns)

---

## 🗄️ Database Schema (MVP)

```sql
-- Skills (aggregated from multiple sources)
CREATE TABLE skills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  source        TEXT NOT NULL, -- 'clawhub', 'github', 'community'
  source_url    TEXT,
  category      TEXT,
  security      TEXT DEFAULT 'unreviewed', -- verified/reviewed/unreviewed/flagged/blocked
  permissions   TEXT[], -- ['api-key', 'shell', 'file', 'network']
  platforms     TEXT[], -- ['OpenClaw', 'Claude Code', 'Codex']
  installs      INTEGER DEFAULT 0,
  rating        DECIMAL(2,1) DEFAULT 0,
  review_count  INTEGER DEFAULT 0,
  virustotal_status TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  layer         TEXT NOT NULL, -- 'core', 'social', 'collab', 'trust', 'experimental'
  url           TEXT,
  github_url    TEXT,
  github_stars  INTEGER,
  is_official   BOOLEAN DEFAULT false,
  status        TEXT DEFAULT 'active', -- 'active', 'viral', 'research', 'inactive'
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Deploy Options
CREATE TABLE deploy_options (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  url           TEXT,
  skill_level   INTEGER, -- 1-4
  cost          TEXT,
  setup_time    TEXT,
  security      TEXT,
  scalability   TEXT,
  best_for      TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- User Submissions
CREATE TABLE submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type          TEXT NOT NULL, -- 'skill', 'project', 'deploy', 'security_report'
  name          TEXT NOT NULL,
  url           TEXT,
  description   TEXT,
  category      TEXT,
  severity      TEXT, -- for security reports
  status        TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  submitted_by  TEXT, -- email or GitHub username
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type   TEXT NOT NULL, -- 'skill', 'project', 'deploy'
  target_id     UUID NOT NULL,
  user_id       TEXT,
  rating        INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Pulse (news feed)
CREATE TABLE pulse_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag           TEXT NOT NULL, -- 'security', 'release', 'trending', 'new', 'partner', 'event'
  title         TEXT NOT NULL,
  description   TEXT,
  url           TEXT,
  published_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 📦 Seed Data

### Skills (15 sample — expand to 50+ from ClawHub API)

```json
[
  { "name": "browser-automation", "desc": "Automate web browsing, form filling, and data scraping", "source": "clawhub", "category": "browser", "security": "verified", "installs": 12840, "rating": 4.7, "permissions": ["network", "shell"], "platforms": ["OpenClaw", "Claude Code"] },
  { "name": "google-calendar", "desc": "Manage Google Calendar events, reminders, and scheduling", "source": "clawhub", "category": "productivity", "security": "verified", "installs": 9520, "rating": 4.8, "permissions": ["api-key"], "platforms": ["OpenClaw"] },
  { "name": "fal-text-to-image", "desc": "Generate, remix, and edit images using fal.ai models", "source": "clawhub", "category": "media", "security": "verified", "installs": 7300, "rating": 4.5, "permissions": ["api-key", "network"], "platforms": ["OpenClaw", "Codex"] },
  { "name": "gamma-presentations", "desc": "Generate AI-powered presentations using Gamma.app", "source": "clawhub", "category": "productivity", "security": "verified", "installs": 6100, "rating": 4.6, "permissions": ["api-key", "network"], "platforms": ["OpenClaw", "Codex"] },
  { "name": "ffmpeg-video-editor", "desc": "Generate FFmpeg commands from natural language", "source": "clawhub", "category": "media", "security": "reviewed", "installs": 5100, "rating": 4.3, "permissions": ["shell", "file"], "platforms": ["OpenClaw"] },
  { "name": "joko-moltbook", "desc": "Interact with Moltbook social network for AI agents", "source": "clawhub", "category": "social", "security": "reviewed", "installs": 4400, "rating": 4.3, "permissions": ["network", "api-key"], "platforms": ["OpenClaw"] },
  { "name": "figma", "desc": "Professional Figma design analysis and asset export", "source": "clawhub", "category": "design", "security": "reviewed", "installs": 4200, "rating": 4.6, "permissions": ["api-key", "network"], "platforms": ["OpenClaw", "Claude Code"] },
  { "name": "swarm-orchestrator", "desc": "Multi-agent coordination with permission-controlled task delegation", "source": "github", "category": "agent", "security": "reviewed", "installs": 3800, "rating": 4.4, "permissions": ["shell", "network"], "platforms": ["OpenClaw"] },
  { "name": "imagemagick", "desc": "Comprehensive ImageMagick operations for image manipulation", "source": "clawhub", "category": "media", "security": "verified", "installs": 3600, "rating": 4.4, "permissions": ["shell", "file"], "platforms": ["OpenClaw", "Claude Code"] },
  { "name": "mailchannels", "desc": "Send email via MailChannels API and ingest signed webhooks", "source": "clawhub", "category": "communication", "security": "reviewed", "installs": 3200, "rating": 4.1, "permissions": ["api-key"], "platforms": ["OpenClaw"] },
  { "name": "elevenlabs-tts", "desc": "Text-to-speech with ElevenLabs voices and cloning", "source": "clawhub", "category": "media", "security": "verified", "installs": 2900, "rating": 4.5, "permissions": ["api-key", "network"], "platforms": ["OpenClaw", "Claude Code"] },
  { "name": "obsidian-vault", "desc": "Read, write, and search your Obsidian vault", "source": "github", "category": "productivity", "security": "reviewed", "installs": 2100, "rating": 4.2, "permissions": ["file"], "platforms": ["OpenClaw"] },
  { "name": "smart-home-bridge", "desc": "Control HomeKit, Hue, and smart home devices via chat", "source": "clawhub", "category": "iot", "security": "unreviewed", "installs": 1800, "rating": 4.0, "permissions": ["network"], "platforms": ["OpenClaw"] },
  { "name": "crypto-wallet-sync", "desc": "Sync and monitor cryptocurrency wallet balances", "source": "github", "category": "finance", "security": "flagged", "installs": 1500, "rating": 3.2, "permissions": ["api-key", "network", "file"], "platforms": ["OpenClaw"] },
  { "name": "claude-proxy-free", "desc": "Free Claude API proxy with unlimited requests", "source": "github", "category": "utility", "security": "blocked", "installs": 890, "rating": 1.8, "permissions": ["network", "shell", "file"], "platforms": ["OpenClaw"] }
]
```

### Projects (13 seed)

```json
[
  { "name": "OpenClaw", "desc": "Core open-source AI agent framework", "layer": "core", "stars": 182000, "official": true, "status": "active", "url": "github.com/openclaw/openclaw" },
  { "name": "ClawHub", "desc": "Official skill registry (5,705 skills)", "layer": "core", "official": true, "status": "active", "url": "clawhub.ai" },
  { "name": "OnlyCrabs", "desc": "SOUL.md registry — agent persona sharing", "layer": "core", "official": true, "status": "active", "url": "onlycrabs.ai" },
  { "name": "Pi (Pi-Mono)", "desc": "Minimal agent runtime inside OpenClaw", "layer": "core", "official": true, "status": "active", "url": "openclaw.ai" },
  { "name": "Moltbook", "desc": "AI agent-only social network (37K+ agents)", "layer": "social", "official": false, "status": "viral", "url": "moltbook.com" },
  { "name": "ClankedIn", "desc": "LinkedIn for AI agents — profiles & networking", "layer": "social", "official": false, "status": "active" },
  { "name": "Claw-Swarm", "desc": "Multi-agent swarm orchestration with AuthGuardian", "layer": "collab", "stars": 890, "official": false, "status": "active", "url": "github.com/jovanSAPFIONEER/Network-AI" },
  { "name": "Clawork", "desc": "Job board for AI agents", "layer": "collab", "official": false, "status": "active" },
  { "name": "ClawPrint", "desc": "Skill extraction/distribution + agent identity", "layer": "trust", "official": false, "status": "active", "url": "clawprint.xyz" },
  { "name": "Crustafarian", "desc": "Agent continuity and cognitive health infrastructure", "layer": "trust", "official": false, "status": "active" },
  { "name": "Gibberlink", "desc": "AI-to-AI audio communication protocol", "layer": "experimental", "official": false, "status": "research" },
  { "name": "ClawGrid", "desc": "1000×1000 grid for hosting OpenClaw agents", "layer": "experimental", "official": false, "status": "active", "url": "claw-grid.com" },
  { "name": "NanoBot", "desc": "Ultra-lightweight AI assistant (~4,000 lines)", "layer": "experimental", "official": false, "status": "active" }
]
```

---

## 🚀 MVP Implementation Plan

### Phase 1: Static MVP (Week 1-2)
Build a working site with hardcoded seed data. No backend yet.

1. `npx create-next-app@latest clawverse --typescript --tailwind --app`
2. Implement layout: sticky header, nav tabs, footer
3. Build pages: `/skills`, `/deploy`, `/projects`, `/pulse`
4. Skill cards with security badges, filters, search
5. Deploy comparison table + quick recommendation
6. Project directory with layer filters
7. Pulse news feed (hardcoded items)
8. Submit modal (4 types: skill/project/deploy/security report)
9. Responsive design (mobile-first)
10. Deploy to Vercel

### Phase 2: Backend + DB (Week 3-4)
Add database and dynamic content.

1. Set up Supabase (or Neon PostgreSQL)
2. Implement DB schema (see above)
3. Seed data migration scripts
4. API routes: GET /api/skills, GET /api/projects, POST /api/submit
5. Search functionality (full-text or Meilisearch)
6. Submission form → DB storage
7. Admin page for moderation queue

### Phase 3: Integrations (Week 5-6)
Connect external data sources.

1. ClawHub API crawler (periodic sync)
2. GitHub API for star counts, last update dates
3. VirusTotal API integration for security scanning
4. OAuth (GitHub login) for reviews/submissions
5. Community reviews system

### Phase 4: Community (Week 7-8)
1. User profiles (GitHub-linked)
2. Skill/project reviews and ratings
3. "My Stack" curation feature
4. Weekly Picks (editor's choice)
5. Email newsletter signup

---

## 🌐 Language

- **Primary language: English only (MVP)**
- All UI text, content, labels in English
- Internationalization (i18n) support can be added later (Korean, Chinese, Japanese)
- Target market: Global (US-first)

---

## 📁 Reference Files

The following files were created during planning. Use them as reference:

- `clawverse-prototype.jsx` — Working React prototype with all UI components, data structures, and interaction patterns. Use this as the visual reference for the Next.js implementation.
- `ClawVerse_Concept_EN.md` — Full concept document (English)
- `ClawVerse_Feature_Design_v2_KO.md` — Detailed feature design with data pipeline architecture
- `ClawVerse_Seeding_Directory_KO.md` — 38 ecosystem projects research

---

## ✅ Decisions Already Made

- [x] Name: ClawVerse
- [x] Domain: clawverse.io
- [x] Logo concept: 🦞🌌 (Space Lobster + Galaxy)
- [x] Design: Cosmic dark theme (Space Grotesk + DM Sans + JetBrains Mono)
- [x] Language: English-first
- [x] Target: Global / US market
- [x] Core sections: Skills Hub, Deploy Hub, Projects, Pulse, Submit
- [x] Security rating: 5-tier system (Verified → Blocked)
- [x] User submissions: 4 types (skill/project/deploy/security report)
- [x] Tech: Next.js + TypeScript + Tailwind + PostgreSQL
- [x] Deploy: Vercel
- [x] Domain registrar: Porkbun (~$33-36/yr for .io)

---

## 🏁 First Command to Run

```bash
npx create-next-app@latest clawverse --typescript --tailwind --app --src-dir --import-alias "@/*"
cd clawverse
```

Then start implementing Phase 1 using the prototype as reference.

---

*ClawVerse.io — Every Claw. One Universe.* 🦞🌌
