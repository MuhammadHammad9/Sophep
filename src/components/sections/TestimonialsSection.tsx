"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import AnimateReveal from "@/components/ui/AnimateReveal";
import Magnetic from "@/components/ui/Magnetic";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Best Delegate",
    event: "GIMUN '24",
    quote:
      "The level of debate and the quality of the crisis committees at GIMUN are unparalleled. It truly pushed me to think on my feet and develop my diplomatic skills.",
  },
  {
    id: 2,
    name: "Ali Hassan",
    role: "Winning Counsel",
    event: "MOOT '23",
    quote:
      "SOPHEP's Moot Court provided the most realistic simulation of Supreme Court proceedings I've ever experienced. An absolute masterclass in legal argumentation.",
  },
  {
    id: 3,
    name: "Zainab Raza",
    role: "Chairperson",
    event: "UNSC '24",
    quote:
      "As a chair, the organizational excellence of the SOPHEP Secretariat made my job seamless. The standard of delegates was exceptionally high — a world-class experience.",
  },
  {
    id: 4,
    name: "Omar Farooq",
    role: "Head Delegate",
    event: "GIMUN '23",
    quote:
      "GIMUN transformed my perspective on international relations. The networking opportunities and the caliber of discussions were beyond anything I'd experienced before.",
  },
];

const AUTOPLAY_MS = 6000;

const contentVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 40 : -40,
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    y: direction < 0 ? 40 : -40,
    opacity: 0,
    filter: "blur(6px)",
  }),
};

const authorVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

export default function TestimonialsSection() {
  const [[page, direction], setPage] = useState([0, 0]);
  const constraintsRef = useRef(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const idx = ((page % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length;
  const current = TESTIMONIALS[idx];

  const paginate = useCallback((newDirection: number) => {
    setPage(([current]) => [current + newDirection, newDirection]);
  }, []);

  // Autoplay timer with CSS-driven progress
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      paginate(1);
    }, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [page, paginate]);

  const handlePaginate = useCallback(
    (dir: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      paginate(dir);
    },
    [paginate]
  );

  const handleDotClick = useCallback(
    (i: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPage([i, i > idx ? 1 : -1]);
    },
    [idx]
  );

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Background Accents */}
      <div
        className="glow-orb glow-orb-lg"
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.05,
        }}
      />

      <div className="container-sophep relative z-10">
        {/* Header */}
        <AnimateReveal className="text-center mb-16">
          <span className="section-eyebrow">The Delegate Experience</span>
          <h2 className="section-title mb-4">
            Words from the{" "}
            <span className="text-[var(--color-primary)]">Best &amp; Brightest</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Hear from delegates, chairs, and legal minds who have been part of the SOPHEP journey.
          </p>
        </AnimateReveal>

        {/* Carousel — static card with animated content */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={constraintsRef}
            className="glass-card-elevated p-8 md:p-14 relative overflow-hidden"
            style={{ minHeight: "320px" }}
          >
            {/* Animated quote icon — stays persistent, pulses on change */}
            <motion.div
              className="absolute top-8 left-8 md:top-10 md:left-10"
              key={`quote-icon-${page}`}
              initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Quote
                size={48}
                className="text-[var(--color-primary)] opacity-15"
                strokeWidth={1}
              />
            </motion.div>

            {/* Content — animated on slide change */}
            <div className="relative z-10 pt-8">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.25 },
                    filter: { duration: 0.3 },
                  }}
                >
                  <p className="font-sans text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-[var(--color-fg)] italic mb-10">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Author — separate animation for stagger effect */}
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={`author-${page}`}
                  custom={direction}
                  variants={authorVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30, delay: 0.08 },
                    opacity: { duration: 0.25, delay: 0.08 },
                  }}
                  className="flex items-center gap-4"
                >
                  {/* Avatar circle */}
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg"
                    style={{
                      background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                      color: "#fff",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 0 0px rgba(139, 92, 246, 0.4)",
                        "0 0 0 10px rgba(139, 92, 246, 0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {current.name.charAt(0)}
                  </motion.div>

                  <div>
                    <h4 className="font-sans font-bold text-[var(--color-fg)] text-sm tracking-wide uppercase">
                      {current.name}
                    </h4>
                    <p className="font-sans text-[11px] uppercase tracking-wider text-[var(--color-primary)] mt-0.5">
                      {current.role} — {current.event}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar — CSS animated */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
              <div
                key={page}
                className="h-full rounded-r-full origin-left"
                style={{
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  boxShadow: "0 0 12px rgba(139,92,246,0.5), 0 0 4px rgba(139,92,246,0.3)",
                  animation: `progress-fill ${AUTOPLAY_MS}ms linear forwards`,
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {/* Prev */}
            <Magnetic strength={0.15}>
              <motion.button
                onClick={() => handlePaginate(-1)}
                className="w-11 h-11 rounded-full border border-[var(--color-border-hover)] flex items-center justify-center text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 cursor-pointer"
                aria-label="Previous testimonial"
                whileHover={{ scale: 1.1, rotate: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </motion.button>
            </Magnetic>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === idx
                      ? "bg-[var(--color-primary)] w-6 h-2"
                      : "bg-[var(--color-border-hover)] hover:bg-[var(--color-fg-subtle)] w-2 h-2"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  layout
                />
              ))}
            </div>

            {/* Next */}
            <Magnetic strength={0.15}>
              <motion.button
                onClick={() => handlePaginate(1)}
                className="w-11 h-11 rounded-full border border-[var(--color-border-hover)] flex items-center justify-center text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all duration-300 cursor-pointer"
                aria-label="Next testimonial"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </motion.button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
