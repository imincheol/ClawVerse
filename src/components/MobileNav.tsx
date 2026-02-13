"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  count?: string;
}

export default function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:text-text-primary"
        aria-label={open ? "Close menu" : "Open menu"}
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
          {open ? (
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

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 right-0 top-[60px] z-50 border-b border-border bg-void/98 px-6 pb-4 pt-2 backdrop-blur-xl">
            <nav className="flex flex-col gap-1">
              {items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm no-underline transition-colors ${
                      isActive
                        ? "bg-accent-purple/15 font-semibold text-accent-violet"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    <span>{item.label}</span>
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
              <Link
                href="/submit"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-[10px] border border-accent-orange/40 bg-accent-orange/10 px-4 py-2.5 text-center text-[13px] font-semibold text-[#fb923c] no-underline transition-colors hover:bg-accent-orange/20"
              >
                + Submit
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
