"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  "Connecting to affiliate network…",
  "Loading revenue streams…",
  "Aggregating performance data…",
  "Analysing fraud signals…",
  "Building your dashboard…",
];

function BarGroup() {
  return (
    <div className="flex items-end gap-[3px] h-10">
      {[0.4, 0.7, 0.55, 0.9, 0.65, 0.8, 0.5, 1.0, 0.75, 0.6, 0.85, 0.45].map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-sm"
          initial={{ scaleY: 0.1 }}
          animate={{ scaleY: [h * 0.3, h, h * 0.6, h * 0.9, h] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "mirror", delay: i * 0.1, ease: "easeInOut" }}
          style={{ background: "var(--accent)", opacity: 0.6, transformOrigin: "bottom" }}
        />
      ))}
    </div>
  );
}

function Hexagon({ size = 40, color = "var(--accent)", delay = 0 }: { size?: number; color?: string; delay?: number }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 40 40" fill="none"
      initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
      animate={{ opacity: [0, 0.6, 0.3, 0.6], scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1], opacity: { duration: 2, repeat: Infinity, repeatType: "mirror" } }}
    >
      <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" stroke={color} strokeWidth="1.5" fill={`${color}10`} />
    </motion.svg>
  );
}

export default function Loading() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s + 1) % STEPS.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(p => Math.min(p + Math.random() * 22 + 8, 92));
    }, 300);
    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{ background: "var(--accent)", opacity: 0.04, top: "20%", left: "30%" }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full blur-3xl"
          style={{ background: "#A78BFA", opacity: 0.04, bottom: "20%", right: "25%" }}
          animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Floating hex background */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { size: 28, color: "var(--accent)", top: "15%", left: "10%", delay: 0 },
          { size: 20, color: "#A78BFA", top: "70%", left: "8%", delay: 0.3 },
          { size: 32, color: "var(--accent)", top: "20%", right: "12%", delay: 0.6 },
          { size: 22, color: "#16A34A", top: "65%", right: "10%", delay: 0.9 },
          { size: 18, color: "#CA8A04", top: "45%", left: "5%", delay: 1.2 },
          { size: 24, color: "var(--accent)", top: "80%", right: "20%", delay: 0.5 },
        ].map(({ size, color, delay, ...pos }, i) => (
          <div key={i} className="absolute" style={pos as React.CSSProperties}>
            <Hexagon size={size} color={color} delay={delay} />
          </div>
        ))}
      </div>

      {/* Center card */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6 px-10 py-10 rounded-2xl border"
        style={{ background: "rgba(var(--surface-rgb, 20,28,40), 0.85)", borderColor: "var(--border)", backdropFilter: "blur(16px)", minWidth: 340 }}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black"
            style={{ background: "var(--accent)", color: "#fff" }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            A
          </motion.div>
          <div>
            <div className="text-sm font-bold" style={{ color: "var(--text)" }}>AffiliateIQ</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>NovaSaaS Co.</div>
          </div>
        </div>

        {/* Bar chart animation */}
        <BarGroup />

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--surface2)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(to right, var(--accent), #A78BFA)" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>

          {/* Step label */}
          <div className="h-4 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={step}
                className="text-xs text-center"
                style={{ color: "var(--muted)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {STEPS[step]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Dot pulse */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>

      <motion.p
        className="relative z-10 mt-6 text-xs"
        style={{ color: "var(--muted)", opacity: 0.5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
      >
        Demo · Synthetic data only
      </motion.p>
    </div>
  );
}
