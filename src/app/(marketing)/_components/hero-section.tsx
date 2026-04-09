"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

function StarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="#FF801E"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 0.5L9.79 5.81H15.5L10.85 9.19L12.64 14.5L8 11.12L3.36 14.5L5.15 9.19L0.5 5.81H6.21L8 0.5Z" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <div className="flex flex-col justify-center py-20 lg:py-0">
      {/* Social proof badge */}
      <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>
        <span className="font-[family-name:var(--font-inter)] text-sm text-gray-600">
          Rated 4.9/5 by 2700+ users
        </span>
      </div>

      {/* Headline */}
      <h1
        className="font-[family-name:var(--font-fustat)] font-bold text-gray-900"
        style={{
          fontSize: "clamp(40px, 5vw, 75px)",
          lineHeight: 1.05,
          letterSpacing: "-2px",
        }}
      >
        Track smarter,
        <br />
        land faster
      </h1>

      {/* Subheadline */}
      <p className="mt-6 max-w-[540px] font-[family-name:var(--font-inter)] text-lg leading-relaxed text-gray-500 tracking-[-1px]">
        Effortlessly manage your applications, track every interview, and land
        your dream internship with our intuitive tracker.
      </p>

      {/* Primary CTA */}
      <Link
        href="/login"
        className="mt-10 inline-flex w-fit cursor-pointer items-center gap-2 rounded-[16px] px-8 py-4 font-[family-name:var(--font-inter)] font-medium text-white transition-transform hover:scale-[1.02]"
        style={{
          background: "rgba(0,132,255,0.8)",
          backdropFilter: "blur(2px)",
          boxShadow: "inset 0px 4px 4px 0px rgba(255,255,255,0.35)",
        }}
      >
        Get Started Now
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25">
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>

      {/* Sign in link */}
      <p className="mt-4 font-[family-name:var(--font-inter)] text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
