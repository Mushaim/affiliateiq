"use client";
import { useEffect, useRef } from "react";
import { motion, animate, useReducedMotion } from "framer-motion";
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

export function KPICard({ label, value, format = "number", delta, deltaLabel, icon: Icon, iconColor = "var(--accent)", delay = 0 }: Props) {
  const reduced = useReducedMotion();
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) {
      if (displayRef.current) displayRef.current.textContent = formatVal(value, format);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (displayRef.current) displayRef.current.textContent = formatVal(v, format);
      },
    });
    return () => controls.stop();
  }, [value, format, delay, reduced]);

  const isPos = delta !== undefined && delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.18 } }}
      className="rounded-xl p-5 border relative overflow-hidden cursor-default group"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {/* corner glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ background: `radial-gradient(circle at 90% 10%, ${iconColor}12, transparent 65%)` }}
      />
      {/* top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2, ease: "easeOut" }}
        style={{ background: `linear-gradient(to right, ${iconColor}60, transparent)` }}
      />

      <div className="flex items-start justify-between mb-3 relative">
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--muted)" }}>{label}</span>
        <motion.div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${iconColor}18` }}
          whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
        >
          <Icon size={14} style={{ color: iconColor }} />
        </motion.div>
      </div>

      <div className="font-mono text-2xl font-bold mb-2 relative" style={{ color: "var(--text)" }}>
        <span ref={displayRef}>{formatVal(0, format)}</span>
      </div>

      {delta !== undefined && (
        <motion.div
          className="flex items-center gap-1.5 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.6 }}
        >
          <span className="font-semibold" style={{ color: isPos ? "var(--success)" : "var(--danger)" }}>
            {isPos ? "▲" : "▼"} {Math.abs(delta)}
          </span>
          {deltaLabel && <span style={{ color: "var(--muted)" }}>{deltaLabel}</span>}
        </motion.div>
      )}
    </motion.div>
  );
}
