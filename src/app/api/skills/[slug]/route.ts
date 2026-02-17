import { NextRequest, NextResponse } from "next/server";
import { getSkillBySlug } from "@/lib/data/skills";

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

  return NextResponse.json({
    skill,
    _links: {
      self: `/api/skills/${skill.slug}`,
      list: "/api/skills",
      registry: "/api/v1/registry",
      html: `/skills/${skill.slug}`,
    },
  });
}
