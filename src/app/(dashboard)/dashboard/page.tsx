import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Application } from "@/lib/database.types";
import { Briefcase, Clock, Trophy, XCircle } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { FadeUp } from "@/components/fade-up";
import { CsvExportButton } from "./_components/csv-export-button";
import { ApplicationsView } from "./_components/applications-view";
import { ChartsRow } from "./_components/charts-row";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: applications, error } = (await supabase
    .from("applications")
    .select("*")
    .order("applied_date" as never, { ascending: false })) as {
    data: Application[] | null;
    error: { message: string } | null;
  };

  if (error) {
    console.error("Error fetching applications:", error);
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center gap-4 py-32">
          <p className="text-base text-red-400/70">
            Failed to load applications. Please try again later.
          </p>
        </div>
      </PageTransition>
    );
  }

  const apps: Application[] = (applications as Application[]) ?? [];

  const counts = {
    total: apps.length,
    interviewing: apps.filter((a) => a.status === "Interviewing").length,
    offers: apps.filter((a) => a.status === "Offer").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
  };

  const statCards = [
    { label: "Total Applications", value: counts.total, icon: Briefcase, type: "applied" as const },
    { label: "Interviewing", value: counts.interviewing, icon: Clock, type: "interview" as const },
    { label: "Offers", value: counts.offers, icon: Trophy, type: "offer" as const },
    { label: "Rejected", value: counts.rejected, icon: XCircle, type: "rejected" as const },
  ];

  return (
    <PageTransition>
      <div className="space-y-10">
        {/* Profile Banner — Command Center */}
        <FadeUp delay={0}>
          <div className="profile-banner">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Career Command Center
                </p>
                <h1 className="mt-1.5 font-serif text-[2rem] italic text-[var(--text-primary)]">
                  Welcome back, <em className="not-italic text-[var(--accent-aqua)]">CareerOS</em>
                </h1>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <CsvExportButton data={apps} />
            </div>
          </div>
        </FadeUp>

        {/* Stat cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <FadeUp key={card.label} delay={0.08 + i * 0.07}>
              <div className="stat-card" data-type={card.type}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-widest text-white/40">
                    {card.label}
                  </p>
                  <card.icon className="h-4 w-4 text-white/20" />
                </div>
                <p className="stat-number mt-4 text-5xl text-white/90">
                  {card.value}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Charts row */}
        <FadeUp delay={0.36}>
          <ChartsRow data={apps} />
        </FadeUp>

        {/* Applications table / kanban */}
        <FadeUp delay={0.44}>
          <ApplicationsView data={apps} />
        </FadeUp>
      </div>
    </PageTransition>
  );
}
