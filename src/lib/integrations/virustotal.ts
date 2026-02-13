/**
 * VirusTotal API integration — security scanning for skills
 */

interface VTAnalysisResult {
  data?: {
    attributes?: {
      stats?: {
        malicious: number;
        suspicious: number;
        undetected: number;
        harmless: number;
      };
    };
  };
}

export async function scanUrl(url: string): Promise<{
  safe: boolean;
  malicious: number;
  suspicious: number;
} | null> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) return null;

  try {
    // Submit URL for scanning
    const submitRes = await fetch("https://www.virustotal.com/api/v3/urls", {
      method: "POST",
      headers: {
        "x-apikey": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `url=${encodeURIComponent(url)}`,
    });

    if (!submitRes.ok) return null;

    const submitData = await submitRes.json();
    const analysisId = submitData.data?.id;
    if (!analysisId) return null;

    // Wait for analysis to complete
    await new Promise((r) => setTimeout(r, 15000));

    // Get results
    const resultRes = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: { "x-apikey": apiKey },
      }
    );

    if (!resultRes.ok) return null;

    const result: VTAnalysisResult = await resultRes.json();
    const stats = result.data?.attributes?.stats;
    if (!stats) return null;

    return {
      safe: stats.malicious === 0 && stats.suspicious === 0,
      malicious: stats.malicious,
      suspicious: stats.suspicious,
    };
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function scanUnreviewedSkills(supabase: any) {
  const { data: skills } = await supabase
    .from("skills")
    .select("id, slug, source_url")
    .eq("security", "unreviewed")
    .not("source_url", "is", null)
    .limit(10); // Rate-limit: process 10 at a time

  if (!skills) return { scanned: 0, flagged: 0 };

  let scanned = 0;
  let flagged = 0;

  for (const skill of skills) {
    const result = await scanUrl(skill.source_url);
    if (!result) continue;

    const newSecurity = result.safe ? "reviewed" : "flagged";
    await supabase
      .from("skills")
      .update({
        security: newSecurity,
        virustotal_status: result.safe
          ? "clean"
          : `malicious:${result.malicious},suspicious:${result.suspicious}`,
      })
      .eq("id", skill.id);

    scanned++;
    if (!result.safe) flagged++;

    // Rate limit: VirusTotal free tier = 4 requests/min
    await new Promise((r) => setTimeout(r, 20000));
  }

  return { scanned, flagged };
}
