"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import type { Variants } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

/* ─────────────────────────── Typewriter ─────────────────────────── */

const TYPEWRITER_PHRASES = [
  "track every application.",
  "forge AI-powered resumes.",
  "discover new opportunities.",
  "get personalized career coaching.",
];

function Typewriter({ phrases }: { phrases: string[] }) {
  const [idx, setIdx]           = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting]   = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const current = phrases[idx];
    clearTimeout(timer.current);

    if (!deleting && displayed.length < current.length) {
      timer.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 62);
    } else if (!deleting && displayed.length === current.length) {
      timer.current = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timer.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 32);
    } else {
      timer.current = setTimeout(() => {
        setDeleting(false);
        setIdx((i) => (i + 1) % phrases.length);
      }, 0);
    }

    return () => clearTimeout(timer.current);
  }, [displayed, deleting, idx, phrases]);

  return (
    <span>
      <span style={{ color: "#0071e3" }}>{displayed}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        style={{ color: "#0071e3", marginLeft: 1 }}
      >
        |
      </motion.span>
    </span>
  );
}

/* ─────────────────────────── Word-by-word blur fade ─────────────────────────── */

function BlurWord({ word, delay, style }: { word: string; delay: number; style?: React.CSSProperties }) {
  return (
    <motion.span
      initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0, 0.2, 1] as [number, number, number, number] }}
      style={{ display: "inline-block", ...style }}
    >
      {word}
    </motion.span>
  );
}

/* ─────────────────────────── Scroll-linked reveal wrapper ─────────────────────────── */

function ScrollReveal({
  children,
  yOffset = 32,
  xOffset,
  style,
  className,
}: {
  children: React.ReactNode;
  yOffset?: number;
  xOffset?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end 20%"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.35], [xOffset !== undefined ? 0 : yOffset, 0]);
  const x = useTransform(scrollYProgress, [0, 0.35], [xOffset ?? 0, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, x, y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── Data ─────────────────────────── */

const MOCK_APPS = [
  { company: "Google",  role: "Software Engineer",  status: "Interviewing", date: "Apr 8, 2026",  color: "#4285F4" },
  { company: "Stripe",  role: "Backend Engineer",   status: "Applied",      date: "Apr 5, 2026",  color: "#635bff" },
  { company: "Figma",   role: "Product Designer",   status: "Offer",        date: "Apr 1, 2026",  color: "#f24e1e" },
  { company: "Vercel",  role: "Frontend Engineer",  status: "Interviewing", date: "Mar 28, 2026", color: "#111111" },
  { company: "Linear",  role: "Full Stack Engineer",status: "Applied",      date: "Mar 25, 2026", color: "#5e6ad2" },
];

function statusStyle(s: string) {
  if (s === "Offer")        return { bg: "#f0fdf4", text: "#16a34a", border: "rgba(22,163,74,0.22)" };
  if (s === "Rejected")     return { bg: "#fef2f2", text: "#dc2626", border: "rgba(220,38,38,0.22)" };
  if (s === "Interviewing") return { bg: "#fff7ed", text: "#d97706", border: "rgba(217,119,6,0.22)" };
  return                           { bg: "#eff6ff", text: "#2563eb", border: "rgba(37,99,235,0.22)" };
}

const FEATURE_CARDS = [
  {
    label: "MODULE 01",
    title: "Command\nCenter",
    desc: "Track every application with Kanban boards and pipeline analytics. Full visibility, zero spreadsheets. Know exactly where every opportunity stands.",
    hueA: 210, hueB: 235, accent: "#0071e3", Icon: BarChart3,
  },
  {
    label: "MODULE 02",
    title: "Resume\nForge AI",
    desc: "Feed it a job description and watch your resume transform. AI-powered bullet tailoring that maintains your authentic voice while maximizing ATS scores.",
    hueA: 265, hueB: 290, accent: "#8b5cf6", Icon: Sparkles,
  },
  {
    label: "MODULE 03",
    title: "Job Market\nDiscovery",
    desc: "Browse thousands of live roles from integrated job boards. One click sends any listing straight into your tracker with all metadata intact.",
    hueA: 150, hueB: 175, accent: "#10b981", Icon: Briefcase,
  },
  {
    label: "MODULE 04",
    title: "AI\nConcierge",
    desc: "Your personal career advisor available 24/7. Get interview coaching, strategy insights, and personalized guidance tailored to your exact pipeline.",
    hueA: 30, hueB: 52, accent: "#f59e0b", Icon: MessageSquare,
  },
] as const;

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your account",
    desc: "Sign up in seconds. Set your target roles, companies, and salary expectations. Your dashboard is ready immediately — no onboarding friction.",
    accent: "#0071e3",
  },
  {
    step: "02",
    title: "Track every application",
    desc: "Log applications with one tap. Move them through Kanban stages — Applied, Interviewing, Offer, Rejected. Export everything to CSV at any time.",
    accent: "#8b5cf6",
  },
  {
    step: "03",
    title: "Let AI accelerate your search",
    desc: "Use Resume Forge to tailor your CV for every role. Discover new jobs from integrated boards. Ask the AI Concierge anything — from salary negotiation to interview strategy.",
    accent: "#10b981",
  },
];

/* ─────────────────────────── Company Logo ─────────────────────────── */

function MockCompanyLogo({ name, color }: { name: string; color: string }) {
  const [failed, setFailed] = useState(false);
  const domain = name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
  return (
    <div style={{ width: 38, height: 38, borderRadius: 11, overflow: "hidden", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {failed ? (
        <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{name[0]}</span>
      ) : (
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          width={28}
          height={28}
          style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 4 }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── Application Tracker ─────────────────────────── */

function ApplicationTracker() {
  return (
    <section style={{ background: "#f5f5f7", padding: "140px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <ScrollReveal xOffset={-60} style={{ marginBottom: 72, textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#0071e3", marginBottom: 18 }}>
            Command Center
          </p>
          <h2 style={{ fontSize: "clamp(44px, 6vw, 80px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.02, color: "#1d1d1f", marginBottom: 24 }}>
            Your command center.
          </h2>
          <p style={{ fontSize: 20, color: "#6e6e73", maxWidth: 580, margin: "0 auto", lineHeight: 1.6 }}>
            Every application tracked, every stage visible, every move deliberate. Replace the chaos of spreadsheets with a single elegant dashboard that shows you exactly where you stand.
          </p>
        </ScrollReveal>

        <ScrollReveal xOffset={-80} className="liquid-glass-card" style={{ borderRadius: 28, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.5fr 1fr 0.85fr", padding: "18px 36px", background: "rgba(0,0,0,0.02)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            {["COMPANY", "ROLE", "STATUS", "APPLIED"].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#86868b" }}>{h}</span>
            ))}
          </div>

          {MOCK_APPS.map((app, i) => {
            const s = statusStyle(app.status);
            return (
              <ScrollReveal
                key={app.company}
                xOffset={-40}
                style={{ display: "grid", gridTemplateColumns: "1.1fr 1.5fr 1fr 0.85fr", padding: "22px 36px", borderBottom: i < MOCK_APPS.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", alignItems: "center" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <MockCompanyLogo name={app.company} color={app.color} />
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#1d1d1f" }}>{app.company}</span>
                </div>
                <span style={{ fontSize: 15, color: "#6e6e73" }}>{app.role}</span>
                <span style={{ display: "inline-flex", alignSelf: "center", width: "fit-content", padding: "5px 14px", borderRadius: 99, fontSize: 13, fontWeight: 500, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                  {app.status}
                </span>
                <span style={{ fontSize: 14, color: "#86868b" }}>{app.date}</span>
              </ScrollReveal>
            );
          })}
        </ScrollReveal>

        <ScrollReveal xOffset={-40} style={{ display: "flex", justifyContent: "center", gap: 64, marginTop: 56, flexWrap: "wrap" }}>
          {[{ value: "50+", label: "Applications tracked" }, { value: "4", label: "Pipeline stages" }, { value: "1-click", label: "CSV export" }].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 15, color: "#6e6e73", marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── Scroll-triggered Feature Card ─────────────────────────── */

const hue = (h: number) => `hsl(${h}, 75%, 88%)`;

const cardVariants: Variants = {
  offscreen: { y: 300 },
  onscreen: {
    y: 50, rotate: -8,
    transition: { type: "spring", bounce: 0.4, duration: 0.8 },
  },
};

function FeatureCard({ card }: { card: (typeof FEATURE_CARDS)[number] }) {
  const bg = `linear-gradient(140deg, ${hue(card.hueA)}, ${hue(card.hueB)})`;
  const { Icon } = card;

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", paddingTop: 20, marginBottom: -140, height: 540 }}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.3 }}
    >
      <div style={{ position: "absolute", inset: 0, background: bg, clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 480 430 C 480 441.046 471.046 450 460 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")` }} />
      <motion.div
        variants={cardVariants}
        className="liquid-glass-card"
        style={{ width: 340, minHeight: 460, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 36, borderRadius: 28, transformOrigin: "10% 60%" }}
      >
        <div>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <Icon style={{ width: 26, height: 26, color: card.accent }} />
          </div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase" as const, color: "#86868b", marginBottom: 10 }}>{card.label}</p>
          <h3 style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.07, color: "#1d1d1f", marginBottom: 18, whiteSpace: "pre-line" }}>{card.title}</h3>
          <p style={{ fontSize: 16, color: "#6e6e73", lineHeight: 1.65 }}>{card.desc}</p>
        </div>
        <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 600, color: card.accent, textDecoration: "none", marginTop: 24 }}>
          Explore <ArrowRight style={{ width: 14, height: 14 }} />
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────── How It Works Card ─────────────────────────── */

function HowItWorksCard({ step, i }: { step: (typeof HOW_IT_WORKS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 20%"] });
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.35], [48, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y, height: "100%" }}>
      <motion.div
        whileHover={{
          y: -12,
          boxShadow: `0 32px 72px rgba(0,0,0,0.11), 0 4px 16px rgba(0,0,0,0.06), 0 0 0 1.5px ${step.accent}35`,
          transition: { duration: 0.28, ease: "easeOut" },
        }}
        className="liquid-glass-card"
        style={{
          borderRadius: 32,
          padding: 60,
          borderTop: `3px solid ${step.accent}`,
          cursor: "default",
          height: "100%",
          boxSizing: "border-box" as const,
        }}
      >
        <motion.div
          animate={{ opacity: [0.16, 0.28, 0.16] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.05em", color: step.accent, lineHeight: 1, marginBottom: 32 }}
        >
          {step.step}
        </motion.div>
        <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.025em", color: "#1d1d1f", marginBottom: 16, lineHeight: 1.2 }}>
          {step.title}
        </h3>
        <p style={{ fontSize: 17, color: "#6e6e73", lineHeight: 1.75 }}>{step.desc}</p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────── Main Export ─────────────────────────── */

export function HeroSection() {
  const { scrollY } = useScroll();
  const bgY         = useTransform(scrollY, [0, 900], [0, 220]);
  const contentY    = useTransform(scrollY, [0, 900], [0, -90]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div style={{ background: "#ffffff", color: "#1d1d1f" }}>

      {/* ═══════════════ 1. HERO ═══════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "110px 40px 100px",
          overflow: "hidden",
        }}
      >
        {/* Parallax gradient orbs */}
        <motion.div style={{ y: bgY, position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-8%", left: "6%",  width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,113,227,0.08) 0%, transparent 68%)", filter: "blur(90px)" }} />
          <div style={{ position: "absolute", bottom: "5%", right: "0%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 68%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", top: "40%", right: "18%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 68%)", filter: "blur(70px)" }} />
        </motion.div>

        <motion.div style={{ y: contentY, opacity: heroOpacity, zIndex: 1, maxWidth: 1080, width: "100%", textAlign: "center" }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.2, 0, 0.2, 1] as [number, number, number, number] }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 14px", borderRadius: 99,
              background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.09)",
              fontSize: 10, fontWeight: 600, letterSpacing: "0.18em",
              textTransform: "uppercase" as const, color: "#6e6e73", marginBottom: 40,
            }}
          >
            <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7 }}>
              <span className="animate-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,113,227,0.5)" }} />
              <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: "#0071e3" }} />
            </span>
            V1.0 High Performance OS
          </motion.div>

          {/* Wide editorial headline — word-by-word blur fade */}
          <h1
            style={{
              fontSize: "clamp(36px, 5.4vw, 84px)",
              fontWeight: 300,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
              color: "#1d1d1f",
              marginBottom: 36,
            }}
          >
            <BlurWord word="The" delay={0.10} />{" "}
            <BlurWord word="luxury" delay={0.19} style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontWeight: 400 }} />{" "}
            <BlurWord word="command" delay={0.28} />{" "}
            <BlurWord word="center" delay={0.37} />
            <br />
            <BlurWord word="for" delay={0.46} />{" "}
            <BlurWord word="your" delay={0.55} />{" "}
            <BlurWord word="next" delay={0.64} />{" "}
            <BlurWord word="career" delay={0.73} style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontWeight: 400 }} />{" "}
            <BlurWord word="move." delay={0.82} />
          </h1>

          {/* Typewriter subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.22 }}
            style={{ fontSize: "clamp(15px, 1.4vw, 19px)", color: "#6e6e73", maxWidth: 560, margin: "0 auto 44px", lineHeight: 1.6, fontWeight: 400 }}
          >
            CareerOS helps you{" "}
            <Typewriter phrases={TYPEWRITER_PHRASES} />
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.32 }}
            style={{ marginBottom: 60 }}
          >
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "17px 34px", background: "#0071e3", color: "#ffffff", borderRadius: 99, fontSize: 17, fontWeight: 500, textDecoration: "none" }}
            >
              Get Started Free
              <ArrowRight style={{ width: 17, height: 17 }} />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            style={{ display: "flex", justifyContent: "center", gap: 36, flexWrap: "wrap" }}
          >
            {[
              { icon: CheckCircle, text: "Free to start" },
              { icon: Shield,      text: "Privacy first · RLS enforced" },
              { icon: Zap,         text: "4 AI-powered modules" },
              { icon: TrendingUp,  text: "Built for job seekers" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#6e6e73", fontWeight: 500 }}>
                <Icon style={{ width: 14, height: 14, color: "#0071e3", flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          style={{ position: "absolute", bottom: 44, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#a1a1aa" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #c7c7cc, transparent)" }}
          />
        </motion.div>
      </section>

      {/* ═══════════════ 2. APPLICATION TRACKER ═══════════════ */}
      <ApplicationTracker />

      {/* ═══════════════ 3. SCROLL-TRIGGERED FEATURE CARDS ═══════════════ */}
      <section style={{ background: "#ffffff", padding: "140px 24px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <ScrollReveal style={{ textAlign: "center", marginBottom: 96 }}>
            <h2 style={{ fontSize: "clamp(40px, 5.8vw, 80px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.03, color: "#1d1d1f", marginBottom: 22 }}>
              Everything you need<br />
              <span style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontWeight: 400 }}>
                to land the role.
              </span>
            </h2>
            <p style={{ fontSize: 19, color: "#6e6e73", lineHeight: 1.58, maxWidth: 520, margin: "0 auto" }}>
              Four purpose-built modules covering every phase of the modern job search — from first application to signed offer.
            </p>
          </ScrollReveal>

          <div style={{ paddingBottom: 340 }}>
            {FEATURE_CARDS.map((card) => (
              <FeatureCard key={card.label} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 4. HOW IT WORKS ═══════════════ */}
      <section style={{ background: "#f5f5f7", padding: "160px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <ScrollReveal style={{ textAlign: "center", marginBottom: 80 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#0071e3", marginBottom: 18 }}>
              How It Works
            </p>
            <h2 style={{ fontSize: "clamp(38px, 5vw, 70px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.04, color: "#1d1d1f", marginBottom: 20 }}>
              Up and running{" "}
              <span style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontWeight: 400 }}>
                in three steps.
              </span>
            </h2>
            <p style={{ fontSize: 19, color: "#6e6e73", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
              No complex setup, no long onboarding. CareerOS is designed to get out of your way. Just open it and start landing offers.
            </p>
          </ScrollReveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28, alignItems: "stretch" }}>
            {HOW_IT_WORKS.map((step, i) => (
              <HowItWorksCard key={step.step} step={step} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 5. QUOTE BLOCK ═══════════════ */}
      <section style={{ background: "#ffffff", padding: "160px 40px", textAlign: "center" }}>
        <ScrollReveal yOffset={40} style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ fontSize: "clamp(26px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.025em", lineHeight: 1.3, color: "#1d1d1f" }}>
            &ldquo;The job search is already hard enough.{" "}
            <span style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontWeight: 400 }}>
              CareerOS makes sure the tools aren&apos;t what hold you back.
            </span>
            &rdquo;
          </p>
          <p style={{ fontSize: 15, color: "#86868b", marginTop: 32, letterSpacing: "0.01em" }}>
            Built for serious job seekers who track their search like a professional.
          </p>
        </ScrollReveal>
      </section>

      {/* ═══════════════ 6. FINAL CTA ═══════════════ */}
      <section style={{ background: "#f5f5f7", padding: "160px 40px", textAlign: "center" }}>
        <ScrollReveal yOffset={36} style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(48px, 8vw, 140px)", fontWeight: 300, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#1d1d1f", marginBottom: 32 }}>
            Ready to land<br />
            <span style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontWeight: 400, color: "#0071e3" }}>
              your next role?
            </span>
          </h2>
          <p style={{ fontSize: 19, color: "#6e6e73", maxWidth: 560, margin: "0 auto 52px", lineHeight: 1.6 }}>
            CareerOS gives you the tracking, AI tools, and market data you need to run a professional, focused job search — from first application to signed offer.
          </p>
          <Link
            href="/login"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "20px 44px", background: "#0071e3", color: "#ffffff", borderRadius: 99, fontSize: 18, fontWeight: 500, textDecoration: "none" }}
          >
            Get Started Free
            <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
          <p style={{ fontSize: 14, color: "#86868b", marginTop: 24 }}>No credit card required · Free to use</p>
        </ScrollReveal>
      </section>

      {/* ═══════════════ 7. FOOTER ═══════════════ */}
      <footer style={{ padding: "48px 40px", borderTop: "1px solid rgba(0,0,0,0.08)", background: "#ffffff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 24, height: 24, background: "#0071e3", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 10, height: 10, background: "#fff", transform: "rotate(45deg)", borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#1d1d1f" }}>CareerOS</span>
            <span style={{ fontSize: 14, color: "#86868b" }}>© 2026</span>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            <a href="#" style={{ fontSize: 14, color: "#6e6e73", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: 14, color: "#6e6e73", textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
