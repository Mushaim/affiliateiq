# Tech Spec — AffiliateIQ Dashboard

## Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 (App Router) | Fast, file-based routing, RSC for data |
| Language | TypeScript | Type safety for data schema |
| Styling | Tailwind CSS v4 | Utility-first, dark theme easy |
| 3D / Hero | Three.js + @react-three/fiber | Animated 3D globe / particle field for hero |
| Charts | Recharts + D3 | Recharts for standard, D3 for custom scatter/radar |
| Animation | Framer Motion | Page transitions, counter animations, chart entrances |
| Data | Static JSON (demo seed) | No API key needed in demo; real FP data swappable |
| Cron | Vercel Cron (vercel.json) | Weekly snapshot trigger, free on hobby plan |
| Snapshot storage | JSON files in /data/snapshots/ | Simple, no DB needed for demo |
| Icons | Lucide React | Clean, consistent |
| Fonts | Geist Sans + Geist Mono | Professional, modern |
| PDF export | @react-pdf/renderer | Weekly report export |

## Architecture

```
/affiliate-dashboard
  /app
    /page.tsx              ← Command Center (hero)
    /leaderboard/page.tsx  ← Affiliate table
    /fraud/page.tsx        ← Fraud radar
    /payouts/page.tsx      ← Payout health
    /growth/page.tsx       ← Growth tracker
    /reports/page.tsx      ← Weekly report cards
    /api
      /snapshot/route.ts   ← POST: saves weekly snapshot
      /data/route.ts       ← GET: serves demo data
  /components
    /layout
      Sidebar.tsx
      TopBar.tsx
      DemoModeBanner.tsx
    /charts
      RevenueArea3D.tsx    ← Three.js canvas
      LeaderboardBar.tsx
      FraudScatter.tsx
      CohortCurves.tsx
      PayoutTimeline.tsx
      KPICard.tsx
    /ui
      Badge.tsx
      AffiliateModal.tsx
      PeriodSelector.tsx
  /data
    /seed
      affiliates.ts        ← 50 fake affiliates
      transactions.ts      ← 12 months of fake revenue
      payouts.ts           ← payout cycles
      snapshots/           ← weekly JSON snapshots
  /lib
    dataUtils.ts           ← aggregation helpers
    cronHelper.ts          ← snapshot builder
```

## Demo Data Seed

50 affiliates across 4 segments:
- **Champions** (8): high revenue, low cancel, active
- **Mid-Tier** (22): moderate performance, mixed trends
- **At Risk** (12): declining referrals, high cancel
- **Fraud Flagged** (8): Vietnam-ring-style cluster, high cancel + ad_source

Revenue: $2.48M lifetime, $293K commissions, 10.2x ROI  
Timeline: 24 months of monthly revenue (matching real program snapshot)

## Performance Budget

- JS bundle: < 350kb gzipped
- Three.js loaded lazily (dynamic import, no SSR)
- Charts rendered client-side only (avoids hydration flash)
- Images: none (all SVG/canvas)

## Cron Schedule

```json
{
  "crons": [{ "path": "/api/snapshot", "schedule": "0 8 * * 1" }]
}
```

Fires every Monday at 8am UTC. Writes to `/data/snapshots/YYYY-MM-DD.json`.
