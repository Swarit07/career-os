import { HeroNavbar } from "./_components/hero-navbar";
import { HeroSection } from "./_components/hero-section";
import { HlsVideoBackground } from "@/components/hls-video-background";

export default function MarketingPage() {
  const videoUrl = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

  return (
    <main className="relative min-h-screen bg-black">
      {videoUrl && <HlsVideoBackground src={videoUrl} />}
      <div className="relative z-10">
        <HeroNavbar />
        <div className="mx-auto max-w-6xl px-6">
          <HeroSection />
        </div>

        <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-white/30">
          <div className="mx-auto max-w-6xl px-6">
            &copy; {new Date().getFullYear()} CareerOS. The operating system for your career.
          </div>
        </footer>
      </div>
    </main>
  );
}
