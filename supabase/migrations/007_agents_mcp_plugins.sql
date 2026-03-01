-- Migration 007: Add agents, MCP servers, and plugins tables
-- Extends Phase 2 to cover all content types added since initial schema

-- === Agents (persona, crew, workflow templates) ===
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('persona', 'crew', 'workflow')),
  role TEXT NOT NULL,
  frameworks TEXT[] DEFAULT '{}',
  complexity TEXT NOT NULL CHECK (complexity IN ('single', 'team', 'pipeline')),
  agent_count INTEGER DEFAULT 1,
  config_format TEXT DEFAULT 'markdown' CHECK (config_format IN ('markdown', 'yaml', 'json')),
  security TEXT DEFAULT 'unreviewed',
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  source TEXT NOT NULL,
  source_url TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT,
  last_updated DATE,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agents_slug ON agents(slug);
CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(type);
CREATE INDEX IF NOT EXISTS idx_agents_role ON agents(role);
CREATE INDEX IF NOT EXISTS idx_agents_security ON agents(security);
CREATE INDEX IF NOT EXISTS idx_agents_downloads ON agents(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_agents_search ON agents USING GIN(search_vector);

-- === MCP Servers ===
CREATE TABLE IF NOT EXISTS mcp_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  source_url TEXT,
  category TEXT NOT NULL,
  security TEXT DEFAULT 'unreviewed',
  runtime TEXT DEFAULT 'stdio' CHECK (runtime IN ('stdio', 'sse', 'streamable-http')),
  tools INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  author TEXT,
  platforms TEXT[] DEFAULT '{}',
  last_updated DATE,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mcp_slug ON mcp_servers(slug);
CREATE INDEX IF NOT EXISTS idx_mcp_category ON mcp_servers(category);
CREATE INDEX IF NOT EXISTS idx_mcp_security ON mcp_servers(security);
CREATE INDEX IF NOT EXISTS idx_mcp_downloads ON mcp_servers(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_mcp_search ON mcp_servers USING GIN(search_vector);

-- === Plugins ===
CREATE TABLE IF NOT EXISTS plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('channel', 'tool', 'provider', 'memory')),
  source TEXT NOT NULL,
  source_url TEXT,
  security TEXT DEFAULT 'unreviewed',
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  author TEXT,
  platforms TEXT[] DEFAULT '{}',
  last_updated DATE,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plugins_slug ON plugins(slug);
CREATE INDEX IF NOT EXISTS idx_plugins_type ON plugins(type);
CREATE INDEX IF NOT EXISTS idx_plugins_security ON plugins(security);
CREATE INDEX IF NOT EXISTS idx_plugins_downloads ON plugins(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_plugins_search ON plugins USING GIN(search_vector);

-- === RLS Policies ===

-- Agents: public read, service role write
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "agents_public_read" ON agents FOR SELECT USING (true);
CREATE POLICY "agents_service_write" ON agents FOR ALL USING (auth.role() = 'service_role');

-- MCP Servers: public read, service role write
ALTER TABLE mcp_servers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mcp_public_read" ON mcp_servers FOR SELECT USING (true);
CREATE POLICY "mcp_service_write" ON mcp_servers FOR ALL USING (auth.role() = 'service_role');

-- Plugins: public read, service role write
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plugins_public_read" ON plugins FOR SELECT USING (true);
CREATE POLICY "plugins_service_write" ON plugins FOR ALL USING (auth.role() = 'service_role');

-- === Updated At Triggers ===
CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER mcp_servers_updated_at
  BEFORE UPDATE ON mcp_servers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER plugins_updated_at
  BEFORE UPDATE ON plugins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- === Add full-text search vector to deploy_options (was missing) ===
ALTER TABLE deploy_options ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B')
) STORED;

CREATE INDEX IF NOT EXISTS idx_deploy_search ON deploy_options USING GIN(search_vector);
