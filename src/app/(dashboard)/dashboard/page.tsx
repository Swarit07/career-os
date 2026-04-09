import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Application } from "@/lib/database.types";
import { Briefcase, Clock, Trophy, XCircle } from "lucide-react";
import { ApplicationsDataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { PageTransition } from "@/components/page-transition";

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

  const apps: Application[] = (applications as Application[]) ?? [];

  const counts = {
    total: apps.length,
    interviewing: apps.filter((a) => a.status === "Interviewing").length,
    offers: apps.filter((a) => a.status === "Offer").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
  };

  if (error) {
    console.error("Error fetching applications:", error);
  }

  const statCards = [
    {
      label: "Total Applications",
      value: counts.total,
      icon: Briefcase,
    },
    {
      label: "Interviewing",
      value: counts.interviewing,
      icon: Clock,
    },
    {
      label: "Offers",
      value: counts.offers,
      icon: Trophy,
    },
    {
      label: "Rejected",
      value: counts.rejected,
      icon: XCircle,
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="font-serif text-3xl italic text-white/90">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Track and manage your job applications
          </p>
        </div>

        {/* Stat cards — liquid glass with serif italic numbers */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="liquid-glass p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                  {card.label}
                </p>
                <card.icon className="h-4 w-4 text-white/20" />
              </div>
              <p className="stat-number mt-3 text-4xl text-white/90">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Data table in liquid glass container */}
        <div className="liquid-glass p-1">
          <ApplicationsDataTable columns={columns} data={apps} />
        </div>
      </div>
    </PageTransition>
  );
}
