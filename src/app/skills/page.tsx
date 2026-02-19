import { SKILLS } from "@/data/skills";
import { DATA_LAST_UPDATED } from "@/data/metadata";
import { SOURCE_REGISTRY } from "@/data/sources";
import SkillsClient from "@/components/SkillsClient";

const sourceNames = Object.values(SOURCE_REGISTRY).map((s) => s.shortName).join(" + ");

export default function SkillsPage() {
  return (
    <SkillsClient
      skills={SKILLS}
      lastUpdated={DATA_LAST_UPDATED}
      sourceNames={sourceNames}
    />
  );
}
