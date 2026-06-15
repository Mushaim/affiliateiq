import { WeeklySnapshot } from "@/lib/types";

// Generate 52 weekly snapshots going back from Jun 9 2026 to Jun 10 2025
function monday(weeksAgo: number): string {
  const base = new Date(2026, 5, 9); // June 9 2026 (Monday)
  base.setDate(base.getDate() - weeksAgo * 7);
  return base.toISOString().split("T")[0];
}

function isoTs(weekOf: string): string {
  return `${weekOf}T08:00:00Z`;
}

// Simulate program metrics trending over time
// At 52 weeks ago: healthier program. Steady decline to present.
function weekStats(weeksAgo: number) {
  const decay = weeksAgo / 52;
  const activeAffiliates = Math.round(114 - (114 - 83) * (1 - decay));
  const totalRevenue = Math.round(2480000 - weeksAgo * 14000);
  const commissionsPaid = Math.round(293000 - weeksAgo * 1800);
  const roi = parseFloat((10.2 - weeksAgo * 0.02).toFixed(1));
  const netCustomerGrowth = weeksAgo > 30 ? Math.floor((30 - weeksAgo) * 0.5) : -Math.floor((30 - weeksAgo) * 1.2);
  const fraudFlagged = weeksAgo > 30 ? 0 : weeksAgo > 20 ? 3 : weeksAgo > 10 ? 5 : 8;
  const newAffiliates = weeksAgo > 35 ? Math.floor(3 + Math.random() * 4) : weeksAgo > 20 ? Math.floor(1 + Math.random() * 3) : Math.floor(Math.random() * 2);
  return { totalRevenue, activeAffiliates, commissionsPaid, roi, netCustomerGrowth, newAffiliates, fraudFlagged };
}

function topAffiliates(weeksAgo: number) {
  const scale = 1 - weeksAgo * 0.003;
  return [
    { id: "aff_001", name: "Jordan Mills",  revenue: Math.round(342000 * scale) },
    { id: "aff_002", name: "Priya Sharma",  revenue: Math.round(298000 * scale) },
    { id: "aff_003", name: "Marcus Chen",   revenue: Math.round(267000 * scale) },
  ];
}

function alerts(weeksAgo: number): WeeklySnapshot["alerts"] {
  const list: WeeklySnapshot["alerts"] = [];
  if (weeksAgo <= 8) list.push({ type: "overdue", message: "Jan 2026 payout of $41,400 overdue" });
  if (weeksAgo <= 10) list.push({ type: "overdue", message: "Dec 2025 payout of $27,700 unpaid" });
  if (weeksAgo <= 14) list.push({ type: "fraud", message: "8 affiliates flagged: ad_source cluster + high cancel rate" });
  if (weeksAgo >= 10 && weeksAgo <= 30) list.push({ type: "decline", message: "Active affiliate count declining from 114 peak" });
  return list;
}

export const SNAPSHOTS: WeeklySnapshot[] = Array.from({ length: 52 }, (_, i) => {
  const weekOf = monday(i);
  const kpis = weekStats(i);
  return {
    generatedAt: isoTs(weekOf),
    weekOf,
    kpis,
    topAffiliates: topAffiliates(i),
    alerts: alerts(i),
  };
});
