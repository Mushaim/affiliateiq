"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, ShieldAlert, TrendingUp, FileText, Zap, CreditCard, X } from "lucide-react";

const nav = [
  { href: "/",            label: "Command Center", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard",    icon: Trophy },
  { href: "/fraud",       label: "Fraud Radar",    icon: ShieldAlert },
  { href: "/growth",      label: "Growth Tracker", icon: TrendingUp },
  { href: "/reports",     label: "Reports",        icon: FileText },
  { href: "/payouts",     label: "Payouts",        icon: CreditCard },
];

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const path = usePathname();
  return (
    <aside className="w-60 shrink-0 flex flex-col border-r h-screen" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
      {/* Logo row */}
      <div className="px-6 py-5 border-b flex items-center gap-2 shrink-0" style={{ borderColor: "var(--border)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
          <Zap size={14} className="text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight flex-1" style={{ color: "var(--text)" }}>AffiliateIQ</span>
        {/* Close button — only shown on mobile drawer */}
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: "var(--muted)" }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Nav — scrollable so it never pushes the footer off */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onCloseMobile}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={{
                color: active ? "var(--accent-hi)" : "var(--text-secondary)",
                background: active ? "rgba(8,145,178,0.12)" : "transparent",
                borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              <Icon size={16} className="shrink-0" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer — always visible, never clipped */}
      <div className="shrink-0 px-5 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--success)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>NovaSaaS Co.</span>
        </div>
        <p className="text-xs" style={{ color: "var(--muted)" }}>Demo · Auto-syncs weekly</p>
      </div>
    </aside>
  );
}
