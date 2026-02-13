import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PROJECTS, LAYERS } from "@/data/projects";
import AddToStackButton from "@/components/AddToStackButton";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found — ClawVerse" };
  return {
    title: `${project.name} — ClawVerse Projects`,
    description: project.desc,
  };
}

function formatStars(count: number | null): string | null {
  if (!count) return null;
  if (count >= 1000)
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`;
  return String(count);
}

function getStatusColor(status: string): string {
  if (status === "viral") return "#f472b6";
  if (status === "research") return "#a78bfa";
  if (status === "inactive") return "#64748b";
  return "#4ade80";
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const layer = LAYERS[project.layer];
  const stars = formatStars(project.stars);

  const relatedProjects = PROJECTS.filter(
    (p) => p.layer === project.layer && p.id !== project.id
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/projects"
        className="mb-6 inline-block text-sm text-text-muted no-underline hover:text-text-secondary"
      >
        ← Back to Projects
      </Link>

      <div
        className="rounded-2xl border p-8"
        style={{ borderColor: layer.color + "30" }}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1
              className="text-2xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  color: layer.color,
                  background: layer.color + "18",
                  border: `1px solid ${layer.color}30`,
                }}
              >
                {layer.label}
              </span>
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: getStatusColor(project.status) }}
              >
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mb-5 text-sm leading-relaxed text-text-secondary">
          {project.desc}
        </p>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">Type</div>
            <div className="text-base font-bold text-text-primary">
              {project.official ? "Official" : "Community"}
            </div>
          </div>
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">
              GitHub Stars
            </div>
            <div className="text-lg font-bold text-[#fbbf24]">
              {stars ? `★ ${stars}` : "—"}
            </div>
          </div>
        </div>

        {/* URL */}
        {project.url && (
          <div className="mb-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Website
            </div>
            <span className="text-[13px] text-accent-cyan">
              {project.url}
            </span>
          </div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-6 border-t border-border pt-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Related {layer.label} Projects
            </div>
            <div className="flex flex-col gap-2">
              {relatedProjects.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/projects/${rp.slug}`}
                  className="rounded-[10px] border border-border bg-card px-4 py-2.5 no-underline transition-colors hover:border-white/10"
                >
                  <span className="text-[13px] font-semibold text-text-primary">
                    {rp.name}
                  </span>
                  <span className="ml-2 text-xs text-text-muted">
                    {rp.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <AddToStackButton itemType="project" itemSlug={project.slug} />
          <Link
            href="/submit"
            className="inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-4 py-2 text-[13px] text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
          >
            Submit an update →
          </Link>
        </div>
      </div>
    </div>
  );
}
