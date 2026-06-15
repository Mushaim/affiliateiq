export type AffiliateSegment = "champion" | "mid-tier" | "at-risk" | "fraud-flagged";
export type CampaignType = "solutions-partner" | "content" | "coupon" | "ad-source";
export type AffiliateStatus = "active" | "inactive" | "archived";
export type PayoutStatus = "paid" | "overdue" | "upcoming" | "processing";
export type PayoutItemStatus = "paid" | "pending" | "flagged";

export interface MonthlyPoint {
  month: string;
  revenue: number;
  customers: number;
  newReferrals: number;
  cancels: number;
}

export interface AffiliateMetrics {
  totalRevenue: number;
  totalCustomers: number;
  activeCustomers: number;
  cancelRate: number;
  avgCommissionPct: number;
  lifetimeCommissions: number;
  lastReferralAt: string;
  fraudScore: number;
  fraudEvidence: string[];
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  segment: AffiliateSegment;
  campaignType: CampaignType;
  status: AffiliateStatus;
  metrics: AffiliateMetrics;
  monthlyRevenue: MonthlyPoint[];
}

export interface PayoutItem {
  affiliateId: string;
  affiliateName: string;
  amount: number;
  status: PayoutItemStatus;
  fpAmount: number;
  actualAmount: number;
  mismatch: boolean;
}

export interface PayoutCycle {
  id: string;
  cycleMonth: string;
  totalAmount: number;
  affiliatesCount: number;
  status: PayoutStatus;
  dueDate: string;
  paidDate: string | null;
  items: PayoutItem[];
}

export interface WeeklySnapshot {
  generatedAt: string;
  weekOf: string;
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
}

export interface ProgramStats {
  allTimeRevenue: number;
  allTimeCommissions: number;
  roi: number;
  activeAffiliates: number;
  totalAffiliates: number;
  activeCustomers: number;
  peakCustomers: number;
  netCustomerGrowth: number;
  overduePayouts: number;
  nextPayoutDue: number;
  fraudFlaggedRevenuePct: number;
}
