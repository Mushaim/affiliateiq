import { NextRequest, NextResponse } from "next/server";
import { getProgramStats, getTopAffiliates } from "@/lib/dataUtils";
import { PAYOUT_CYCLES } from "@/data/seed/payouts";
import { AFFILIATES } from "@/data/seed/affiliates";

// Simple in-memory rate limiter: max 10 calls per minute per IP
const calls = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const prev = (calls.get(ip) ?? []).filter(t => now - t < window);
  if (prev.length >= 10) return true;
  calls.set(ip, [...prev, now]);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
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
        newAffiliates: fraudFlagged.length > 0 ? 1 : 3, // deterministic for demo
        fraudFlagged: fraudFlagged.length,
      },
      topAffiliates: top.map(a => ({ id: a.id, name: a.name, revenue: a.metrics.totalRevenue })),
      alerts,
    };

    return NextResponse.json({ success: true, snapshot });
  } catch (err) {
    console.error("[snapshot] failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Reject non-POST requests explicitly
export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
