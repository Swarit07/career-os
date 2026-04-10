import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import { FadeUp } from "@/components/fade-up";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile } from "@/lib/database.types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings — CareerOS" };

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id" as never, user.id as never)
    .single()) as { data: Profile | null; error: unknown };

  const fullName = profile?.full_name ?? user.email?.split("@")[0] ?? "User";
  const email = user.email ?? "";
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <PageTransition>
      <div className="space-y-10">
        <FadeUp delay={0}>
          <div className="profile-banner">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Settings
            </p>
            <h1 className="mt-1.5 font-serif text-[2rem] italic text-[var(--text-primary)]">
              Your <em className="not-italic text-[var(--accent-aqua)]">Profile</em>
            </h1>
          </div>
        </FadeUp>

        <FadeUp delay={0.12}>
          <div className="liquid-glass max-w-lg p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-white/10">
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback className="bg-white/5 text-sm text-white/60">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white/90">{fullName}</p>
                <p className="text-sm text-white/40">{email}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Member since</span>
                <span className="font-mono text-white/60">
                  {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Auth provider</span>
                <span className="font-mono text-white/60 capitalize">
                  {user.app_metadata?.provider ?? "email"}
                </span>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </PageTransition>
  );
}
