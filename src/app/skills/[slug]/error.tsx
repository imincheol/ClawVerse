"use client";

import Link from "next/link";

export default function SkillDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <h2 className="font-display mb-3 text-2xl font-bold text-sec-red">
        Failed to load skill
      </h2>
      <p className="mb-6 text-sm text-text-secondary">
        {error.digest
          ? `Something went wrong (${error.digest})`
          : "The skill could not be loaded. It may not exist or there was a server error."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="cursor-pointer rounded-xl border border-accent-purple/40 bg-accent-purple/10 px-6 py-2.5 text-sm font-semibold text-accent-violet transition-colors hover:bg-accent-purple/20"
        >
          Try Again
        </button>
        <Link
          href="/skills"
          className="rounded-xl border border-border px-6 py-2.5 text-sm text-text-secondary no-underline transition-colors hover:border-border-hover hover:text-text-primary"
        >
          Back to Skills
        </Link>
      </div>
    </div>
  );
}
