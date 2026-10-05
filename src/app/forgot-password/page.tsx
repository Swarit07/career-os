"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "../login/actions";
import { type ActionState } from "../login/constants";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    forgotPasswordAction,
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
              Reset your password
            </h1>
            <p className="mt-1.5 text-base" style={{ color: "#6e6e73" }}>
              We&apos;ll email you a secure link that expires in 1 hour.
            </p>
          </div>
        </div>

        <div className="apple-card space-y-5 p-8">
          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm" style={{ color: "#6e6e73" }}>
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="apple-input h-12 text-base"
              />
            </div>

            {state?.error && (
              <p className="text-sm" style={{ color: "#dc2626" }}>
                {state.error}
              </p>
            )}
            {state?.ok && state.info && (
              <p className="text-sm" style={{ color: "#10b981" }}>
                {state.info}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="apple-btn-primary h-12 w-full text-base"
            >
              {pending && <Loader2 className="h-5 w-5 animate-spin" />}
              Send reset link
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: "#6e6e73" }}>
          Remembered it?{" "}
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
