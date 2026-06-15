# Design Spec — AffiliateIQ Dashboard

## Visual Identity

**Name:** AffiliateIQ  
**Tagline:** "Affiliate Intelligence, Real-Time"  
**Demo Context:** "Built for NovaSaaS Co. · Demo Mode"

## Color System

```
Background:     #080C14  (deep navy-black)
Surface:        #0D1424  (card background)
Surface-2:      #111827  (elevated card)
Border:         #1E2D45  (subtle border)

Accent Primary: #3B82F6  (electric blue)
Accent Glow:    #60A5FA  (blue glow for 3D)
Success:        #10B981  (green — revenue up)
Warning:        #F59E0B  (amber — at risk)
Danger:         #EF4444  (red — fraud / overdue)
Muted:          #64748B  (secondary text)
```

## Typography

- **Headings:** Geist Sans, 700, tracking-tight
- **Body:** Geist Sans, 400, text-sm
- **Numbers/KPI:** Geist Mono, 600 (makes numbers feel precise)
- **Badges:** uppercase, tracking-widest, text-xs

## Component Aesthetics

### KPI Cards
- Glassmorphism: `backdrop-blur-sm bg-white/5 border border-white/10`
- Top-left: metric name (muted)
- Center: large number in Geist Mono with counter animation
- Bottom: delta badge (green ▲ / red ▼) + sparkline
- Hover: subtle blue glow border `shadow-blue-500/20`

### 3D Hero Section
- Rotating particle sphere using Three.js (represents global affiliate network)
- Particles colored by performance tier (blue = active, amber = at risk, red = flagged)
- Slow auto-rotate, pauses on hover
- Behind the KPI cards — acts as a live background, not center-stage

### Charts
- Dark grid lines (#1E2D45), no chart borders
- Tooltip: dark glass card with blur
- All charts animate in on scroll (Framer Motion viewport trigger)
- Revenue area: gradient fill blue→transparent, glowing stroke

### Sidebar
- Width: 240px
- Dark: #080C14 with active item highlight (#3B82F6/20 background + left border)
- Icons from Lucide, 18px
- Collapsed state at 1024px → icon-only rail

### Tables (Leaderboard)
- Row hover: `bg-white/3`
- Rank column: large Geist Mono number, muted
- Sparkline column: 60px inline SVG, 12 data points
- Status badge: pill shape, color-coded

## Motion Principles

1. **Page enter:** `opacity 0→1, y 20→0, duration 0.4s`
2. **KPI counters:** count up from 0 on mount, easeOut 1.2s
3. **Chart bars/lines:** draw from left to right on mount
4. **Fraud scatter:** dots fade in staggered (0.02s each)
5. **Sidebar nav:** active indicator slides between items
6. **Alert badges:** gentle pulse animation for overdue items

## Responsive

| Breakpoint | Layout |
|-----------|--------|
| 1280px+ | Full sidebar + 4-col KPI grid |
| 1024px | Icon sidebar + 2-col KPI grid |
| 768px | Hidden sidebar (hamburger) + 1-col |

## Demo Mode Banner

Persistent top banner:
```
⚡ DEMO MODE  ·  All data is synthetic  ·  Built for NovaSaaS Co.  ·  by Mushaim Khan
```
Color: amber/10 background, amber text, subtle border.
