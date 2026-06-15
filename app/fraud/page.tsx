"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from "recharts";
import { ShieldAlert, AlertTriangle, X } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { MultiSelect, ActiveFilterTags } from "@/components/ui/MultiSelect";
import { DateRangeFilter, inDateRange, DateRange } from "@/components/ui/DateRangeFilter";
import { AFFILIATES } from "@/data/seed/affiliates";

const EVIDENCE_OPTIONS = [
  { value: "high_cancel_rate", label: "High Cancel Rate" },
  { value: "ad_source_cluster", label: "Ad Source Cluster" },
  { value: "duplicate_referrals", label: "Duplicate Referrals" },
];

function scoreColor(s: number) {
  if (s >= 70) return "#DC2626";
  if (s >= 40) return "#CA8A04";
  return "#0891B2";
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: { name: string; x: number; y: number; fraudScore: number; segment: string } }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border px-3 py-2.5 text-xs shadow-xl" style={{ background: "var(--surface2)", borderColor: "var(--border)" }}>
      <p className="font-bold mb-1" style={{ color: "var(--text)" }}>{d.name}</p>
      <p style={{ color: "var(--muted)" }}>Cancel rate: <span className="font-mono text-white">{d.x}%</span></p>
      <p style={{ color: "var(--muted)" }}>Revenue: <span className="font-mono text-white">${(d.y / 1000).toFixed(0)}K</span></p>
      <p style={{ color: "var(--muted)" }}>Fraud score: <span className="font-mono" style={{ color: scoreColor(d.fraudScore) }}>{d.fraudScore}/100</span></p>
    </div>
  );
}

export default function FraudRadar() {
  const [evidenceFilter, setEvidenceFilter] = useState<string[]>([]);
  const [joinedRange, setJoinedRange] = useState<DateRange | null>(null);
  const [lastReferralRange, setLastReferralRange] = useState<DateRange | null>(null);
  const [minScore, setMinScore] = useState("");

  const filtered = useMemo(() => AFFILIATES.filter(a => {
    if (evidenceFilter.length && !evidenceFilter.some(e => a.metrics.fraudEvidence.includes(e))) return false;
    if (joinedRange && !inDateRange(a.joinedAt, joinedRange)) return false;
    if (lastReferralRange && !inDateRange(a.metrics.lastReferralAt, lastReferralRange)) return false;
    if (minScore && a.metrics.fraudScore < Number(minScore)) return false;
    return true;
  }), [evidenceFilter, joinedRange, lastReferralRange, minScore]);

  const flagged = filtered.filter(a => a.segment === "fraud-flagged");
  const scatterData = filtered.map(a => ({
    id: a.id, name: a.name,
    x: parseFloat((a.metrics.cancelRate * 100).toFixed(1)),
    y: a.metrics.totalRevenue,
    fraudScore: a.metrics.fraudScore,
    segment: a.segment,
  }));

  const activeFilters = evidenceFilter.length + (joinedRange ? 1 : 0) + (lastReferralRange ? 1 : 0) + (minScore ? 1 : 0);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Fraud Radar" subtitle={`${filtered.length} affiliates · ${flagged.length} flagged`} />

      <div className="px-6 py-4 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <MultiSelect label="Evidence type" selected={evidenceFilter} onChange={setEvidenceFilter} options={EVIDENCE_OPTIONS} />
          <DateRangeFilter value={joinedRange} onChange={setJoinedRange} label="Joined date" />
          <DateRangeFilter value={lastReferralRange} onChange={setLastReferralRange} label="Last referral" />

          <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--muted)" }}>Score ≥</span>
            <input value={minScore} onChange={e => setMinScore(e.target.value)} placeholder="0" className="w-10 bg-transparent text-xs outline-none font-mono" style={{ color: "var(--text)" }} type="number" min="0" max="100" />
          </div>

          {activeFilters > 0 && (
            <button onClick={() => { setEvidenceFilter([]); setJoinedRange(null); setLastReferralRange(null); setMinScore(""); }} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              <X size={11} /> Clear ({activeFilters})
            </button>
          )}
        </div>

        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <ActiveFilterTags label="Evidence" values={evidenceFilter} onRemove={v => setEvidenceFilter(s => s.filter(x => x !== v))} />
            {joinedRange && <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs" style={{ background: "rgba(8,145,178,0.1)", color: "var(--accent-hi)", border: "1px solid rgba(8,145,178,0.2)" }}>Joined: {joinedRange.from} → {joinedRange.to} <button onClick={() => setJoinedRange(null)}><X size={9} /></button></span>}
            {lastReferralRange && <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs" style={{ background: "rgba(8,145,178,0.1)", color: "var(--accent-hi)", border: "1px solid rgba(8,145,178,0.2)" }}>Last referral: {lastReferralRange.from} → {lastReferralRange.to} <button onClick={() => setLastReferralRange(null)}><X size={9} /></button></span>}
            {minScore && <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs" style={{ background: "rgba(8,145,178,0.1)", color: "var(--accent-hi)", border: "1px solid rgba(8,145,178,0.2)" }}>Score ≥ {minScore} <button onClick={() => setMinScore("")}><X size={9} /></button></span>}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Showing affiliates", value: String(filtered.length), color: "var(--text)", icon: ShieldAlert },
            { label: "Fraud flagged", value: String(flagged.length), color: "var(--danger)", icon: ShieldAlert },
            { label: "Avg cancel rate", value: flagged.length ? `${(flagged.reduce((s, a) => s + a.metrics.cancelRate, 0) / flagged.length * 100).toFixed(0)}%` : "–", color: "var(--warning)", icon: AlertTriangle },
          ].map(({ label, value, color, icon: Icon }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-4 flex items-center gap-3" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `rgba(${color === "var(--danger)" ? "220,38,38" : color === "var(--warning)" ? "202,138,4" : "8,145,178"},0.12)` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{label}</div>
                <div className="font-mono text-lg font-bold" style={{ color }}>{value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scatter plot */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Cancel Rate vs. Revenue</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Upper-left quadrant = high cancel, low revenue — primary fraud signal</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {[["Low risk", "#0891B2"], ["Medium", "#CA8A04"], ["High risk", "#DC2626"]].map(([l, c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                  <span style={{ color: "var(--muted)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 4, right: 4, bottom: 24, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" name="Cancel Rate" unit="%" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false}
                label={{ value: "Cancel Rate (%)", position: "insideBottom", offset: -12, fill: "var(--muted)", fontSize: 11 }} />
              <YAxis dataKey="y" tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={60} stroke="var(--danger)" strokeDasharray="4 4" strokeOpacity={0.3} />
              <ReferenceLine y={50000} stroke="var(--danger)" strokeDasharray="4 4" strokeOpacity={0.3} />
              <Scatter data={scatterData}>
                {scatterData.map((d, i) => <Cell key={i} fill={scoreColor(d.fraudScore)} opacity={0.85} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Dashed lines mark fraud boundary (cancel &gt; 60% or revenue &lt; $50K)</p>
        </motion.div>

        {/* Flagged cards */}
        {flagged.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Flagged Affiliates ({flagged.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {flagged.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.04 }}
                  className="rounded-xl border p-4" style={{ background: "var(--surface)", borderColor: "rgba(220,38,38,0.2)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs font-bold" style={{ color: "var(--text)" }}>{a.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Joined {a.joinedAt.slice(0, 7)}</div>
                    </div>
                    <span className="font-mono text-sm font-bold" style={{ color: "var(--danger)" }}>{a.metrics.fraudScore}</span>
                  </div>
                  <div className="w-full rounded-full h-1 mb-2.5" style={{ background: "var(--border)" }}>
                    <div className="h-1 rounded-full" style={{ width: `${a.metrics.fraudScore}%`, background: "linear-gradient(to right, var(--warning), var(--danger))" }} />
                  </div>
                  <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>
                    Cancel: <span className="font-mono" style={{ color: "var(--danger)" }}>{(a.metrics.cancelRate * 100).toFixed(0)}%</span>
                    <span className="mx-1.5" style={{ color: "var(--border)" }}>·</span>
                    Last ref: <span className="font-mono">{a.metrics.lastReferralAt.slice(0, 7)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {a.metrics.fraudEvidence.map(e => (
                      <span key={e} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(220,38,38,0.08)", color: "var(--danger)" }}>{e.replace(/_/g, " ")}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-xs" style={{ color: "var(--muted)" }}>No affiliates match the current filters.</div>
        )}
      </div>
    </div>
  );
}
