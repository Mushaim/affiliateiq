"use client";
import { useState } from "react";
import { CalendarDays, X } from "lucide-react";

export interface DateRange { from: string; to: string }

const PRESETS = [
  { label: "Last 30 days", from: "2026-05-16", to: "2026-06-15" },
  { label: "Last 3 months", from: "2026-03-15", to: "2026-06-15" },
  { label: "Last 6 months", from: "2025-12-15", to: "2026-06-15" },
  { label: "2026", from: "2026-01-01", to: "2026-06-15" },
  { label: "2025", from: "2025-01-01", to: "2025-12-31" },
  { label: "All time", from: "2023-01-01", to: "2026-06-15" },
];

interface Props {
  value: DateRange | null;
  onChange: (r: DateRange | null) => void;
  label?: string;
}

export function DateRangeFilter({ value, onChange, label = "Date range" }: Props) {
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const activePreset = value ? PRESETS.find(p => p.from === value.from && p.to === value.to) : null;
  const hasValue = !!value;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
        style={{
          background: hasValue ? "rgba(8,145,178,0.1)" : "var(--surface)",
          borderColor: hasValue ? "var(--accent)" : "var(--border)",
          color: hasValue ? "var(--accent-hi)" : "var(--text-secondary)",
        }}
      >
        <CalendarDays size={11} />
        <span>{hasValue ? (activePreset?.label ?? `${value!.from} → ${value!.to}`) : label}</span>
        {hasValue && (
          <span onClick={e => { e.stopPropagation(); onChange(null); }} className="ml-0.5 hover:opacity-70"><X size={10} /></span>
        )}
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-1 left-0 w-64 rounded-xl border shadow-xl p-3 space-y-1" style={{ background: "var(--surface2)", borderColor: "var(--border)" }}>
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => { onChange(p); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-white/5 transition-colors"
              style={{ color: activePreset?.label === p.label ? "var(--accent-hi)" : "var(--text-secondary)", background: activePreset?.label === p.label ? "rgba(8,145,178,0.1)" : "transparent" }}
            >
              {p.label}
            </button>
          ))}

          <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>Custom range</p>
            <div className="space-y-1.5">
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="w-full rounded-lg px-2 py-1.5 text-xs border outline-none" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="w-full rounded-lg px-2 py-1.5 text-xs border outline-none" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }} />
              <button
                onClick={() => { if (customFrom && customTo) { onChange({ from: customFrom, to: customTo }); setOpen(false); } }}
                disabled={!customFrom || !customTo}
                className="w-full py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function inDateRange(dateStr: string, range: DateRange | null): boolean {
  if (!range) return true;
  return dateStr >= range.from && dateStr <= range.to;
}
