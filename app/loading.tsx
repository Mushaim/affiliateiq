export default function Loading() {
  return (
    <div className="flex flex-col min-h-full">
      {/* TopBar skeleton */}
      <div className="h-14 border-b flex items-center px-6 gap-3" style={{ borderColor: "var(--border)" }}>
        <div className="h-4 w-32 rounded-md animate-pulse" style={{ background: "var(--surface2)" }} />
      </div>
      {/* Content skeleton */}
      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border p-5 h-28 animate-pulse" style={{ background: "var(--surface)", borderColor: "var(--border)" }} />
          ))}
        </div>
        <div className="rounded-xl border h-72 animate-pulse" style={{ background: "var(--surface)", borderColor: "var(--border)" }} />
      </div>
    </div>
  );
}
