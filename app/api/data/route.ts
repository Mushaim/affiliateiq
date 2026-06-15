import { NextResponse } from "next/server";
import { getProgramStats, getMonthlyProgramRevenue, getTopAffiliates } from "@/lib/dataUtils";

export function GET() {
  return NextResponse.json({
    stats: getProgramStats(),
    monthly: getMonthlyProgramRevenue(),
    topAffiliates: getTopAffiliates(10),
  });
}
