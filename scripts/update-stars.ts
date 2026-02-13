/**
 * Fetches GitHub stars for projects and updates src/data/projects.ts
 *
 * Usage:
 *   npx tsx scripts/update-stars.ts
 *
 * Set GITHUB_TOKEN env var for higher rate limits (60/hr → 5000/hr)
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const PROJECTS_FILE = resolve(__dirname, "../src/data/projects.ts");

// Map of project slugs to their GitHub repo paths
// Only projects with github.com URLs
const GITHUB_REPOS: Record<string, string> = {};

async function fetchStars(repo: string): Promise<number | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ClawVerse-Sync",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) {
      console.log(`  ✗ ${repo} — ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    return data.stargazers_count;
  } catch (err) {
    console.log(`  ✗ ${repo} — ${err}`);
    return null;
  }
}

function extractGitHubRepos(content: string) {
  // Match: url: "github.com/owner/repo" patterns in the projects array
  const regex = /slug:\s*"([^"]+)".*?url:\s*"github\.com\/([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    GITHUB_REPOS[match[1]] = match[2];
  }
}

async function main() {
  console.log("ClawVerse — GitHub Stars Updater");
  console.log("=================================\n");

  let content = readFileSync(PROJECTS_FILE, "utf-8");

  // Extract GitHub repos from the file
  extractGitHubRepos(content);
  const repos = Object.entries(GITHUB_REPOS);

  if (repos.length === 0) {
    console.log("No GitHub repos found in projects.ts");
    return;
  }

  console.log(`Found ${repos.length} GitHub repos to check:\n`);

  let updated = 0;

  for (const [slug, repo] of repos) {
    const stars = await fetchStars(repo);
    if (stars === null) continue;

    // Find and replace the stars value for this project
    // Match the line containing this slug and update its stars value
    const slugPattern = new RegExp(
      `(slug:\\s*"${slug}"[^}]*?stars:\\s*)([\\d]+|null)`,
      "s"
    );
    const match = content.match(slugPattern);

    if (match) {
      const oldStars = match[2];
      if (oldStars !== String(stars)) {
        content = content.replace(slugPattern, `$1${stars}`);
        console.log(`  ✓ ${slug}: ${oldStars} → ${stars}`);
        updated++;
      } else {
        console.log(`  - ${slug}: ${stars} (no change)`);
      }
    }

    // Rate limit: 1 req/sec without token, can go faster with token
    await new Promise((r) => setTimeout(r, process.env.GITHUB_TOKEN ? 200 : 1100));
  }

  if (updated > 0) {
    writeFileSync(PROJECTS_FILE, content, "utf-8");
    console.log(`\n✓ Updated ${updated} project(s) in projects.ts`);
  } else {
    console.log("\nNo changes needed.");
  }
}

main().catch(console.error);
