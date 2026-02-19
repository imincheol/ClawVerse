import { AGENTS as STATIC_AGENTS } from "@/data/agents";
import type { Agent } from "@/data/agents";

export interface AgentFilters {
  search?: string;
  type?: string;
  role?: string;
  framework?: string;
  security?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export async function getAgents(filters: AgentFilters = {}): Promise<Agent[]> {
  return filterStaticAgents(filters);
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  return STATIC_AGENTS.find((a) => a.slug === slug) || null;
}

function filterStaticAgents(filters: AgentFilters): Agent[] {
  let result = [...STATIC_AGENTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.desc.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (filters.type && filters.type !== "all") {
    result = result.filter((a) => a.type === filters.type);
  }
  if (filters.role && filters.role !== "all") {
    result = result.filter((a) => a.role === filters.role);
  }
  if (filters.framework && filters.framework !== "all") {
    result = result.filter((a) =>
      a.frameworks.some((fw) => fw.toLowerCase() === filters.framework!.toLowerCase())
    );
  }
  if (filters.security && filters.security !== "all") {
    result = result.filter((a) => a.security === filters.security);
  }

  const SECURITY_ORDER: Record<string, number> = { verified: 0, reviewed: 1, unreviewed: 2, flagged: 3, blocked: 4 };
  switch (filters.sort) {
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      result.sort((a, b) => b.id - a.id);
      break;
    case "security":
      result.sort((a, b) => (SECURITY_ORDER[a.security] ?? 9) - (SECURITY_ORDER[b.security] ?? 9));
      break;
    case "downloads":
    default:
      result.sort((a, b) => b.downloads - a.downloads);
  }

  if (filters.offset) result = result.slice(filters.offset);
  if (filters.limit) result = result.slice(0, filters.limit);

  return result;
}
