import { HeroNavbar } from "./_components/hero-navbar";
import { HeroSection } from "./_components/hero-section";

export default function MarketingPage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#ffffff" }}>
      <HeroNavbar />
      <HeroSection />
    </main>
  );
}
