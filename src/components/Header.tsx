"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DATA_COUNTS } from "@/data/metadata";
import { compactNumber } from "@/lib/format";
import GradientText from "./GradientText";

const NAV_ITEMS = [
  { href: "/skills", label: "Skills", count: compactNumber(DATA_COUNTS.skills) },
  { href: "/mcp", label: "MCP", count: compactNumber(DATA_COUNTS.mcpServers) },
  { href: "/plugins", label: "Plugins", count: compactNumber(DATA_COUNTS.plugins) },
  { href: "/agents", label: "Agents", count: compactNumber(DATA_COUNTS.agents) },
  { href: "/deploy", label: "Deploy", count: compactNumber(DATA_COUNTS.deployOptions) },
  { href: "/projects", label: "Projects", count: compactNumber(DATA_COUNTS.projects) },
  { href: "/pulse", label: "Pulse", count: compactNumber(DATA_COUNTS.pulseItems) },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-void/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="text-[22px]" role="img" aria-label="lobster">
            &#x1F99E;
          </span>
          <GradientText className="font-display text-xl font-bold">
            ClawVerse
          </GradientText>
          <span className="ml-1 rounded-md border border-border px-2 py-0.5 text-[11px] text-text-muted">
            .io
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex lg:gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] no-underline transition-all lg:gap-1.5 lg:px-3 ${
                  isActive
                    ? "bg-accent-purple/15 font-semibold text-accent-violet"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {item.count && (
                  <span
                    className={`hidden rounded-full px-1.5 py-px text-[10px] lg:inline ${
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

        <div className="flex items-center gap-3">
          <Link
            href="/submit"
            className="rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-4 py-1.5 text-[13px] font-semibold text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
          >
            + Submit
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="15" y2="5" />
                  <line x1="3" y1="9" x2="15" y2="9" />
                  <line x1="3" y1="13" x2="15" y2="13" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div id="mobile-nav" className="border-t border-border bg-void/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-1 px-6 py-3" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-[14px] no-underline transition-all ${
                    isActive
                      ? "bg-accent-purple/15 font-semibold text-accent-violet"
                      : "text-text-secondary hover:bg-white/[0.03] hover:text-text-primary"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {item.count && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
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
        </div>
      )}
    </header>
  );
}
