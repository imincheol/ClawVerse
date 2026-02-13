const FIELD_WIDTH = 3000;
const FIELD_HEIGHT = 2000;

function generateStars(count: number, seed: number, blur?: number): string {
  const shadows: string[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 16807) % 2147483647;
    const x = s % FIELD_WIDTH;
    s = (s * 16807) % 2147483647;
    const y = s % FIELD_HEIGHT;
    shadows.push(blur ? `${x}px ${y}px ${blur}px` : `${x}px ${y}px`);
  }
  return shadows.join(",");
}

const smallStars = generateStars(200, 1);
const mediumStars = generateStars(100, 5000, 1);
const largeStars = generateStars(30, 9000, 1);

function StarLayer({
  stars,
  size,
  color,
  duration,
  twinkle,
}: {
  stars: string;
  size: number;
  color: string;
  duration: number;
  twinkle?: boolean;
}) {
  const starStyle: React.CSSProperties = {
    width: size,
    height: size,
    background: "transparent",
    color,
    boxShadow: stars,
  };

  if (twinkle) {
    starStyle.animation = "twinkle 4s ease-in-out infinite";
  }

  return (
    <div
      className="cosmic-animate absolute left-0 top-0"
      style={{
        animation: `drift ${duration}s linear infinite`,
        willChange: "transform",
      }}
    >
      <div className={twinkle ? "cosmic-animate" : undefined} style={starStyle} />
      <div
        className={twinkle ? "cosmic-animate" : undefined}
        style={{ ...starStyle, position: "absolute", top: FIELD_HEIGHT }}
      />
    </div>
  );
}

export default function StarField() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <StarLayer
        stars={smallStars}
        size={1}
        color="rgba(255,255,255,0.4)"
        duration={150}
      />
      <StarLayer
        stars={mediumStars}
        size={1}
        color="rgba(255,255,255,0.6)"
        duration={100}
      />
      <StarLayer
        stars={largeStars}
        size={2}
        color="rgba(255,255,255,0.9)"
        duration={80}
        twinkle
      />
    </div>
  );
}
