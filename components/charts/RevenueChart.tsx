"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MonthlyPoint } from "@/lib/types";

interface Props {
  data: MonthlyPoint[];
  period?: "7D" | "30D" | "90D" | "all";
}

function formatMonth(m: string) {
  const [y, mo] = m.split("-");
  const d = new Date(Number(y), Number(mo) - 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function formatK(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export function RevenueChart({ data, period = "all" }: Props) {
  const sliced = period === "all" ? data : data.slice(-({ "7D": 1, "30D": 1, "90D": 3, "all": 24 }[period]));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={sliced} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0891B2" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#252D3A" vertical={false} />
        <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tickFormatter={formatK} tick={{ fill: "#6B7280", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
        <Tooltip
          contentStyle={{ background: "#1A1F2B", border: "1px solid #252D3A", borderRadius: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
          labelStyle={{ color: "#94A3B8", fontSize: 12, marginBottom: 4 }}
          itemStyle={{ color: "#22D3EE", fontFamily: "var(--font-geist-mono)" }}
          formatter={(v) => [formatK(Number(v)), "Revenue"]}
          labelFormatter={(m) => formatMonth(String(m))}
        />
        <Area type="monotone" dataKey="revenue" stroke="#0891B2" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: "#22D3EE" }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
