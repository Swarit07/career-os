import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";

export function HeroNavbar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Briefcase className="h-4 w-4 text-white/80" />
          </div>
          <span className="font-serif text-lg italic text-white/90">
            Tracker
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:text-white/80"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="liquid-glass-strong inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white/90 transition-transform hover:scale-[1.02]"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
