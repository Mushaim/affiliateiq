import { NextRequest, NextResponse } from "next/server";
import { getProgramStats, getMonthlyProgramRevenue, getTopAffiliates } from "@/lib/dataUtils";

const calls = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const prev = (calls.get(ip) ?? []).filter(t => now - t < 60_000);
  if (prev.length >= 30) return true;
  calls.set(ip, [...prev, now]);
  return false;
}

export function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
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
