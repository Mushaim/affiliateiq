"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, TrendingDown, TrendingUp, AlertCircle, Calendar, LayoutGrid } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { DateRangeFilter, inDateRange, DateRange } from "@/components/ui/DateRangeFilter";
import { SNAPSHOTS } from "@/data/seed/snapshots";
import { WeeklySnapshot } from "@/lib/types";

type ViewMode = "weekly" | "monthly";

function alertColor(type: string) {
  if (type === "overdue") return "var(--danger)";
  if (type === "fraud") return "var(--warning)";
  return "#A78BFA";
}

function SnapshotModal({ snap, onClose }: { snap: WeeklySnapshot; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative z-10 w-full max-w-lg rounded-2xl border p-6" style={{ background: "var(--surface2)", borderColor: "var(--border)" }} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: "var(--muted)" }}><X size={14} /></button>
        <div className="flex items-center gap-2 mb-1">
          <FileText size={15} style={{ color: "var(--accent)" }} />
          <h2 className="font-bold text-sm" style={{ color: "var(--text)" }}>Report · {snap.weekOf}</h2>
        </div>
        <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>Generated {new Date(snap.generatedAt).toLocaleString()}</p>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { label: "Revenue", value: `$${(snap.kpis.totalRevenue / 1_000_000).toFixed(2)}M`, color: "var(--accent-hi)" },
            { label: "Active Affiliates", value: snap.kpis.activeAffiliates, color: "var(--success)" },
            { label: "ROI", value: `${snap.kpis.roi}x`, color: "#A78BFA" },
            { label: "Commissions", value: `$${(snap.kpis.commissionsPaid / 1000).toFixed(0)}K`, color: "var(--warning)" },
            { label: "Net Growth", value: snap.kpis.netCustomerGrowth, color: snap.kpis.netCustomerGrowth < 0 ? "var(--danger)" : "var(--success)" },
            { label: "Fraud Flagged", value: snap.kpis.fraudFlagged, color: "var(--danger)" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg p-2.5" style={{ background: "var(--surface)" }}>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{label}</div>
              <div className="font-mono font-bold text-base mt-0.5" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Top Affiliates</p>
          {snap.topAffiliates.map((a, i) => (
            <div key={a.id} className="flex justify-between text-xs py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
              <span style={{ color: "var(--text-secondary)" }}>#{i + 1} {a.name}</span>
              <span className="font-mono" style={{ color: "var(--text)" }}>${(a.revenue / 1000).toFixed(0)}K</span>
            </div>
          ))}
        </div>

        {snap.alerts.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Alerts</p>
            <div className="space-y-1.5">
              {snap.alerts.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs p-2.5 rounded-lg border" style={{ background: `${alertColor(a.type)}08`, borderColor: `${alertColor(a.type)}25` }}>
                  <AlertCircle size={12} className="mt-0.5 shrink-0" style={{ color: alertColor(a.type) }} />
                  <span style={{ color: alertColor(a.type) }}>{a.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function MonthlyRollup({ snapshots }: { snapshots: WeeklySnapshot[] }) {
  const byMonth = useMemo(() => {
    const map = new Map<string, WeeklySnapshot[]>();
    for (const s of snapshots) {
      const m = s.weekOf.slice(0, 7);
      const arr = map.get(m) ?? [];
      arr.push(s);
      map.set(m, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0])).map(([month, snaps]) => {
      const latest = snaps[snaps.length - 1];
      const totalAlerts = snaps.reduce((s, x) => s + x.alerts.length, 0);
      return { month, snaps, latest, totalAlerts };
    });
  }, [snapshots]);

  return (
    <div className="space-y-3">
      {byMonth.map(({ month, snaps, latest, totalAlerts }, i) => (
        <motion.div key={month} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          className="rounded-xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>{new Date(month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{snaps.length} weekly report{snaps.length !== 1 ? "s" : ""}</p>
            </div>
            {totalAlerts > 0 ? (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--warning)" }}>
                <AlertCircle size={12} /> {totalAlerts} alert{totalAlerts !== 1 ? "s" : ""}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--success)" }}>
                <TrendingUp size={12} /> No alerts
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Revenue", value: `$${(latest.kpis.totalRevenue / 1_000_000).toFixed(2)}M`, color: "var(--accent-hi)" },
              { label: "Affiliates", value: latest.kpis.activeAffiliates, color: "var(--text)" },
              { label: "ROI", value: `${latest.kpis.roi}x`, color: "var(--text)" },
              { label: "Net Growth", value: latest.kpis.netCustomerGrowth, color: latest.kpis.netCustomerGrowth < 0 ? "var(--danger)" : "var(--success)" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{label}</div>
                <div className="font-mono font-semibold text-sm mt-0.5" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Reports() {
  const [selected, setSelected] = useState<WeeklySnapshot | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("weekly");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const filtered = useMemo(() => SNAPSHOTS.filter(s => !dateRange || inDateRange(s.weekOf, dateRange)), [dateRange]);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Reports" subtitle="Auto-generated · every Monday 08:00 UTC" />

      <div className="px-6 py-4 space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center rounded-lg border overflow-hidden text-xs" style={{ borderColor: "var(--border)" }}>
            <button onClick={() => setViewMode("weekly")} className="flex items-center gap-1.5 px-3 py-1.5 transition-colors" style={{ background: viewMode === "weekly" ? "var(--accent)" : "var(--surface)", color: viewMode === "weekly" ? "#fff" : "var(--muted)" }}>
              <LayoutGrid size={11} /> Weekly
            </button>
            <button onClick={() => setViewMode("monthly")} className="flex items-center gap-1.5 px-3 py-1.5 transition-colors" style={{ background: viewMode === "monthly" ? "var(--accent)" : "var(--surface)", color: viewMode === "monthly" ? "#fff" : "var(--muted)" }}>
              <Calendar size={11} /> Monthly rollup
            </button>
          </div>
          <DateRangeFilter value={dateRange} onChange={setDateRange} label="Filter by date" />

          <div className="flex items-center gap-1.5 text-xs ml-auto" style={{ color: "var(--muted)" }}>
            <div className="w-1.5 h-1.5 rounded-full pulse-slow" style={{ background: "var(--accent)" }} />
            Cron: <code className="font-mono" style={{ color: "var(--accent-hi)" }}>0 8 * * 1</code> · Next: Mon Jun 16 08:00 UTC
          </div>
        </div>

        {/* Content */}
        {viewMode === "monthly" ? (
          <MonthlyRollup snapshots={filtered} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {filtered.map((snap, i) => {
              const hasAlerts = snap.alerts.length > 0;
              return (
                <motion.div key={snap.weekOf} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(snap)}
                  className="rounded-xl border p-4 cursor-pointer transition-all hover:border-opacity-80"
                  style={{ background: "var(--surface)", borderColor: hasAlerts ? "rgba(220,38,38,0.25)" : "var(--border)" }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-bold" style={{ color: "var(--text)" }}>{snap.weekOf}</div>
                      <div className="text-xs" style={{ color: "var(--muted)" }}>Week of</div>
                    </div>
                    <FileText size={13} style={{ color: "var(--muted)" }} />
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {[
                      { label: "Revenue", value: `$${(snap.kpis.totalRevenue / 1_000_000).toFixed(2)}M` },
                      { label: "Affiliates", value: snap.kpis.activeAffiliates },
                      { label: "ROI", value: `${snap.kpis.roi}x` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-xs">
                        <span style={{ color: "var(--muted)" }}>{label}</span>
                        <span className="font-mono font-semibold" style={{ color: "var(--text)" }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  {hasAlerts ? (
                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--warning)" }}>
                      <AlertCircle size={11} /> {snap.alerts.length} alert{snap.alerts.length > 1 ? "s" : ""}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--success)" }}>
                      <TrendingUp size={11} /> No alerts
                    </div>
                  )}
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-10 text-xs" style={{ color: "var(--muted)" }}>No reports in selected date range.</div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <SnapshotModal snap={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
