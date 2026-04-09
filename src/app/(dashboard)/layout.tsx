import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "./dashboard/_components/dashboard-shell";
import type { Profile } from "@/lib/database.types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id as never)
    .single()) as { data: Profile | null };

  return (
    <DashboardShell
      user={{
        email: user.email ?? "",
        fullName: profile?.full_name ?? user.email?.split("@")[0] ?? "User",
        avatarUrl: profile?.avatar_url ?? null,
      }}
    >
      {children}
    </DashboardShell>
  );
}
