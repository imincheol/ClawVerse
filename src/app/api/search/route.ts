import { NextRequest, NextResponse } from "next/server";
import { SKILLS } from "@/data/skills";
import { PROJECTS } from "@/data/projects";
import { DEPLOY_OPTIONS } from "@/data/deploy";
import { AGENTS } from "@/data/agents";
import { MCP_SERVERS } from "@/data/mcp-servers";
import { PLUGINS } from "@/data/plugins";

let supabaseModule: typeof import("@/lib/supabase/server") | null = null;

async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  if (!supabaseModule) {
    supabaseModule = await import("@/lib/supabase/server");
  }
  try {
    return await supabaseModule.createServerSupabaseClient();
  } catch {
    return null;
  }
}

interface SearchResult {
  type: string;
  slug: string;
  name: string;
  description: string;
  score: number;
}

async function searchDatabase(
  query: string,
  type: string | null,
  page: number,
  limit: number,
): Promise<{ results: SearchResult[]; total: number } | null> {
  const supabase = await getSupabase();
  if (!supabase) return null;

  const tables: { name: string; type: string }[] = [];
  if (!type || type === "skill") tables.push({ name: "skills", type: "skill" });
  if (!type || type === "project") tables.push({ name: "projects", type: "project" });
  if (!type || type === "deploy") tables.push({ name: "deploy_options", type: "deploy" });
  if (!type || type === "agent") tables.push({ name: "agents", type: "agent" });
  if (!type || type === "mcp") tables.push({ name: "mcp_servers", type: "mcp" });
  if (!type || type === "plugin") tables.push({ name: "plugins", type: "plugin" });

  const allResults: SearchResult[] = [];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select("slug, name, description")
        .textSearch("search_vector", query, { type: "websearch" })
        .limit(50);

      if (!error && data) {
        for (const row of data) {
          const nameMatch = (row.name as string).toLowerCase().includes(query.toLowerCase());
          allResults.push({
            type: table.type,
            slug: row.slug as string,
            name: row.name as string,
            description: (row.description as string) || "",
            score: nameMatch ? 10 : 1,
          });
        }
      }
    } catch {
      // Individual table search failure — continue with others
    }
  }

  allResults.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  const total = allResults.length;
  const offset = (page - 1) * limit;
  const paged = allResults.slice(offset, offset + limit);

  return { results: paged, total };
}

function searchStatic(
  query: string,
  type: string | null,
  page: number,
  limit: number,
): { results: SearchResult[]; total: number } {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search skills
  if (!type || type === "skill") {
    for (const s of SKILLS) {
      const nameMatch = s.name.toLowerCase().includes(q);
      const descMatch = s.desc.toLowerCase().includes(q);
      const catMatch = s.category.toLowerCase().includes(q);
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
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.desc.toLowerCase().includes(q);
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
      const nameMatch = d.name.toLowerCase().includes(q);
      const descMatch = d.desc.toLowerCase().includes(q);
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

  // Search agents
  if (!type || type === "agent") {
    for (const a of AGENTS) {
      const nameMatch = a.name.toLowerCase().includes(q);
      const descMatch = a.desc.toLowerCase().includes(q);
      const tagMatch = a.tags.some((t) => t.toLowerCase().includes(q));
      if (nameMatch || descMatch || tagMatch) {
        results.push({
          type: "agent",
          slug: a.slug,
          name: a.name,
          description: a.desc,
          score: nameMatch ? 10 : tagMatch ? 5 : 1,
        });
      }
    }
  }

  // Search MCP servers
  if (!type || type === "mcp") {
    for (const m of MCP_SERVERS) {
      const nameMatch = m.name.toLowerCase().includes(q);
      const descMatch = m.desc.toLowerCase().includes(q);
      const catMatch = m.category.toLowerCase().includes(q);
      if (nameMatch || descMatch || catMatch) {
        results.push({
          type: "mcp",
          slug: m.slug,
          name: m.name,
          description: m.desc,
          score: nameMatch ? 10 : catMatch ? 5 : 1,
        });
      }
    }
  }

  // Search plugins
  if (!type || type === "plugin") {
    for (const p of PLUGINS) {
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.desc.toLowerCase().includes(q);
      if (nameMatch || descMatch) {
        results.push({
          type: "plugin",
          slug: p.slug,
          name: p.name,
          description: p.desc,
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

  return { results: paged, total };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const type = searchParams.get("type"); // 'skill' | 'project' | 'deploy' | 'agent' | 'mcp' | 'plugin' | null (all)
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters", code: "INVALID_QUERY" },
      { status: 400 },
    );
  }

  // Try database search first, fall back to static
  const dbResult = await searchDatabase(query, type, page, limit);
  const { results, total } = dbResult || searchStatic(query, type, page, limit);

  return NextResponse.json({
    data: results.map(({ score, ...rest }) => {
      void score;
      return rest;
    }),
    total,
    page,
    limit,
  });
}
