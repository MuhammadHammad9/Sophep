"use client";

import React, { useRef, ReactNode, ElementType } from "react";
import { motion, useInView } from "framer-motion";
import type { Variants, Transition } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────

type EaseTuple = [number, number, number, number];

const EASE: EaseTuple = [0.22, 1, 0.36, 1];

interface AnimateRevealProps {
  children: ReactNode;
  variant?: "fadeUp" | "fadeRight" | "fadeLeft" | "scaleUp" | "none";
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  className?: string;
  once?: boolean;
  as?: ElementType;
}

// ─── Variant Definitions ─────────────────────────────────────────────────────
// Defined at module scope — these objects are stable across renders.

const variantMap: Record<NonNullable<AnimateRevealProps["variant"]>, Variants> =
  {
    fadeUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    fadeRight: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
    fadeLeft: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.98 },
      visible: { opacity: 1, scale: 1 },
    },
    none: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  };

const AnimateReveal = ({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.8,
  staggerChildren,
  className = "",
  once = true,
  as: Component = "div",
}: AnimateRevealProps) => {
  const MotionComponent = (typeof Component === "string" ? motion[Component as keyof typeof motion] : motion(Component as any)) as any;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.05 }}
      variants={variantMap[variant]}
      transition={{ duration, delay, ease: EASE, staggerChildren }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export default AnimateReveal;
