import { describe, it, expect } from "vitest";
import { AFFILIATES } from "@/data/seed/affiliates";
import { PAYOUT_CYCLES } from "@/data/seed/payouts";
import { SNAPSHOTS } from "@/data/seed/snapshots";

describe("AFFILIATES seed", () => {
  it("has exactly 50 affiliates", () => {
    expect(AFFILIATES).toHaveLength(50);
  });
  it("has 8 champions", () => {
    expect(AFFILIATES.filter(a => a.segment === "champion")).toHaveLength(8);
  });
  it("has 22 mid-tier", () => {
    expect(AFFILIATES.filter(a => a.segment === "mid-tier")).toHaveLength(22);
  });
  it("has 12 at-risk", () => {
    expect(AFFILIATES.filter(a => a.segment === "at-risk")).toHaveLength(12);
  });
  it("has 8 fraud-flagged", () => {
    expect(AFFILIATES.filter(a => a.segment === "fraud-flagged")).toHaveLength(8);
  });
  it("all IDs are unique", () => {
    const ids = AFFILIATES.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("all affiliates have 24 monthly revenue points", () => {
    for (const a of AFFILIATES) {
      expect(a.monthlyRevenue).toHaveLength(24);
    }
  });
  it("is deterministic — same revenue on repeated import", () => {
    const r1 = AFFILIATES[0].monthlyRevenue[0].revenue;
    const r2 = AFFILIATES[0].monthlyRevenue[0].revenue;
    expect(r1).toBe(r2);
  });
  it("all monthly points have required fields", () => {
    for (const a of AFFILIATES) {
      for (const pt of a.monthlyRevenue) {
        expect(pt).toHaveProperty("month");
        expect(pt).toHaveProperty("revenue");
        expect(pt).toHaveProperty("customers");
        expect(pt).toHaveProperty("newReferrals");
        expect(pt).toHaveProperty("cancels");
        expect(pt).toHaveProperty("clicks");
      }
    }
  });
  it("cancel rates are between 0 and 1", () => {
    for (const a of AFFILIATES) {
      expect(a.metrics.cancelRate).toBeGreaterThanOrEqual(0);
      expect(a.metrics.cancelRate).toBeLessThanOrEqual(1);
    }
  });
  it("fraud-flagged affiliates have high cancel rates", () => {
    const flagged = AFFILIATES.filter(a => a.segment === "fraud-flagged");
    for (const a of flagged) {
      expect(a.metrics.cancelRate).toBeGreaterThan(0.5);
    }
  });
  it("all fraud-flagged have fraud evidence", () => {
    const flagged = AFFILIATES.filter(a => a.segment === "fraud-flagged");
    for (const a of flagged) {
      expect(a.metrics.fraudEvidence.length).toBeGreaterThan(0);
    }
  });
});

describe("PAYOUT_CYCLES seed", () => {
  it("has at least 6 payout cycles", () => {
    expect(PAYOUT_CYCLES.length).toBeGreaterThanOrEqual(6);
  });
  it("has overdue cycles", () => {
    expect(PAYOUT_CYCLES.filter(c => c.status === "overdue").length).toBeGreaterThan(0);
  });
  it("all amounts are positive", () => {
    for (const c of PAYOUT_CYCLES) {
      expect(c.totalAmount).toBeGreaterThan(0);
    }
  });
  it("paid cycles have a paidDate", () => {
    for (const c of PAYOUT_CYCLES.filter(c => c.status === "paid")) {
      expect(c.paidDate).not.toBeNull();
    }
  });
  it("overdue cycles have no paidDate", () => {
    for (const c of PAYOUT_CYCLES.filter(c => c.status === "overdue")) {
      expect(c.paidDate).toBeNull();
    }
  });
});

describe("SNAPSHOTS seed", () => {
  it("has 52 weekly snapshots", () => {
    expect(SNAPSHOTS).toHaveLength(52);
  });
  it("all weekOf dates are unique", () => {
    const dates = SNAPSHOTS.map(s => s.weekOf);
    expect(new Set(dates).size).toBe(dates.length);
  });
  it("snapshots are sorted descending (most recent first)", () => {
    for (let i = 1; i < SNAPSHOTS.length; i++) {
      expect(SNAPSHOTS[i - 1].weekOf >= SNAPSHOTS[i].weekOf).toBe(true);
    }
  });
  it("all ROI values are positive", () => {
    for (const s of SNAPSHOTS) {
      expect(s.kpis.roi).toBeGreaterThan(0);
    }
  });
  it("most recent snapshot has most revenue", () => {
    const revenues = SNAPSHOTS.map(s => s.kpis.totalRevenue);
    expect(revenues[0]).toBeGreaterThan(revenues[revenues.length - 1]);
  });
});
