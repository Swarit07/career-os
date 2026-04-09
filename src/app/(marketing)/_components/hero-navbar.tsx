"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

export function HeroNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="absolute inset-x-0 top-0 z-20 font-[family-name:var(--font-manrope)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#7b39fc" />
            <path
              d="M10 16L14 20L22 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-bold tracking-tight text-white">
            Tracker
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            Home
          </Link>
          <button className="flex items-center gap-1 text-sm font-medium text-white/90 transition-colors hover:text-white">
            Services
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Link
            href="#reviews"
            className="text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            Reviews
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-white/90 transition-colors hover:text-white"
          >
            Contact us
          </Link>
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-[10px] border border-white/30 px-5 py-2 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="rounded-[10px] bg-[#7b39fc] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#8f55fd]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex flex-col bg-black/95 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="8" fill="#7b39fc" />
                <path
                  d="M10 16L14 20L22 12"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-lg font-bold tracking-tight text-white">
                Tracker
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-medium text-white"
            >
              Home
            </Link>
            <button className="flex items-center gap-2 text-2xl font-medium text-white">
              Services
              <ChevronDown className="h-5 w-5" />
            </button>
            <Link
              href="#reviews"
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-medium text-white"
            >
              Reviews
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-medium text-white"
            >
              Contact us
            </Link>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-[10px] border border-white/30 px-8 py-3 text-base font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-[10px] bg-[#7b39fc] px-8 py-3 text-base font-medium text-white transition-colors hover:bg-[#8f55fd]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
