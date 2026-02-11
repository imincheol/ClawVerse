"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/skills", label: "Skills", count: "5,705" },
  { href: "/deploy", label: "Deploy" },
  { href: "/projects", label: "Projects", count: "13" },
  { href: "/pulse", label: "Pulse" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-void/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="text-[22px]" role="img" aria-label="lobster">
            &#x1F99E;
          </span>
          <span
            className="font-display text-xl font-bold"
            style={{
              background: "linear-gradient(135deg, #c084fc, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ClawVerse
          </span>
          <span className="ml-1 rounded-md border border-border px-2 py-0.5 text-[11px] text-text-muted">
            .io
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] no-underline transition-all ${
                  isActive
                    ? "bg-accent-purple/15 font-semibold text-accent-violet"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {item.label}
                {item.count && (
                  <span
                    className={`rounded-full px-1.5 py-px text-[10px] ${
                      isActive
                        ? "bg-accent-purple/20 text-[#c084fc]"
                        : "bg-white/[0.06] text-text-muted"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/submit"
          className="rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-4 py-1.5 text-[13px] font-semibold text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
        >
          + Submit
        </Link>
      </div>
    </header>
  );
}
