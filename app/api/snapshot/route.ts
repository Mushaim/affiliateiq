import { NextResponse } from "next/server";
import { getProgramStats, getTopAffiliates } from "@/lib/dataUtils";
import { PAYOUT_CYCLES } from "@/data/seed/payouts";
import { AFFILIATES } from "@/data/seed/affiliates";

export async function POST() {
  const stats = getProgramStats();
  const top = getTopAffiliates(3);
  const overdue = PAYOUT_CYCLES.filter(c => c.status === "overdue");
  const fraudFlagged = AFFILIATES.filter(a => a.segment === "fraud-flagged");

  const alerts: { type: "overdue" | "fraud" | "decline"; message: string }[] = [];
  if (overdue.length > 0) {
    alerts.push({ type: "overdue", message: `${overdue.length} payout cycles overdue: $${overdue.reduce((s, c) => s + c.totalAmount, 0).toLocaleString()}` });
  }
  if (fraudFlagged.length > 0) {
    alerts.push({ type: "fraud", message: `${fraudFlagged.length} affiliates fraud-flagged (ad_source cluster)` });
  }
  if (stats.netCustomerGrowth < 0) {
    alerts.push({ type: "decline", message: `Net customer growth: ${stats.netCustomerGrowth} (4 consecutive negative quarters)` });
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    weekOf: new Date().toISOString().split("T")[0],
    kpis: {
      totalRevenue: stats.allTimeRevenue,
      activeAffiliates: stats.activeAffiliates,
      commissionsPaid: stats.allTimeCommissions,
      roi: stats.roi,
      netCustomerGrowth: stats.netCustomerGrowth,
      newAffiliates: Math.floor(Math.random() * 5),
      fraudFlagged: fraudFlagged.length,
    },
    topAffiliates: top.map(a => ({ id: a.id, name: a.name, revenue: a.metrics.totalRevenue })),
    alerts,
  };

  return NextResponse.json({ success: true, snapshot });
}
