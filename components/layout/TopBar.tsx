"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, RefreshCw, AlertTriangle, Clock, ShieldAlert, X } from "lucide-react";
import { getProgramStats } from "@/lib/dataUtils";

const ALERTS = (() => {
  const s = getProgramStats();
  const list: { type: "overdue" | "fraud" | "info"; message: string; detail: string }[] = [];
  if (s.overduePayouts > 0) {
    list.push({ type: "overdue", message: "Payouts overdue", detail: `$${(s.overduePayouts / 1000).toFixed(0)}K unpaid across 2 cycles — Dec 2025 & Jan 2026` });
  }
  if (s.fraudFlaggedRevenuePct > 0.2) {
    list.push({ type: "fraud", message: "Fraud cluster detected", detail: `8 affiliates flagged (ad_source) — ${(s.fraudFlaggedRevenuePct * 100).toFixed(0)}% of revenue at risk` });
  }
  if (s.netCustomerGrowth < 0) {
    list.push({ type: "info", message: "Negative net growth", detail: `${s.netCustomerGrowth} net customers over 4 consecutive quarters` });
  }
  list.push({ type: "info", message: "Next payout due", detail: `$${(s.nextPayoutDue / 1000).toFixed(0)}K due Jul 2, 2026` });
  return list;
})();

function alertIcon(type: string) {
  if (type === "overdue") return <Clock size={13} style={{ color: "var(--danger)" }} />;
  if (type === "fraud")   return <ShieldAlert size={13} style={{ color: "var(--warning)" }} />;
  return <AlertTriangle size={13} style={{ color: "var(--accent-hi)" }} />;
}

interface Props {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: Props) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [lastRefresh, setLastRefresh] = useState("Jun 15, 2026 08:00");
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleReload() {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      const now = new Date();
      setLastRefresh(now.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }));
      window.location.reload();
    }, 600);
  }

  const unread = ALERTS.filter(a => a.type !== "info").length;

  return (
    <header className="h-14 border-b flex items-center justify-between px-6 shrink-0 gap-4" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
      <div className="min-w-0">
        <h1 className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{title}</h1>
        {subtitle && <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Timestamp */}
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-xs font-medium tabular-nums" style={{ color: "var(--text-secondary, var(--muted))" }}>{lastRefresh}</span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>Auto-syncs weekly</span>
        </div>

        <div className="w-px h-5" style={{ background: "var(--border)" }} />

        {/* Reload */}
        <button
          onClick={handleReload}
          title="Reload data"
          className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors hover:bg-white/5"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <RefreshCw size={13} className={spinning ? "animate-spin" : ""} />
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(o => !o)}
            title="Notifications"
            className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors hover:bg-white/5 relative"
            style={{ borderColor: notifOpen ? "var(--accent)" : "var(--border)", color: notifOpen ? "var(--accent-hi)" : "var(--muted)" }}
          >
            <Bell size={13} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: "var(--danger)", color: "#fff" }}>
                {unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-2xl overflow-hidden z-50"
                style={{ background: "var(--surface2)", borderColor: "var(--border)" }}
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                  <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>Notifications</span>
                  <button onClick={() => setNotifOpen(false)} style={{ color: "var(--muted)" }}><X size={12} /></button>
                </div>
                {ALERTS.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 px-4 py-3 border-b transition-colors hover:bg-white/[0.03]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="mt-0.5 shrink-0">{alertIcon(a.type)}</div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{a.message}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{a.detail}</p>
                    </div>
                  </motion.div>
                ))}
                <div className="px-4 py-2.5 text-xs text-center" style={{ color: "var(--muted)" }}>
                  {ALERTS.length} notification{ALERTS.length !== 1 ? "s" : ""}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
