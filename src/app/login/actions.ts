"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { PASSWORD_MIN, type ActionState } from "./constants";

function emailLooksValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function originFromHeaders(): Promise<string> {
  const hdrs = await headers();
  const origin = hdrs.get("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin;
  const host = hdrs.get("host");
  if (!host) return "";
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!emailLooksValid(email) || !password) {
    return { error: "Invalid email or password." };
  }

  const hdrs = await headers();
  const ip = getClientIp(hdrs);

  const ipLimit = rateLimit(`login:ip:${ip}`, 10, 60_000);
  const emailLimit = rateLimit(`login:email:${email}`, 5, 15 * 60_000);
  if (!ipLimit.ok || !emailLimit.ok) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/dashboard");
}

export async function signupAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!emailLooksValid(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < PASSWORD_MIN) {
    return {
      error: `Password must be at least ${PASSWORD_MIN} characters long.`,
    };
  }

  const hdrs = await headers();
  const ip = getClientIp(hdrs);

  const ipLimit = rateLimit(`signup:ip:${ip}`, 5, 60 * 60_000);
  const emailLimit = rateLimit(`signup:email:${email}`, 3, 24 * 60 * 60_000);
  if (!ipLimit.ok || !emailLimit.ok) {
    return { error: "Too many signup attempts. Please try again later." };
  }

  const origin = await originFromHeaders();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return {
      error:
        "We couldn't create that account. If you already have one, try signing in or resetting your password.",
    };
  }

  redirect("/verify-email");
}

export async function forgotPasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!emailLooksValid(email)) {
    return { error: "Please enter a valid email address." };
  }

  const hdrs = await headers();
  const ip = getClientIp(hdrs);

  const ipLimit = rateLimit(`forgot:ip:${ip}`, 5, 15 * 60_000);
  const emailLimit = rateLimit(`forgot:email:${email}`, 3, 60 * 60_000);

  if (ipLimit.ok && emailLimit.ok) {
    const origin = await originFromHeaders();
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });
  }

  return {
    ok: true,
    info:
      "If an account exists for that email, a password-reset link has been sent. The link expires in 1 hour.",
  };
}

export async function updatePasswordAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < PASSWORD_MIN) {
    return {
      error: `Password must be at least ${PASSWORD_MIN} characters long.`,
    };
  }
  if (password !== confirm) {
    return { error: "Passwords don't match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error:
        "This reset link has expired or already been used. Please request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "Could not update password. Please try again." };
  }

  redirect("/dashboard");
}

export async function signoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
