import { SecurityLevel, SECURITY_CONFIG } from "@/data/skills";

const SECURITY_ICONS: Record<SecurityLevel, string> = {
  verified: "\u{1F7E2}",
  reviewed: "\u{1F7E1}",
  unreviewed: "\u{1F7E0}",
  flagged: "\u{1F534}",
  blocked: "\u26D4",
};

export default function SecurityBadge({ level }: { level: SecurityLevel }) {
  const config = SECURITY_CONFIG[level];
  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}30`,
      }}
    >
      {SECURITY_ICONS[level]} {config.label}
    </span>
  );
}
