export default function Loading() {
  return (
    <div className="animate-pulse space-y-6 py-8">
      <div className="h-8 w-48 rounded-lg bg-white/[0.06]" />
      <div className="h-4 w-80 rounded bg-white/[0.04]" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-[14px] border border-border bg-card"
          />
        ))}
      </div>
    </div>
  );
}
