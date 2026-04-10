# Product Requirements Document: CareerOS

**Version**: 1.1 — Post Phase 4  
**Last Updated**: 2026-04-09  
**Status**: Active Development

---

## 1. Executive Summary

CareerOS is a premium, "luxury editorial" operating system for job seekers. It replaces fragmented tools — spreadsheets, external resume builders, job boards — with a unified, AI-enhanced command center. The product is defined by a high-end dark aesthetic ("Liquid Glass Noir"), privacy-first AI, and a workflow that covers the full job-acquisition lifecycle: track → forge → discover → land.

---

## 2. Technical Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.3 (App Router, Turbopack) |
| Language | TypeScript 5 strict, React 19 |
| Styling | Tailwind CSS v4, Shadcn UI (radix-nova) |
| Animation | `motion` v12 (Framer Motion successor) |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Database | Supabase (PostgreSQL) with RLS |
| Charts | Recharts |
| Video | HLS.js |
| AI (Phase 5+) | Vercel AI SDK (`ai`, `@ai-sdk/openai` or `@ai-sdk/anthropic`) |
| Deployment | Vercel |

> **Note**: Auth is Supabase, not Clerk. Proxy file is `proxy.ts` (not `middleware.ts`). Framework is Next.js 16, not 15.

---

## 3. Design System — Liquid Glass Noir

### 3.1 Identity

- **Theme**: Luxury Editorial — pure black (`#080808`) backgrounds, white text, glassmorphism surfaces
- **Mode**: Dark only. No light mode.
- **Brand mark**: `Terminal` icon from lucide-react + "CareerOS" in Instrument Serif italic

### 3.2 Typography

| Use | Font | Style |
|---|---|---|
| Headlines / stat numbers | Instrument Serif | Italic, tracking-tight |
| UI / body / data | Barlow | 300–700 weight |
| Dates / IDs / mono | Geist Mono | — |

### 3.3 Color Palette

| Token | Value | Semantic |
|---|---|---|
| `--bg-void` | `#080808` | Page background |
| `--bg-deep` | `#0d0d0f` | Card backgrounds |
| `--accent-aqua` | `#00d4ff` | Applied, primary highlights |
| `--accent-violet` | `#8b5cf6` | Analytics, secondary |
| `--accent-amber` | `#f59e0b` | Interviewing |
| `--accent-emerald` | `#10b981` | Offer |
| `--accent-rose` | `#f43f5e` | Rejected |

### 3.4 Key CSS Utilities (globals.css)

- `.liquid-glass` — backdrop-filter: blur(4px), gradient border via mask-composite
- `.liquid-glass-strong` — blur(50px), high opacity — for CTAs, modals, sidebars
- `.stat-number` — serif italic, tabular-nums, text-shadow glow
- `.stat-card` — glassmorphic card with accent top border per `data-type`
- `.profile-banner` — banner with dot-grid overlay + left aqua-to-violet gradient bar
- `.liquid-bg` — fixed animated background (two drifting radial gradients, 18s/22s)
- `.video-fade-overlay` — top/bottom black gradient for video backgrounds
- `.empty-state` — dashed border placeholder with centered content

---

## 4. Feature Specifications

### Module 1: Command Center (Dashboard) — ✅ Built

**Route**: `/dashboard`

**Components**:
- **Profile banner** — "Career Command Center" heading with current date and CSV export button
- **Stat cards** (4) — Total Applications, Interviewing, Offers, Rejected — each with accent color glow
- **Status Donut Chart** — Recharts PieChart with accent-colored segments and center count. Dynamically imported (client-only).
- **Activity Heatmap** — 91-day CSS grid heatmap showing applications per day with aqua intensity scale. Dynamically imported.
- **Applications View** — Toggles between Table (TanStack) and Kanban Board views
  - **Table**: sortable columns, status filter, search by company, pagination
  - **Kanban Board**: 4 columns grouped by status with accent top borders and per-column counts
- **CSV Export** — "Download Manifest" button generates `careeros-manifest-YYYY-MM-DD.csv`

---

### Module 2: Analytics — ✅ Built

**Route**: `/analytics`

**Components**:
- Reuses `ChartsRow` (donut + heatmap) from dashboard
- Dedicated "Pipeline Insights" banner with violet accent

*Planned expansion*: Monthly applications bar chart, response rate trend, offer conversion rate.

---

### Module 3: Resume Forge — 🔲 Phase 5

**Route**: `/resume`

**Planned UX**:
- Side-by-side split pane (left: upload + controls, right: AI streaming output)
- Left panel: PDF/DOCX file dropzone, job description textarea, keyword input
- Right panel: real-time streaming tailored resume via Vercel AI SDK `streamText()`
- AI prompt logic: extract top 10 JD keywords → inject into resume bullets naturally → maintain professional tone
- Actions: "Save tailored version" (to DB), "Copy to clipboard"

**API Routes**:
- `POST /api/resume/upload` — accept PDF via FormData, extract text with `pdf-parse`, insert `resumes` row
- `POST /api/resume/tailor` — accept `{ resumeId, jobDescription }`, stream AI response

**Database migration** (`002_resumes_table.sql`):
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  original_text TEXT,
  tailored_version TEXT,
  job_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX resumes_user_id_idx ON resumes(user_id);
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
-- RLS: SELECT/INSERT/UPDATE/DELETE using (SELECT auth.uid()) = user_id
```

**New env vars**: `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`

**New packages**: `ai`, `@ai-sdk/openai` (or `@ai-sdk/anthropic`), `pdf-parse`, `@types/pdf-parse`

---

### Module 4: Job Market — 🔲 Phase 6

**Route**: `/jobs`

**Planned UX**:
- Search bar (role + location inputs, debounced 300ms)
- Results grid of liquid-glass job cards: title, company, location, salary, posted date
- "Quick Add" button on each card — inserts into `applications` table with status "Applied", then `router.refresh()`
- External link to original posting
- Pagination or load-more
- Loading skeletons during fetch

**API Route**:
- `GET /api/jobs/search?q=&location=&page=` — server-side proxy to Adzuna API, normalizes response

**New env vars**: `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`

---

### Module 5: AI Concierge — 🔲 Phase 7

**Placement**: Floating bubble, fixed bottom-right, all dashboard pages

**Planned UX**:
- Collapsed state: pulsing aqua FAB with `Sparkles` icon
- Expanded state: `liquid-glass-strong` chat panel with motion scale animation
- Message bubbles: user right-aligned, assistant left-aligned in `liquid-glass`
- Streaming responses via `useChat()` from `ai/react`
- System prompt covers: CareerOS features, how to use Resume Forge, how to export data, general career advice

**API Route**: `POST /api/chat` — `streamText()` with FAQ-focused system prompt

**Depends on**: Phase 5 (AI SDK already installed)

---

### Module 6: Landing Page — ✅ Built

**Route**: `/`

**Components**:
- `HeroNavbar` — sticky, glassmorphism, CareerOS brand
- `HeroSection`:
  - Badge: "Free to use — no credit card required"
  - `BlurText` animated headline: "The Operating System / for your Career"
  - Stats bar: `StaggerList` of 3 liquid-glass stat cards
  - Dashboard preview: mock table with real job titles (no "Intern")
  - Features grid: `StaggerList` of 3 feature cards
  - Bottom CTA: "Ready to take command?"
- `HlsVideoBackground` — reads `NEXT_PUBLIC_HERO_VIDEO_URL`, disabled if unset, hidden on mobile

---

## 5. Database Architecture

### Current Schema (001_initial_schema.sql)

**Table: profiles**
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | References `auth.users(id)` |
| `email` | TEXT NOT NULL | |
| `full_name` | TEXT | |
| `avatar_url` | TEXT | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**Table: applications**
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | `gen_random_uuid()` |
| `user_id` | UUID NOT NULL | FK → `profiles(id)` |
| `company_name` | TEXT NOT NULL | |
| `role_title` | TEXT NOT NULL | |
| `status` | `application_status` | Default: `Applied` |
| `salary_range` | TEXT | Nullable |
| `location` | TEXT | Nullable |
| `job_url` | TEXT | Nullable |
| `applied_date` | DATE | Default: `CURRENT_DATE` |
| `notes` | TEXT | Nullable |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**RLS pattern**: `(SELECT auth.uid()) = user_id` (subquery form, evaluated once per statement)

### Planned Schema (002_resumes_table.sql — Phase 5)

**Table: resumes** — see Module 3 above.

---

## 6. Navigation Structure

```
Sidebar (DashboardShell)
├── Command Center    → /dashboard    (LayoutDashboard icon, active: aqua)
├── Analytics         → /analytics   (BarChart3 icon)
├── Resume Forge      → /resume      (FilePen icon)
├── Job Market        → /jobs        (Globe icon)
└── Settings          → /settings    (Settings icon)
```

Active state: `bg-white/[0.06] text-white/90` + icon color `var(--accent-aqua)`

---

## 7. Animation System

All animations use `motion` from `"motion/react"`.

| Component | File | Effect |
|---|---|---|
| `FadeUp` | `components/fade-up.tsx` | opacity 0→1, y 20→0, blur 6px→0 |
| `PageTransition` | `components/page-transition.tsx` | opacity fade-in |
| `BlurText` | `components/blur-text.tsx` | Word-by-word blur dissolve (headlines) |
| `StaggerList` / `StaggerItem` | `components/stagger-list.tsx` | Staggered entrance for grids/lists |

**Rules**:
- Ease values in variant objects must use `"easeOut" as const` to satisfy the `Easing` union type
- Every new dashboard page uses `PageTransition` → `FadeUp` wrappers
- `ssr: false` dynamic imports must live in a `"use client"` wrapper, never in a Server Component

---

## 8. Roadmap

| Phase | Feature | Status |
|---|---|---|
| 1 | Rebrand to CareerOS | ✅ Complete |
| 2 | Donut chart, heatmap, CSV export | ✅ Complete |
| 3 | Sidebar nav, routes, Kanban board | ✅ Complete |
| 4 | Landing page video + BlurText + StaggerList | ✅ Complete |
| 5 | Resume Forge (PDF upload + AI tailoring) | 🔲 Next |
| 6 | Job Market Discovery (Adzuna API) | 🔲 Planned |
| 7 | AI Concierge chatbot | 🔲 Planned |
| 8 | Polish, responsive audit, error boundaries | 🔲 Planned |

---

## 9. Success Metrics

1. **Time-to-apply**: reduction in time spent manually tailoring resumes (Resume Forge)
2. **Pipeline visibility**: daily active dashboard usage
3. **Discovery-to-track rate**: percentage of Job Market results added to tracker
4. **Offer conversion**: tracked offers / total tracked applications over time
