import { HeroNavbar } from "./_components/hero-navbar";
import { HeroSection } from "./_components/hero-section";
import { GlassyOrb } from "./_components/glassy-orb";
import { TrustedLogos } from "./_components/trusted-logos";

export default function MarketingPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-white text-gray-900"
      style={{ WebkitFontSmoothing: "antialiased" }}
    >
      {/* Background gradient glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#60B1FF] opacity-20 blur-[150px]" />
      <div className="pointer-events-none absolute left-20 top-20 h-[400px] w-[400px] rounded-full bg-[#319AFF] opacity-15 blur-[120px]" />

      {/* Navbar */}
      <HeroNavbar />

      {/* Hero dual-column layout */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1600px] items-center px-6 lg:grid-cols-2 lg:gap-12 lg:px-20">
        <HeroSection />
        <GlassyOrb />
      </div>

      {/* Trusted logos */}
      <TrustedLogos />
    </main>
  );
}
