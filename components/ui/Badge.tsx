"use client";

type Variant = "champion" | "mid-tier" | "at-risk" | "fraud-flagged" | "active" | "inactive" | "archived" | "overdue" | "paid" | "upcoming" | "processing" | "pending" | "flagged";

const styles: Record<Variant, { bg: string; color: string }> = {
  "champion":       { bg: "rgba(16,185,129,0.12)",  color: "#10B981" },
  "mid-tier":       { bg: "rgba(59,130,246,0.12)",  color: "#60A5FA" },
  "at-risk":        { bg: "rgba(245,158,11,0.12)",  color: "#F59E0B" },
  "fraud-flagged":  { bg: "rgba(239,68,68,0.12)",   color: "#EF4444" },
  "active":         { bg: "rgba(16,185,129,0.10)",  color: "#34D399" },
  "inactive":       { bg: "rgba(100,116,139,0.15)", color: "#64748B" },
  "archived":       { bg: "rgba(100,116,139,0.10)", color: "#475569" },
  "processing":     { bg: "rgba(245,158,11,0.10)", color: "#F59E0B" },
  "pending":        { bg: "rgba(167,139,250,0.10)", color: "#A78BFA" },
  "flagged":        { bg: "rgba(239,68,68,0.10)", color: "#EF4444" },
  "overdue":        { bg: "rgba(239,68,68,0.12)",   color: "#EF4444" },
  "paid":           { bg: "rgba(16,185,129,0.10)",  color: "#10B981" },
  "upcoming":       { bg: "rgba(167,139,250,0.12)", color: "#A78BFA" },
};

interface Props {
  variant: Variant;
  label?: string;
}

export function Badge({ variant, label }: Props) {
  const s = styles[variant] || styles["inactive"];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider" style={{ background: s.bg, color: s.color }}>
      {label ?? variant}
    </span>
  );
}
