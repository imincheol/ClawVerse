import { NextRequest, NextResponse } from "next/server";
import { getSkillBySlug } from "@/lib/data/skills";
import { getSource, type SourceRef } from "@/data/sources";

function getEffectiveSources(skill: { source: string; sources?: SourceRef[] }): SourceRef[] {
  if (skill.sources && skill.sources.length > 0) return skill.sources;
  const normalized = skill.source.toLowerCase().replace(/\s+/g, "-");
  const sourceId = normalized === "clawhub" ? "clawhub" : normalized === "github" ? "github" : "community";
  return [{ sourceId }];
}

/**
 * GET /api/skills/[slug]/manifest
 *
 * Returns an MCP-compatible manifest for the skill.
 * Agents can use this to auto-configure the skill integration.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    return NextResponse.json(
      { error: "Skill not found", slug },
      { status: 404 },
    );
  }

  const sources = getEffectiveSources(skill);

  return NextResponse.json({
    manifest_version: "1.0",
    skill: {
      slug: skill.slug,
      name: skill.name,
      description: skill.desc,
      version: skill.lastUpdated,
    },
    security: {
      level: skill.security,
      virustotal_status: skill.virustotal_status || "unscanned",
      blocked: skill.security === "blocked",
      required_permissions: skill.permissions,
      risk_notes: skill.permissions.length >= 3
        ? `High risk: ${skill.permissions.length} permissions requested`
        : null,
    },
    compatibility: {
      platforms: skill.platforms,
      protocols: skill.protocols,
    },
    sources: sources.map((ref) => {
      const source = getSource(ref.sourceId);
      return {
        id: ref.sourceId,
        name: source?.name || ref.sourceId,
        url: ref.url || source?.skillUrlPattern.replace("{slug}", skill.slug),
        install_command: source?.installCommand?.replace("{slug}", skill.slug),
        has_security_scan: source?.hasSecurityScan || false,
      };
    }),
    github_url: skill.githubUrl || null,
    maintainer: {
      activity: skill.maintainerActivity,
      last_updated: skill.lastUpdated,
    },
    metadata: {
      category: skill.category,
      installs: skill.installs,
      rating: skill.rating,
      reviews: skill.reviews,
    },
    _links: {
      self: `/api/skills/${skill.slug}/manifest`,
      detail: `/api/skills/${skill.slug}`,
      install: `/api/skills/${skill.slug}/install`,
      html: `/skills/${skill.slug}`,
    },
  });
}
