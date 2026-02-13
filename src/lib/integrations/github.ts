/**
 * GitHub API integration — sync project star counts
 */

interface GitHubRepo {
  stargazers_count: number;
  updated_at: string;
}

export async function fetchGitHubStars(repoUrl: string): Promise<number | null> {
  // Extract owner/repo from various URL formats
  const match = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
  if (!match) return null;

  const repo = match[1].replace(/\.git$/, "");

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (!res.ok) return null;

    const data: GitHubRepo = await res.json();
    return data.stargazers_count;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncProjectStars(supabase: any) {
  const { data: projects } = await supabase
    .from("projects")
    .select("id, url, github_url")
    .not("url", "is", null);

  if (!projects) return { synced: 0, errors: 0 };

  let synced = 0;
  let errors = 0;

  for (const project of projects) {
    const githubUrl = project.github_url || project.url;
    if (!githubUrl?.includes("github.com")) continue;

    const stars = await fetchGitHubStars(githubUrl);
    if (stars !== null) {
      const { error } = await supabase
        .from("projects")
        .update({ github_stars: stars })
        .eq("id", project.id);

      if (error) errors++;
      else synced++;
    }

    // Rate limiting — 1 request per second
    await new Promise((r) => setTimeout(r, 1000));
  }

  return { synced, errors };
}
