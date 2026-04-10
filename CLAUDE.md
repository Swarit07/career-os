# CareerOS

Premium job-acquisition operating system. Users sign up, log applications, track pipeline status, forge AI-tailored resumes, and discover jobs — all from a single command center.

## Tech Stack

- **Framework**: Next.js 16.2.3 (App Router, Turbopack)
- **Language**: TypeScript 5, React 19
- **Styling**: Tailwind CSS v4, Shadcn UI (radix-nova style)
- **Backend/Auth**: Supabase (PostgreSQL + Auth via `@supabase/ssr`)
- **Data Tables**: `@tanstack/react-table`
- **Charts**: `recharts` (donut chart, heatmap)
- **Animation**: `motion` v12 (Framer Motion successor)
- **Video**: `hls.js` (HLS streaming background)
- **Theme**: `next-themes` (dark mode forced)
- **Icons**: `lucide-react`
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout — Instrument Serif, Barlow, Inter, Fustat via next/font
│   ├── globals.css                   # Tailwind v4 tokens, Liquid Glass Noir design system
│   ├── (marketing)/                  # Public pages — no auth required
│   │   ├── page.tsx                  # Landing page at /
│   │   └── _components/
│   │       ├── hero-navbar.tsx       # Sticky nav with CareerOS brand
│   │       └── hero-section.tsx      # Full landing page content with BlurText + StaggerList
│   ├── (dashboard)/                  # Authenticated pages — proxy.ts enforces auth
│   │   ├── layout.tsx                # Server: auth check + profile fetch → DashboardShell
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Command Center: stat cards, charts, table/kanban
│   │   │   └── _components/
│   │   │       ├── dashboard-shell.tsx       # Client: sidebar, header, user menu
│   │   │       ├── applications-view.tsx     # Client: table/kanban toggle wrapper
│   │   │       ├── data-table.tsx            # TanStack table with search + filter + pagination
│   │   │       ├── columns.tsx               # Column defs with status badges and actions
│   │   │       ├── new-application-dialog.tsx # Dialog form to add applications
│   │   │       ├── kanban-board.tsx          # 4-column kanban grouped by status
│   │   │       ├── view-toggle.tsx           # Table / Board icon toggle
│   │   │       ├── charts-row.tsx            # Client wrapper for dynamic Recharts imports
│   │   │       ├── status-donut-chart.tsx    # Recharts donut — status distribution
│   │   │       ├── activity-heatmap.tsx      # 91-day CSS grid heatmap
│   │   │       └── csv-export-button.tsx     # Blob-based CSV "Download Manifest"
│   │   ├── analytics/page.tsx        # Analytics: charts + pipeline insights
│   │   ├── resume/page.tsx           # Resume Forge (placeholder → Phase 5)
│   │   ├── jobs/page.tsx             # Job Market (placeholder → Phase 6)
│   │   └── settings/page.tsx         # Profile info + auth provider
│   ├── login/page.tsx                # Email/password + Google OAuth
│   └── auth/callback/route.ts        # OAuth code exchange
├── components/
│   ├── ui/                           # Shadcn components (18 installed)
│   ├── fade-up.tsx                   # motion.div blur-in from y:20
│   ├── page-transition.tsx           # Opacity fade-in wrapper
│   ├── blur-text.tsx                 # Word-by-word blur dissolve headline animation
│   ├── stagger-list.tsx              # StaggerList + StaggerItem for entrance animations
│   └── hls-video-background.tsx      # HLS.js video background (reads NEXT_PUBLIC_HERO_VIDEO_URL)
├── lib/
│   ├── database.types.ts             # Manual Supabase types — regenerate: supabase gen types typescript
│   ├── utils.ts                      # cn() utility
│   └── supabase/
│       ├── server.ts                 # createServerClient() for Server Components / Route Handlers
│       ├── client.ts                 # createBrowserClient() for Client Components
│       └── middleware.ts             # updateSession() — route protection logic
└── proxy.ts                          # Next.js 16 request proxy (named proxy(), not middleware())

supabase/
└── migrations/
    └── 001_initial_schema.sql        # profiles, applications, RLS, trigger
```

## Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static | Landing page |
| `/login` | Static | Email + Google OAuth |
| `/auth/callback` | Dynamic | OAuth code exchange |
| `/dashboard` | Dynamic | Command Center — stat cards, charts, table/kanban |
| `/analytics` | Dynamic | Pipeline charts and heatmap |
| `/resume` | Dynamic | Resume Forge (Phase 5) |
| `/jobs` | Dynamic | Job Market (Phase 6) |
| `/settings` | Dynamic | User profile |

## Database Schema

**Tables**: `profiles` (1:1 with `auth.users`), `applications`

**Enum**: `application_status` — Applied, Interviewing, Offer, Rejected

**RLS**: All policies use `(SELECT auth.uid())` subquery pattern (evaluated once per query, not per row).

**Trigger**: `on_auth_user_created` auto-creates a `profiles` row on signup.

**Planned (Phase 5)**: `resumes` table — id, user_id (fk), file_name, original_text, tailored_version, job_description, created_at, updated_at

## Design System — Liquid Glass Noir

Single dark theme (no light mode). All tokens defined in `globals.css`.

### Colors
- **Background**: `#080808` (`--bg-void`), `#0d0d0f` (`--bg-deep`)
- **Accents**: aqua `#00d4ff`, violet `#8b5cf6`, amber `#f59e0b`, emerald `#10b981`, rose `#f43f5e`
- **Glass**: `--glass-surface: rgba(255,255,255,0.04)`, `--glass-border: rgba(255,255,255,0.08)`
- **Text**: primary `rgba(255,255,255,0.92)`, secondary `rgba(255,255,255,0.45)`, muted `rgba(255,255,255,0.2)`

### Typography
- **Headings/Stats**: `font-serif` = Instrument Serif (italic)
- **UI/Body**: `font-sans` = Barlow (300–700)
- **Mono/Dates**: `font-mono` = Geist Mono

### CSS Utilities (globals.css)
- `.liquid-glass` — 4px blur, gradient border via mask-composite
- `.liquid-glass-strong` — 50px blur, higher opacity, for CTAs and modals
- `.stat-number` — serif italic with text-shadow glow, tabular-nums
- `.stat-card` — glassmorphic card with `data-type` variants (applied/interview/offer/rejected)
- `.profile-banner` — banner with grid pattern and aqua-to-violet left accent bar
- `.status-dot` — 6px colored dot with glow, per `data-status`
- `.app-row` — table row hover with aqua left inset shadow
- `.empty-state` — dashed border placeholder
- `.liquid-bg` — fixed animated background (two drifting radial gradients)
- `.video-fade-overlay` — top/bottom black gradient fade for video backgrounds

### Status Colors
| Status | Color | CSS Var |
|---|---|---|
| Applied | `#00d4ff` | `--accent-aqua` |
| Interviewing | `#f59e0b` | `--accent-amber` |
| Offer | `#10b981` | `--accent-emerald` |
| Rejected | `#f43f5e` | `--accent-rose` |

## Key Patterns

- Server Components fetch data; Client Components handle interactivity
- Supabase server client: `const supabase = await createClient()` (uses `cookies()` from `next/headers`)
- Client mutations via browser client, then `router.refresh()` to revalidate server data
- **Postgrest v12 type workaround**: cast `.eq()` params with `as never`, cast query results to typed interfaces — e.g. `(await supabase.from("applications").select("*").order("applied_date" as never, { ascending: false })) as { data: Application[] | null; error: unknown }`
- Next.js 16 uses `proxy.ts` — function is named `proxy()` not `middleware()`
- `params` and `searchParams` are async in Next.js 16 — always `await` them
- `ssr: false` with `next/dynamic` is forbidden in Server Components — wrap in a `"use client"` component (e.g. `charts-row.tsx`)
- Animation: use `motion` from `"motion/react"` — NOT `"framer-motion"`
- Ease values in motion variants must be typed `as const` to satisfy the `Easing` union type

## Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Optional — enables HLS video background on landing page
NEXT_PUBLIC_HERO_VIDEO_URL=https://<cdn>/hero.m3u8

# Phase 5 — Resume Forge AI
OPENAI_API_KEY=sk-...
# or ANTHROPIC_API_KEY=sk-ant-...

# Phase 6 — Job Market
ADZUNA_APP_ID=...
ADZUNA_APP_KEY=...
```

Keep `.env.local` out of git. Use `.env.example` as template.

## MCP Tools Available

- **Supabase** — DB and auth operations
- **Vercel** — Deployment, logs, domains
- **Magic (21st.dev)** — UI component builder/inspiration
- **GitHub** — Issues, PRs, commits, code search

## Conventions

- Do not add narrating code comments (no "// Import X", "// Return result")
- Use Shadcn components over raw HTML elements where available
- All RLS policies must use `(SELECT auth.uid())` wrapped in subquery
- Never commit `.env.local` or secrets
- Prefer `next/font` for font loading — no external font CDN links
- Use `lucide-react` icons at `h-4 w-4` or `h-5 w-5`
- Dynamic chart imports must live in a `"use client"` wrapper component
- All new dashboard pages need a `profile-banner` header block and `PageTransition` + `FadeUp` wrappers

## Roadmap Status

| Phase | Feature | Status |
|---|---|---|
| 1 | Rebrand to CareerOS | ✅ Done |
| 2 | Charts, heatmap, CSV export | ✅ Done |
| 3 | Sidebar nav, routes, Kanban board | ✅ Done |
| 4 | Landing page video + motion | ✅ Done |
| 5 | Resume Forge (AI tailoring) | 🔲 Next |
| 6 | Job Market Discovery | 🔲 Planned |
| 7 | AI Concierge chatbot | 🔲 Planned |
| 8 | Polish & integration | 🔲 Planned |
