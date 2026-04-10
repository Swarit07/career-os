import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  Clock,
  Trophy,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { BlurText } from "@/components/blur-text";
import { StaggerList, StaggerItem } from "@/components/stagger-list";

const stats = [
  { label: "Applications", value: "248", icon: Terminal },
  { label: "Interviews", value: "42", icon: Clock },
  { label: "Offers", value: "12", icon: Trophy },
];

const features = [
  {
    title: "Command your pipeline",
    description:
      "Log company, role, salary, and status in one place. Know exactly where you stand at every stage.",
    icon: Terminal,
  },
  {
    title: "AI-powered resume forge",
    description:
      "Tailor your resume to any job description in seconds. Let the AI extract keywords and rewrite your bullets.",
    icon: Zap,
  },
  {
    title: "Stay ahead",
    description:
      "Filter by status, sort by date, and discover new opportunities — all from a single command center.",
    icon: CheckCircle2,
  },
];

const statusRows = [
  {
    company: "Google",
    role: "Senior Software Engineer",
    status: "Interviewing",
    statusClass: "border-amber-500/20 text-amber-400/70",
    date: "Mar 15, 2026",
  },
  {
    company: "Stripe",
    role: "Backend Engineer",
    status: "Applied",
    statusClass: "border-white/10 text-white/50",
    date: "Mar 12, 2026",
  },
  {
    company: "Figma",
    role: "Product Designer",
    status: "Offer",
    statusClass: "border-emerald-500/20 text-emerald-400/70",
    date: "Mar 8, 2026",
  },
  {
    company: "Vercel",
    role: "Frontend Engineer",
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
          <BlurText text="The Operating System" delay={0} />
          <br />
          <BlurText text="for your Career" delay={0.3} />
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/40">
          One command center for tracking applications, forging AI-tailored
          resumes, and discovering your next opportunity.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="liquid-glass-strong inline-flex items-center gap-2 px-8 py-3 text-sm font-medium text-white/90 transition-transform hover:scale-[1.02]"
          >
            Launch CareerOS
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
      <section className="mx-auto max-w-3xl">
        <StaggerList className="grid gap-4 sm:grid-cols-3" delay={0.1}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="liquid-glass p-5 text-center">
                <stat.icon className="mx-auto mb-2 h-4 w-4 text-white/20" />
                <p className="stat-number text-3xl text-white/90">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
                  {stat.label} tracked
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      {/* Dashboard preview */}
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-2xl italic text-white/90 sm:text-3xl">
            Your command center
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Every application tracked, every stage visible, every move deliberate
          </p>
        </div>

        <div className="liquid-glass overflow-hidden">
          <div className="grid grid-cols-[1fr_1.5fr_auto_auto] gap-4 border-b border-white/[0.04] px-6 py-3 text-xs uppercase tracking-wider text-white/30">
            <span>Company</span>
            <span>Role</span>
            <span>Status</span>
            <span className="text-right">Applied</span>
          </div>
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
            Built for serious job seekers
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Every module purpose-built for the modern career hunt
          </p>
        </div>

        <StaggerList className="grid gap-4 sm:grid-cols-3" delay={0.05} stagger={0.1}>
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <div className="liquid-glass h-full p-6">
                <feature.icon className="mb-3 h-5 w-5 text-white/30" />
                <h3 className="text-sm font-medium text-white/80">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">
                  {feature.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-2xl pb-20 text-center">
        <div className="liquid-glass p-10">
          <h2 className="font-serif text-2xl italic text-white/90">
            Ready to take command?
          </h2>
          <p className="mt-2 text-sm text-white/40">
            Join thousands of professionals running their job search on CareerOS.
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
