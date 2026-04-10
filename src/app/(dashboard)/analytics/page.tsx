import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Application } from "@/lib/database.types";
import { PageTransition } from "@/components/page-transition";
import { FadeUp } from "@/components/fade-up";
import { ChartsRow } from "../dashboard/_components/charts-row";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Analytics — CareerOS" };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = (await supabase
    .from("applications")
    .select("*")
    .order("applied_date" as never, { ascending: false })) as { data: Application[] | null; error: unknown };

  const apps: Application[] = data ?? [];

  return (
    <PageTransition>
      <div className="space-y-10">
        <FadeUp delay={0}>
          <div className="profile-banner">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Analytics
            </p>
            <h1 className="mt-1.5 font-serif text-[2rem] italic text-[var(--text-primary)]">
              Pipeline <em className="not-italic text-[var(--accent-violet)]">Insights</em>
            </h1>
          </div>
        </FadeUp>

        <FadeUp delay={0.12}>
          <ChartsRow data={apps} />
        </FadeUp>
      </div>
    </PageTransition>
  );
}
