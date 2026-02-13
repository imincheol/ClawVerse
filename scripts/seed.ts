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
  }));

  const { error } = await supabase.from("pulse_items").upsert(rows, {
    onConflict: "id",
    ignoreDuplicates: true,
  });

  if (error) {
    // pulse_items has no unique slug, so insert instead
    const { error: insertError } = await supabase
      .from("pulse_items")
      .insert(rows);
    if (insertError) {
      console.error("Pulse seed error:", insertError.message);
    } else {
      console.log(`  ✓ ${rows.length} pulse items seeded`);
    }
  } else {
    console.log(`  ✓ ${rows.length} pulse items seeded`);
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

  console.log("\nDone!");
}

main().catch(console.error);
