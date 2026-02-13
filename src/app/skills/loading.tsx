export default function SkillsLoading() {
  return (
    <div className="animate-pulse">
      {/* Title */}
      <div className="mb-7">
        <div className="mb-1.5 h-8 w-36 rounded-lg bg-white/[0.06]" />
        <div className="h-4 w-72 rounded bg-white/[0.04]" />
      </div>

      {/* Search bar */}
      <div className="mb-5 h-10 rounded-xl bg-white/[0.06]" />

      {/* Filter row */}
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-white/[0.06]"
            style={{ width: `${60 + i * 12}px` }}
          />
        ))}
      </div>

      {/* Card grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[14px] border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="h-5 w-40 rounded bg-white/[0.06]" />
              <div className="h-5 w-16 rounded-full bg-white/[0.06]" />
            </div>
            <div className="mb-2 h-3 w-full rounded bg-white/[0.04]" />
            <div className="mb-4 h-3 w-3/4 rounded bg-white/[0.04]" />
            <div className="flex gap-2">
              <div className="h-5 w-14 rounded bg-white/[0.04]" />
              <div className="h-5 w-14 rounded bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
