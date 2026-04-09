# Internship Tracker

Job/Internship application tracker SaaS. Users sign up, log applications, and track status through a dashboard.

## Tech Stack

- **Framework**: Next.js 16.2.3 (App Router, Turbopack)
- **Language**: TypeScript 5, React 19
- **Styling**: Tailwind CSS v4, Shadcn UI (radix-nova style, Zinc base)
- **Backend/Auth**: Supabase (PostgreSQL + Auth via `@supabase/ssr`)
- **Data Tables**: `@tanstack/react-table`
- **Theme**: `next-themes` (dark mode default)
- **Icons**: `lucide-react`
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Geist fonts, ThemeProvider, TooltipProvider)
│   ├── globals.css             # Tailwind v4 theme tokens, Zinc palette, --radius: 0.5rem
│   ├── (marketing)/            # Public pages (landing/hero) — no auth required
│   │   ├── layout.tsx          # Marketing layout with custom fonts (Manrope, Cabin, Instrument Serif, Inter)
│   │   ├── page.tsx            # Landing page at /
│   │   └── _components/        # Hero navbar, hero section
│   ├── (dashboard)/            # Authenticated pages — requires login
│   │   ├── layout.tsx          # Dashboard shell with sidebar, header, user menu
│   │   └── dashboard/
│   │       └── page.tsx        # Main dashboard at /dashboard
│   │       └── _components/    # DataTable, columns, new-application-dialog
│   ├── login/page.tsx          # Login/signup form
│   └── auth/callback/route.ts  # OAuth code exchange
├── components/ui/              # Shadcn source components (button, dialog, table, etc.)
├── lib/
│   ├── database.types.ts       # Manual Supabase types (regenerate: supabase gen types typescript)
│   ├── utils.ts                # cn() utility
│   └── supabase/
│       ├── server.ts           # createServerClient() for Server Components/Actions/Route Handlers
│       ├── client.ts           # createBrowserClient() for Client Components
│       └── middleware.ts       # Session refresh helper for proxy
└── proxy.ts                    # Next.js 16 request proxy (replaces middleware.ts)

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Tables, enums, RLS policies, triggers
```

## Database Schema

**Tables**: `profiles` (1:1 with `auth.users`), `applications`

**Enum**: `application_status` — Applied, Interviewing, Offer, Rejected

**RLS**: All policies use `(SELECT auth.uid())` subquery pattern for performance (evaluated once per query, not per row). Index on `applications.user_id`.

**Trigger**: `on_auth_user_created` auto-creates a `profiles` row on signup.

## Design System

### Dashboard
- Dark mode default, Zinc/Slate palette
- `--radius: 0.5rem`
- Geist Sans for UI text, Geist Mono for dates/metrics/IDs
- Comfortable density: `gap-6`, `p-6`, `text-sm`
- Shadcn tokens: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`

### Landing / Hero Page
- Fonts: Manrope (nav/UI), Cabin (buttons/tags), Instrument Serif (headlines), Inter (body)
- Primary purple: `#7b39fc`
- Dark purple: `#2b2344`
- Full-screen video background, glassmorphism UI elements

## Key Patterns

- Server Components fetch data; Client Components handle interactivity
- Supabase server client: `const supabase = await createClient()` (uses `cookies()` from `next/headers`)
- Client mutations via browser client, then `router.refresh()` to revalidate server data
- Postgrest v12 type workaround: cast `.eq()` params with `as never`, cast query results to typed interfaces
- Next.js 16 uses `proxy.ts` (not `middleware.ts`) — the function is named `proxy()` not `middleware()`
- `params` and `searchParams` are async in Next.js 16 — always `await` them

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
