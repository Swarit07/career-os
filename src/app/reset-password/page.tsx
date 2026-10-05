"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordAction } from "../login/actions";
import { PASSWORD_MIN, type ActionState } from "../login/constants";

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updatePasswordAction,
    null
  );

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
            <KeyRound className="h-7 w-7" style={{ color: "#ffffff" }} />
          </div>
          <div className="text-center">
            <h1
              className="font-serif text-3xl italic"
              style={{ color: "#1d1d1f" }}
            >
              Set a new password
            </h1>
            <p className="mt-1.5 text-base" style={{ color: "#6e6e73" }}>
              Choose something you haven&apos;t used before.
            </p>
          </div>
        </div>

        <div className="apple-card space-y-5 p-8">
          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm" style={{ color: "#6e6e73" }}>
                New password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••"
                required
                minLength={PASSWORD_MIN}
                autoComplete="new-password"
                className="apple-input h-12 text-base"
              />
              <p className="text-xs" style={{ color: "#86868b" }}>
                Use at least {PASSWORD_MIN} characters.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-sm" style={{ color: "#6e6e73" }}>
                Confirm password
              </Label>
              <Input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="••••••••••"
                required
                minLength={PASSWORD_MIN}
                autoComplete="new-password"
                className="apple-input h-12 text-base"
              />
            </div>

            {state?.error && (
              <p className="text-sm" style={{ color: "#dc2626" }}>
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="apple-btn-primary h-12 w-full text-base"
            >
              {pending && <Loader2 className="h-5 w-5 animate-spin" />}
              Update password
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: "#6e6e73" }}>
          <Link
            href="/login"
            className="underline underline-offset-4"
            style={{ color: "#0071e3" }}
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
