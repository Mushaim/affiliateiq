# Implementation Plan — AffiliateIQ Dashboard

## Phase 0: Scaffold (Day 1, ~2h)
- [ ] `npx create-next-app@latest` with TypeScript + Tailwind + App Router
- [ ] Install deps: framer-motion, three, @react-three/fiber, @react-three/drei, recharts, lucide-react, @react-pdf/renderer
- [ ] Set up Tailwind dark theme config + custom colors
- [ ] Create layout: Sidebar + TopBar + DemoModeBanner
- [ ] Add placeholder routes for all 6 pages

## Phase 1: Data Layer (Day 1-2, ~3h)
- [ ] Write TypeScript types (`/lib/types.ts`)
- [ ] Build seed data generator (`/data/seed/generate.ts`)
  - 50 affiliates with realistic distributions
  - 24 months of revenue curves per affiliate
  - 12 payout cycles
  - 8 pre-built weekly snapshots
- [ ] Write aggregation utils (`/lib/dataUtils.ts`)
- [ ] Add `/api/data` route that returns program stats

## Phase 2: Command Center / Hero (Day 2, ~4h)
- [ ] KPI cards with Framer Motion counter animation
- [ ] Three.js particle globe (lazy-loaded)
  - 200 particles on a sphere
  - Color by segment
  - Slow auto-rotate
- [ ] Revenue area chart (Recharts, custom dark theme)
- [ ] Alerts section
- [ ] Period selector (7D/30D/90D/All)

## Phase 3: Leaderboard (Day 3, ~3h)
- [ ] Sortable table with rank, name, revenue, customers, cancel rate, status
- [ ] Inline sparkline SVG for 12-week trend
- [ ] Search + filter controls
- [ ] Affiliate detail modal (Framer Motion slide-in)

## Phase 4: Fraud + Payouts (Day 3-4, ~3h)
- [ ] Fraud scatter plot (D3 or Recharts ScatterChart)
  - Fraud quadrant highlight overlay
  - Dot color = fraud score
- [ ] Fraud score cards for top 8 flagged
- [ ] Payout timeline (horizontal scroll)
- [ ] Funding gap alert component
- [ ] Reconciliation table

## Phase 5: Growth + Reports (Day 4, ~3h)
- [ ] QoQ bar chart
- [ ] Cohort retention curves (line chart, 4 cohorts)
- [ ] New vs. churned stacked bar
- [ ] Weekly snapshot grid with hover preview
- [ ] Snapshot detail view
- [ ] PDF export (basic layout)

## Phase 6: Cron + Polish (Day 5, ~2h)
- [ ] `/api/snapshot` POST route — builds and saves snapshot JSON
- [ ] `vercel.json` cron config (every Monday 8am)
- [ ] Animation polish pass (stagger delays, viewport triggers)
- [ ] Mobile responsive pass (1024px+)
- [ ] Demo banner + "About this project" modal
- [ ] README with screenshots

## Total Estimated Time: 4-5 days
