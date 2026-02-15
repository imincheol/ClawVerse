import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { PROJECTS, LAYERS } from "@/data/projects";
import AddToStackButton from "@/components/AddToStackButton";
import ReviewSection from "@/components/ReviewSection";
import PageViewTracker from "@/components/PageViewTracker";
import { getProjectBySlug } from "@/lib/data/projects";
import { getPageViewStatsForPath, getProjectGrowthBySlug } from "@/lib/data/metrics";

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
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const layer = LAYERS[project.layer];
  const stars = formatStars(project.stars);
  const path = `/projects/${project.slug}`;
  const [growth, pageViews] = await Promise.all([
    getProjectGrowthBySlug(project.slug, 30),
    getPageViewStatsForPath(path, 30),
  ]);
  const growthRows = [...growth].reverse();

  const relatedProjects = PROJECTS.filter(
    (p) => p.layer === project.layer && p.slug !== project.slug
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
        <PageViewTracker
          path={path}
          targetType="project"
          targetSlug={project.slug}
        />

        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1
              className="font-display text-2xl font-bold text-text-primary"
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
            <div className="mb-1 text-[11px] text-text-muted">Page Views</div>
            <div className="text-lg font-bold text-text-primary">
              {pageViews.totalViews.toLocaleString()}
            </div>
            <div className="text-[10px] text-text-muted">
              {pageViews.recentViews.toLocaleString()} in last {pageViews.windowDays}d
            </div>
          </div>
          {growthRows[0] ? (
            <div className="rounded-[10px] bg-card p-3">
              <div className="mb-1 text-[11px] text-text-muted">Latest Growth</div>
              <div className="text-lg font-bold text-text-primary">
                {growthRows[0].stars.toLocaleString()}
              </div>
              <div className="text-[10px] text-text-muted">
                Δ {growthRows[0].delta >= 0 ? "+" : "-"}
                {Math.abs(growthRows[0].delta)} vs previous
              </div>
            </div>
          ) : (
            <div className="rounded-[10px] bg-card p-3">
              <div className="mb-1 text-[11px] text-text-muted">Latest Growth</div>
              <div className="text-lg font-bold text-text-primary">No snapshot yet</div>
            </div>
          )}
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
            <a
              href={project.url.startsWith("http") ? project.url : `https://${project.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-accent-cyan no-underline hover:underline"
            >
              {project.url} ↗
            </a>
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

        {/* Reviews */}
        <ReviewSection targetType="project" targetId={project.slug} />

        {growthRows.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Growth Snapshot (latest {growthRows.length})
            </div>
            <div className="space-y-2 text-sm">
              {growthRows.slice(0, 8).map((row) => (
                <div key={`${row.snapshotDate}-${row.source}`} className="rounded-md bg-card px-3 py-2">
                  <span className="text-text-muted">{row.snapshotDate}</span>
                  <span className="ml-2 font-semibold text-text-primary">
                    {row.stars.toLocaleString()} ⭐
                  </span>
                  <span className="ml-2 text-xs text-text-muted">
                    ({row.delta >= 0 ? "+" : "-"}
                    {Math.abs(row.delta)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
