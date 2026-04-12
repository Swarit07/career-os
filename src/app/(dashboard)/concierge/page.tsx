import { PageTransition } from "@/components/page-transition";
import { FadeUp } from "@/components/fade-up";
import { ConciergeClient } from "./_components/concierge-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "AI Concierge — CareerOS" };

export default async function ConciergePage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <FadeUp delay={0}>
          <div className="profile-banner">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              AI Concierge
            </p>
            <h1 className="mt-1.5 font-serif text-[2rem] italic text-[var(--text-primary)]">
              Your{" "}
              <em className="not-italic text-[var(--accent-violet)]">
                Career Coach
              </em>
            </h1>
            <p className="mt-2 text-sm text-[#6e6e73]">
              Pipeline analysis, interview prep, salary negotiation, cover letters — ask anything.
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <ConciergeClient />
        </FadeUp>
      </div>
    </PageTransition>
  );
}
