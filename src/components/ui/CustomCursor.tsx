"use client";

import { useEffect } from "react";
import { motion, useSpring, useMotionValue, useReducedMotion } from "framer-motion";

export default function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0);
  const innerScale = useMotionValue(0.4);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is touch capable
    if (
      prefersReducedMotion ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 1024
    ) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (opacity.get() === 0) opacity.set(1);
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") || 
        target.closest("button") ||
        target.closest(".cursor-pointer") ||
        target.closest(".cursor-grab")
      ) {
        scale.set(2);
        innerScale.set(0.3);
      } else {
        scale.set(1);
        innerScale.set(0.4);
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleHoverStart, { passive: true });
    document.addEventListener("mouseleave", () => opacity.set(0), { passive: true });
    document.addEventListener("mouseenter", () => opacity.set(1), { passive: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleHoverStart);
    };
  }, [cursorX, cursorY, scale, innerScale, opacity, prefersReducedMotion]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[40] border border-primary/70 will-change-transform hidden xl:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        scale,
        opacity,
        backgroundColor: "rgba(124, 58, 237, 0.1)", // Subtle primary tint
      }}
      transition={{ scale: { type: "spring", stiffness: 220, damping: 24 } }}
    >
      <motion.div 
        className="absolute inset-0 bg-primary rounded-full"
        style={{ scale: innerScale }}
      />
    </motion.div>
  );
}
