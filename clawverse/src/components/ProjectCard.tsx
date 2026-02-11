import { Project, LAYERS } from "@/data/projects";

function formatStars(count: number | null): string | null {
  if (!count) return null;
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`;
  return String(count);
}

function getStatusColor(status: string): string {
  if (status === "viral") return "#f472b6";
  if (status === "research") return "#a78bfa";
  return "#4ade80";
}

export default function ProjectCard({ project }: { project: Project }) {
  const layer = LAYERS[project.layer];
  const stars = formatStars(project.stars);

  return (
    <div
      className="group rounded-[14px] border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = layer.color + "50";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
      }}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[15px] font-bold text-text-primary">
          {project.name}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px]"
          style={{
            color: layer.color,
            background: layer.color + "18",
            border: `1px solid ${layer.color}30`,
          }}
        >
          {layer.label}
        </span>
      </div>

      <p className="mb-2.5 text-[13px] leading-snug text-text-secondary">
        {project.desc}
      </p>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{project.official ? "Official" : "Community"}</span>
        {stars && <span className="text-[#fbbf24]">★ {stars}</span>}
        <span
          className="text-[11px] font-semibold uppercase tracking-wide"
          style={{ color: getStatusColor(project.status) }}
        >
          {project.status}
        </span>
      </div>
    </div>
  );
}
