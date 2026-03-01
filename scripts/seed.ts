/**
 * Seed script — populates Supabase with data from src/data/*.ts
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { SKILLS } from "../src/data/skills";
import { PROJECTS } from "../src/data/projects";
import { DEPLOY_OPTIONS } from "../src/data/deploy";
import { PULSE_ITEMS } from "../src/data/pulse";
import { AGENTS } from "../src/data/agents";
import { MCP_SERVERS } from "../src/data/mcp-servers";
import { PLUGINS } from "../src/data/plugins";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedSkills() {
  console.log(`Seeding ${SKILLS.length} skills...`);
  const rows = SKILLS.map((s) => ({
    slug: s.slug,
    name: s.name,
    description: s.desc,
    source: s.source,
    category: s.category,
    security: s.security,
    permissions: s.permissions,
    platforms: s.platforms,
    installs: s.installs,
    rating: s.rating,
    review_count: s.reviews,
    virustotal_status: s.virustotal_status || null,
    github_url: s.githubUrl || null,
    protocols: s.protocols || [],
    last_updated: s.lastUpdated || null,
    maintainer_activity: s.maintainerActivity || "active",
    sources: s.sources ? JSON.stringify(s.sources) : "[]",
  }));

  const { error } = await supabase
    .from("skills")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Skills seed error:", error.message);
  } else {
    console.log(`  ✓ ${rows.length} skills seeded`);
  }
}

async function seedProjects() {
  console.log(`Seeding ${PROJECTS.length} projects...`);
  const rows = PROJECTS.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.desc,
    layer: p.layer,
    url: p.url,
    github_stars: p.stars,
    is_official: p.official,
    status: p.status,
  }));

  const { error } = await supabase
    .from("projects")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Projects seed error:", error.message);
  } else {
    console.log(`  ✓ ${rows.length} projects seeded`);
  }
}

async function seedDeployOptions() {
  console.log(`Seeding ${DEPLOY_OPTIONS.length} deploy options...`);
  const rows = DEPLOY_OPTIONS.map((d) => ({
    slug: d.slug,
    name: d.name,
    description: d.desc,
    url: d.url,
    skill_level: d.level,
    cost: d.cost,
    setup_time: d.setup,
    security: d.security,
    scalability: d.scalability,
    best_for: d.bestFor,
    pros: d.pros,
    cons: d.cons,
    features: d.features || [],
    setup_steps: d.setupSteps || [],
    alternatives: d.alternatives || [],
  }));

  const { error } = await supabase
    .from("deploy_options")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Deploy seed error:", error.message);
  } else {
    console.log(`  ✓ ${rows.length} deploy options seeded`);
  }
}

async function seedPulse() {
  console.log(`Seeding ${PULSE_ITEMS.length} pulse items...`);
  const rows = PULSE_ITEMS.map((p) => ({
    tag: p.tag,
    title: p.title,
    description: p.desc,
    url: p.url || null,
    published_at: p.date,
    source: p.source || null,
    source_url: p.sourceUrl || null,
  }));

  // pulse_items has no unique slug, so delete and re-insert
  const { error: deleteError } = await supabase
    .from("pulse_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError) {
    console.error("Pulse delete error:", deleteError.message);
  }

  const { error } = await supabase.from("pulse_items").insert(rows);
  if (error) {
    console.error("Pulse seed error:", error.message);
  } else {
    console.log(`  ✓ ${rows.length} pulse items seeded`);
  }
}

async function seedAgents() {
  console.log(`Seeding ${AGENTS.length} agents...`);
  const rows = AGENTS.map((a) => ({
    slug: a.slug,
    name: a.name,
    description: a.desc,
    type: a.type,
    role: a.role,
    frameworks: a.frameworks,
    complexity: a.complexity,
    agent_count: a.agentCount,
    config_format: a.configFormat,
    security: a.security,
    downloads: a.downloads,
    rating: a.rating,
    review_count: a.reviews,
    source: a.source,
    source_url: a.sourceUrl || null,
    tags: a.tags,
    author: a.author,
    last_updated: a.lastUpdated || null,
  }));

  const { error } = await supabase
    .from("agents")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Agents seed error:", error.message);
  } else {
    console.log(`  ✓ ${rows.length} agents seeded`);
  }
}

async function seedMcpServers() {
  console.log(`Seeding ${MCP_SERVERS.length} MCP servers...`);
  const rows = MCP_SERVERS.map((m) => ({
    slug: m.slug,
    name: m.name,
    description: m.desc,
    source: m.source,
    source_url: m.sourceUrl || null,
    category: m.category,
    security: m.security,
    runtime: m.runtime,
    tools: m.tools,
    downloads: m.downloads,
    rating: m.rating,
    review_count: m.reviews,
    author: m.author,
    platforms: m.platforms,
    last_updated: m.lastUpdated || null,
  }));

  const { error } = await supabase
    .from("mcp_servers")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("MCP servers seed error:", error.message);
  } else {
    console.log(`  ✓ ${rows.length} MCP servers seeded`);
  }
}

async function seedPlugins() {
  console.log(`Seeding ${PLUGINS.length} plugins...`);
  const rows = PLUGINS.map((p) => ({
    slug: p.slug,
    name: p.name,
    description: p.desc,
    type: p.type,
    source: p.source,
    source_url: p.sourceUrl || null,
    security: p.security,
    downloads: p.downloads,
    rating: p.rating,
    review_count: p.reviews,
    author: p.author,
    platforms: p.platforms,
    last_updated: p.lastUpdated || null,
  }));

  const { error } = await supabase
    .from("plugins")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Plugins seed error:", error.message);
  } else {
    console.log(`  ✓ ${rows.length} plugins seeded`);
  }
}

async function main() {
  console.log("ClawVerse Seed Script");
  console.log("=====================");
  console.log(`URL: ${supabaseUrl}`);
  console.log("");

  await seedSkills();
  await seedProjects();
  await seedDeployOptions();
  await seedPulse();
  await seedAgents();
  await seedMcpServers();
  await seedPlugins();

  console.log("\nDone!");
}

main().catch(console.error);
