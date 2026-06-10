"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export default function PageProgress() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 40 : 80,
    damping: prefersReducedMotion ? 40 : 28,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-px bg-primary/70 z-[60] origin-left pointer-events-none"
      style={{ scaleX }}
    />
  );
}
