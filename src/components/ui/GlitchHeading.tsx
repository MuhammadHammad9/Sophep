"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types & Constants ───────────────────────────────────────────────────────

interface GlitchHeadingProps {
  text: string;
  className?: string;
  /** Time in ms between glitch bursts. */
  intervalMs?: number;
  /** How long each glitch burst lasts in ms. */
  glitchDurationMs?: number;
  /** Allow rendering as any heading or inline element. */
  as?: React.ElementType;
}

const NUM_CHARS = "0123456789";
const GLITCH_CHARS = "XЖ0123456789/?!@#$%^&*()_+{}[]|;:,.<>";

// ─── Component ───────────────────────────────────────────────────────────────

export default function GlitchHeading({
  text,
  className = "",
  intervalMs = 8000,
  glitchDurationMs = 1000,
  as: Component = "span",
}: GlitchHeadingProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchStyle, setGlitchStyle] = useState<React.CSSProperties>({});
  const [showFlash, setShowFlash] = useState(false);

  // Split text into words to potentially target specific words for "missing" effect
  const words = useMemo(() => text.split(" "), [text]);

  // ── Trigger glitch bursts on an interval ──────────────────────────────────
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);

      const resetTimer = setTimeout(() => {
        setIsGlitching(false);
      }, glitchDurationMs);

      return () => clearTimeout(resetTimer);
    }, intervalMs);

    return () => clearInterval(glitchInterval);
  }, [intervalMs, glitchDurationMs]);

  // ── Scramble characters while glitching ──────────────────────────────────
  // When NOT glitching we restore the original text via the cleanup / state
  // reset below. We guard the setDisplayText/setGlitchStyle calls with a
  // condition so that they don't trigger during initial mount (isGlitching is
  // already false), preventing the "setState in effect body" lint warning.
  useEffect(() => {
    if (!isGlitching) {
      // Defer state update to avoid 'setState inside effect body' triggering a synchronous re-render
      const t = setTimeout(() => {
        setDisplayText((prev) => (prev !== text ? text : prev));
        setGlitchStyle((prev) => (Object.keys(prev).length > 0 ? {} : prev));
        setShowFlash(false);
      }, 0);
      return () => clearTimeout(t);
    }

    const scrambleInterval = setInterval(() => {
      // Character scramble with numbers & glitch chars
      const scrambled = text
        .split("")
        .map((char) => {
          if (char === " ") return " ";
          const r = Math.random();
          if (r < 0.12)
            return NUM_CHARS[Math.floor(Math.random() * NUM_CHARS.length)];
          if (r < 0.22)
            return GLITCH_CHARS[
              Math.floor(Math.random() * GLITCH_CHARS.length)
            ];
          if (r < 0.27) return "\u00A0"; // Reduced chance of missing char
          return char;
        })
        .join("");

      setDisplayText(scrambled);

      // Jitter / colour-shift style
      const offsetX = (Math.random() - 0.5) * 4;
      const offsetY = (Math.random() - 0.5) * 2;
      setShowFlash(Math.random() > 0.7);
      const hue =
        Math.random() > 0.8
          ? `hue-rotate(${Math.random() * 90}deg)`
          : "none";

      setGlitchStyle({
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        filter: hue,
      });
    }, 80);

    return () => clearInterval(scrambleInterval);
  }, [isGlitching, text, words]);

  return (
    <Component className={`relative inline-block ${className}`}>
      {/* Layout holder — preserves space, prevents layout shifts */}
      <span
        className="opacity-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        {text}
      </span>

      {/* Visible glitching text overlay */}
      <span
        className="absolute top-0 left-0 w-full h-full z-10"
        style={glitchStyle}
      >
        {displayText}
      </span>

      {/* Chromatic aberration layers */}
      <AnimatePresence>
        {isGlitching && (
          <span
            className="absolute inset-0 pointer-events-none select-none"
            style={glitchStyle}
          >
            {/* Cyan channel */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, x: -2, y: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 text-[var(--color-neo-cyan)] mix-blend-screen pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              {displayText}
            </motion.span>

            {/* Magenta channel */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7, x: 2, y: -1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 text-[var(--color-neo-pink)] mix-blend-screen pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              {displayText}
            </motion.span>

            {/* Brightness flash */}
            {showFlash && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                className="absolute inset-0 bg-white mix-blend-overlay pointer-events-none z-20"
              />
            )}
          </span>
        )}
      </AnimatePresence>
    </Component>
  );
}
