/**
 * Source Registry — defines all known skill sources with their metadata,
 * install URL patterns, and capabilities.
 *
 * New sources can be added here and immediately appear in the UI.
 */

export interface SkillSource {
  id: string;
  name: string;
  shortName: string;
  url: string;
  color: string;
  icon: string;
  /** URL pattern for a skill page. Use {slug} as placeholder. */
  skillUrlPattern: string;
  /** Install command pattern. Use {slug} as placeholder. */
  installCommand?: string;
  /** Whether this source provides security scanning */
  hasSecurityScan: boolean;
  /** Total skills available from this source (approximate) */
  totalSkills: number;
  description: string;
}

export const SOURCE_REGISTRY: Record<string, SkillSource> = {
  clawhub: {
    id: "clawhub",
    name: "ClawHub",
    shortName: "ClawHub",
    url: "https://clawhub.ai",
    color: "#8b5cf6",
    icon: "C",
    skillUrlPattern: "https://clawhub.ai/skills/{slug}",
    installCommand: "openclaw install @clawhub/{slug}",
    hasSecurityScan: true,
    totalSkills: 5705,
    description: "Official OpenClaw skill registry with 5,705+ skills",
  },
  "awesome-openclaw-skills": {
    id: "awesome-openclaw-skills",
    name: "Awesome OpenClaw Skills",
    shortName: "Awesome",
    url: "https://github.com/VoltAgent/awesome-openclaw-skills",
    color: "#f97316",
    icon: "A",
    skillUrlPattern: "https://github.com/VoltAgent/awesome-openclaw-skills#readme",
    installCommand: "openclaw install github:{slug}",
    hasSecurityScan: false,
    totalSkills: 2999,
    description: "Community-curated collection with 2,999+ entries",
  },
  github: {
    id: "github",
    name: "GitHub",
    shortName: "GitHub",
    url: "https://github.com",
    color: "#e2e8f0",
    icon: "G",
    skillUrlPattern: "https://github.com/search?q={slug}+openclaw+skill",
    installCommand: "openclaw install github:{slug}",
    hasSecurityScan: false,
    totalSkills: 0, // varies
    description: "Individual GitHub repositories",
  },
  community: {
    id: "community",
    name: "Community",
    shortName: "Community",
    url: "https://clawverse.io/submit",
    color: "#38bdf8",
    icon: "U",
    skillUrlPattern: "https://clawverse.io/skills/{slug}",
    hasSecurityScan: false,
    totalSkills: 0, // varies
    description: "User-submitted skills via ClawVerse",
  },
  moltbooks: {
    id: "moltbooks",
    name: "Moltbooks.app",
    shortName: "Moltbooks",
    url: "https://moltbooks.app",
    color: "#22c55e",
    icon: "M",
    skillUrlPattern: "https://moltbooks.app/skills/{slug}",
    installCommand: "openclaw install @moltbooks/{slug}",
    hasSecurityScan: true,
    totalSkills: 850,
    description: "Cross-platform skill index",
  },
  openclawskill: {
    id: "openclawskill",
    name: "OpenClawSkill.ai",
    shortName: "OCS",
    url: "https://openclawskill.ai",
    color: "#fbbf24",
    icon: "O",
    skillUrlPattern: "https://openclawskill.ai/skills/{slug}",
    installCommand: "openclaw install @ocs/{slug}",
    hasSecurityScan: false,
    totalSkills: 1200,
    description: "Vector search-based AI skill registry",
  },
};

/** Reference to a source where a skill is available */
export interface SourceRef {
  /** Source ID — must match a key in SOURCE_REGISTRY */
  sourceId: string;
  /** Direct URL to this skill on the source (optional override) */
  url?: string;
}

/** Get the SkillSource config for a source ID, with fallback */
export function getSource(sourceId: string): SkillSource | null {
  // Normalize: "ClawHub" -> "clawhub", "GitHub" -> "github"
  const normalized = sourceId.toLowerCase().replace(/\s+/g, "-");
  return SOURCE_REGISTRY[normalized] || null;
}

/**
 * Infer effective sources for a skill.
 * If the skill has explicit sources[], use those.
 * Otherwise, apply heuristic rules based on primary source + popularity.
 */
export function getEffectiveSources(skill: {
  source: string;
  sources?: SourceRef[];
  installs: number;
  security: string;
}): SourceRef[] {
  if (skill.sources && skill.sources.length > 0) return skill.sources;

  const refs: SourceRef[] = [];
  const primary = skill.source.toLowerCase().replace(/\s+/g, "-");
  const primaryId = primary === "clawhub" ? "clawhub" : primary === "github" ? "github" : "community";
  refs.push({ sourceId: primaryId });

  // Popular ClawHub skills (1000+ installs, not blocked) are likely also on awesome-openclaw-skills
  if (primaryId === "clawhub" && skill.installs >= 1000 && skill.security !== "blocked") {
    refs.push({ sourceId: "awesome-openclaw-skills" });
  }

  // Popular GitHub skills (2000+ installs) are likely curated in awesome-openclaw-skills
  if (primaryId === "github" && skill.installs >= 2000 && skill.security !== "blocked" && skill.security !== "flagged") {
    refs.push({ sourceId: "awesome-openclaw-skills" });
  }

  // Verified ClawHub skills with 3000+ installs are likely on Moltbooks and OpenClawSkill
  if (primaryId === "clawhub" && skill.security === "verified" && skill.installs >= 3000) {
    refs.push({ sourceId: "moltbooks" });
  }
  if ((primaryId === "clawhub" || primaryId === "github") && skill.installs >= 4000 && skill.security !== "blocked") {
    refs.push({ sourceId: "openclawskill" });
  }

  return refs;
}

/** Get install commands for a skill across its sources */
export function getInstallCommands(
  slug: string,
  sourceRefs: SourceRef[],
): { source: SkillSource; command: string; url: string }[] {
  const commands: { source: SkillSource; command: string; url: string }[] = [];

  for (const ref of sourceRefs) {
    const source = getSource(ref.sourceId);
    if (!source) continue;

    const url = ref.url || source.skillUrlPattern.replace("{slug}", slug);
    const command = source.installCommand
      ? source.installCommand.replace("{slug}", slug)
      : `# Visit ${url}`;

    commands.push({ source, command, url });
  }

  return commands;
}
