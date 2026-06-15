"use client";
export function DemoModeBanner() {
  return (
    <div className="w-full border-b px-4 py-1 flex items-center justify-center gap-2 text-xs tracking-wide" style={{ background: "rgba(8,145,178,0.07)", borderColor: "rgba(8,145,178,0.18)", color: "var(--muted)" }}>
      <span className="w-1.5 h-1.5 rounded-full pulse-slow inline-block" style={{ background: "var(--accent)" }} />
      <span className="font-semibold uppercase tracking-widest text-xs" style={{ color: "var(--accent)" }}>Demo</span>
      <span style={{ color: "var(--border)" }}>·</span>
      <span>NovaSaaS Co. — Synthetic data</span>
    </div>
  );
}
