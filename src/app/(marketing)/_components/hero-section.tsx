"use client";

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Glassmorphism pill */}
        <div className="mb-8 flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md font-[family-name:var(--font-cabin)]">
          <span className="rounded-full bg-[#7b39fc] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
            New
          </span>
          <span className="text-sm text-white/90">
            Say Hello to Datacore v3.2
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl font-[family-name:var(--font-instrument-serif)] text-5xl leading-[1.1] tracking-tight text-white md:text-7xl lg:text-[96px]">
          Book your perfect stay instantly{" "}
          <em className="not-italic" style={{ fontStyle: "italic" }}>
            and
          </em>{" "}
          hassle-free
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-[662px] font-[family-name:var(--font-inter)] text-base leading-relaxed text-white/70 md:text-lg">
          Seamlessly manage your bookings with our intuitive platform. From
          discovery to checkout, experience the future of hassle-free
          reservations.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-[10px] bg-[#7b39fc] px-7 py-3.5 font-[family-name:var(--font-cabin)] text-base font-medium text-white transition-colors hover:bg-[#8f55fd]"
          >
            Book a Free Demo
          </Link>
          <Link
            href="/login"
            className="rounded-[10px] bg-[#2b2344] px-7 py-3.5 font-[family-name:var(--font-cabin)] text-base font-medium text-[#f6f7f9] transition-colors hover:bg-[#3a3058]"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  );
}
