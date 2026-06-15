"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";
import { TopBar } from "@/components/layout/TopBar";
import { DateRangeFilter, DateRange } from "@/components/ui/DateRangeFilter";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { getQoQGrowth, getCohortData, getMonthlyAffiliateStats } from "@/lib/dataUtils";

type Metric = "newAffiliates" | "newCustomers" | "revenue" | "churnedCustomers";

const METRIC_OPTS = [
  { value: "newAffiliates", label: "New Affiliates" },
  { value: "newCustomers", label: "New Customers" },
  { value: "revenue", label: "Revenue" },
  { value: "churnedCustomers", label: "Churned Customers" },
];

const METRIC_COLORS: Record<Metric, string> = {
  newAffiliates: "#0891B2",
  newCustomers: "#16A34A",
  revenue: "#A78BFA",
  churnedCustomers: "#DC2626",
};

function fmtMonth(m: string) {
  const [y, mo] = m.split("-");
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function fmtValue(v: number, metric: Metric) {
  if (metric === "revenue") return `$${(v / 1000).toFixed(0)}K`;
  return String(v);
}

export default function Growth() {
  const qoq = getQoQGrowth();
  const { cohorts, months } = getCohortData();
  const allMonthly = getMonthlyAffiliateStats();

  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [metrics, setMetrics] = useState<string[]>(["newAffiliates", "newCustomers"]);

  const filteredMonthly = useMemo(() => {
    if (!dateRange) return allMonthly;
    return allMonthly.filter(d => d.month >= dateRange.from.slice(0, 7) && d.month <= dateRange.to.slice(0, 7));
  }, [allMonthly, dateRange]);

  const cohortChartData = months.map((m, mi) => {
    const pt: Record<string, string | number | null> = { month: m };
    cohorts.forEach(c => { pt[c.name] = c.values[mi]; });
    return pt;
  });

  const activeMetrics = metrics.length ? metrics as Metric[] : (["newAffiliates"] as Metric[]);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Growth Tracker" subtitle="Affiliates · customers · cohort retention" />

      <div className="px-6 py-4 space-y-5">
        {/* QoQ summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {qoq.map(({ quarter, net }) => (
            <motion.div key={quarter} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{quarter}</div>
              <div className="font-mono text-2xl font-bold mt-0.5" style={{ color: net < 0 ? "var(--danger)" : "var(--success)" }}>{net > 0 ? "+" : ""}{net}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>net customers</div>
            </motion.div>
          ))}
        </div>

        {/* Monthly breakdown — custom filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Monthly Breakdown</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>New affiliates, customers, churn — filterable by date range</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <MultiSelect label="Metrics" selected={metrics} onChange={setMetrics} options={METRIC_OPTS} />
              <DateRangeFilter value={dateRange} onChange={setDateRange} label="Date range" />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={filteredMonthly} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickFormatter={fmtMonth} tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} interval={Math.max(0, Math.floor(filteredMonthly.length / 12))} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }}
                labelStyle={{ color: "var(--text-secondary)", fontSize: 11 }}
                itemStyle={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }}
                labelFormatter={(m) => fmtMonth(String(m))}
              />
              <Legend wrapperStyle={{ color: "var(--muted)", fontSize: 11 }} />
              {activeMetrics.map(m => (
                <Bar key={m} dataKey={m} name={METRIC_OPTS.find(o => o.value === m)?.label ?? m} fill={METRIC_COLORS[m]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>

          {/* Summary table for filtered range */}
          {filteredMonthly.length > 0 && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "Total New Affiliates", value: filteredMonthly.reduce((s, d) => s + d.newAffiliates, 0) },
                  { label: "Total New Customers", value: filteredMonthly.reduce((s, d) => s + d.newCustomers, 0) },
                  { label: "Total Churned", value: filteredMonthly.reduce((s, d) => s + d.churnedCustomers, 0) },
                  { label: "Net Customers", value: filteredMonthly.reduce((s, d) => s + d.newCustomers - d.churnedCustomers, 0) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{label}</div>
                    <div className="font-mono font-bold text-lg mt-0.5" style={{ color: value < 0 ? "var(--danger)" : value === 0 ? "var(--muted)" : "var(--text)" }}>{value > 0 ? "+" : ""}{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* QoQ bar chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>New vs. Churned — Quarterly</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={qoq} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="quarter" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }} labelStyle={{ color: "var(--text-secondary)", fontSize: 11 }} itemStyle={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }} />
              <Legend wrapperStyle={{ color: "var(--muted)", fontSize: 11 }} />
              <Bar dataKey="newCustomers" name="New" fill="var(--success)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="churnedCustomers" name="Churned" fill="var(--danger)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cohort retention */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Cohort Retention</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>% of affiliate-referred customers still active each month after acquisition</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cohortChartData} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8 }} labelStyle={{ color: "var(--text-secondary)", fontSize: 11 }} itemStyle={{ fontFamily: "var(--font-geist-mono)", fontSize: 11 }} formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ color: "var(--muted)", fontSize: 11 }} />
              {cohorts.map(c => (
                <Line key={c.name} type="monotone" dataKey={c.name} stroke={c.color} strokeWidth={2} dot={false} connectNulls={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
