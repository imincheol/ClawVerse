import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ClawVerse — Every Claw. One Universe.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090f",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.15) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Logo emoji */}
        <div style={{ fontSize: 96, marginBottom: 24, display: "flex" }}>
          🦞🌌
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            background: "linear-gradient(135deg, #8b5cf6 0%, #f97316 100%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          ClawVerse
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: 16,
            display: "flex",
          }}
        >
          Every Claw. One Universe.
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 18,
            color: "#64748b",
            marginTop: 32,
            display: "flex",
          }}
        >
          clawverse.io
        </div>
      </div>
    ),
    { ...size },
  );
}
