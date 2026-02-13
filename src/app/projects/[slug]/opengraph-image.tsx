import { ImageResponse } from "next/og";
import { PROJECTS, LAYERS } from "@/data/projects";

export const alt = "ClawVerse Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

function formatStars(count: number | null): string | null {
  if (!count) return null;
  if (count >= 1000)
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K`;
  return String(count);
}

export default async function ProjectOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#09090f",
            color: "#e2e8f0",
            fontSize: 48,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Project Not Found
        </div>
      ),
      { ...size },
    );
  }

  const layer = LAYERS[project.layer];
  const stars = formatStars(project.stars);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#09090f",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle cyan gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.12) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        {/* Top bar: logo + layer badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 36, display: "flex" }}>🦞</span>
            <span style={{ fontSize: 24, color: "#64748b", display: "flex" }}>
              ClawVerse Projects
            </span>
          </div>
          <div
            style={{
              fontSize: 18,
              color: layer.color,
              border: `2px solid ${layer.color}`,
              borderRadius: 9999,
              padding: "6px 20px",
              display: "flex",
            }}
          >
            {layer.label}
          </div>
        </div>

        {/* Project name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#e2e8f0",
            lineHeight: 1.2,
            marginBottom: 16,
            display: "flex",
          }}
        >
          {project.name}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 26,
            color: "#94a3b8",
            lineHeight: 1.4,
            marginBottom: 40,
            display: "flex",
          }}
        >
          {project.desc}
        </div>

        {/* Bottom stats */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          {stars && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "#fbbf24", display: "flex" }}>
                ★ {stars}
              </span>
              <span style={{ fontSize: 20, color: "#64748b", display: "flex" }}>
                stars
              </span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, color: "#64748b", display: "flex" }}>
              Type
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#e2e8f0", display: "flex" }}>
              {project.official ? "Official" : "Community"}
            </span>
          </div>
          {project.url && (
            <div
              style={{
                fontSize: 18,
                color: "#38bdf8",
                display: "flex",
              }}
            >
              {project.url}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
