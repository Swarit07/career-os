"use client";

import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

const containerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: { staggerChildren: staggerDelay },
  }),
};

const wordVariants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 8 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function BlurText({ text, className, delay = 0, staggerDelay = 0.08 }: BlurTextProps) {
  const words = text.split(" ");
  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={staggerDelay}
      style={{ display: "inline", ...(delay > 0 ? { transitionDelay: `${delay}s` } : {}) }}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariants} style={{ display: "inline-block", whiteSpace: "pre" }}>
          {word}{i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
