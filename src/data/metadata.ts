import { SKILLS } from "./skills";
import { PROJECTS } from "./projects";
import { DEPLOY_OPTIONS } from "./deploy";
import { PULSE_ITEMS } from "./pulse";

/** Auto-computed from the most recent lastUpdated date across all skills */
function computeLastUpdated(): string {
  const skillDates = SKILLS.map((s) => s.lastUpdated).filter(Boolean);
  const pulseDates = PULSE_ITEMS.map((p) => p.date).filter(Boolean);
  const allDates = [...skillDates, ...pulseDates].sort();
  return allDates.length > 0 ? allDates[allDates.length - 1] : "unknown";
}

/** Global data freshness metadata for ClawVerse — auto-computed from actual data */
export const DATA_LAST_UPDATED = computeLastUpdated();

export const DATA_COUNTS = {
  skills: SKILLS.length,
  projects: PROJECTS.length,
  deployOptions: DEPLOY_OPTIONS.length,
  pulseItems: PULSE_ITEMS.length,
} as const;
