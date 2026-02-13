import { DeployOption } from "@/data/deploy";

function getSecurityColor(security: string): string {
  if (security === "Very High") return "#22c55e";
  if (security === "High") return "#4ade80";
  if (security === "Medium") return "#eab308";
  return "#f97316";
}

export default function DeployCard({ opt }: { opt: DeployOption }) {
  const secColor = getSecurityColor(opt.security);

  return (
    <div className="group rounded-[14px] border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-purple/40">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-base font-bold text-text-primary">{opt.name}</span>
        <span className="text-xs text-accent-purple">
          {"★".repeat(opt.level)}
        </span>
      </div>

      <p className="mb-3 text-[13px] leading-snug text-text-secondary">
        {opt.desc}
      </p>

      <div className="mb-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <span className="text-text-muted">
          Cost: <span className="text-text-primary">{opt.cost}</span>
        </span>
        <span className="text-text-muted">
          Setup: <span className="text-text-primary">{opt.setup}</span>
        </span>
        <span className="text-text-muted">
          Security:{" "}
          <span style={{ color: secColor }}>{opt.security}</span>
        </span>
        <span className="text-text-muted">
          Scale: <span className="text-text-primary">{opt.scalability}</span>
        </span>
      </div>

      <div className="rounded-lg bg-accent-purple/[0.08] px-2.5 py-1.5 text-xs text-accent-violet">
        Best for: {opt.bestFor}
      </div>
    </div>
  );
}
