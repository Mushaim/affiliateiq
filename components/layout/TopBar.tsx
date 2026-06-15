"use client";
import { Bell, RefreshCw } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: Props) {
  return (
    <header className="h-14 border-b flex items-center justify-between px-6 shrink-0" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
      <div>
        <h1 className="text-sm font-semibold" style={{ color: "var(--text)" }}>{title}</h1>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs px-2 py-1 rounded-full border" style={{ color: "var(--muted)", borderColor: "var(--border)" }}>
          Last updated: Jun 15, 2026
        </span>
        <button className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          <Bell size={14} />
        </button>
        <button className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  );
}
