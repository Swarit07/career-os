import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Clock,
  Trophy,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { label: "Applications", value: "248", icon: Briefcase },
  { label: "Interviews", value: "42", icon: Clock },
  { label: "Offers", value: "12", icon: Trophy },
];

const features = [
  {
    title: "Track every application",
    description:
      "Log company, role, salary, and status in one place. Never lose track of where you applied.",
    icon: Briefcase,
  },
  {
    title: "Monitor your pipeline",
    description:
      "See how many applications are active, interviewing, or closed at a glance with real-time stats.",
    icon: BarChart3,
  },
  {
    title: "Stay organized",
    description:
      "Filter by status, sort by date, and search across all your applications instantly.",
    icon: CheckCircle2,
  },
];

const statusRows = [
  {
    company: "Google",
    role: "Software Engineer Intern",
    status: "Interviewing",
    statusClass: "border-amber-500/20 text-amber-400/70",
    date: "Mar 15, 2026",
  },
  {
    company: "Stripe",
    role: "Backend Engineer Intern",
    status: "Applied",
    statusClass: "border-white/10 text-white/50",
    date: "Mar 12, 2026",
  },
  {
    company: "Figma",
    role: "Product Design Intern",
    status: "Offer",
    statusClass: "border-emerald-500/20 text-emerald-400/70",
    date: "Mar 8, 2026",
  },
  {
    company: "Vercel",
    role: "Frontend Engineer Intern",
    status: "Interviewing",
    statusClass: "border-amber-500/20 text-amber-400/70",
    date: "Mar 5, 2026",
  },
];

export function HeroSection() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="mx-auto max-w-4xl pt-20 text-center sm:pt-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          <span className="text-xs font-medium text-white/50">
            Free to use &mdash; no credit card required
          </span>
        </div>

        <h1 className="font-serif text-5xl italic text-white/90 sm:text-7xl">
          Track smarter,
          <br />
          land faster
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/40">
          The simple, focused tracker for managing your internship and job
          applications. Know where you stand at every stage.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="liquid-glass-strong inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white/90 transition-transform hover:scale-[1.02]"
          >
            Start Tracking
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-6 py-3 text-sm font-medium text-white/50 transition-colors hover:text-white/80"
          >
            Sign in to your account
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="liquid-glass p-5 text-center">
            <stat.icon className="mx-auto mb-2 h-4 w-4 text-white/20" />
            <p className="stat-number text-3xl text-white/90">{stat.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
              {stat.label} tracked
            </p>
          </div>
        ))}
      </section>

      {/* Dashboard preview */}
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl italic text-white/90 sm:text-3xl">
            Your applications, at a glance
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Everything you need to stay on top of your job search
          </p>
        </div>

        <div className="liquid-glass overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1.5fr_auto_auto] gap-4 border-b border-white/[0.04] px-6 py-3 text-xs uppercase tracking-wider text-white/30">
            <span>Company</span>
            <span>Role</span>
            <span>Status</span>
            <span className="text-right">Applied</span>
          </div>
          {/* Table rows */}
          {statusRows.map((row) => (
            <div
              key={row.company}
              className="grid grid-cols-[1fr_1.5fr_auto_auto] items-center gap-4 border-b border-white/[0.04] px-6 py-4 last:border-0"
            >
              <span className="font-medium text-white/80">{row.company}</span>
              <span className="truncate text-sm text-white/50">{row.role}</span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${row.statusClass}`}
              >
                {row.status}
              </span>
              <span className="stat-number text-right text-sm text-white/40">
                {row.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl italic text-white/90 sm:text-3xl">
            Built for applicants
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Simple tools that help you focus on what matters
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="liquid-glass p-6">
              <feature.icon className="mb-3 h-5 w-5 text-white/30" />
              <h3 className="text-sm font-medium text-white/80">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-2xl pb-20 text-center">
        <div className="liquid-glass p-10">
          <h2 className="font-serif text-2xl italic text-white/90">
            Ready to get organized?
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Join thousands of students tracking their applications with Tracker.
          </p>
          <Link
            href="/login"
            className="liquid-glass-strong mt-6 inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white/90 transition-transform hover:scale-[1.02]"
          >
            Get Started for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
