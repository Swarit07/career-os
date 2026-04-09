import { HeroNavbar } from "./_components/hero-navbar";
import { HeroSection } from "./_components/hero-section";

export default function MarketingPage() {
  return (
    <main className="relative min-h-screen bg-black">
      <HeroNavbar />
      <div className="mx-auto max-w-6xl px-6">
        <HeroSection />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-white/30">
        <div className="mx-auto max-w-6xl px-6">
          &copy; {new Date().getFullYear()} Tracker. Built for applicants.
        </div>
      </footer>
    </main>
  );
}
