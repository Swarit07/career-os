import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Application } from "@/lib/database.types";
import { Briefcase, Clock, Trophy, XCircle } from "lucide-react";
import { ApplicationsDataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { PageTransition } from "@/components/page-transition";
import { FadeUp } from "@/components/fade-up";

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
    { label: "Total Applications", value: counts.total, icon: Briefcase },
    { label: "Interviewing", value: counts.interviewing, icon: Clock },
    { label: "Offers", value: counts.offers, icon: Trophy },
    { label: "Rejected", value: counts.rejected, icon: XCircle },
  ];

  return (
    <PageTransition>
      <div className="space-y-10">
        {/* Page header */}
        <FadeUp delay={0}>
          <h1 className="font-serif text-4xl italic text-white/90">
            Dashboard
          </h1>
          <p className="mt-2 text-base text-white/40">
            Track and manage your job applications
          </p>
        </FadeUp>

        {/* Stat cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <FadeUp key={card.label} delay={0.08 + i * 0.07}>
              <div className="liquid-glass p-6">
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

        {/* Data table */}
        <FadeUp delay={0.36}>
          <div className="liquid-glass p-1">
            <ApplicationsDataTable columns={columns} data={apps} />
          </div>
        </FadeUp>
      </div>
    </PageTransition>
  );
}
