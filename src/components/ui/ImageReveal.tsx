"use client";

import { motion, useInView } from "framer-motion";
import type { Variants, Transition } from "framer-motion";
import { useRef, ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  backgroundColor?: string;
}

// ─── Ease Curve ──────────────────────────────────────────────────────────────
// Framer Motion's Easing type accepts a 4-tuple for cubic-bezier curves.
// `as const` freezes the inferred type from number[] → [number, number, number, number].

const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Component ───────────────────────────────────────────────────────────────

export default function ImageReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  backgroundColor = "var(--color-primary)",
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  // ── Reveal overlay (slides away to expose the image) ─────────────────────
  const revealVariants: Variants = {
    hidden: {
      scaleY: direction === "up" || direction === "down" ? 1 : 0,
      scaleX: direction === "left" || direction === "right" ? 1 : 0,
      originY: direction === "up" ? 1 : 0,
      originX: direction === "left" ? 1 : 0,
    },
    visible: {
      scaleY: direction === "up" || direction === "down" ? 0 : 1,
      scaleX: direction === "left" || direction === "right" ? 0 : 1,
    },
  };

  const revealTransition: Transition = {
    duration: 0.8,
    ease: EASE,
    delay,
  };

  // ── Image zoom-in reveal ──────────────────────────────────────────────────
  const imageVariants: Variants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  const imageTransition: Transition = {
    duration: 1.2,
    ease: EASE,
    delay: delay + 0.1,
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={imageTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>

      {/* Overlay that slides away to reveal the image */}
      <motion.div
        variants={revealVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={revealTransition}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ backgroundColor }}
      />
    </div>
  );
}
