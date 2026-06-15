"use client";
import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { PAYOUT_CYCLES } from "@/data/seed/payouts";
import { PayoutStatus } from "@/lib/types";

function statusIcon(s: PayoutStatus) {
  if (s === "paid") return <CheckCircle size={15} style={{ color: "#10B981" }} />;
  if (s === "overdue") return <AlertTriangle size={15} style={{ color: "#EF4444" }} />;
  if (s === "upcoming") return <ArrowRight size={15} style={{ color: "#A78BFA" }} />;
  return <Clock size={15} style={{ color: "#F59E0B" }} />;
}

export default function Payouts() {
  const overdue = PAYOUT_CYCLES.filter(c => c.status === "overdue");
  const totalOverdue = overdue.reduce((s, c) => s + c.totalAmount, 0);
  const upcoming = PAYOUT_CYCLES.filter(c => c.status === "upcoming");
  const totalUpcoming = upcoming.reduce((s, c) => s + c.totalAmount, 0);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Payout Health" subtitle="Cycle status · reconciliation · funding gaps" />

      <div className="px-6 py-5 space-y-5">
        {/* Alerts */}
        {totalOverdue > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border p-4 flex items-start gap-3" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.3)" }}>
            <AlertTriangle size={18} style={{ color: "#EF4444" }} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold" style={{ color: "#EF4444" }}>Overdue: ${totalOverdue.toLocaleString()}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Dec 2025 + Jan 2026 cycles have not been paid. Affiliates may churn.</p>
            </div>
          </motion.div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Overdue", value: `$${(totalOverdue / 1000).toFixed(0)}K`, color: "#EF4444", cycles: overdue.length },
            { label: "Upcoming", value: `$${(totalUpcoming / 1000).toFixed(0)}K`, color: "#A78BFA", cycles: upcoming.length },
            { label: "Paid (last 6mo)", value: "$143K", color: "#10B981", cycles: 4 },
          ].map(({ label, value, color, cycles }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{label}</div>
              <div className="font-mono text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{cycles} cycle{cycles !== 1 ? "s" : ""}</div>
            </motion.div>
          ))}
        </div>

        {/* Cycle timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="px-5 py-4 border-b" style={{ background: "var(--surface2)", borderColor: "var(--border)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Payout Cycles</h3>
          </div>
          <div style={{ background: "var(--surface)" }}>
            {PAYOUT_CYCLES.map((cycle, i) => (
              <motion.div
                key={cycle.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-4 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="shrink-0">{statusIcon(cycle.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{cycle.cycleMonth}</span>
                    <Badge variant={cycle.status} label={cycle.status} />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {cycle.affiliatesCount} affiliates · Due {cycle.dueDate}
                    {cycle.paidDate && ` · Paid ${cycle.paidDate}`}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-sm" style={{ color: cycle.status === "overdue" ? "#EF4444" : "var(--text)" }}>
                    ${cycle.totalAmount.toLocaleString()}
                  </div>
                  {cycle.status === "overdue" && (
                    <div className="text-xs" style={{ color: "#EF4444" }}>UNPAID</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reconciliation detail for overdue */}
        {overdue.length > 0 && overdue[0].items.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="px-5 py-4 border-b" style={{ background: "var(--surface2)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Jan 2026 — Pending Payouts (top 10)</h3>
            </div>
            <table className="w-full text-xs" style={{ background: "var(--surface)" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Affiliate", "Amount", "FP Reported", "Status"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {overdue[0].items.slice(0, 10).map(item => (
                  <tr key={item.affiliateId} className="border-b" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-2.5" style={{ color: "var(--text)" }}>{item.affiliateName}</td>
                    <td className="px-4 py-2.5 font-mono" style={{ color: "var(--text)" }}>${item.amount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono" style={{ color: "var(--text-secondary)" }}>${item.fpAmount.toLocaleString()}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={item.status} label={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
