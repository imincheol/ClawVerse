export default function PulseLoading() {
  return (
    <div className="animate-pulse">
      {/* Title */}
      <div className="mb-7">
        <div className="mb-1.5 h-8 w-24 rounded-lg bg-white/[0.06]" />
        <div className="h-4 w-72 rounded bg-white/[0.04]" />
      </div>

      {/* Tag filter row */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-white/[0.06]"
            style={{ width: `${60 + i * 8}px` }}
          />
        ))}
      </div>

      {/* News items list */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[14px] border border-border bg-card p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <div className="h-5 w-20 rounded-full bg-white/[0.06]" />
              <div className="h-3 w-24 rounded bg-white/[0.04]" />
            </div>
            <div className="mb-1.5 h-4 w-3/4 rounded bg-white/[0.06]" />
            <div className="h-3 w-full rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}
