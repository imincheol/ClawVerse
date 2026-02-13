import NewsletterSignup from "./NewsletterSignup";

export default function Footer() {
  const releaseVersion = process.env.NEXT_PUBLIC_RELEASE_VERSION || "dev";
  const releaseDate = process.env.NEXT_PUBLIC_RELEASE_DATE || "n/a";
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

  return (
    <footer className="border-t border-border px-6 py-6">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <div className="text-xs text-text-muted">
            ClawVerse.io — Every Claw. One Universe. · Built for the OpenClaw
            ecosystem
          </div>
          <div className="mt-1 text-[11px] text-text-muted">
            Release {releaseVersion} · {releaseDate}
            {commit ? ` · ${commit}` : ""}
          </div>
        </div>
        <NewsletterSignup />
      </div>
    </footer>
  );
}
