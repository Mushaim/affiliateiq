# App Flow — AffiliateIQ Dashboard

## Navigation Structure

```
/ (Command Center)
  ├── KPI cards (Revenue, Affiliates, ROI, Commissions)
  ├── 3D affiliate network globe
  ├── Revenue area chart (30D default)
  ├── Quick alerts (overdue payout, fraud flags)
  └── Top 5 affiliates mini-list

/leaderboard (Affiliate Leaderboard)
  ├── Search + filter (segment, status, campaign)
  ├── Ranked table with sparklines
  └── Click row → Affiliate Detail modal (slide-in)

/fraud (Fraud Radar)
  ├── Cancel rate vs. Revenue scatter
  ├── Fraud score cards for flagged affiliates
  └── Evidence tag breakdown

/payouts (Payout Health)
  ├── Payout cycle timeline
  ├── Funding gap alert
  └── Per-affiliate reconciliation table

/growth (Program Growth)
  ├── Q-o-Q net customer growth (bar chart)
  ├── Cohort retention curves
  └── New vs. churned affiliates per month

/reports (Weekly Report Cards)
  ├── Grid of past snapshots (last 8 weeks)
  ├── Click snapshot → full report view
  └── Export as PDF button
```

## Key User Flows

### Flow 1: Morning Check (Program Manager)
1. Land on `/` — sees KPI cards animate in
2. Notices red alert: "Payout overdue: $27,700"
3. Clicks alert → navigates to `/payouts`
4. Reviews overdue cycle, sees 16 flagged affiliates
5. Exports to PDF for the finance team

### Flow 2: Weekly Review (VP of Marketing)
1. Opens `/` — selects "90D" period
2. Revenue area chart shows Q2 trend
3. Scrolls to top affiliates — clicks "Jordan Mills"
4. Affiliate modal shows 12-month sparkline + stats
5. Navigates to `/growth` for cohort curves

### Flow 3: Fraud Investigation
1. Opens `/fraud`
2. Scatter plot shows red cluster in upper-left (high cancel, low revenue)
3. Hovers a dot — tooltip shows affiliate name, cancel rate, fraud score
4. Clicks dot — modal opens with evidence tags
5. Notes for manual review

### Flow 4: Demo Walkthrough (Interview / Presentation)
1. Open app — animated 3D globe + KPIs counting up (wow moment)
2. "This was built for NovaSaaS Co. — all data is synthetic for demo"
3. Walk through each page in ~2 minutes
4. Show weekly report on `/reports` — "this auto-runs every Monday"
5. Export PDF to show the full reporting pipeline
