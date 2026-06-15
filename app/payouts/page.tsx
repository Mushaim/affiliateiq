"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, AlertTriangle, ArrowRight, X, CreditCard } from "lucide-react";
import { PageWrapper, FadeItem } from "@/components/ui/PageWrapper";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { MultiSelect, ActiveFilterTags } from "@/components/ui/MultiSelect";
import { PAYOUT_CYCLES } from "@/data/seed/payouts";
import { PayoutCycle, PayoutStatus } from "@/lib/types";

function statusIcon(s: PayoutStatus) {
  if (s === "paid") return <CheckCircle size={14} style={{ color: "#10B981" }} />;
  if (s === "overdue") return <AlertTriangle size={14} style={{ color: "#EF4444" }} />;
  if (s === "upcoming") return <ArrowRight size={14} style={{ color: "#A78BFA" }} />;
  return <Clock size={14} style={{ color: "#F59E0B" }} />;
}

function statusColor(s: PayoutStatus): string {
  if (s === "paid") return "#10B981";
  if (s === "overdue") return "#EF4444";
  if (s === "upcoming") return "#A78BFA";
  return "#F59E0B";
}

function CycleModal({ cycle, onClose }: { cycle: PayoutCycle; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl border p-6 max-h-[80vh] overflow-y-auto"
        style={{ background: "var(--surface2)", borderColor: "var(--border)" }}
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: "var(--muted)" }}>
          <X size={14} />
        </button>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            {statusIcon(cycle.status)}
            <h2 className="font-bold text-sm" style={{ color: "var(--text)" }}>Cycle: {cycle.cycleMonth}</h2>
          </div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {cycle.affiliatesCount} affiliates · Due {cycle.dueDate}
            {cycle.paidDate && ` · Paid ${cycle.paidDate}`}
          </p>
          <p className="text-xs mt-0.5 font-mono font-bold" style={{ color: statusColor(cycle.status) }}>
            Total: ${cycle.totalAmount.toLocaleString()}
          </p>
        </div>

        {cycle.items.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--muted)" }}>No individual payout items for this cycle.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Affiliate", "Amount", "Status", "Mismatch"].map(h => (
                  <th key={h} className="py-2 text-left font-semibold uppercase tracking-wider pr-3" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cycle.items.map(item => (
                <tr key={item.affiliateId} className="border-b" style={{ borderColor: "var(--border)" }}>
                  <td className="py-2.5 pr-3" style={{ color: "var(--text)" }}>{item.affiliateName}</td>
                  <td className="py-2.5 pr-3 font-mono" style={{ color: "var(--text)" }}>${item.amount.toLocaleString()}</td>
                  <td className="py-2.5 pr-3"><Badge variant={item.status} label={item.status} /></td>
                  <td className="py-2.5">
                    {item.mismatch ? (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>yes</span>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Payouts() {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [amountMin, setAmountMin] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<PayoutCycle | null>(null);

  const totalPaid = PAYOUT_CYCLES.filter(c => c.status === "paid").reduce((s, c) => s + c.totalAmount, 0);
  const totalOverdue = PAYOUT_CYCLES.filter(c => c.status === "overdue").reduce((s, c) => s + c.totalAmount, 0);
  const totalUpcoming = PAYOUT_CYCLES.filter(c => c.status === "upcoming").reduce((s, c) => s + c.totalAmount, 0);
  const avgCycleSize = Math.round(PAYOUT_CYCLES.reduce((s, c) => s + c.totalAmount, 0) / PAYOUT_CYCLES.length);

  const filtered = useMemo(() => {
    return PAYOUT_CYCLES.filter(c => {
      if (statusFilter.length && !statusFilter.includes(c.status)) return false;
      if (amountMin && c.totalAmount < Number(amountMin)) return false;
      if (dateFrom && c.cycleMonth < dateFrom.slice(0, 7)) return false;
      if (dateTo && c.cycleMonth > dateTo.slice(0, 7)) return false;
      return true;
    });
  }, [statusFilter, amountMin, dateFrom, dateTo]);

  const activeFilters = statusFilter.length + (amountMin ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  function clearAll() {
    setStatusFilter([]); setAmountMin(""); setDateFrom(""); setDateTo("");
  }

  return (
    <PageWrapper>
      <TopBar
        title="Payouts"
        subtitle={`${PAYOUT_CYCLES.length} cycles · $${(totalPaid / 1000).toFixed(0)}K paid · $${(totalOverdue / 1000).toFixed(0)}K overdue`}
      />

      <div className="px-6 py-4 space-y-4">
        {/* KPI row */}
        <FadeItem>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { label: "Total Paid", value: `$${(totalPaid / 1000).toFixed(0)}K`, color: "#10B981", icon: CheckCircle },
              { label: "Overdue Amount", value: `$${(totalOverdue / 1000).toFixed(0)}K`, color: "#EF4444", icon: AlertTriangle },
              { label: "Upcoming", value: `$${(totalUpcoming / 1000).toFixed(0)}K`, color: "#A78BFA", icon: ArrowRight },
              { label: "Avg Cycle Size", value: `$${(avgCycleSize / 1000).toFixed(0)}K`, color: "var(--accent)", icon: CreditCard },
            ].map(({ label, value, color, icon: Icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border p-4"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color }} />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{label}</span>
                </div>
                <div className="font-mono text-xl font-bold" style={{ color }}>{value}</div>
              </motion.div>
            ))}
          </div>
        </FadeItem>

        {/* Overdue alert */}
        {totalOverdue > 0 && (
          <FadeItem>
            <div className="rounded-xl border p-4 flex items-start gap-3" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.3)" }}>
              <AlertTriangle size={16} style={{ color: "#EF4444" }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold" style={{ color: "#EF4444" }}>Overdue: ${totalOverdue.toLocaleString()}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Dec 2025 + Jan 2026 cycles have not been paid. Affiliates may churn.</p>
              </div>
            </div>
          </FadeItem>
        )}

        {/* Filters */}
        <FadeItem>
          <div className="flex items-center gap-2 flex-wrap">
            <MultiSelect label="Status" selected={statusFilter} onChange={setStatusFilter} options={[
              { value: "paid", label: "Paid" },
              { value: "overdue", label: "Overdue" },
              { value: "upcoming", label: "Upcoming" },
              { value: "processing", label: "Processing" },
            ]} />

            <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <span className="text-xs" style={{ color: "var(--muted)" }}>Amount ≥ $</span>
              <input value={amountMin} onChange={e => setAmountMin(e.target.value)} placeholder="0" className="w-16 bg-transparent text-xs outline-none font-mono" style={{ color: "var(--text)" }} type="number" min="0" />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <span className="text-xs" style={{ color: "var(--muted)" }}>From</span>
              <input value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="YYYY-MM" className="w-20 bg-transparent text-xs outline-none font-mono" style={{ color: "var(--text)" }} />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <span className="text-xs" style={{ color: "var(--muted)" }}>To</span>
              <input value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="YYYY-MM" className="w-20 bg-transparent text-xs outline-none font-mono" style={{ color: "var(--text)" }} />
            </div>

            {activeFilters > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                <X size={11} /> Clear ({activeFilters})
              </button>
            )}
          </div>

          {activeFilters > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <ActiveFilterTags label="Status" values={statusFilter} onRemove={v => setStatusFilter(s => s.filter(x => x !== v))} />
              {amountMin && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs" style={{ background: "rgba(8,145,178,0.1)", color: "var(--accent-hi)", border: "1px solid rgba(8,145,178,0.2)" }}>
                  Amount ≥ ${amountMin}
                  <button onClick={() => setAmountMin("")} className="ml-0.5"><X size={9} /></button>
                </span>
              )}
            </div>
          )}
        </FadeItem>

        {/* Table */}
        <FadeItem className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                {["Month", "Status", "Total Amount", "# Affiliates", "Due Date", "Paid Date"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center" style={{ color: "var(--muted)" }}>No cycles match the current filters.</td></tr>
              ) : filtered.map((cycle, i) => (
                <motion.tr
                  key={cycle.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  onClick={() => setSelected(cycle)}
                  className="border-b cursor-pointer transition-colors hover:bg-white/[0.025]"
                  style={{
                    borderColor: "var(--border)",
                    borderLeft: cycle.status === "overdue" ? "3px solid #EF4444" : "3px solid transparent",
                  }}
                >
                  <td className="px-4 py-3 font-mono font-semibold" style={{ color: "var(--text)" }}>{cycle.cycleMonth}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {statusIcon(cycle.status)}
                      <span className="font-medium" style={{ color: statusColor(cycle.status) }}>{cycle.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold" style={{ color: cycle.status === "overdue" ? "#EF4444" : "var(--text)" }}>
                    ${cycle.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono" style={{ color: "var(--text-secondary)" }}>{cycle.affiliatesCount}</td>
                  <td className="px-4 py-3" style={{ color: "var(--muted)" }}>{cycle.dueDate}</td>
                  <td className="px-4 py-3" style={{ color: cycle.paidDate ? "var(--text-secondary)" : "var(--muted)" }}>
                    {cycle.paidDate ?? "—"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </FadeItem>
      </div>

      <AnimatePresence>
        {selected && <CycleModal cycle={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </PageWrapper>
  );
}
