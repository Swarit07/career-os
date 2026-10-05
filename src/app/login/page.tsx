"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { Terminal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { loginAction, signupAction } from "./actions";
import { PASSWORD_MIN, type ActionState } from "./constants";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const [state, action, pending] = useActionState<ActionState, FormData>(
    mode === "login" ? loginAction : signupAction,
    null
  );

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setGoogleError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setGoogleError("Could not start Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  }

  const formError = state?.error ?? googleError;

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
            <Terminal className="h-7 w-7" style={{ color: "#ffffff" }} />
          </div>
          <div className="text-center">
            <h1
              className="font-serif text-3xl italic"
              style={{ color: "#1d1d1f" }}
            >
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-1.5 text-base" style={{ color: "#6e6e73" }}>
              {mode === "login"
                ? "Sign in to CareerOS"
                : "Start your career operating system"}
            </p>
          </div>
        </div>

        <div className="apple-card space-y-5 p-8">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full cursor-pointer gap-3 text-base"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.09)",
              color: "#1d1d1f",
            }}
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.07)" }} />
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "#86868b" }}
            >
              or
            </span>
            <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.07)" }} />
          </div>

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
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm" style={{ color: "#6e6e73" }}>
                  Password
                </Label>
                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs underline underline-offset-4"
                    style={{ color: "#0071e3" }}
                  >
                    Forgot?
                  </Link>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••"
                required
                minLength={mode === "signup" ? PASSWORD_MIN : 1}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                className="apple-input h-12 text-base"
              />
              {mode === "signup" && (
                <p className="text-xs" style={{ color: "#86868b" }}>
                  Use at least {PASSWORD_MIN} characters.
                </p>
              )}
            </div>

            {formError && (
              <p className="text-sm" style={{ color: "#dc2626" }}>
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="apple-btn-primary h-12 w-full text-base"
            >
              {pending && <Loader2 className="h-5 w-5 animate-spin" />}
              {mode === "login" ? "Sign in" : "Sign up"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: "#6e6e73" }}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="cursor-pointer underline underline-offset-4"
            style={{ color: "#0071e3" }}
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setGoogleError(null);
            }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
