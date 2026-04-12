import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Application, Profile } from "@/lib/database.types";
import { Briefcase, Clock, Trophy, TrendingUp } from "lucide-react";
import { PageTransition } from "@/components/page-transition";
import { FadeUp } from "@/components/fade-up";
import { CsvExportButton } from "./_components/csv-export-button";
import { ApplicationsView } from "./_components/applications-view";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id as never)
    .single()) as { data: Pick<Profile, "full_name"> | null };

  const displayName =
    profile?.full_name ?? user.email?.split("@")[0] ?? "there";

  const { data: applications, error } = (await supabase
    .from("applications")
    .select("*")
    .order("applied_date" as never, { ascending: false })) as {
    data: Application[] | null;
    error: { message: string } | null;
  };

  if (error) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center gap-4 py-32">
          <p className="text-base" style={{ color: "#dc2626" }}>
            Failed to load applications. Please try again later.
          </p>
        </div>
      </PageTransition>
    );
  }

  const apps: Application[] = applications ?? [];
  const total = apps.length;
  const interviewing = apps.filter((a) => a.status === "Interviewing").length;
  const offers = apps.filter((a) => a.status === "Offer").length;
  const rejected = apps.filter((a) => a.status === "Rejected").length;
  const activeApplied = total - interviewing - offers - rejected;
  const responseRate =
    total > 0 ? Math.round(((interviewing + offers) / total) * 100) : 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentCount = apps.filter(
    (a) => a.applied_date != null && new Date(a.applied_date) >= sevenDaysAgo
  ).length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const statCards = [
    {
      label: "Total Applied",
      value: total,
      icon: Briefcase,
      type: "applied" as const,
      color: "#0071e3",
      suffix: "",
      sub: recentCount > 0 ? `+${recentCount} this week` : "Start tracking",
    },
    {
      label: "Interviewing",
      value: interviewing,
      icon: Clock,
      type: "interview" as const,
      color: "#f59e0b",
      suffix: "",
      sub:
        total > 0
          ? `${Math.round((interviewing / total) * 100)}% interview rate`
          : "No apps yet",
    },
    {
      label: "Offers",
      value: offers,
      icon: Trophy,
      type: "offer" as const,
      color: "#10b981",
      suffix: "",
      sub: offers > 0 ? "Keep it up!" : "You've got this",
    },
    {
      label: "Response Rate",
      value: responseRate,
      icon: TrendingUp,
      type: "rejected" as const,
      color: "#f43f5e",
      suffix: "%",
      sub: `${rejected} rejected · ${activeApplied} pending`,
    },
  ];

  const pipelineStrip = [
    { label: "Pending", count: activeApplied, status: "applied", color: "#0071e3" },
    { label: "Interviewing", count: interviewing, status: "interviewing", color: "#f59e0b" },
    { label: "Offers", count: offers, status: "offer", color: "#10b981" },
    { label: "Rejected", count: rejected, status: "rejected", color: "#f43f5e" },
  ];

  return (
    <PageTransition>
      <div className="space-y-10">

        {/* ── Banner ── */}
        <FadeUp delay={0}>
          <div className="profile-banner">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="apple-label">Career Command Center</p>
                <h1
                  className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl"
                  style={{
                    color: "#1d1d1f",
                    letterSpacing: "-0.035em",
                  }}
                >
                  {greeting},{" "}
                  <span
                    className="apple-serif-italic"
                    style={{ color: "#0071e3" }}
                  >
                    {displayName}
                  </span>
                  .
                </h1>
                <p
                  className="mt-3 flex flex-wrap items-center gap-3 text-[15px]"
                  style={{ color: "#6e6e73" }}
                >
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  {recentCount > 0 && (
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: "#10b981" }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: "#10b981" }}
                      />
                      {recentCount} app{recentCount !== 1 ? "s" : ""} this week
                    </span>
                  )}
                </p>
              </div>
              <CsvExportButton data={apps} />
            </div>

            {total > 0 && (
              <div
                className="relative mt-6 flex flex-wrap items-center gap-5 pt-5"
                style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
              >
                {pipelineStrip.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="status-dot" data-status={s.status} />
                    <span
                      className="text-xs font-medium"
                      style={{ color: "#86868b" }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="text-xs font-semibold tabular-nums"
                      style={{ color: "#1d1d1f" }}
                    >
                      {s.count}
                    </span>
                  </div>
                ))}
                <div className="ml-auto hidden flex-1 sm:block">
                  <div
                    className="flex h-1.5 overflow-hidden rounded-full"
                    style={{ background: "#f5f5f7" }}
                  >
                    {pipelineStrip.map((s, i) => (
                      <div
                        key={i}
                        style={{
                          width: `${(s.count / total) * 100}%`,
                          background: s.color,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </FadeUp>

        {/* ── Stat cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <FadeUp key={card.label} delay={0.08 + i * 0.07}>
              <div className="stat-card" data-type={card.type}>
                <div className="flex items-center justify-between">
                  <p
                    className="text-[11px] font-semibold uppercase"
                    style={{
                      color: "#86868b",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {card.label}
                  </p>
                  <card.icon className="h-4 w-4" style={{ color: card.color }} />
                </div>
                <p className="stat-number mt-5 text-5xl">
                  {card.value}
                  {card.suffix}
                </p>
                <p
                  className="mt-2 text-[13px]"
                  style={{ color: "#86868b" }}
                >
                  {card.sub}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* ── Applications table / kanban ── */}
        <FadeUp delay={0.36}>
          <ApplicationsView data={apps} />
        </FadeUp>

      </div>
    </PageTransition>
  );
}
