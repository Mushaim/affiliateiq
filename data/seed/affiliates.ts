import { Affiliate, MonthlyPoint, Country, CommissionTier, TrafficSource } from "@/lib/types";

// Deterministic seeded RNG (mulberry32) — avoids hydration mismatch from Math.random()
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rng = makeRng(0xDEADBEEF);

const ALL_TRAFFIC_SOURCES: TrafficSource[] = [
  "organic-search", "paid-social", "youtube", "email", "podcast", "linkedin", "twitter-x", "reddit"
];

const COUNTRIES: Country[] = ["US","UK","CA","DE","AU","IN","SE","NL","FR","SG","BR","PH"];

function genMonthly(
  baseRevenue: number,
  trend: "up" | "down" | "flat" | "volatile",
  baseCvr: number,
  baseAov: number,
  months = 24,
): MonthlyPoint[] {
  const points: MonthlyPoint[] = [];
  const now = new Date(2026, 5, 1); // June 2026
  let current = baseRevenue;
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const noise = (rng() - 0.5) * 0.2 * current;
    if (trend === "up") current = current * 1.03 + noise;
    else if (trend === "down") current = current * 0.97 + noise;
    else if (trend === "volatile") current = baseRevenue + (rng() - 0.5) * baseRevenue * 0.8;
    else current = current + noise;
    const rev = Math.max(0, Math.round(current));
    const customers = Math.max(0, Math.floor(rev / 4900));
    const newRefs = Math.max(0, Math.floor(rng() * 4));
    const cancels = Math.floor(newRefs * rng() * 0.4);
    const clicks = Math.max(0, Math.floor(rev / 120 + rng() * 80));
    const conversionRate = Math.max(0.005, baseCvr + (rng() - 0.5) * 0.02);
    const avgOrderValue = Math.max(1000, baseAov + Math.floor((rng() - 0.5) * 2000));
    points.push({ month: monthStr, revenue: rev, customers, newReferrals: newRefs, cancels, clicks, conversionRate: parseFloat(conversionRate.toFixed(4)), avgOrderValue });
  }
  return points;
}

export const AFFILIATES: Affiliate[] = [
  // Champions (8)
  {
    id: "aff_001", name: "Jordan Mills", email: "jordan@solutionsco.io",
    joinedAt: "2024-01-15", segment: "champion", campaignType: "solutions-partner", status: "active",
    country: "US", tier: "platinum", trafficSources: ["organic-search", "email"],
    metrics: { totalRevenue: 342000, totalCustomers: 68, activeCustomers: 61, cancelRate: 0.09, avgCommissionPct: 0.12, lifetimeCommissions: 41040, lastReferralAt: "2026-06-10", fraudScore: 4, fraudEvidence: [], conversionRate: 0.12, avgOrderValue: 18500, customerLTV: 148000 },
    monthlyRevenue: genMonthly(14000, "up", 0.12, 18500),
  },
  {
    id: "aff_002", name: "Priya Sharma", email: "priya@techconsults.net",
    joinedAt: "2024-02-20", segment: "champion", campaignType: "solutions-partner", status: "active",
    country: "IN", tier: "platinum", trafficSources: ["organic-search", "linkedin"],
    metrics: { totalRevenue: 298000, totalCustomers: 59, activeCustomers: 54, cancelRate: 0.08, avgCommissionPct: 0.12, lifetimeCommissions: 35760, lastReferralAt: "2026-06-08", fraudScore: 2, fraudEvidence: [], conversionRate: 0.13, avgOrderValue: 16200, customerLTV: 129600 },
    monthlyRevenue: genMonthly(12000, "up", 0.13, 16200),
  },
  {
    id: "aff_003", name: "Marcus Chen", email: "marcus@growthlab.co",
    joinedAt: "2023-11-05", segment: "champion", campaignType: "content", status: "active",
    country: "SG", tier: "gold", trafficSources: ["youtube", "organic-search"],
    metrics: { totalRevenue: 267000, totalCustomers: 53, activeCustomers: 48, cancelRate: 0.11, avgCommissionPct: 0.15, lifetimeCommissions: 40050, lastReferralAt: "2026-06-09", fraudScore: 6, fraudEvidence: [], conversionRate: 0.10, avgOrderValue: 14800, customerLTV: 118400 },
    monthlyRevenue: genMonthly(11000, "up", 0.10, 14800),
  },
  {
    id: "aff_004", name: "Aisha Okafor", email: "aisha@saasreviews.blog",
    joinedAt: "2024-03-10", segment: "champion", campaignType: "content", status: "active",
    country: "UK", tier: "gold", trafficSources: ["organic-search", "email"],
    metrics: { totalRevenue: 189000, totalCustomers: 37, activeCustomers: 34, cancelRate: 0.08, avgCommissionPct: 0.15, lifetimeCommissions: 28350, lastReferralAt: "2026-06-07", fraudScore: 3, fraudEvidence: [], conversionRate: 0.11, avgOrderValue: 20000, customerLTV: 160000 },
    monthlyRevenue: genMonthly(7800, "up", 0.11, 20000),
  },
  {
    id: "aff_005", name: "Tyler Novak", email: "tyler@automationhub.io",
    joinedAt: "2023-09-22", segment: "champion", campaignType: "solutions-partner", status: "active",
    country: "US", tier: "gold", trafficSources: ["email", "linkedin"],
    metrics: { totalRevenue: 178000, totalCustomers: 35, activeCustomers: 31, cancelRate: 0.12, avgCommissionPct: 0.12, lifetimeCommissions: 21360, lastReferralAt: "2026-06-05", fraudScore: 8, fraudEvidence: [], conversionRate: 0.09, avgOrderValue: 17500, customerLTV: 140000 },
    monthlyRevenue: genMonthly(7400, "flat", 0.09, 17500),
  },
  {
    id: "aff_006", name: "Sofia Andersen", email: "sofia@aibusiness.dk",
    joinedAt: "2024-04-01", segment: "champion", campaignType: "content", status: "active",
    country: "SE", tier: "gold", trafficSources: ["youtube", "podcast"],
    metrics: { totalRevenue: 156000, totalCustomers: 31, activeCustomers: 28, cancelRate: 0.10, avgCommissionPct: 0.15, lifetimeCommissions: 23400, lastReferralAt: "2026-06-11", fraudScore: 5, fraudEvidence: [], conversionRate: 0.10, avgOrderValue: 22000, customerLTV: 176000 },
    monthlyRevenue: genMonthly(6500, "up", 0.10, 22000),
  },
  {
    id: "aff_007", name: "Ravi Patel", email: "ravi@cloudsolutions.in",
    joinedAt: "2023-12-18", segment: "champion", campaignType: "solutions-partner", status: "active",
    country: "IN", tier: "silver", trafficSources: ["organic-search"],
    metrics: { totalRevenue: 143000, totalCustomers: 28, activeCustomers: 25, cancelRate: 0.11, avgCommissionPct: 0.12, lifetimeCommissions: 17160, lastReferralAt: "2026-06-06", fraudScore: 7, fraudEvidence: [], conversionRate: 0.08, avgOrderValue: 13500, customerLTV: 108000 },
    monthlyRevenue: genMonthly(6000, "flat", 0.08, 13500),
  },
  {
    id: "aff_008", name: "Emma Larsson", email: "emma@techblogger.se",
    joinedAt: "2024-01-28", segment: "champion", campaignType: "content", status: "active",
    country: "SE", tier: "silver", trafficSources: ["organic-search", "reddit"],
    metrics: { totalRevenue: 134000, totalCustomers: 26, activeCustomers: 24, cancelRate: 0.08, avgCommissionPct: 0.15, lifetimeCommissions: 20100, lastReferralAt: "2026-06-10", fraudScore: 3, fraudEvidence: [], conversionRate: 0.09, avgOrderValue: 15000, customerLTV: 120000 },
    monthlyRevenue: genMonthly(5600, "up", 0.09, 15000),
  },

  // Mid-Tier (22)
  ...(["Liam Torres", "Fatima Hassan", "James O'Brien", "Yuki Tanaka", "Carlos Mendez",
    "Amara Diallo", "Wei Zhang", "Olga Petrov", "Mateo Rivera", "Hannah Fischer",
    "Kwame Asante", "Isla MacLeod", "Dmitri Volkov", "Nadia Ali", "Ben Kowalski",
    "Zara Ahmed", "Lucas Dubois", "Mei Lin", "Alex Okonkwo", "Sara Lindqvist",
    "Paulo Ferreira", "Ingrid Holm"].map((name, i) => {
    const baseCvr = 0.04 + rng() * 0.05;
    const baseAov = 6000 + Math.floor(rng() * 8000);
    const numSources = rng() > 0.5 ? 2 : 1;
    const src1 = ALL_TRAFFIC_SOURCES[Math.floor(rng() * ALL_TRAFFIC_SOURCES.length)];
    const src2 = ALL_TRAFFIC_SOURCES[Math.floor(rng() * ALL_TRAFFIC_SOURCES.length)];
    const trafficSources: TrafficSource[] = numSources === 2 ? [src1, src2] : [src1];
    return {
      id: `aff_${String(i + 9).padStart(3, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]/g, "")}@partner.net`,
      joinedAt: `202${4 - Math.floor(i / 8)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      segment: "mid-tier" as const,
      campaignType: i % 3 === 0 ? "coupon" as const : i % 3 === 1 ? "content" as const : "solutions-partner" as const,
      status: "active" as const,
      country: COUNTRIES[i % COUNTRIES.length],
      tier: (i % 3 === 0 ? "gold" : "silver") as CommissionTier,
      trafficSources,
      metrics: {
        totalRevenue: 20000 + Math.floor(rng() * 80000),
        totalCustomers: 4 + Math.floor(rng() * 16),
        activeCustomers: 3 + Math.floor(rng() * 12),
        cancelRate: 0.1 + rng() * 0.25,
        avgCommissionPct: i % 3 === 0 ? 0.20 : 0.13,
        lifetimeCommissions: 3000 + Math.floor(rng() * 12000),
        lastReferralAt: `2026-0${Math.floor(rng() * 5) + 1}-${String(Math.floor(rng() * 28) + 1).padStart(2, "0")}`,
        fraudScore: Math.floor(rng() * 25),
        fraudEvidence: [],
        conversionRate: parseFloat(baseCvr.toFixed(4)),
        avgOrderValue: baseAov,
        customerLTV: baseAov * 8,
      },
      monthlyRevenue: genMonthly(1500 + Math.floor(rng() * 3000), i % 2 === 0 ? "down" : "flat", baseCvr, baseAov),
    };
  })),

  // At Risk (12)
  ...(["Jason West", "Liam Grant", "Nina Reyes", "Oscar Bjork", "Tina Marsh",
    "Eric Volpe", "Dana Cross", "Finn Murphy", "Rosa Sato", "Cole Hendrix",
    "Vera Novak", "Sam Adeyemi"].map((name, i) => {
    const baseCvr = 0.01 + rng() * 0.03;
    const baseAov = 4000 + Math.floor(rng() * 4000);
    const src = rng() > 0.5 ? "paid-social" as TrafficSource : "reddit" as TrafficSource;
    return {
      id: `aff_${String(i + 31).padStart(3, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]/g, "")}@email.com`,
      joinedAt: `2023-${String((i % 12) + 1).padStart(2, "0")}-15`,
      segment: "at-risk" as const,
      campaignType: "coupon" as const,
      status: i > 9 ? "inactive" as const : "active" as const,
      country: COUNTRIES[Math.floor(rng() * COUNTRIES.length)],
      tier: "bronze" as CommissionTier,
      trafficSources: [src],
      metrics: {
        totalRevenue: 5000 + Math.floor(rng() * 20000),
        totalCustomers: 2 + Math.floor(rng() * 8),
        activeCustomers: Math.floor(rng() * 3),
        cancelRate: 0.7 + rng() * 0.28,
        avgCommissionPct: 0.20,
        lifetimeCommissions: 1000 + Math.floor(rng() * 4000),
        lastReferralAt: `2025-${String((i % 12) + 1).padStart(2, "0")}-10`,
        fraudScore: 20 + Math.floor(rng() * 40),
        fraudEvidence: i < 3 ? ["high_cancel_rate"] : [],
        conversionRate: parseFloat(baseCvr.toFixed(4)),
        avgOrderValue: baseAov,
        customerLTV: baseAov * 8,
      },
      monthlyRevenue: genMonthly(800 + Math.floor(rng() * 1200), "down", baseCvr, baseAov),
    };
  })),

  // Fraud Flagged (8)
  ...(["Minh Tran", "Nguyen Bao", "Thi Linh", "Van Duc", "Hoang Anh", "Quang Minh", "Bich Ngoc", "Tuan Kiet"].map((name, i) => {
    const baseCvr = 0.15 + rng() * 0.10;
    const baseAov = 3000 + Math.floor(rng() * 2000);
    return {
      id: `aff_${String(i + 43).padStart(3, "0")}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]/g, "")}@gmail.com`,
      joinedAt: `2025-${String((i % 6) + 7).padStart(2, "0")}-${String((i * 3) + 1).padStart(2, "0")}`,
      segment: "fraud-flagged" as const,
      campaignType: "ad-source" as const,
      status: "active" as const,
      country: (i % 2 === 0 ? "PH" : "BR") as Country,
      tier: "bronze" as CommissionTier,
      trafficSources: ["paid-social", "twitter-x"] as TrafficSource[],
      metrics: {
        totalRevenue: 8000 + Math.floor(rng() * 12000),
        totalCustomers: 3 + Math.floor(rng() * 6),
        activeCustomers: 1 + Math.floor(rng() * 3),
        cancelRate: 0.88 + rng() * 0.09,
        avgCommissionPct: 0.15,
        lifetimeCommissions: 1200 + Math.floor(rng() * 2000),
        lastReferralAt: "2026-05-20",
        fraudScore: 72 + Math.floor(rng() * 25),
        fraudEvidence: ["high_cancel_rate", "ad_source_cluster", "duplicate_referrals"],
        conversionRate: parseFloat(baseCvr.toFixed(4)),
        avgOrderValue: baseAov,
        customerLTV: baseAov * 8,
      },
      monthlyRevenue: genMonthly(1000 + Math.floor(rng() * 800), "volatile", baseCvr, baseAov),
    };
  })),
];
