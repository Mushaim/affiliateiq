"use client";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, TrendingUp, Award, AlertTriangle, Clock } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { KPICard } from "@/components/charts/KPICard";
import { Badge } from "@/components/ui/Badge";
import { DateRangeFilter, DateRange } from "@/components/ui/DateRangeFilter";
import { getProgramStats, getMonthlyProgramRevenue, getTopAffiliates, formatCurrency } from "@/lib/dataUtils";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const GlobeScene = dynamic(() => import("@/components/charts/GlobeScene").then(m => ({ default: m.GlobeScene })), { ssr: false });

type Metric = "revenue" | "customers" | "affiliates" | "cancels" | "clicks";

const METRICS: { key: Metric; label: string; color: string; format?: string }[] = [
  { key: "revenue",    label: "Revenue",      color: "#0891B2" },
  { key: "customers",  label: "Customers",    color: "#16A34A" },
  { key: "affiliates", label: "New Affiliates", color: "#A78BFA" },
  { key: "cancels",    label: "Cancels",      color: "#DC2626" },
  { key: "clicks",     label: "Clicks",       color: "#CA8A04" },
];

function fmtMonth(m: string) {
  const [y, mo] = m.split("-");
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function fmtTick(v: number, metric: Metric) {
  if (metric === "revenue") return v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1_000).toFixed(0)}K`;
  if (metric === "clicks") return v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v);
  return String(v);
}

function fmtTooltip(v: number, metric: Metric) {
  if (metric === "revenue") return v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M` : `$${(v / 1_000).toFixed(0)}K`;
  return String(v);
}

export default function CommandCenter() {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const stats = getProgramStats();
  const allMonthly = getMonthlyProgramRevenue();
  const top5 = getTopAffiliates(5);

  const monthly = useMemo(() => {
    if (!dateRange) return allMonthly;
    return allMonthly.filter(d => d.month >= dateRange.from.slice(0, 7) && d.month <= dateRange.to.slice(0, 7));
  }, [allMonthly, dateRange]);

  const activeMetric = METRICS.find(m => m.key === metric)!;

  // Map monthly to selected metric's data key
  const chartData = monthly.map(d => ({
    month: d.month,
    value: metric === "revenue" ? d.revenue
         : metric === "customers" ? d.customers
         : metric === "affiliates" ? d.newReferrals
         : metric === "cancels" ? d.cancels
         : d.clicks,
  }));

  // Summary for selected period
  const periodTotal = chartData.reduce((s, d) => s + d.value, 0);
  const periodAvg = chartData.length ? Math.round(periodTotal / chartData.length) : 0;

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Command Center" subtitle="NovaSaaS Co. — Affiliate Program" />

      {/* Hero */}
      <div className="relative overflow-hidden px-6 pt-6 pb-0" style={{ minHeight: 300 }}>
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <GlobeScene />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 30%, var(--bg) 90%)" }} />

        <motion.div className="relative z-10 mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full pulse-slow" style={{ background: "var(--success)" }} />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "var(--muted)" }}>50 Affiliates · 22 Countries · Live</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>Affiliate Network Overview</h2>
        </motion.div>

        <div className="relative z-10 grid grid-cols-2 xl:grid-cols-4 gap-3 pb-6">
          <KPICard label="All-Time Revenue"   value={stats.allTimeRevenue}      format="currency"    icon={DollarSign} iconColor="var(--accent)"   delta={12.4}  deltaLabel="vs last quarter" delay={0}   />
          <KPICard label="Active Affiliates"  value={stats.activeAffiliates}    icon={Users}         iconColor="var(--success)"  delta={-31}   deltaLabel="from peak"       delay={0.1} />
          <KPICard label="Program ROI"        value={stats.roi}                 format="multiplier"  icon={TrendingUp} iconColor="#A78BFA"            delta={0.4}   deltaLabel="vs last month"   delay={0.2} />
          <KPICard label="Commissions Paid"   value={stats.allTimeCommissions}  format="currency"    icon={Award}      iconColor="var(--warning)"                                          delay={0.3} />
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4">
        {/* Alerts */}
        {(stats.overduePayouts > 0 || stats.fraudFlaggedRevenuePct > 0.2) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.overduePayouts > 0 && (
              <div className="flex items-start gap-3 rounded-xl px-4 py-3 border" style={{ background: "rgba(220,38,38,0.05)", borderColor: "rgba(220,38,38,0.2)" }}>
                <Clock size={14} className="mt-0.5 shrink-0" style={{ color: "var(--danger)" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--danger)" }}>Overdue Payouts: {formatCurrency(stats.overduePayouts)}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Dec 2025 + Jan 2026 cycles · 16 days overdue</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 rounded-xl px-4 py-3 border" style={{ background: "rgba(202,138,4,0.05)", borderColor: "rgba(202,138,4,0.2)" }}>
              <AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--warning)" }}>8 Fraud-Flagged Affiliates</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>ad_source cluster · high cancel rates · ~36% of revenue</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main chart + top affiliates */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="xl:col-span-2 rounded-xl border p-5"
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          >
            {/* Chart header: metric tabs + date filter */}
            <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Program Analytics</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {dateRange ? `${dateRange.from} → ${dateRange.to}` : "All time"} ·{" "}
                  {metric === "revenue" ? formatCurrency(periodTotal) : periodTotal.toLocaleString()} total ·{" "}
                  avg {metric === "revenue" ? formatCurrency(periodAvg) : periodAvg.toLocaleString()}/mo
                </p>
              </div>
              <DateRangeFilter value={dateRange} onChange={setDateRange} label="Date range" />
            </div>

            {/* Metric tabs */}
            <div className="flex items-center gap-1 mb-4 flex-wrap">
              {METRICS.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMetric(m.key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: metric === m.key ? `${m.color}18` : "transparent",
                    color: metric === m.key ? m.color : "var(--muted)",
                    border: `1px solid ${metric === m.key ? m.color + "40" : "transparent"}`,
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={200}>
              {metric === "revenue" ? (
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeMetric.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={activeMetric.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tickFormatter={fmtMonth} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.max(0, Math.floor(chartData.length / 10))} />
                  <YAxis tickFormatter={v => fmtTick(v, metric)} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }} labelStyle={{ color: "var(--text-secondary)", fontSize: 11 }} itemStyle={{ color: activeMetric.color, fontFamily: "var(--font-geist-mono)", fontSize: 11 }} formatter={(v) => [fmtTooltip(Number(v), metric), activeMetric.label]} labelFormatter={(m) => fmtMonth(String(m))} />
                  <Area type="monotone" dataKey="value" stroke={activeMetric.color} strokeWidth={2} fill="url(#chartGrad)" dot={false} activeDot={{ r: 3, fill: activeMetric.color }} />
                </AreaChart>
              ) : metric === "cancels" || metric === "affiliates" ? (
                <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tickFormatter={fmtMonth} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.max(0, Math.floor(chartData.length / 10))} />
                  <YAxis tickFormatter={v => fmtTick(v, metric)} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }} labelStyle={{ color: "var(--text-secondary)", fontSize: 11 }} itemStyle={{ color: activeMetric.color, fontFamily: "var(--font-geist-mono)", fontSize: 11 }} formatter={(v) => [fmtTooltip(Number(v), metric), activeMetric.label]} labelFormatter={(m) => fmtMonth(String(m))} />
                  <Bar dataKey="value" fill={activeMetric.color} radius={[3, 3, 0, 0]} name={activeMetric.label} />
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tickFormatter={fmtMonth} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.max(0, Math.floor(chartData.length / 10))} />
                  <YAxis tickFormatter={v => fmtTick(v, metric)} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }} labelStyle={{ color: "var(--text-secondary)", fontSize: 11 }} itemStyle={{ color: activeMetric.color, fontFamily: "var(--font-geist-mono)", fontSize: 11 }} formatter={(v) => [fmtTooltip(Number(v), metric), activeMetric.label]} labelFormatter={(m) => fmtMonth(String(m))} />
                  <Line type="monotone" dataKey="value" stroke={activeMetric.color} strokeWidth={2} dot={false} activeDot={{ r: 3 }} name={activeMetric.label} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </motion.div>

          {/* Top affiliates */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Top Affiliates</h3>
            <div className="space-y-3">
              {top5.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold w-5 shrink-0" style={{ color: i === 0 ? "var(--warning)" : "var(--muted)" }}>#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>{a.name}</div>
                    <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted)" }}>{formatCurrency(a.metrics.totalRevenue)}</div>
                  </div>
                  <Badge variant={a.segment} />
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
              {[
                { label: "Active customers", value: stats.activeCustomers, color: "var(--text)" },
                { label: "Peak customers",   value: stats.peakCustomers,   color: "var(--muted)" },
                { label: "Net growth (4Q)",  value: stats.netCustomerGrowth, color: "var(--danger)" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span style={{ color: "var(--muted)" }}>{label}</span>
                  <span className="font-mono font-semibold" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Segment breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Champions",    count: 8,  revenue: 1707000, color: "var(--success)" },
            { label: "Mid-Tier",     count: 22, revenue: 624000,  color: "var(--accent)"  },
            { label: "At Risk",      count: 12, revenue: 149000,  color: "var(--warning)" },
            { label: "Fraud Flagged",count: 8,  revenue: 80000,   color: "var(--danger)"  },
          ].map(seg => (
            <div key={seg.label} className="rounded-xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
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
