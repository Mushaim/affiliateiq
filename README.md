# AffiliateIQ

**Affiliate Performance Intelligence Dashboard** — built for NovaSaaS Co.

A full-stack analytics dashboard that replaces a manual weekly Excel reporting workflow with a live, animated, visual intelligence platform for affiliate program managers.

> Demo mode: all data is synthetic, modeled after a real $2.48M affiliate program.

---

## What It Does

Before this dashboard, the affiliate team at NovaSaaS Co. ran a Python script weekly, exported a CSV, and manually built a 6-tab Excel workbook that was already stale before it reached leadership. There was no way to spot fraud patterns, track payout gaps, or see retention trends without hours of manual work.

AffiliateIQ replaces that entire workflow:

| Old Way | AffiliateIQ |
|---------|------------|
| Python → CSV → Excel (manual, weekly) | Live dashboard, always current |
| No fraud visibility | Scatter plot fraud radar with risk scoring |
| Payout status in spreadsheet | Real-time overdue alerts + reconciliation |
| Emailed static reports | Auto-generated weekly report cards via cron |
| No trend data | 24-month revenue curves, cohort retention |

---

## Pages

### Command Center (`/`)
The main overview. Animated KPI counters for revenue, active affiliates, ROI, and commissions. A 3D particle globe visualizes the affiliate network by segment (green = champions, blue = mid-tier, amber = at-risk, red = fraud-flagged). Live revenue area chart with period selector. Alert banners for overdue payouts and fraud flags.

### Leaderboard (`/leaderboard`)
All 50 affiliates ranked and filterable by segment. Sortable by revenue, customers, cancel rate, or fraud score. Each row has an inline 12-week sparkline. Click any affiliate to open a detail modal with full stats, trend chart, and fraud evidence tags.

### Fraud Radar (`/fraud`)
Cancel rate vs. revenue scatter plot with a fraud quadrant overlay. Dots are colored by fraud score (blue → amber → red). A cluster of 8 affiliates with high cancel rates and `ad_source` campaign tags are flagged — this mirrors a real pattern discovered in the program. Individual fraud score cards show evidence strings per flagged affiliate.

### Payout Health (`/payouts`)
Timeline of all payout cycles with status (paid / overdue / upcoming). Overdue cycles surface a prominent alert with dollar amount and days late. Expandable reconciliation table shows per-affiliate payout status and FP vs. actual amount mismatches.

### Growth Tracker (`/growth`)
Quarter-over-quarter new vs. churned customer bar chart (4 negative quarters highlighted). Cohort retention curves for 4 quarterly cohorts — shows ~43% 12-month retention across all cohorts despite declining new referrals.

### Weekly Reports (`/reports`)
Grid of the last 8 auto-generated weekly report cards. Each card shows that week's KPIs and alert count. Click to expand the full snapshot with top affiliates, all KPIs, and alert details. Export to PDF.

---

## Automation

A Vercel Cron job fires every Monday at 08:00 UTC and hits `/api/snapshot`, which:
1. Pulls current program stats
2. Identifies active alerts (overdue payouts, fraud flags, negative growth)
3. Builds a snapshot with top affiliates and KPI summary
4. Returns a JSON report card that appears in the `/reports` page

```json
// vercel.json
{ "crons": [{ "path": "/api/snapshot", "schedule": "0 8 * * 1" }] }
```

This directly replaces the manual "run the script on Monday morning" workflow.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| 3D / Globe | Three.js + @react-three/fiber |
| Charts | Recharts |
| Animation | Framer Motion |
| Automation | Vercel Cron |
| Data | Synthetic seed (50 affiliates, 24mo history) |

---

## Demo Data

The seed is calibrated to match a real program's shape:
- **50 affiliates** across 4 segments: Champions (8), Mid-Tier (22), At-Risk (12), Fraud-Flagged (8)
- **$2.48M** all-time attributed revenue · **$293K** commissions · **10.2x ROI**
- **24 months** of monthly revenue per affiliate (1,200 data points)
- **8 pre-built weekly snapshots** (last 8 Mondays)
- **2 overdue payout cycles** ($27.7K + $41.4K) to demonstrate alert system

No real API keys, credentials, or customer data are used or required.

---

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Built By

**Mushaim Khan** — AI & Automation portfolio project  
Demonstrates: data pipeline design, process automation, AI-adjacent tooling, end-to-end full-stack ownership
