"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "#", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function HeroNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-[30px] z-20 flex justify-center px-4">
      {/* Glass pill */}
      <div
        className="flex items-center gap-8 rounded-[16px] border border-black/10 bg-white/30 px-6 py-3 backdrop-blur-[50px]"
        style={{
          boxShadow: "inset 0px 4px 4px 0px rgba(255,255,255,0.25)",
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="font-[family-name:var(--font-fustat)] text-lg font-bold text-gray-900"
        >
          Tracker
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-[family-name:var(--font-inter)] text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="font-[family-name:var(--font-inter)] text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Sign In
          </Link>
        </div>

        {/* Desktop Sign Up button */}
        <Link
          href="/login"
          className="hidden items-center gap-1.5 rounded-[12px] bg-black/5 px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium text-gray-900 backdrop-blur-sm transition-colors hover:bg-black/10 md:inline-flex"
        >
          Sign Up
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex cursor-pointer items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-gray-900" />
          ) : (
            <Menu className="h-5 w-5 text-gray-900" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex flex-col bg-white/95 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="font-[family-name:var(--font-fustat)] text-lg font-bold text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              Tracker
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-900" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-[family-name:var(--font-inter)] text-2xl font-medium text-gray-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="font-[family-name:var(--font-inter)] text-2xl font-medium text-gray-600"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex items-center gap-2 rounded-[16px] bg-gray-900 px-8 py-3 font-[family-name:var(--font-inter)] text-base font-medium text-white transition-colors hover:bg-gray-800"
            >
              Sign Up
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
