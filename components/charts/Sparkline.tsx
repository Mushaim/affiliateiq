"use client";
import { MonthlyPoint } from "@/lib/types";

interface Props {
  data: MonthlyPoint[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = "#3B82F6", width = 80, height = 28 }: Props) {
  if (!data || data.length < 2) return <span style={{ color: "var(--muted)", fontSize: 10 }}>–</span>;
  const vals = data.slice(-12).map(d => d.revenue);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  const isDown = vals[vals.length - 1] < vals[0];
  const lineColor = isDown ? "#EF4444" : color;

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={lineColor} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
