/**
 * Compact number formatter for navigation badges and stats.
 *
 * Examples:
 *   65       → "65"
 *   999      → "999"
 *   1_000    → "1K"
 *   1_234    → "1.2K"
 *   9_999    → "10K"
 *   15_200   → "15K"
 *   120_000  → "120K"
 *   1_000_000 → "1M"
 *   1_234_567 → "1.2M"
 */
export function compactNumber(n: number): string {
  if (n < 1_000) return String(n);
  if (n < 10_000) {
    const k = n / 1_000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1).replace(/\.0$/, "")}K`;
  }
  if (n < 1_000_000) return `${Math.round(n / 1_000)}K`;
  const m = n / 1_000_000;
  return m % 1 === 0 ? `${m}M` : `${m.toFixed(1).replace(/\.0$/, "")}M`;
}
