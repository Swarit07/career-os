import { createClient } from "@/lib/supabase/server";
import { PageTransition } from "@/components/page-transition";
import { FadeUp } from "@/components/fade-up";
import { ForgePanel } from "./_components/forge-panel";
import type { Resume } from "@/lib/database.types";
import { FileText, Trash2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Resume Forge — CareerOS" };

export default async function ResumePage() {
  const supabase = await createClient();
  const { data: resumes } = (await supabase
    .from("resumes")
    .select("*")
    .order("created_at" as never, { ascending: false })
    .limit(20)) as { data: Resume[] | null };

  const history = resumes ?? [];

  return (
    <PageTransition>
      <div className="space-y-10">
        {/* Banner */}
        <FadeUp delay={0}>
          <div className="profile-banner">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Resume Forge
            </p>
            <h1 className="mt-1.5 font-serif text-[2rem] italic text-[var(--text-primary)]">
              AI-Powered{" "}
              <em className="not-italic text-[var(--accent-amber)]">
                Resume Tailoring
              </em>
            </h1>
            <p className="mt-2 text-sm text-[#6e6e73]">
              Paste your base résumé and a job description — CareerOS rewrites
              your bullets to mirror the role.
            </p>
          </div>
        </FadeUp>

        {/* Forge UI */}
        <FadeUp delay={0.08}>
          <ForgePanel />
        </FadeUp>

        {/* History */}
        {history.length > 0 && (
          <FadeUp delay={0.16}>
            <div className="space-y-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#86868b]">
                Vault — {history.length} saved
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {history.map((r) => (
                  <HistoryCard key={r.id} resume={r} />
                ))}
              </div>
            </div>
          </FadeUp>
        )}
      </div>
    </PageTransition>
  );
}

function HistoryCard({ resume }: { resume: Resume }) {
  const date = new Date(resume.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const preview = resume.tailored_version.slice(0, 120).replace(/\n/g, " ");

  return (
    <div className="apple-card group flex flex-col gap-3 rounded-2xl p-5 transition-colors hover:bg-[#fafafa]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[rgba(245,158,11,0.1)]">
            <FileText className="h-4 w-4 text-[#f59e0b]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#1d1d1f]">
              {resume.label}
            </p>
            <p className="text-[11px] text-[#86868b]">{date}</p>
          </div>
        </div>
        <DeleteResumeButton id={resume.id} />
      </div>
      <p className="line-clamp-3 font-mono text-xs leading-relaxed text-[#6e6e73]">
        {preview}…
      </p>
    </div>
  );
}

function DeleteResumeButton({ id }: { id: string }) {
  return (
    <form action={`/api/resume/delete`} method="POST">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg p-1.5 text-[#a1a1a6] opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
