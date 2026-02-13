import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 text-6xl">&#x1F99E;</div>
      <h1
        className="mb-3 text-4xl font-bold"
        style={{
          fontFamily: "var(--font-display)",
          background: "linear-gradient(135deg, #c084fc, #f97316)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </h1>
      <p className="mb-2 text-lg text-text-secondary">
        Lost in the ClawVerse
      </p>
      <p className="mb-8 text-sm text-text-muted">
        This page doesn&apos;t exist in any known universe.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-xl border border-accent-purple/40 bg-accent-purple/10 px-6 py-2.5 text-sm font-semibold text-accent-violet no-underline transition-colors hover:bg-accent-purple/20"
        >
          Go Home
        </Link>
        <Link
          href="/skills"
          className="rounded-xl border border-border px-6 py-2.5 text-sm text-text-secondary no-underline transition-colors hover:border-border-hover hover:text-text-primary"
        >
          Browse Skills
        </Link>
      </div>
    </div>
  );
}
