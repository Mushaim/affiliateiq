"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { Sparkline } from "@/components/charts/Sparkline";
import { MultiSelect, ActiveFilterTags } from "@/components/ui/MultiSelect";
import { DateRangeFilter, inDateRange, DateRange } from "@/components/ui/DateRangeFilter";
import { AFFILIATES } from "@/data/seed/affiliates";
import { formatCurrency, getSegmentColor } from "@/lib/dataUtils";
import { Affiliate } from "@/lib/types";

type SortKey = "revenue" | "customers" | "cancelRate" | "fraudScore" | "joined";
type SortDir = "asc" | "desc";

function AffiliateModal({ affiliate, onClose }: { affiliate: Affiliate; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl border p-6"
        style={{ background: "var(--surface2)", borderColor: "var(--border)" }}
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: "var(--muted)" }}>
          <X size={14} />
        </button>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ background: `${getSegmentColor(affiliate.segment)}18`, color: getSegmentColor(affiliate.segment) }}>
            {affiliate.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-sm" style={{ color: "var(--text)" }}>{affiliate.name}</h2>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{affiliate.email}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Joined {affiliate.joinedAt} · {affiliate.campaignType}</p>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <Badge variant={affiliate.segment} />
          <Badge variant={affiliate.status} />
        </div>

        <div className="mb-4">
          <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>12-Month Revenue Trend</p>
          <Sparkline data={affiliate.monthlyRevenue.slice(-12)} color={getSegmentColor(affiliate.segment)} width={340} height={52} />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Total Revenue", value: formatCurrency(affiliate.metrics.totalRevenue) },
            { label: "Active Customers", value: affiliate.metrics.activeCustomers },
            { label: "Cancel Rate", value: `${(affiliate.metrics.cancelRate * 100).toFixed(0)}%` },
            { label: "Commissions", value: formatCurrency(affiliate.metrics.lifetimeCommissions) },
            { label: "Fraud Score", value: `${affiliate.metrics.fraudScore}/100` },
            { label: "Last Referral", value: affiliate.metrics.lastReferralAt.slice(0, 7) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg p-2.5" style={{ background: "var(--surface)" }}>
              <div className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>{label}</div>
              <div className="text-sm font-mono font-semibold" style={{ color: "var(--text)" }}>{value}</div>
            </div>
          ))}
        </div>

        {affiliate.metrics.fraudEvidence.length > 0 && (
          <div className="mt-3 p-3 rounded-lg border" style={{ background: "rgba(220,38,38,0.05)", borderColor: "rgba(220,38,38,0.2)" }}>
            <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--danger)" }}>Fraud Evidence</p>
            <div className="flex flex-wrap gap-1.5">
              {affiliate.metrics.fraudEvidence.map(e => (
                <span key={e} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(220,38,38,0.1)", color: "var(--danger)" }}>{e.replace(/_/g, " ")}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Leaderboard() {
  const [search, setSearch] = useState("");
  const [segments, setSegments] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [joinedRange, setJoinedRange] = useState<DateRange | null>(null);
  const [revenueMin, setRevenueMin] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Affiliate | null>(null);

  const filtered = useMemo(() => {
    return AFFILIATES
      .filter(a => {
        if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
        if (segments.length && !segments.includes(a.segment)) return false;
        if (campaigns.length && !campaigns.includes(a.campaignType)) return false;
        if (statuses.length && !statuses.includes(a.status)) return false;
        if (joinedRange && !inDateRange(a.joinedAt, joinedRange)) return false;
        if (revenueMin && a.metrics.totalRevenue < Number(revenueMin) * 1000) return false;
        return true;
      })
      .sort((a, b) => {
        let av = 0, bv = 0;
        if (sortKey === "revenue")    { av = a.metrics.totalRevenue; bv = b.metrics.totalRevenue; }
        if (sortKey === "customers")  { av = a.metrics.activeCustomers; bv = b.metrics.activeCustomers; }
        if (sortKey === "cancelRate") { av = a.metrics.cancelRate; bv = b.metrics.cancelRate; }
        if (sortKey === "fraudScore") { av = a.metrics.fraudScore; bv = b.metrics.fraudScore; }
        if (sortKey === "joined")     { av = new Date(a.joinedAt).getTime(); bv = new Date(b.joinedAt).getTime(); }
        return sortDir === "desc" ? bv - av : av - bv;
      });
  }, [search, segments, campaigns, statuses, joinedRange, revenueMin, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const activeFilters = segments.length + campaigns.length + statuses.length + (joinedRange ? 1 : 0) + (revenueMin ? 1 : 0);

  function clearAll() {
    setSegments([]); setCampaigns([]); setStatuses([]); setJoinedRange(null); setRevenueMin(""); setSearch("");
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown size={10} style={{ color: "var(--border)" }} />;
    return sortDir === "desc" ? <ChevronDown size={10} style={{ color: "var(--accent)" }} /> : <ChevronUp size={10} style={{ color: "var(--accent)" }} />;
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Affiliate Leaderboard" subtitle={`${filtered.length} of ${AFFILIATES.length} affiliates`} />

      <div className="px-6 py-4 space-y-3">
        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-44 rounded-lg border px-3 py-1.5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <Search size={13} style={{ color: "var(--muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…" className="flex-1 bg-transparent text-xs outline-none" style={{ color: "var(--text)" }} />
            {search && <button onClick={() => setSearch("")}><X size={11} style={{ color: "var(--muted)" }} /></button>}
          </div>

          <MultiSelect label="Segment" selected={segments} onChange={setSegments} options={[
            { value: "champion", label: "Champion" },
            { value: "mid-tier", label: "Mid-Tier" },
            { value: "at-risk", label: "At Risk" },
            { value: "fraud-flagged", label: "Fraud Flagged" },
          ]} />
          <MultiSelect label="Campaign" selected={campaigns} onChange={setCampaigns} options={[
            { value: "solutions-partner", label: "Solutions Partner" },
            { value: "content", label: "Content" },
            { value: "coupon", label: "Coupon" },
            { value: "ad-source", label: "Ad Source" },
          ]} />
          <MultiSelect label="Status" selected={statuses} onChange={setStatuses} options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "archived", label: "Archived" },
          ]} />
          <DateRangeFilter value={joinedRange} onChange={setJoinedRange} label="Joined date" />

          <div className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--muted)" }}>Rev ≥ $</span>
            <input value={revenueMin} onChange={e => setRevenueMin(e.target.value)} placeholder="0K" className="w-12 bg-transparent text-xs outline-none font-mono" style={{ color: "var(--text)" }} type="number" min="0" />
            <span className="text-xs" style={{ color: "var(--muted)" }}>K</span>
          </div>

          {activeFilters > 0 && (
            <button onClick={clearAll} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-colors hover:bg-white/5" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              <X size={11} /> Clear all ({activeFilters})
            </button>
          )}
        </div>

        {/* Active filter tags */}
        {activeFilters > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <ActiveFilterTags label="Segment" values={segments} onRemove={v => setSegments(s => s.filter(x => x !== v))} />
            <ActiveFilterTags label="Campaign" values={campaigns} onRemove={v => setCampaigns(s => s.filter(x => x !== v))} />
            <ActiveFilterTags label="Status" values={statuses} onRemove={v => setStatuses(s => s.filter(x => x !== v))} />
            {joinedRange && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs" style={{ background: "rgba(8,145,178,0.1)", color: "var(--accent-hi)", border: "1px solid rgba(8,145,178,0.2)" }}>
                Joined: {joinedRange.from} → {joinedRange.to}
                <button onClick={() => setJoinedRange(null)} className="ml-0.5"><X size={9} /></button>
              </span>
            )}
            {revenueMin && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs" style={{ background: "rgba(8,145,178,0.1)", color: "var(--accent-hi)", border: "1px solid rgba(8,145,178,0.2)" }}>
                Revenue ≥ ${revenueMin}K
                <button onClick={() => setRevenueMin("")} className="ml-0.5"><X size={9} /></button>
              </span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--surface2)", borderBottom: "1px solid var(--border)" }}>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider w-8" style={{ color: "var(--muted)" }}>#</th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Affiliate</th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider cursor-pointer" style={{ color: "var(--muted)" }} onClick={() => toggleSort("revenue")}>
                  <div className="flex items-center gap-1">Revenue <SortIcon k="revenue" /></div>
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider cursor-pointer" style={{ color: "var(--muted)" }} onClick={() => toggleSort("customers")}>
                  <div className="flex items-center gap-1">Customers <SortIcon k="customers" /></div>
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider cursor-pointer hidden lg:table-cell" style={{ color: "var(--muted)" }} onClick={() => toggleSort("cancelRate")}>
                  <div className="flex items-center gap-1">Cancel% <SortIcon k="cancelRate" /></div>
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider cursor-pointer hidden lg:table-cell" style={{ color: "var(--muted)" }} onClick={() => toggleSort("joined")}>
                  <div className="flex items-center gap-1">Joined <SortIcon k="joined" /></div>
                </th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider hidden xl:table-cell" style={{ color: "var(--muted)" }}>Trend</th>
                <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Segment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-xs" style={{ color: "var(--muted)" }}>No affiliates match the current filters.</td></tr>
              ) : filtered.map((a, i) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.015, 0.3) }}
                  onClick={() => setSelected(a)}
                  className="border-b cursor-pointer transition-colors hover:bg-white/[0.025]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-4 py-3 font-mono font-bold" style={{ color: i < 3 ? "var(--warning)" : "var(--muted)" }}>{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${getSegmentColor(a.segment)}18`, color: getSegmentColor(a.segment) }}>
                        {a.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: "var(--text)" }}>{a.name}</div>
                        <div style={{ color: "var(--muted)" }}>{a.campaignType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold" style={{ color: "var(--text)" }}>{formatCurrency(a.metrics.totalRevenue)}</td>
                  <td className="px-4 py-3 font-mono" style={{ color: "var(--text-secondary)" }}>{a.metrics.activeCustomers}</td>
                  <td className="px-4 py-3 font-mono hidden lg:table-cell" style={{ color: a.metrics.cancelRate > 0.5 ? "var(--danger)" : "var(--text-secondary)" }}>
                    {(a.metrics.cancelRate * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell" style={{ color: "var(--muted)" }}>{a.joinedAt.slice(0, 7)}</td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <Sparkline data={a.monthlyRevenue} color={getSegmentColor(a.segment)} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={a.segment} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selected && <AffiliateModal affiliate={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
