# PRD — Affiliate Performance Dashboard
**Project:** AffiliateIQ Dashboard  
**Status:** In Development  
**Author:** Mushaim Khan  
**Last Updated:** 2026-06-15  
**Demo Mode:** ON — All data is synthetic, modeled after a real affiliate program

---

## Problem Statement

Affiliate program managers spend hours every week pulling raw data from FirstPromoter, manually building Excel reports, and sharing static spreadsheets that are outdated the moment they're sent. There is no single place to see program health, top performer trends, fraud signals, payout status, and revenue attribution together — in real time, with drill-down capability.

The current workflow at **NovaSaaS Co.** (demo company):
- A Python script runs manually to pull promoter data into a CSV
- An analyst builds a 6-tab Excel workbook from that CSV
- Leadership sees the report 2–3 days after the data was pulled
- No trend lines, no alerts, no visual signal of what's working

This dashboard replaces that entire workflow.

---

## Target User

| User | Context |
|------|---------|
| **Affiliate Program Manager** | Reviews daily — needs top/bottom performers, payout flags, fraud alerts |
| **VP of Marketing / Growth** | Checks weekly — needs revenue trends, ROI, channel comparison |
| **CEO / Executive Sponsor** | Looks monthly — needs the 3-number summary: revenue, ROI, net growth |

---

## Core Features

### F1 — Command Center (Hero View)
- Animated KPI cards: Total Revenue, Active Affiliates, Commissions Paid, ROI
- Real-time pulse on program health (growing / flat / declining)
- Period selector: 7D / 30D / 90D / All Time

### F2 — Revenue Intelligence
- 3D area chart of affiliate-attributed revenue over time
- Revenue by campaign type (Solutions Partner vs. Content vs. Coupon)
- Top 10 affiliates by revenue — animated bar race

### F3 — Affiliate Leaderboard
- Ranked table with sparklines for each affiliate's 12-week trend
- Status badges: Active / At Risk / Fraud Flag / Inactive
- Click-through to affiliate detail modal

### F4 — Fraud Radar
- Scatter plot: cancel rate vs. revenue (fraud quadrant highlighted)
- Fraud score gauge per flagged affiliate
- Evidence tags (high cancel, ad_source cluster, duplicate referrals)

### F5 — Payout Health
- Timeline of payout cycles: paid / overdue / upcoming
- Funding gap alert when next cycle exceeds available balance
- Per-affiliate payout reconciliation status

### F6 — Program Growth Tracker
- Quarter-over-quarter net customer growth
- Cohort retention curves for affiliate-referred customers
- New vs. churned affiliate counts per month

### F7 — Weekly Auto-Report
- Cron-triggered weekly snapshot (every Monday 8am)
- Stores snapshot in JSON — visible as historical "Report Cards" in the UI
- Exportable as PDF

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Page load (initial) | < 2s |
| Dashboard renders all charts | < 500ms after data load |
| Weekly cron fires reliably | 100% for 4 consecutive weeks |
| Demo mode clearly labeled | Visible badge on every page |
| Mobile responsive | Fully usable on iPad (1024px+) |
| Wow factor | Interviewer asks "did you build this yourself?" |
