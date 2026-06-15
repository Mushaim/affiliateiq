import { NextResponse } from "next/server";
import { getProgramStats, getMonthlyProgramRevenue, getTopAffiliates } from "@/lib/dataUtils";

export function GET() {
  try {
    return NextResponse.json({
      stats: getProgramStats(),
      monthly: getMonthlyProgramRevenue(),
      topAffiliates: getTopAffiliates(10),
    });
  } catch (err) {
    console.error("[data] failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
