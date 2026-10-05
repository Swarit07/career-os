import Link from "next/link";
import { MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signoutAction } from "../login/actions";

export const metadata = { title: "Verify your email — CareerOS" };

export default async function VerifyEmailPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email_confirmed_at) {
    redirect("/dashboard");
  }

  const email = user?.email ?? "your email address";

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{ background: "#f5f5f7" }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: "#1d1d1f" }}
          >
            <MailCheck className="h-7 w-7" style={{ color: "#ffffff" }} />
          </div>
          <div className="text-center">
            <h1
              className="font-serif text-3xl italic"
              style={{ color: "#1d1d1f" }}
            >
              Check your inbox
            </h1>
            <p className="mt-1.5 text-base" style={{ color: "#6e6e73" }}>
              We sent a verification link to{" "}
              <span style={{ color: "#1d1d1f", fontWeight: 500 }}>{email}</span>.
              Click it to activate your account.
            </p>
          </div>
        </div>

        <div className="apple-card space-y-4 p-8 text-center">
          <p className="text-sm" style={{ color: "#6e6e73" }}>
            The link expires in 24 hours. If it doesn&apos;t arrive in a few
            minutes, check your spam folder.
          </p>
          <form action={signoutAction}>
            <button
              type="submit"
              className="apple-btn-secondary h-11 w-full text-sm"
            >
              Sign out
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: "#6e6e73" }}>
          Wrong email?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4"
            style={{ color: "#0071e3" }}
          >
            Use a different account
          </Link>
        </p>
      </div>
    </div>
  );
}
