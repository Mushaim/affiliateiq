# Project Rules — AffiliateIQ Dashboard

## Non-Negotiables

1. **Demo mode is always on and always labeled.** The banner is not removable from the UI. Every page carries the demo indicator. No confusion about whether real customer data is shown.

2. **No real API keys in code.** The `.env` file is gitignored. The seed data is purely synthetic — no FirstPromoter, Stripe, or PayPal calls in the demo build.

3. **The 3D globe and animations are required.** They are the visual hook for the demo. Do not remove them to "simplify" the project.

4. **Every new feature needs a data source first.** Before building a chart, confirm the data exists in the seed. No charts that show empty/zero state in demo.

5. **All numbers match the NovaSaaS Co. narrative.** The seed data is calibrated to the numbers in SCHEMA.md. Do not change KPIs without updating the seed.

## Code Standards

- TypeScript strict mode on. No `any` types.
- Components are named exports, not default exports (except page files).
- Chart components accept typed props — no raw API data directly in JSX.
- All animations use `useReducedMotion` check (accessibility).
- No hardcoded colors in JSX — use Tailwind classes from the design system.

## File Conventions

```
Components:        PascalCase.tsx
Utilities:         camelCase.ts
Pages:             page.tsx (Next.js convention)
Data files:        camelCase.ts
Types:             types.ts (single source of truth)
```

## What This Project Demonstrates (for interviewers)

- AI/automation thinking: the weekly cron replaces a manual reporting task
- Data pipeline: seed generator → API route → visualized dashboard
- Modern frontend: Next.js 15, TypeScript, Tailwind, Three.js, Framer Motion
- Attention to operational reality: fraud detection, payout reconciliation, alerts
- End-to-end ownership: from data schema to PDF export to scheduled automation

## Definition of Done

A feature is done when:
- [ ] It renders without errors in `next dev`
- [ ] It uses data from the seed (not hardcoded in JSX)
- [ ] It has at least one animation / motion element
- [ ] It is labeled correctly in demo mode
- [ ] It looks good at 1280px width
