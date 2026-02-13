interface CosmicBackgroundProps {
  intensity?: "normal" | "strong";
}

export default function CosmicBackground({
  intensity = "normal",
}: CosmicBackgroundProps) {
  const m = intensity === "strong" ? 2 : 1;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
      style={{ height: "100vh", zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Nebula 1 — Purple, top-left */}
      <div
        className="cosmic-animate absolute"
        style={{
          top: "-20%",
          left: "-10%",
          width: "60%",
          height: "60%",
          background: `radial-gradient(ellipse at center, rgba(139,92,246,${0.15 * m}), transparent 70%)`,
          animation: "nebula-float 60s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      {/* Nebula 2 — Cyan, center-right */}
      <div
        className="cosmic-animate absolute"
        style={{
          top: "20%",
          right: "-15%",
          width: "50%",
          height: "50%",
          background: `radial-gradient(ellipse at center, rgba(56,189,248,${0.08 * m}), transparent 70%)`,
          animation: "nebula-float 60s ease-in-out infinite reverse",
          willChange: "transform",
        }}
      />
      {/* Nebula 3 — Orange, bottom */}
      <div
        className="cosmic-animate absolute"
        style={{
          bottom: "-10%",
          left: "20%",
          width: "40%",
          height: "40%",
          background: `radial-gradient(ellipse at center, rgba(249,115,22,${0.06 * m}), transparent 70%)`,
          animation: "nebula-float 80s ease-in-out 20s infinite",
          willChange: "transform",
        }}
      />
      {/* Hero glow — centered purple */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background: `radial-gradient(circle, rgba(139,92,246,${0.12 * m}), transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
