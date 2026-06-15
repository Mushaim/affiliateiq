import { describe, it, expect } from "vitest";
import {
  getProgramStats,
  getMonthlyProgramRevenue,
  getTopAffiliates,
  formatCurrency,
  formatUSD,
  getSegmentColor,
  getMonthlyAffiliateStats,
} from "@/lib/dataUtils";

describe("formatCurrency", () => {
  it("formats millions", () => {
    expect(formatCurrency(2_480_000)).toBe("$2.5M");
  });
  it("formats thousands", () => {
    expect(formatCurrency(293_000)).toBe("$293K");
  });
  it("formats small values", () => {
    expect(formatCurrency(50)).toBe("$50");
  });
  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});

describe("formatUSD", () => {
  it("formats as USD currency string", () => {
    expect(formatUSD(41400)).toBe("$41,400");
  });
});

describe("getSegmentColor", () => {
  it("returns green for champion", () => {
    expect(getSegmentColor("champion")).toBe("#16A34A");
  });
  it("returns teal for mid-tier", () => {
    expect(getSegmentColor("mid-tier")).toBe("#0891B2");
  });
  it("returns amber for at-risk", () => {
    expect(getSegmentColor("at-risk")).toBe("#CA8A04");
  });
  it("returns red for fraud-flagged", () => {
    expect(getSegmentColor("fraud-flagged")).toBe("#DC2626");
  });
  it("returns muted for unknown", () => {
    expect(getSegmentColor("unknown")).toBe("#6B7280");
  });
});

describe("getProgramStats", () => {
  const stats = getProgramStats();

  it("returns positive allTimeRevenue", () => {
    expect(stats.allTimeRevenue).toBeGreaterThan(0);
  });
  it("returns positive ROI", () => {
    expect(stats.roi).toBeGreaterThan(1);
  });
  it("activeAffiliates is within total", () => {
    expect(stats.activeAffiliates).toBeLessThanOrEqual(stats.totalAffiliates);
    expect(stats.activeAffiliates).toBeGreaterThan(0);
  });
  it("commissions are less than total revenue", () => {
    expect(stats.allTimeCommissions).toBeLessThan(stats.allTimeRevenue);
  });
  it("roi matches revenue/commissions", () => {
    const expected = parseFloat((stats.allTimeRevenue / stats.allTimeCommissions).toFixed(1));
    expect(stats.roi).toBe(expected);
  });
  it("fraudFlaggedRevenuePct is between 0 and 1", () => {
    expect(stats.fraudFlaggedRevenuePct).toBeGreaterThanOrEqual(0);
    expect(stats.fraudFlaggedRevenuePct).toBeLessThanOrEqual(1);
  });
});

describe("getMonthlyProgramRevenue", () => {
  const data = getMonthlyProgramRevenue();

  it("returns sorted months", () => {
    for (let i = 1; i < data.length; i++) {
      expect(data[i].month >= data[i - 1].month).toBe(true);
    }
  });
  it("each month has non-negative revenue", () => {
    for (const pt of data) {
      expect(pt.revenue).toBeGreaterThanOrEqual(0);
    }
  });
  it("is deterministic across calls", () => {
    const a = getMonthlyProgramRevenue();
    const b = getMonthlyProgramRevenue();
    expect(a[0].revenue).toBe(b[0].revenue);
    expect(a[a.length - 1].revenue).toBe(b[b.length - 1].revenue);
  });
  it("has 24 months of data", () => {
    expect(data.length).toBe(24);
  });
});

describe("getTopAffiliates", () => {
  it("returns n affiliates sorted by revenue desc", () => {
    const top = getTopAffiliates(5);
    expect(top).toHaveLength(5);
    for (let i = 1; i < top.length; i++) {
      expect(top[i - 1].metrics.totalRevenue).toBeGreaterThanOrEqual(top[i].metrics.totalRevenue);
    }
  });
  it("top affiliate is a champion", () => {
    const top = getTopAffiliates(1);
    expect(top[0].segment).toBe("champion");
  });
});

describe("getMonthlyAffiliateStats", () => {
  const stats = getMonthlyAffiliateStats();

  it("returns sorted months", () => {
    for (let i = 1; i < stats.length; i++) {
      expect(stats[i].month >= stats[i - 1].month).toBe(true);
    }
  });
  it("all numeric fields are non-negative", () => {
    for (const s of stats) {
      expect(s.newAffiliates).toBeGreaterThanOrEqual(0);
      expect(s.newCustomers).toBeGreaterThanOrEqual(0);
      expect(s.churnedCustomers).toBeGreaterThanOrEqual(0);
      expect(s.revenue).toBeGreaterThanOrEqual(0);
    }
  });
});
