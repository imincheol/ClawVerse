import { ImageResponse } from "next/og";
import { SKILLS, SECURITY_CONFIG } from "@/data/skills";

export const alt = "ClawVerse Skill";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return SKILLS.map((s) => ({ slug: s.slug }));
}

export default async function SkillOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = SKILLS.find((s) => s.slug === slug);

  if (!skill) {
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
          Skill Not Found
        </div>
      ),
      { ...size },
    );
  }

  const sec = SECURITY_CONFIG[skill.security];

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
        {/* Subtle purple gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.12) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        {/* Top bar: logo + category */}
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
              ClawVerse Skills
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: sec.color,
                border: `2px solid ${sec.color}`,
                borderRadius: 9999,
                padding: "6px 20px",
                display: "flex",
              }}
            >
              {sec.label}
            </div>
          </div>
        </div>

        {/* Skill name */}
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
          {skill.name}
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
          {skill.desc}
        </div>

        {/* Bottom stats */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, color: "#64748b", display: "flex" }}>
              Installs
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#e2e8f0", display: "flex" }}>
              {skill.installs.toLocaleString()}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, color: "#64748b", display: "flex" }}>
              Rating
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#fbbf24", display: "flex" }}>
              {skill.rating}
            </span>
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#8b5cf6",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 8,
              padding: "4px 14px",
              display: "flex",
            }}
          >
            {skill.category}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
