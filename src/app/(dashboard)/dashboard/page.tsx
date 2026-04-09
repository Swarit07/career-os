import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Application } from "@/lib/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Clock, Trophy, XCircle } from "lucide-react";
import { ApplicationsDataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

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
    applied: apps.filter((a) => a.status === "Applied").length,
    interviewing: apps.filter((a) => a.status === "Interviewing").length,
    offers: apps.filter((a) => a.status === "Offer").length,
    rejected: apps.filter((a) => a.status === "Rejected").length,
  };

  if (error) {
    console.error("Error fetching applications:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track and manage your job applications
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{counts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Interviewing
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {counts.interviewing}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offers
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{counts.offers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {counts.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data table */}
      <ApplicationsDataTable columns={columns} data={apps} />
    </div>
  );
}
