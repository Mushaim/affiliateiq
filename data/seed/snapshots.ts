import { WeeklySnapshot } from "@/lib/types";

export const SNAPSHOTS: WeeklySnapshot[] = [
  {
    generatedAt: "2026-06-09T08:00:00Z", weekOf: "2026-06-09",
    kpis: { totalRevenue: 2480000, activeAffiliates: 83, commissionsPaid: 293000, roi: 10.2, netCustomerGrowth: -93, newAffiliates: 2, fraudFlagged: 8 },
    topAffiliates: [
      { id: "aff_001", name: "Jordan Mills", revenue: 342000 },
      { id: "aff_002", name: "Priya Sharma", revenue: 298000 },
      { id: "aff_003", name: "Marcus Chen", revenue: 267000 },
    ],
    alerts: [
      { type: "overdue", message: "Jan 2026 payout of $41,400 is 16 days overdue" },
      { type: "overdue", message: "Dec 2025 payout of $27,700 remains unpaid" },
      { type: "fraud", message: "8 affiliates flagged: ad_source cluster + high cancel rate" },
    ],
  },
  {
    generatedAt: "2026-06-02T08:00:00Z", weekOf: "2026-06-02",
    kpis: { totalRevenue: 2440000, activeAffiliates: 84, commissionsPaid: 287000, roi: 10.1, netCustomerGrowth: -88, newAffiliates: 3, fraudFlagged: 8 },
    topAffiliates: [
      { id: "aff_001", name: "Jordan Mills", revenue: 328000 },
      { id: "aff_002", name: "Priya Sharma", revenue: 284000 },
      { id: "aff_003", name: "Marcus Chen", revenue: 254000 },
    ],
    alerts: [
      { type: "overdue", message: "Jan 2026 payout of $41,400 is 9 days overdue" },
      { type: "fraud", message: "8 affiliates flagged: ad_source cluster" },
    ],
  },
  {
    generatedAt: "2026-05-26T08:00:00Z", weekOf: "2026-05-26",
    kpis: { totalRevenue: 2398000, activeAffiliates: 85, commissionsPaid: 281000, roi: 9.9, netCustomerGrowth: -82, newAffiliates: 1, fraudFlagged: 8 },
    topAffiliates: [
      { id: "aff_001", name: "Jordan Mills", revenue: 314000 },
      { id: "aff_002", name: "Priya Sharma", revenue: 271000 },
      { id: "aff_003", name: "Marcus Chen", revenue: 242000 },
    ],
    alerts: [
      { type: "overdue", message: "Jan 2026 payout of $41,400 overdue" },
      { type: "decline", message: "Active affiliate count down from 114 peak (net -29)" },
    ],
  },
  {
    generatedAt: "2026-05-19T08:00:00Z", weekOf: "2026-05-19",
    kpis: { totalRevenue: 2356000, activeAffiliates: 86, commissionsPaid: 275000, roi: 9.8, netCustomerGrowth: -76, newAffiliates: 4, fraudFlagged: 8 },
    topAffiliates: [
      { id: "aff_001", name: "Jordan Mills", revenue: 300000 },
      { id: "aff_002", name: "Priya Sharma", revenue: 259000 },
      { id: "aff_003", name: "Marcus Chen", revenue: 232000 },
    ],
    alerts: [
      { type: "fraud", message: "8 affiliates in ad_source cluster — investigation recommended" },
    ],
  },
  {
    generatedAt: "2026-05-12T08:00:00Z", weekOf: "2026-05-12",
    kpis: { totalRevenue: 2314000, activeAffiliates: 88, commissionsPaid: 269000, roi: 9.6, netCustomerGrowth: -69, newAffiliates: 2, fraudFlagged: 7 },
    topAffiliates: [
      { id: "aff_001", name: "Jordan Mills", revenue: 287000 },
      { id: "aff_002", name: "Priya Sharma", revenue: 247000 },
      { id: "aff_003", name: "Marcus Chen", revenue: 221000 },
    ],
    alerts: [
      { type: "decline", message: "Net customer growth negative for 4 consecutive quarters" },
    ],
  },
  {
    generatedAt: "2026-05-05T08:00:00Z", weekOf: "2026-05-05",
    kpis: { totalRevenue: 2271000, activeAffiliates: 89, commissionsPaid: 264000, roi: 9.5, netCustomerGrowth: -61, newAffiliates: 5, fraudFlagged: 7 },
    topAffiliates: [
      { id: "aff_001", name: "Jordan Mills", revenue: 273000 },
      { id: "aff_002", name: "Priya Sharma", revenue: 235000 },
      { id: "aff_003", name: "Marcus Chen", revenue: 210000 },
    ],
    alerts: [],
  },
  {
    generatedAt: "2026-04-28T08:00:00Z", weekOf: "2026-04-28",
    kpis: { totalRevenue: 2228000, activeAffiliates: 91, commissionsPaid: 258000, roi: 9.3, netCustomerGrowth: -53, newAffiliates: 3, fraudFlagged: 6 },
    topAffiliates: [
      { id: "aff_001", name: "Jordan Mills", revenue: 259000 },
      { id: "aff_002", name: "Priya Sharma", revenue: 222000 },
      { id: "aff_003", name: "Marcus Chen", revenue: 198000 },
    ],
    alerts: [],
  },
  {
    generatedAt: "2026-04-21T08:00:00Z", weekOf: "2026-04-21",
    kpis: { totalRevenue: 2184000, activeAffiliates: 93, commissionsPaid: 252000, roi: 9.1, netCustomerGrowth: -44, newAffiliates: 6, fraudFlagged: 5 },
    topAffiliates: [
      { id: "aff_001", name: "Jordan Mills", revenue: 245000 },
      { id: "aff_002", name: "Priya Sharma", revenue: 209000 },
      { id: "aff_003", name: "Marcus Chen", revenue: 186000 },
    ],
    alerts: [],
  },
];
