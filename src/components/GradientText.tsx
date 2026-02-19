interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

export default function GradientText({
  children,
  className = "",
  gradient = "linear-gradient(135deg, #c084fc, #f97316)",
}: GradientTextProps) {
  return (
    <span
      className={className}
      style={{
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}
