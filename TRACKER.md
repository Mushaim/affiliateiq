# Tracker — AffiliateIQ Dashboard

## Status: 🟡 In Progress

## Phase 0: Scaffold
- [ ] Next.js app created
- [ ] Dependencies installed
- [ ] Tailwind dark theme configured
- [ ] Layout shell (Sidebar, TopBar, DemoModeBanner)
- [ ] All 6 routes scaffolded

## Phase 1: Data Layer
- [ ] TypeScript types defined
- [ ] Seed data generated (50 affiliates, 24mo history)
- [ ] Aggregation utils
- [ ] /api/data route

## Phase 2: Command Center (Hero)
- [ ] KPI cards + counter animation
- [ ] Three.js particle globe
- [ ] Revenue area chart
- [ ] Alerts section
- [ ] Period selector

## Phase 3: Leaderboard
- [ ] Sortable table with sparklines
- [ ] Search + filter
- [ ] Affiliate detail modal

## Phase 4: Fraud + Payouts
- [ ] Fraud scatter plot
- [ ] Fraud score cards
- [ ] Payout timeline
- [ ] Reconciliation table

## Phase 5: Growth + Reports
- [ ] QoQ bar chart
- [ ] Cohort retention curves
- [ ] Snapshot grid + detail
- [ ] PDF export

## Phase 6: Cron + Polish
- [ ] /api/snapshot route
- [ ] vercel.json cron
- [ ] Animation polish
- [ ] Mobile responsive
- [ ] README

## Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-06-15 | Use Three.js particle sphere (not chart) for hero 3D | More visual impact than a 3D bar chart |
| 2026-06-15 | Store snapshots as JSON files, not DB | Simplest demo path; easily swappable |
| 2026-06-15 | Recharts for most charts, D3 only for fraud scatter | Recharts is faster to implement; fraud scatter needs custom quadrant overlay |
