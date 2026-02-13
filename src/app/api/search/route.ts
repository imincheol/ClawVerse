import { NextRequest, NextResponse } from "next/server";
import { SKILLS } from "@/data/skills";
import { PROJECTS } from "@/data/projects";
import { DEPLOY_OPTIONS } from "@/data/deploy";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const type = searchParams.get("type"); // 'skill' | 'project' | 'deploy' | null (all)
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters", code: "INVALID_QUERY" },
      { status: 400 },
    );
  }

  const results: {
    type: string;
    slug: string;
    name: string;
    description: string;
    score: number;
  }[] = [];

  // Search skills
  if (!type || type === "skill") {
    for (const s of SKILLS) {
      const nameMatch = s.name.toLowerCase().includes(query);
      const descMatch = s.desc.toLowerCase().includes(query);
      const catMatch = s.category.toLowerCase().includes(query);
      if (nameMatch || descMatch || catMatch) {
        results.push({
          type: "skill",
          slug: s.slug,
          name: s.name,
          description: s.desc,
          score: nameMatch ? 10 : catMatch ? 5 : 1,
        });
      }
    }
  }

  // Search projects
  if (!type || type === "project") {
    for (const p of PROJECTS) {
      const nameMatch = p.name.toLowerCase().includes(query);
      const descMatch = p.desc.toLowerCase().includes(query);
      if (nameMatch || descMatch) {
        results.push({
          type: "project",
          slug: p.slug,
          name: p.name,
          description: p.desc,
          score: nameMatch ? 10 : 1,
        });
      }
    }
  }

  // Search deploy options
  if (!type || type === "deploy") {
    for (const d of DEPLOY_OPTIONS) {
      const nameMatch = d.name.toLowerCase().includes(query);
      const descMatch = d.desc.toLowerCase().includes(query);
      if (nameMatch || descMatch) {
        results.push({
          type: "deploy",
          slug: d.slug,
          name: d.name,
          description: d.desc,
          score: nameMatch ? 10 : 1,
        });
      }
    }
  }

  // Sort by relevance score then name
  results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  const total = results.length;
  const offset = (page - 1) * limit;
  const paged = results.slice(offset, offset + limit);

  return NextResponse.json({
    data: paged.map(({ score: _score, ...rest }) => rest),
    total,
    page,
    limit,
  });
}
