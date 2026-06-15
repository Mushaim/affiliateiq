"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  format?: "currency" | "number" | "percent" | "multiplier";
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

function formatVal(v: number, fmt: Props["format"]) {
  if (fmt === "currency") {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v}`;
  }
  if (fmt === "percent") return `${(v * 100).toFixed(0)}%`;
  if (fmt === "multiplier") return `${v.toFixed(1)}x`;
  return v.toLocaleString();
}

export function KPICard({ label, value, format = "number", delta, deltaLabel, icon: Icon, iconColor = "#3B82F6", delay = 0 }: Props) {
  const count = useMotionValue(0);
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.4,
      delay,
      ease: "easeOut",
      onUpdate(v) {
        if (displayRef.current) {
          displayRef.current.textContent = formatVal(v, format);
        }
      },
    });
    return () => controls.stop();
  }, [value, format, delay, count]);

  const isPositiveDelta = delta !== undefined && delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl p-5 border relative overflow-hidden group cursor-default"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      whileHover={{ borderColor: iconColor, boxShadow: `0 0 24px ${iconColor}22` }}
    >
      {/* bg glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 100% 0%, ${iconColor}08, transparent 70%)` }} />

      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${iconColor}18` }}>
          <Icon size={14} style={{ color: iconColor }} />
        </div>
      </div>

      <div className="font-mono text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
        <span ref={displayRef}>{formatVal(0, format)}</span>
      </div>

      {delta !== undefined && (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold" style={{ color: isPositiveDelta ? "var(--success)" : "var(--danger)" }}>
            {isPositiveDelta ? "▲" : "▼"} {Math.abs(delta)}
          </span>
          {deltaLabel && <span style={{ color: "var(--muted)" }}>{deltaLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}
