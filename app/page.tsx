"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, TrendingUp, Award, AlertTriangle, Clock } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { KPICard } from "@/components/charts/KPICard";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { Badge } from "@/components/ui/Badge";
import { getProgramStats, getMonthlyProgramRevenue, getTopAffiliates, formatCurrency } from "@/lib/dataUtils";

const GlobeScene = dynamic(() => import("@/components/charts/GlobeScene").then(m => ({ default: m.GlobeScene })), { ssr: false });

const PERIODS = ["7D", "30D", "90D", "all"] as const;
type Period = typeof PERIODS[number];

export default function CommandCenter() {
  const [period, setPeriod] = useState<Period>("all");
  const stats = getProgramStats();
  const monthly = getMonthlyProgramRevenue();
  const top5 = getTopAffiliates(5);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Command Center" subtitle="NovaSaaS Co. Affiliate Program · Real-time overview" />

      {/* Hero section with globe */}
      <div className="relative overflow-hidden px-6 pt-6 pb-0" style={{ minHeight: 320 }}>
        {/* 3D Globe background */}
        <div className="absolute inset-0 opacity-70 pointer-events-none">
          <GlobeScene />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--bg) 95%)" }} />

        {/* Hero text */}
        <motion.div
          className="relative z-10 mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-slow" />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "var(--muted)" }}>Live · 50 Affiliates · 22 Countries</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Affiliate Network Overview
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Program performance at a glance · Jun 15, 2026
          </p>
        </motion.div>

        {/* KPI Grid */}
        <div className="relative z-10 grid grid-cols-2 xl:grid-cols-4 gap-4 pb-6">
          <KPICard label="All-Time Revenue" value={stats.allTimeRevenue} format="currency" icon={DollarSign} iconColor="var(--accent)" delta={12.4} deltaLabel="vs last quarter" delay={0} />
          <KPICard label="Active Affiliates" value={stats.activeAffiliates} icon={Users} iconColor="var(--success)" delta={-31} deltaLabel="from 114 peak" delay={0.1} />
          <KPICard label="Program ROI" value={stats.roi} format="multiplier" icon={TrendingUp} iconColor="#A78BFA" delta={0.4} deltaLabel="vs last month" delay={0.2} />
          <KPICard label="Commissions Paid" value={stats.allTimeCommissions} format="currency" icon={Award} iconColor="var(--warning)" delay={0.3} />
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 pb-6 space-y-5">

        {/* Alerts */}
        {(stats.overduePayouts > 0 || stats.fraudFlaggedRevenuePct > 0.2) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.overduePayouts > 0 && (
              <div className="flex items-start gap-3 rounded-xl px-4 py-3 border" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }}>
                <Clock size={15} className="mt-0.5 shrink-0" style={{ color: "var(--danger)" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--danger)" }}>Overdue Payouts: {formatCurrency(stats.overduePayouts)}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Dec 2025 + Jan 2026 cycles unpaid · 16 days overdue</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 rounded-xl px-4 py-3 border" style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)" }}>
              <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--warning)" }}>8 Fraud-Flagged Affiliates</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>ad_source cluster · high cancel rates · ~36% of revenue</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Revenue chart + Top affiliates */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-2 rounded-xl border p-5"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Revenue Over Time</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Affiliate-attributed revenue · all campaigns</p>
              </div>
              <div className="flex items-center gap-1">
                {PERIODS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors"
                    style={{
                      background: period === p ? "var(--accent)" : "transparent",
                      color: period === p ? "#fff" : "var(--muted)",
                    }}
                  >
                    {p === "all" ? "All" : p}
                  </button>
                ))}
              </div>
            </div>
            <RevenueChart data={monthly} period={period} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border p-5"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Top Affiliates</h3>
            <div className="space-y-3">
              {top5.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold w-5 shrink-0" style={{ color: i === 0 ? "var(--warning)" : "var(--muted)" }}>#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>{a.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{formatCurrency(a.metrics.totalRevenue)}</div>
                  </div>
                  <Badge variant={a.segment} label={a.segment === "champion" ? "⭐" : a.segment.charAt(0).toUpperCase()} />
                </div>
              ))}
            </div>

            {/* Program health summary */}
            <div className="mt-5 pt-4 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--muted)" }}>Active customers</span>
                <span className="font-mono font-semibold" style={{ color: "var(--text)" }}>{stats.activeCustomers}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--muted)" }}>Peak customers</span>
                <span className="font-mono font-semibold" style={{ color: "var(--text)" }}>{stats.peakCustomers}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--muted)" }}>Net growth (4Q)</span>
                <span className="font-mono font-semibold" style={{ color: "var(--danger)" }}>{stats.netCustomerGrowth}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Segment breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Champions", count: 8, revenue: 1707000, color: "var(--success)" },
            { label: "Mid-Tier", count: 22, revenue: 624000, color: "var(--accent)" },
            { label: "At Risk", count: 12, revenue: 149000, color: "var(--warning)" },
            { label: "Fraud Flagged", count: 8, revenue: 80000, color: "var(--danger)" },
          ].map(seg => (
            <div key={seg.label} className="rounded-xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{seg.label}</span>
              </div>
              <div className="font-mono text-xl font-bold" style={{ color: "var(--text)" }}>{seg.count}</div>
              <div className="text-xs mt-0.5 font-mono" style={{ color: seg.color }}>{formatCurrency(seg.revenue)}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
