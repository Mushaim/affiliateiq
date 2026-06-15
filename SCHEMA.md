# Data Schema — AffiliateIQ Dashboard

## Core Types (TypeScript)

```typescript
// Affiliate (promoter)
type Affiliate = {
  id: string;                    // "aff_001"
  name: string;                  // "Jordan Mills"
  email: string;
  joinedAt: string;              // ISO date
  segment: "champion" | "mid-tier" | "at-risk" | "fraud-flagged";
  campaignType: "solutions-partner" | "content" | "coupon" | "ad-source";
  status: "active" | "inactive" | "archived";
  metrics: {
    totalRevenue: number;        // USD cents
    totalCustomers: number;
    activeCustomers: number;
    cancelRate: number;          // 0-1
    avgCommissionPct: number;    // 0-1
    lifetimeCommissions: number; // USD cents
    lastReferralAt: string;      // ISO date
    fraudScore: number;          // 0-100
    fraudEvidence: string[];     // ["high_cancel", "ad_source_cluster"]
  };
  monthlyRevenue: MonthlyPoint[]; // 24-month series
};

// Monthly data point
type MonthlyPoint = {
  month: string;   // "2024-07"
  revenue: number; // USD cents
  customers: number;
  newReferrals: number;
  cancels: number;
};

// Payout cycle
type PayoutCycle = {
  id: string;
  cycleMonth: string;         // "2026-01"
  totalAmount: number;        // USD cents
  affiliatesCount: number;
  status: "paid" | "overdue" | "upcoming" | "processing";
  dueDate: string;
  paidDate: string | null;
  items: PayoutItem[];
};

type PayoutItem = {
  affiliateId: string;
  amount: number;
  status: "paid" | "pending" | "flagged";
  fpAmount: number;            // FirstPromoter reported
  actualAmount: number;        // PayPal confirmed
  mismatch: boolean;
};

// Weekly snapshot (stored as JSON file)
type WeeklySnapshot = {
  generatedAt: string;         // ISO datetime
  weekOf: string;              // "2026-06-09"
  kpis: {
    totalRevenue: number;
    activeAffiliates: number;
    commissionsPaid: number;
    roi: number;
    netCustomerGrowth: number;
    newAffiliates: number;
    fraudFlagged: number;
  };
  topAffiliates: { id: string; name: string; revenue: number }[];
  alerts: { type: "overdue" | "fraud" | "decline"; message: string }[];
};

// Program-level aggregates (computed)
type ProgramStats = {
  allTimeRevenue: number;
  allTimeCommissions: number;
  roi: number;
  activeAffiliates: number;
  totalAffiliates: number;
  activeCustomers: number;
  peakCustomers: number;
  netCustomerGrowth: number;   // last 4 quarters combined
  overduePayouts: number;
  nextPayoutDue: number;
  fraudFlaggedRevenuePct: number;
};
```

## Demo Seed Summary

| Entity | Count |
|--------|-------|
| Affiliates | 50 |
| Champions | 8 |
| Mid-Tier | 22 |
| At Risk | 12 |
| Fraud Flagged | 8 |
| Payout Cycles | 12 (monthly, last 12 months) |
| Monthly Revenue Points | 50 affiliates × 24 months = 1,200 |
| Weekly Snapshots (pre-seeded) | 8 (last 8 Mondays) |

## Key Program Numbers (Demo / NovaSaaS Co.)

| Metric | Value |
|--------|-------|
| All-time revenue | $2,480,000 |
| Commissions paid | $293,000 |
| ROI | 10.2x |
| Active promoters | 83 |
| Peak promoters | 114 |
| Active customers | 542 |
| Peak customers | 606 |
| Overdue payouts | $27,700 |
| Next payout due | $41,400 |
| Fraud-flagged revenue | 36% (ad_source cluster) |
