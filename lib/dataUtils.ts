import { Affiliate, ProgramStats, MonthlyPoint, Country, CommissionTier } from "./types";
import { AFFILIATES } from "@/data/seed/affiliates";
import { PAYOUT_CYCLES } from "@/data/seed/payouts";

export function getProgramStats(): ProgramStats {
  const all = AFFILIATES;
  const active = all.filter(a => a.status === "active");
  const allTimeRevenue = all.reduce((s, a) => s + a.metrics.totalRevenue, 0);
  const allTimeCommissions = all.reduce((s, a) => s + a.metrics.lifetimeCommissions, 0);
  const activeCustomers = all.reduce((s, a) => s + a.metrics.activeCustomers, 0);
  const fraudRev = all.filter(a => a.segment === "fraud-flagged").reduce((s, a) => s + a.metrics.totalRevenue, 0);
  const overdue = PAYOUT_CYCLES.filter(c => c.status === "overdue").reduce((s, c) => s + c.totalAmount, 0);
  const upcoming = PAYOUT_CYCLES.filter(c => c.status === "upcoming").reduce((s, c) => s + c.totalAmount, 0);

  const avgOrderValue = Math.round(all.reduce((s, a) => s + a.metrics.avgOrderValue, 0) / all.length);
  const avgConversionRate = parseFloat((all.reduce((s, a) => s + a.metrics.conversionRate, 0) / all.length).toFixed(4));

  const countryRevMap = new Map<Country, number>();
  for (const a of all) {
    countryRevMap.set(a.country, (countryRevMap.get(a.country) ?? 0) + a.metrics.totalRevenue);
  }
  let topCountry: Country = "US";
  let topRev = 0;
  for (const [c, r] of countryRevMap) {
    if (r > topRev) { topRev = r; topCountry = c; }
  }

  return {
    allTimeRevenue,
    allTimeCommissions,
    roi: parseFloat((allTimeRevenue / allTimeCommissions).toFixed(1)),
    activeAffiliates: active.length,
    totalAffiliates: all.length,
    activeCustomers,
    peakCustomers: 606,
    netCustomerGrowth: -93,
    overduePayouts: overdue,
    nextPayoutDue: upcoming,
    fraudFlaggedRevenuePct: parseFloat((fraudRev / allTimeRevenue).toFixed(3)),
    avgOrderValue,
    avgConversionRate,
    topCountry,
  };
}

export function getTopCountries(): { country: Country; revenue: number; affiliates: number }[] {
  const map = new Map<Country, { revenue: number; affiliates: number }>();
  for (const a of AFFILIATES) {
    const existing = map.get(a.country) ?? { revenue: 0, affiliates: 0 };
    existing.revenue += a.metrics.totalRevenue;
    existing.affiliates += 1;
    map.set(a.country, existing);
  }
  return Array.from(map.entries())
    .map(([country, v]) => ({ country, ...v }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getConversionFunnel(): { month: string; conversionRate: number }[] {
  const monthMap = new Map<string, { total: number; count: number }>();
  for (const a of AFFILIATES) {
    for (const pt of a.monthlyRevenue) {
      const e = monthMap.get(pt.month) ?? { total: 0, count: 0 };
      e.total += pt.conversionRate;
      e.count += 1;
      monthMap.set(pt.month, e);
    }
  }
  return Array.from(monthMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, v]) => ({ month, conversionRate: parseFloat((v.total / v.count).toFixed(4)) }));
}

export function getTierBreakdown(): { tier: CommissionTier; count: number; revenue: number; avgCancelRate: number }[] {
  const map = new Map<CommissionTier, { count: number; revenue: number; cancelRateSum: number }>();
  for (const a of AFFILIATES) {
    const e = map.get(a.tier) ?? { count: 0, revenue: 0, cancelRateSum: 0 };
    e.count += 1;
    e.revenue += a.metrics.totalRevenue;
    e.cancelRateSum += a.metrics.cancelRate;
    map.set(a.tier, e);
  }
  return Array.from(map.entries())
    .map(([tier, v]) => ({ tier, count: v.count, revenue: v.revenue, avgCancelRate: parseFloat((v.cancelRateSum / v.count).toFixed(3)) }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getMonthlyProgramRevenue(): MonthlyPoint[] {
  const monthMap = new Map<string, MonthlyPoint>();
  for (const a of AFFILIATES) {
    for (const pt of a.monthlyRevenue) {
      const existing = monthMap.get(pt.month);
      if (existing) {
        existing.revenue += pt.revenue;
        existing.customers += pt.customers;
        existing.newReferrals += pt.newReferrals;
        existing.cancels += pt.cancels;
        existing.clicks = (existing.clicks ?? 0) + (pt.clicks ?? 0);
      } else {
        monthMap.set(pt.month, { ...pt });
      }
    }
  }
  return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
}

export function getTopAffiliates(n = 10): Affiliate[] {
  return [...AFFILIATES].sort((a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue).slice(0, n);
}

export function formatCurrency(cents: number): string {
  if (cents >= 1_000_000) return `$${(cents / 1_000_000).toFixed(1)}M`;
  if (cents >= 1_000) return `$${(cents / 1_000).toFixed(0)}K`;
  return `$${cents}`;
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function getSegmentColor(segment: string): string {
  switch (segment) {
    case "champion":      return "#16A34A";
    case "mid-tier":      return "#0891B2";
    case "at-risk":       return "#CA8A04";
    case "fraud-flagged": return "#DC2626";
    default:              return "#6B7280";
  }
}

export function getMonthlyAffiliateStats() {
  const months: { month: string; newAffiliates: number; newCustomers: number; revenue: number; churnedCustomers: number; clicks: number }[] = [];
  const byMonth = new Map<string, { newAff: number; newCust: number; rev: number; churn: number; clicks: number }>();

  for (const a of AFFILIATES) {
    const joined = a.joinedAt.slice(0, 7);
    const e = byMonth.get(joined) ?? { newAff: 0, newCust: 0, rev: 0, churn: 0, clicks: 0 };
    e.newAff += 1;
    byMonth.set(joined, e);

    for (const pt of a.monthlyRevenue) {
      const e2 = byMonth.get(pt.month) ?? { newAff: 0, newCust: 0, rev: 0, churn: 0, clicks: 0 };
      e2.newCust += pt.newReferrals;
      e2.rev += pt.revenue;
      e2.churn += pt.cancels;
      e2.clicks += (pt.clicks ?? 0);
      byMonth.set(pt.month, e2);
    }
  }

  const sorted = Array.from(byMonth.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [month, v] of sorted) {
    months.push({ month, newAffiliates: v.newAff, newCustomers: v.newCust, revenue: v.rev, churnedCustomers: v.churn, clicks: v.clicks });
  }
  // Only return months that have actual revenue — eliminates sparse pre-data months from joinedAt dates
  const firstWithRevenue = months.findIndex(m => m.revenue > 0);
  return firstWithRevenue >= 0 ? months.slice(firstWithRevenue) : months;
}

export function getQoQGrowth() {
  return [
    { quarter: "Q3 2024", newCustomers: 68, churnedCustomers: 41, net: 27 },
    { quarter: "Q4 2024", newCustomers: 74, churnedCustomers: 48, net: 26 },
    { quarter: "Q1 2025", newCustomers: 61, churnedCustomers: 52, net: 9 },
    { quarter: "Q2 2025", newCustomers: 55, churnedCustomers: 53, net: 2 },
    { quarter: "Q3 2025", newCustomers: 42, churnedCustomers: 58, net: -16 },
    { quarter: "Q4 2025", newCustomers: 38, churnedCustomers: 61, net: -23 },
    { quarter: "Q1 2026", newCustomers: 29, churnedCustomers: 43, net: -14 },
    { quarter: "Q2 2026", newCustomers: 22, churnedCustomers: 62, net: -40 },
  ];
}

export function getCohortData() {
  const cohorts = [
    { name: "Q3 2024", color: "#0891B2", values: [100, 85, 76, 70, 65, 61, 58, 56, 54, 53, 52, 51] },
    { name: "Q4 2024", color: "#16A34A", values: [100, 83, 73, 67, 62, 58, 55, 52, 50, 48, 47, 46] },
    { name: "Q1 2025", color: "#3B82F6", values: [100, 82, 71, 64, 59, 55, 52, 49, 47, 45, 44, 43] },
    { name: "Q2 2025", color: "#10B981", values: [100, 79, 67, 59, 53, 48, 44, 41, 39, 37, 36, null] },
    { name: "Q3 2025", color: "#F59E0B", values: [100, 76, 63, 54, 48, 43, 39, 36, null, null, null, null] },
    { name: "Q4 2025", color: "#A78BFA", values: [100, 72, 58, 49, 43, 38, null, null, null, null, null, null] },
    { name: "Q1 2026", color: "#DC2626", values: [100, 68, 54, 45, null, null, null, null, null, null, null, null] },
  ];
  const months = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11"];
  return { cohorts, months };
}
