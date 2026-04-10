import { PageTransition } from "@/components/page-transition";
import { FadeUp } from "@/components/fade-up";
import { Globe, Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Job Market — CareerOS" };

export default function JobsPage() {
  return (
    <PageTransition>
      <div className="space-y-10">
        <FadeUp delay={0}>
          <div className="profile-banner">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Job Market
            </p>
            <h1 className="mt-1.5 font-serif text-[2rem] italic text-[var(--text-primary)]">
              Discover <em className="not-italic text-[var(--accent-emerald)]">Opportunities</em>
            </h1>
          </div>
        </FadeUp>

        <FadeUp delay={0.12}>
          <div className="empty-state flex flex-col items-center gap-4 py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Globe className="h-6 w-6 text-white/30" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/60">Job Market is coming soon</p>
              <p className="mt-1 text-xs text-white/30">
                Search live job listings and add them to your pipeline with one click.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[var(--accent-emerald)]/20 bg-[rgba(16,185,129,0.06)] px-4 py-1.5">
              <Search className="h-3.5 w-3.5 text-[var(--accent-emerald)]/70" />
              <span className="text-xs text-[var(--accent-emerald)]/70">Powered by Adzuna API</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </PageTransition>
  );
}
