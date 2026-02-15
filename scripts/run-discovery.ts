/**
 * Discover new OpenClaw/ClawHub-related projects and skills.
 *
 * Usage:
 *   npx tsx scripts/run-discovery.ts
 *
 * Env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GITHUB_TOKEN (optional)
 *   CLAWHUB_API_KEY (optional)
 */

import { createClient } from "@supabase/supabase-js";

interface GitHubRepoItem {
  id: number;
  full_name: string;
  name: string;
  description: string | null;
  html_url: string;
}

interface ClawHubItem {
  name: string;
  description?: string;
}

interface ExistingRecord {
  slug: string;
  url: string | null;
  github_url: string | null;
  name: string;
}

interface ExistingSkillRecord {
  name: string;
}

function getEnv(name: string): string | null {
  return process.env[name] || null;
}

function normalizeUrl(value: string | null | undefined) {
  if (!value) return null;
  return value.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

function hasKeyword(value: string | null | undefined, terms: string[]) {
  if (!value) return false;
  const text = value.toLowerCase();
  return terms.some((term) => text.includes(term.toLowerCase()));
}

const KEYWORDS = ["openclaw", "claw", "clawverse", "clawhub", "moltbook"];
const GH_QUERY = getEnv("DISCOVERY_GITHUB_QUERY") || "openclaw OR clawhub OR claw";
const MAX_RESULTS = Number(getEnv("DISCOVERY_MAX_RESULTS") || "12");
const DRY_RUN = getEnv("DISCOVERY_DRY_RUN") === "1";

async function fetchGitHubCandidates(token: string | null): Promise<GitHubRepoItem[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "ClawVerse-Discovery",
    };
    if (token) headers.Authorization = `token ${token}`;

    const perPage = Math.min(25, Math.max(5, Math.ceil(MAX_RESULTS / 2)));
    const resp = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        `${GH_QUERY} in:name,description`
      )}&sort=stars&order=desc&per_page=${perPage}`,
      { headers }
    );

    if (!resp.ok) {
      throw new Error(`GitHub search failed: ${resp.status} ${resp.statusText}`);
    }

    const payload = (await resp.json()) as { items: GitHubRepoItem[] };
    return (payload.items || []).slice(0, MAX_RESULTS);
  } catch (error) {
    console.warn("[discovery] GitHub search failed:", error);
    return [];
  }
}

async function fetchClawHubCandidates() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    const key = getEnv("CLAWHUB_API_KEY");
    if (key) headers.Authorization = `Bearer ${key}`;

    const resp = await fetch(
      `https://api.clawhub.ai/v1/skills?page=1&limit=${Math.max(
        5,
        Math.min(50, MAX_RESULTS)
      )}`,
      { headers }
    );

    if (!resp.ok) return [] as ClawHubItem[];
    const json = (await resp.json()) as { skills?: ClawHubItem[]; data?: ClawHubItem[] };
    return (json.skills || json.data || []).slice(0, MAX_RESULTS);
  } catch (error) {
    console.warn("[discovery] ClawHub candidate fetch failed:", error);
    return [] as ClawHubItem[];
  }
}

async function fetchReadmeContainsClawClues(repo: string, token: string | null) {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3.raw+json",
      "User-Agent": "ClawVerse-Discovery",
    };
    if (token) headers.Authorization = `token ${token}`;

    const url = `https://api.github.com/repos/${repo}/readme`;
    const resp = await fetch(url, { headers });
    if (!resp.ok) return false;

    const text = await resp.text();
    return hasKeyword(text, KEYWORDS);
  } catch {
    return false;
  }
}

async function main() {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseServiceRole = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error("Missing Supabase config. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }

  const githubToken = getEnv("GITHUB_TOKEN");
  const supabase = createClient(supabaseUrl, supabaseServiceRole);

  const { data: existingProjects } = await supabase.from("projects").select("slug,url,github_url,name");
  const { data: existingSkills } = await supabase.from("skills").select("slug,name");
  const { data: existingSubmissions } = await supabase
    .from("submissions")
    .select("name,type");

  const projectNames = new Set(
    (existingProjects || []).map((row: ExistingRecord) => row.name.toLowerCase())
  );
  const projectUrls = new Set(
    (existingProjects || [])
      .flatMap((row: ExistingRecord) => [normalizeUrl(row.url), normalizeUrl(row.github_url)])
      .filter(Boolean) as string[]
  );
  const skillNames = new Set((existingSkills || []).map((row: ExistingSkillRecord) => row.name.toLowerCase()));
  const submissionKey = new Set(
    (existingSubmissions || []).map(
      (row: { name: string; type: string }) => `${row.type}:${row.name.toLowerCase()}`
    )
  );

  const githubCandidates = await fetchGitHubCandidates(githubToken);
  const clawHubCandidates = await fetchClawHubCandidates();

  const deduped: Array<{
    type: "project" | "skill";
    name: string;
    url: string;
    description: string;
    category: string;
  }> = [];

  for (const repo of githubCandidates) {
    const combined = `${repo.name} ${repo.description || ""}`;
    if (!hasKeyword(combined, KEYWORDS)) continue;
    if (projectNames.has(repo.name.toLowerCase())) continue;
    if (projectUrls.has(normalizeUrl(repo.html_url) as string)) continue;
    const submissionKeyValue = `project:${repo.name.toLowerCase()}`;
    if (submissionKey.has(submissionKeyValue)) continue;

    const passesReadme = await fetchReadmeContainsClawClues(repo.full_name, githubToken);
    if (!passesReadme) continue;

    deduped.push({
      type: "project",
      name: repo.name,
      url: repo.html_url,
      description: repo.description || "Discovered via GitHub keyword search.",
      category: "discovery",
    });
  }

  for (const skill of clawHubCandidates) {
    const combined = `${skill.name} ${skill.description || ""}`;
    if (!hasKeyword(combined, KEYWORDS)) continue;
    if (skillNames.has(skill.name.toLowerCase())) continue;

    const submissionKeyValue = `skill:${skill.name.toLowerCase()}`;
    if (submissionKey.has(submissionKeyValue)) continue;

    deduped.push({
      type: "skill",
      name: skill.name,
      url: "",
      description: skill.description || "Discovered via ClawHub search.",
      category: "discovery",
    });
  }

  const pendingInserts = deduped.filter(
    (entry, index, list) =>
      index === list.findIndex((candidate) => candidate.type === entry.type && candidate.name === entry.name)
  );

  if (DRY_RUN || pendingInserts.length === 0) {
    console.log("Discovered candidates:");
    console.table(
      pendingInserts.map((entry) => ({
        type: entry.type,
        name: entry.name,
        url: entry.url,
        source: entry.description,
      }))
    );
    if (DRY_RUN) {
      console.log("DISCOVERY_DRY_RUN=1 enabled. No inserts were made.");
      return;
    }
  }

  let inserted = 0;
  for (const item of pendingInserts) {
    const { error } = await supabase.from("submissions").insert({
      type: item.type,
      name: item.name,
      url: item.url || null,
      description: item.description,
      category: item.category,
      status: "pending",
    });

    if (!error) inserted += 1;
  }

  console.log(`Discovered ${pendingInserts.length} raw candidates, inserted ${inserted} submissions.`);
  for (const item of pendingInserts.slice(0, 20)) {
    console.log(`${item.type.toUpperCase()} | ${item.name} | ${item.url || "(no url)"}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
