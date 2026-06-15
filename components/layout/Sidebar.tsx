"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, ShieldAlert, Wallet, TrendingUp, FileText, Zap } from "lucide-react";

const nav = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/fraud", label: "Fraud Radar", icon: ShieldAlert },
  { href: "/payouts", label: "Payout Health", icon: Wallet },
  { href: "/growth", label: "Growth Tracker", icon: TrendingUp },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-60 shrink-0 flex flex-col border-r h-screen sticky top-0" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
      <div className="px-6 py-5 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>AffiliateIQ</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group"
              style={{
                color: active ? "var(--accent-glow)" : "var(--text-secondary)",
                background: active ? "rgba(59,130,246,0.12)" : "transparent",
                borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              <Icon size={16} className="shrink-0" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="text-xs" style={{ color: "var(--muted)" }}>
          <div className="font-semibold mb-0.5" style={{ color: "var(--text-secondary)" }}>NovaSaaS Co.</div>
          <div>Weekly cron: Mon 8:00 UTC</div>
        </div>
      </div>
    </aside>
  );
}
