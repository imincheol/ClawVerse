import { NextRequest, NextResponse } from "next/server";
import { getSkills } from "@/lib/data/skills";
import { SKILLS } from "@/data/skills";
import { PROJECTS } from "@/data/projects";
import { DEPLOY_OPTIONS } from "@/data/deploy";

/**
 * OpenClaw-compatible skill registry endpoint.
 *
 * GET /api/v1/registry
 *   Returns the registry manifest with metadata and discovery info.
 *
 * GET /api/v1/registry?action=search&q=chart&category=visualize&security=verified&platform=OpenClaw
 *   Search skills with filters, returns results in a format
 *   consumable by OpenClaw agents and other MCP clients.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");

  if (action === "search") {
    return handleSearch(searchParams);
  }

  // Default: return registry manifest
  const lastUpdated = computeLastUpdated();

  return NextResponse.json({
    name: "ClawVerse",
    version: "1.0.0",
    description:
      "ClawVerse.io — Aggregated skill registry for the OpenClaw ecosystem. Discover, verify, and compare skills from ClawHub, GitHub, and community sources.",
    homepage: "https://clawverse.io",
    registry_url: "https://clawverse.io/api/v1/registry",
    last_updated: lastUpdated,
    stats: {
      total_skills: SKILLS.length,
      total_projects: PROJECTS.length,
      total_deploy_options: DEPLOY_OPTIONS.length,
      verified_skills: SKILLS.filter((s) => s.security === "verified").length,
      blocked_skills: SKILLS.filter((s) => s.security === "blocked").length,
      categories: [...new Set(SKILLS.map((s) => s.category))],
      sources: [...new Set(SKILLS.map((s) => s.source))],
      platforms: [...new Set(SKILLS.flatMap((s) => s.platforms))],
    },
    endpoints: {
      search: "/api/v1/registry?action=search&q={query}",
      skill_detail: "/api/skills/{slug}",
      skill_list: "/api/skills",
      projects: "/api/projects",
      deploy: "/api/deploy",
      submit: "/api/submit",
    },
    search_params: {
      q: "Search query (name, description)",
      category:
        "Filter by category: browser, productivity, media, design, communication, agent, social, finance, iot, utility, visualize",
      security:
        "Filter by security level: verified, reviewed, unreviewed, flagged, blocked",
      platform: "Filter by platform: OpenClaw, Claude Code, Codex",
      source: "Filter by source: ClawHub, GitHub, Community",
      sort: "Sort by: installs (default), rating, newest, name, security",
      limit: "Results per page (default: 50)",
      offset: "Pagination offset",
    },
    security_levels: {
      verified:
        "VirusTotal pass + code review + 100+ installs + 0 reports",
      reviewed: "VirusTotal pass + basic code check + 10+ installs",
      unreviewed: "New, auto-scan only",
      flagged: "Security warning from community reports",
      blocked:
        "Confirmed malicious — do NOT install",
    },
  });
}

async function handleSearch(searchParams: URLSearchParams) {
  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const security = searchParams.get("security") || undefined;
  const source = searchParams.get("source") || undefined;
  const platform = searchParams.get("platform") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const limit = searchParams.has("limit")
    ? Number(searchParams.get("limit"))
    : 50;
  const offset = searchParams.has("offset")
    ? Number(searchParams.get("offset"))
    : 0;

  let skills = await getSkills({
    search: q,
    category,
    security,
    source,
    sort,
    limit,
    offset,
  });

  // Additional platform filter (not in base getSkills)
  if (platform) {
    const p = platform.toLowerCase();
    skills = skills.filter((s) =>
      s.platforms.some((pl) => pl.toLowerCase() === p),
    );
  }

  return NextResponse.json({
    results: skills.map((s) => ({
      slug: s.slug,
      name: s.name,
      description: s.desc,
      category: s.category,
      security: s.security,
      source: s.source,
      installs: s.installs,
      rating: s.rating,
      permissions: s.permissions,
      platforms: s.platforms,
      protocols: s.protocols,
      last_updated: s.lastUpdated,
      maintainer_activity: s.maintainerActivity,
      detail_url: `/api/skills/${s.slug}`,
      html_url: `/skills/${s.slug}`,
    })),
    total: skills.length,
    query: { q, category, security, source, platform, sort, limit, offset },
  });
}

function computeLastUpdated(): string {
  const dates = SKILLS.map((s) => s.lastUpdated).filter(Boolean).sort();
  return dates.length > 0 ? dates[dates.length - 1] : new Date().toISOString().slice(0, 10);
}
