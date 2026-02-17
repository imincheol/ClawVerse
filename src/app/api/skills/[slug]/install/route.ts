import { NextRequest, NextResponse } from "next/server";
import { getSkillBySlug } from "@/lib/data/skills";
import { getInstallCommands, getSource, type SourceRef } from "@/data/sources";

function getEffectiveSources(skill: { source: string; sources?: SourceRef[] }): SourceRef[] {
  if (skill.sources && skill.sources.length > 0) return skill.sources;
  const normalized = skill.source.toLowerCase().replace(/\s+/g, "-");
  const sourceId = normalized === "clawhub" ? "clawhub" : normalized === "github" ? "github" : "community";
  return [{ sourceId }];
}

/**
 * POST /api/skills/[slug]/install
 *
 * Track an install event and return install instructions.
 *
 * Body: { source?: string, platform?: string, agent_id?: string }
 * Headers: X-ClawVerse-Key (optional, for tracking)
 */
export async function POST(
  request: NextRequest,
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

  if (skill.security === "blocked") {
    return NextResponse.json(
      {
        error: "Install blocked",
        reason: "This skill has been confirmed malicious and cannot be installed.",
        security: skill.security,
      },
      { status: 403 },
    );
  }

  let body: { source?: string; platform?: string; agent_id?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is fine
  }

  const apiKey = request.headers.get("x-clawverse-key");
  const sources = getEffectiveSources(skill);
  const commands = getInstallCommands(skill.slug, sources);

  // Preferred source: use the one specified in body, or the first available
  const preferredSourceId = body.source || sources[0]?.sourceId;
  const preferredCommand = commands.find((c) => c.source.id === preferredSourceId) || commands[0];

  // TODO: In production, persist install event to Supabase
  // await supabase.from('install_events').insert({
  //   skill_slug: slug,
  //   source: body.source,
  //   platform: body.platform,
  //   agent_id: body.agent_id,
  //   api_key: apiKey,
  //   created_at: new Date().toISOString(),
  // });

  return NextResponse.json({
    installed: true,
    skill: {
      slug: skill.slug,
      name: skill.name,
      security: skill.security,
    },
    install: {
      command: preferredCommand?.command,
      source: preferredCommand?.source.name,
      url: preferredCommand?.url,
    },
    all_sources: commands.map((cmd) => ({
      source: cmd.source.id,
      source_name: cmd.source.name,
      command: cmd.command,
      url: cmd.url,
    })),
    warnings: [
      ...(skill.security === "flagged"
        ? ["This skill has community security warnings. Install at your own risk."]
        : []),
      ...(skill.security === "unreviewed"
        ? ["This skill has not been security reviewed. Use with caution."]
        : []),
      ...(skill.permissions.length >= 3
        ? [`This skill requests ${skill.permissions.length} permissions (${skill.permissions.join(", ")}). High risk per OWASP MCP-06.`]
        : []),
    ],
    tracked: !!apiKey,
  });
}

/**
 * GET /api/skills/[slug]/install
 *
 * Return install instructions without tracking.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    return NextResponse.json({ error: "Skill not found", slug }, { status: 404 });
  }

  const sources = getEffectiveSources(skill);
  const commands = getInstallCommands(skill.slug, sources);

  return NextResponse.json({
    slug: skill.slug,
    name: skill.name,
    security: skill.security,
    blocked: skill.security === "blocked",
    install_commands: commands.map((cmd) => ({
      source: cmd.source.id,
      source_name: cmd.source.name,
      command: cmd.command,
      url: cmd.url,
      has_security_scan: cmd.source.hasSecurityScan,
    })),
  });
}
