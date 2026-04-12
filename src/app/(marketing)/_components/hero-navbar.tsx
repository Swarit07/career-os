"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function HeroNavbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] as [number, number, number, number] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: 52,
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            background: "#0071e3",
            borderRadius: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              background: "#ffffff",
              transform: "rotate(45deg)",
              borderRadius: 2,
            }}
          />
        </div>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#1d1d1f",
            letterSpacing: "-0.01em",
          }}
        >
          CareerOS
        </span>
      </Link>

      {/* CTA */}
      <Link
        href="/login"
        style={{
          padding: "7px 18px",
          background: "#0071e3",
          color: "#ffffff",
          borderRadius: 99,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
          transition: "background 0.15s",
        }}
      >
        Get Started
      </Link>
    </motion.nav>
  );
}
