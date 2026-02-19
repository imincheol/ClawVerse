import { NextRequest, NextResponse } from "next/server";
import { getSkillBySlug } from "@/lib/data/skills";
import { getInstallCommands, getSource, getEffectiveSources } from "@/data/sources";

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
  const installCommands = getInstallCommands(skill.slug, sources);

  return NextResponse.json({
    skill: {
      ...skill,
      // Enrich with resolved source details
      available_sources: sources.map((ref) => {
        const source = getSource(ref.sourceId);
        return {
          id: ref.sourceId,
          name: source?.name || ref.sourceId,
          url: ref.url || source?.skillUrlPattern.replace("{slug}", skill.slug),
          has_security_scan: source?.hasSecurityScan || false,
        };
      }),
      install_commands: installCommands.map((cmd) => ({
        source: cmd.source.id,
        source_name: cmd.source.name,
        command: cmd.command,
        url: cmd.url,
      })),
    },
    _links: {
      self: `/api/skills/${skill.slug}`,
      install: `/api/skills/${skill.slug}/install`,
      manifest: `/api/skills/${skill.slug}/manifest`,
      list: "/api/skills",
      registry: "/api/v1/registry",
      html: `/skills/${skill.slug}`,
    },
  });
}
