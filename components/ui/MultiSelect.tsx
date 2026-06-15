"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, Check } from "lucide-react";

interface Option { value: string; label: string }

interface Props {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (v: string[]) => void;
}

export function MultiSelect({ label, options, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(v: string) {
    onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v]);
  }

  const hasActive = selected.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
        style={{
          background: hasActive ? "rgba(8,145,178,0.1)" : "var(--surface)",
          borderColor: hasActive ? "var(--accent)" : "var(--border)",
          color: hasActive ? "var(--accent-hi)" : "var(--text-secondary)",
        }}
      >
        <span>{label}</span>
        {hasActive && (
          <span className="rounded-full px-1.5 py-0 text-xs font-bold" style={{ background: "var(--accent)", color: "#fff" }}>{selected.length}</span>
        )}
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute z-30 top-full mt-1 left-0 min-w-40 rounded-xl border shadow-xl overflow-hidden"
            style={{ background: "var(--surface2)", borderColor: "var(--border)" }}
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            {options.map(opt => {
              const active = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2 text-xs hover:bg-white/5 transition-colors text-left"
                  style={{ color: active ? "var(--accent-hi)" : "var(--text-secondary)" }}
                >
                  <span>{opt.label}</span>
                  {active && <Check size={11} style={{ color: "var(--accent)" }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ActiveFilterTags({ label, values, onRemove }: { label: string; values: string[]; onRemove: (v: string) => void }) {
  if (!values.length) return null;
  return (
    <AnimatePresence>
      {values.map(v => (
        <motion.span
          key={v}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
          style={{ background: "rgba(8,145,178,0.1)", color: "var(--accent-hi)", border: "1px solid rgba(8,145,178,0.2)" }}
        >
          {label}: {v}
          <button onClick={() => onRemove(v)} className="ml-0.5 hover:opacity-70"><X size={9} /></button>
        </motion.span>
      ))}
    </AnimatePresence>
  );
}
