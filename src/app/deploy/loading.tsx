export default function DeployLoading() {
  return (
    <div className="animate-pulse">
      {/* Title */}
      <div className="mb-7">
        <div className="mb-1.5 h-8 w-36 rounded-lg bg-white/[0.06]" />
        <div className="h-4 w-72 rounded bg-white/[0.04]" />
      </div>

      {/* Filter pills */}
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-white/[0.06]"
            style={{ width: `${80 + i * 10}px` }}
          />
        ))}
      </div>

      {/* Recommendation boxes */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-2 h-4 w-28 rounded bg-white/[0.06]" />
            <div className="mb-3 h-3 w-full rounded bg-white/[0.04]" />
            <div className="h-8 w-24 rounded-lg bg-white/[0.06]" />
          </div>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[14px] border border-border bg-card p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="h-5 w-32 rounded bg-white/[0.06]" />
              <div className="h-5 w-12 rounded bg-white/[0.06]" />
            </div>
            <div className="mb-2 h-3 w-full rounded bg-white/[0.04]" />
            <div className="flex gap-3">
              <div className="h-4 w-16 rounded bg-white/[0.04]" />
              <div className="h-4 w-16 rounded bg-white/[0.04]" />
              <div className="h-4 w-16 rounded bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
