import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { DEPLOY_OPTIONS } from "@/data/deploy";

export function generateStaticParams() {
  return DEPLOY_OPTIONS.map((d) => ({ provider: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ provider: string }>;
}): Promise<Metadata> {
  const { provider } = await params;
  const opt = DEPLOY_OPTIONS.find((d) => d.slug === provider);
  if (!opt) return { title: "Deploy Option Not Found — ClawVerse" };
  return {
    title: `${opt.name} — ClawVerse Deploy`,
    description: opt.desc,
  };
}

function getSecurityColor(security: string): string {
  if (security === "Very High") return "#22c55e";
  if (security === "High") return "#4ade80";
  if (security === "Medium") return "#eab308";
  return "#f97316";
}

export default async function DeployDetailPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;
  const opt = DEPLOY_OPTIONS.find((d) => d.slug === provider);
  if (!opt) notFound();

  const secColor = getSecurityColor(opt.security);

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/deploy"
        className="mb-6 inline-block text-sm text-text-muted no-underline hover:text-text-secondary"
      >
        ← Back to Deploy Hub
      </Link>

      <div className="rounded-2xl border border-accent-purple/20 p-8">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1
              className="text-2xl font-bold text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {opt.name}
            </h1>
            <div className="mt-1 text-xs text-accent-purple">
              {"★".repeat(opt.level)}{" "}
              <span className="ml-1 text-text-muted">
                Level {opt.level} / 4
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mb-5 text-sm leading-relaxed text-text-secondary">
          {opt.desc}
        </p>

        {/* Specs Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">Cost</div>
            <div className="text-base font-bold text-text-primary">
              {opt.cost}
            </div>
          </div>
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">Setup Time</div>
            <div className="text-base font-bold text-text-primary">
              {opt.setup}
            </div>
          </div>
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">Security</div>
            <div className="text-base font-bold" style={{ color: secColor }}>
              {opt.security}
            </div>
          </div>
          <div className="rounded-[10px] bg-card p-3">
            <div className="mb-1 text-[11px] text-text-muted">Scalability</div>
            <div className="text-base font-bold text-text-primary">
              {opt.scalability}
            </div>
          </div>
        </div>

        {/* Best For */}
        <div className="mb-6 rounded-lg bg-accent-purple/[0.08] px-4 py-3">
          <span className="text-xs font-semibold text-accent-violet">
            Best for:{" "}
          </span>
          <span className="text-sm text-text-primary">{opt.bestFor}</span>
        </div>

        {/* Pros & Cons */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-sec-green">
              Pros
            </div>
            <ul className="space-y-1.5">
              {opt.pros.map((pro, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px] text-text-secondary"
                >
                  <span className="mt-0.5 text-sec-green">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-sec-red">
              Cons
            </div>
            <ul className="space-y-1.5">
              {opt.cons.map((con, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px] text-text-secondary"
                >
                  <span className="mt-0.5 text-sec-red">-</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* URL */}
        {opt.url && (
          <div className="mb-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Official Website
            </div>
            <a
              href={opt.url.startsWith("http") ? opt.url : `https://${opt.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-accent-cyan hover:underline"
            >
              {opt.url}
            </a>
          </div>
        )}

        {/* Quiz CTA */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/deploy/quiz"
            className="inline-block rounded-[10px] border border-accent-purple/40 bg-accent-purple/10 px-4 py-2 text-[13px] text-accent-violet no-underline transition-colors hover:bg-accent-purple/20"
          >
            Take the Deploy Quiz →
          </Link>
          <Link
            href="/submit"
            className="inline-block rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-4 py-2 text-[13px] text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
          >
            Submit a correction →
          </Link>
        </div>
      </div>
    </div>
  );
}
