export default function ProjectsLoading() {
  return (
    <div className="animate-pulse">
      {/* Title */}
      <div className="mb-7">
        <div className="mb-1.5 h-8 w-48 rounded-lg bg-white/[0.06]" />
        <div className="h-4 w-80 rounded bg-white/[0.04]" />
      </div>

      {/* Layer tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 rounded-full bg-white/[0.06]"
            style={{ width: `${70 + i * 8}px` }}
          />
        ))}
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <div className="mx-auto mb-1 h-6 w-16 rounded bg-white/[0.06]" />
            <div className="mx-auto h-3 w-20 rounded bg-white/[0.04]" />
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
            <div className="mb-2 flex items-center gap-2">
              <div className="h-5 w-20 rounded-full bg-white/[0.06]" />
              <div className="h-5 w-32 rounded bg-white/[0.06]" />
            </div>
            <div className="mb-2 h-3 w-full rounded bg-white/[0.04]" />
            <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}
