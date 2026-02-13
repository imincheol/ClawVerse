"use client";

import Link from "next/link";
import CosmicBackground from "@/components/CosmicBackground";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center text-center">
      <CosmicBackground intensity="strong" />
      <div className="mb-6 text-6xl">&#x1F30C;</div>
      <h1
        className="font-display mb-3 text-4xl font-bold"
        style={{
          background: "linear-gradient(135deg, #ef4444, #f97316)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Something went wrong
      </h1>
      <p className="mb-2 text-lg text-text-secondary">
        A cosmic disturbance occurred
      </p>
      <p className="mb-8 text-sm text-text-muted">
        {error.digest && (
          <span className="font-code text-xs text-text-muted">
            Error ID: {error.digest}
          </span>
        )}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="cursor-pointer rounded-xl border border-accent-purple/40 bg-accent-purple/10 px-6 py-2.5 text-sm font-semibold text-accent-violet transition-colors hover:bg-accent-purple/20"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border px-6 py-2.5 text-sm text-text-secondary no-underline transition-colors hover:border-border-hover hover:text-text-primary"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
