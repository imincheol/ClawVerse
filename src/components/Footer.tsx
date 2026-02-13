import NewsletterSignup from "./NewsletterSignup";

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-6">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 md:flex-row md:justify-between">
        <span className="text-xs text-text-muted">
          ClawVerse.io — Every Claw. One Universe. · Built for the OpenClaw
          ecosystem
        </span>
        <NewsletterSignup />
      </div>
    </footer>
  );
}
