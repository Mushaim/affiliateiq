import { PayoutCycle } from "@/lib/types";
import { AFFILIATES } from "./affiliates";

function cycleMonth(monthsAgo: number): string {
  const d = new Date(2026, 5 - monthsAgo, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function dueDate(cycleM: string): string {
  const [y, m] = cycleM.split("-").map(Number);
  const due = new Date(y, m, 2); // 2nd of following month
  return due.toISOString().split("T")[0];
}

export const PAYOUT_CYCLES: PayoutCycle[] = [
  {
    id: "pay_001",
    cycleMonth: cycleMonth(5), // Jan 2026
    totalAmount: 41400,
    affiliatesCount: 28,
    status: "overdue",
    dueDate: "2026-03-02",
    paidDate: null,
    items: AFFILIATES.filter(a => a.segment !== "fraud-flagged").slice(0, 28).map(a => ({
      affiliateId: a.id,
      affiliateName: a.name,
      amount: Math.floor(a.metrics.lifetimeCommissions / 12),
      status: "pending" as const,
      fpAmount: Math.floor(a.metrics.lifetimeCommissions / 12),
      actualAmount: 0,
      mismatch: false,
    })),
  },
  {
    id: "pay_002",
    cycleMonth: cycleMonth(6), // Dec 2025
    totalAmount: 27700,
    affiliatesCount: 33,
    status: "overdue",
    dueDate: "2026-02-02",
    paidDate: null,
    items: AFFILIATES.filter(a => a.segment !== "fraud-flagged").slice(0, 33).map(a => ({
      affiliateId: a.id,
      affiliateName: a.name,
      amount: Math.floor(a.metrics.lifetimeCommissions / 14),
      status: "flagged" as const,
      fpAmount: Math.floor(a.metrics.lifetimeCommissions / 14),
      actualAmount: 0,
      mismatch: true,
    })),
  },
  {
    id: "pay_003",
    cycleMonth: cycleMonth(1), // May 2026
    totalAmount: 38200,
    affiliatesCount: 31,
    status: "upcoming",
    dueDate: "2026-07-02",
    paidDate: null,
    items: [],
  },
  {
    id: "pay_004",
    cycleMonth: cycleMonth(2),
    totalAmount: 35100,
    affiliatesCount: 29,
    status: "paid",
    dueDate: "2026-06-02",
    paidDate: "2026-06-01",
    items: [],
  },
  {
    id: "pay_005",
    cycleMonth: cycleMonth(3),
    totalAmount: 32800,
    affiliatesCount: 27,
    status: "paid",
    dueDate: "2026-05-02",
    paidDate: "2026-04-30",
    items: [],
  },
  {
    id: "pay_006",
    cycleMonth: cycleMonth(4),
    totalAmount: 29400,
    affiliatesCount: 25,
    status: "paid",
    dueDate: "2026-04-02",
    paidDate: "2026-04-01",
    items: [],
  },
  {
    id: "pay_007",
    cycleMonth: cycleMonth(7),
    totalAmount: 24100,
    affiliatesCount: 22,
    status: "paid",
    dueDate: "2026-01-02",
    paidDate: "2026-01-02",
    items: [],
  },
  {
    id: "pay_008",
    cycleMonth: cycleMonth(8),
    totalAmount: 21800,
    affiliatesCount: 20,
    status: "paid",
    dueDate: "2025-12-02",
    paidDate: "2025-12-01",
    items: [],
  },
];
