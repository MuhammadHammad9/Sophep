"use client";

import { useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ChevronDown } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Magnetic from "@/components/ui/Magnetic";
import CountdownTimer from "@/components/ui/CountdownTimer";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const wordContainerVariants = {
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -20, scale: 0.95, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: EASE_OUT },
  }),
};

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 80 : 220]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, prefersReducedMotion ? 1.02 : 1.08]);
  const springY = useSpring(y, { stiffness: prefersReducedMotion ? 60 : 90, damping: 28 });

  const scrollToHighlights = useCallback(() => {
    document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section id="hero" className="relative min-h-dvh flex items-center overflow-hidden bg-[var(--color-bg)] -mt-16 lg:-mt-20">
      <motion.div className="absolute inset-0 z-0" style={{ y: springY, scale, opacity }}>
        <Image
          src="/giki-hero.png"
          alt="GIKI Campus — venue for GIMUN 25"
          fill
          className="object-cover brightness-[0.75] contrast-[1.05]"
          priority
          quality={82}
          sizes="100vw"
        />
        <div className="absolute inset-0 z-[1] bg-[rgba(6,1,15,0.35)] mix-blend-multiply" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/20 to-transparent" />
        <div className="absolute inset-0 z-[3] bg-gradient-to-r from-[var(--color-bg)]/70 via-transparent to-transparent" />
      </motion.div>

      <div className="relative z-10 container-sophep w-full pt-28 pb-20 lg:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80dvh] lg:min-h-dvh">
          <div className="flex flex-col items-start text-left">
            <motion.div
              custom={0.1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-px bg-[var(--color-primary)]" />
              <span className="font-sans text-[11px] uppercase tracking-[0.4em] font-semibold text-[var(--color-primary)]">
                SOPHEP presents
              </span>
            </motion.div>

            <motion.h1
              className="flex flex-col font-display text-[var(--color-fg)] mb-6"
              style={{ fontSize: "clamp(3rem, 10vw, 8.5rem)", lineHeight: 0.9, perspective: 1000 }}
              initial="hidden"
              animate="visible"
              variants={wordContainerVariants}
            >
              <div className="flex items-baseline gap-3 md:gap-5 flex-wrap">
                {["GIMUN"].map((word, idx) => (
                  <motion.span key={idx} variants={wordVariants} className="font-display uppercase font-bold">
                    {word}
                  </motion.span>
                ))}
                <motion.span variants={wordVariants} className="font-display italic opacity-50 font-light text-[clamp(2.5rem,6vw,5rem)] ml-1">
                  &
                </motion.span>
              </div>
              <div className="flex items-baseline gap-3 md:gap-5">
                {["GMC", "25"].map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={wordVariants}
                    className={word === "25" ? "font-display uppercase font-bold text-transparent bg-clip-text" : "font-display uppercase font-bold"}
                    style={word === "25" ? { backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-neo-cyan))" } : undefined}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.7, ease: EASE_OUT }}
              style={{ transformOrigin: "left" }}
              className="h-px w-24 md:w-32 bg-gradient-to-r from-[var(--color-primary)] to-transparent mb-8"
            />

            <motion.p
              variants={fadeUpVariants}
              custom={1.0}
              initial="hidden"
              animate="visible"
              className="font-sans text-[11px] md:text-[13px] uppercase tracking-[0.4em] font-medium mb-6 text-[var(--color-primary)]"
            >
              GIKI Model United Nations & Moot Cup
            </motion.p>

            <motion.p
              variants={fadeUpVariants}
              custom={1.2}
              initial="hidden"
              animate="visible"
              className="font-sans font-light text-base md:text-lg leading-relaxed max-w-lg mb-10 text-[var(--color-fg-muted)]"
            >
              Join Pakistan&apos;s foremost diplomatic and legal simulation. Empowering the next generation of global leaders and legal minds.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              custom={1.4}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 w-full sm:w-auto"
            >
              <Magnetic strength={0.12}>
                <Link href="/register" className="btn btn-primary btn-lg w-full sm:min-w-[220px] justify-center">
                  Register Now
                </Link>
              </Magnetic>
              <Magnetic strength={0.12}>
                <Link href="/#committees" className="btn btn-outline btn-lg w-full sm:min-w-[220px] justify-center">
                  Explore Committees
                </Link>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: EASE_OUT }}
            className="hidden lg:block"
          >
            <motion.div
              className="glass-card-elevated p-8 xl:p-10 relative overflow-hidden"
              whileHover={prefersReducedMotion ? {} : { y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            >
              <div className="absolute inset-0 rounded-[var(--radius-2xl)] pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, transparent 40%, rgba(0,240,255,0.08) 100%)" }} />

              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                  <span className="font-sans text-[11px] uppercase tracking-[0.3em] font-semibold text-[var(--color-fg-muted)]">
                    December 5-7, 2025
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-medium text-[var(--color-fg-subtle)]">Date</span>
                    <div className="font-display text-xl font-bold text-[var(--color-fg)]">5-7 Dec</div>
                  </div>
                  <div className="space-y-2">
                    <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-medium text-[var(--color-fg-subtle)]">Venue</span>
                    <div className="font-display text-xl font-bold text-[var(--color-fg)] flex items-center gap-2">
                      <MapPin size={15} className="text-[var(--color-primary)]" />
                      GIKI
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-[var(--color-border-hover)] via-[var(--color-border)] to-transparent" />

                <div>
                  <div className="mb-4">
                    <div className="font-sans text-[10px] uppercase tracking-[0.35em] font-medium text-[var(--color-fg-subtle)] mb-2">Countdown</div>
                    <CountdownTimer targetDate={new Date("2026-12-05T09:00:00+05:00")} />
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-[var(--color-border-hover)] via-[var(--color-border)] to-transparent" />

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 1500, suffix: "+", label: "Delegates" },
                    { value: 15, suffix: "+", label: "Committees" },
                    { value: 12, suffix: "", label: "Editions" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.5, ease: EASE_OUT }}
                    >
                      <span className="font-display font-bold text-xl text-[var(--color-fg)] flex items-center justify-center">
                        <AnimatedCounter value={stat.value} />
                        <span className="text-[var(--color-primary)]">{stat.suffix}</span>
                      </span>
                      <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUpVariants}
          custom={1.6}
          initial="hidden"
          animate="visible"
          className="lg:hidden mt-8 sm:mt-12 glass-card p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[var(--color-fg-subtle)]">
              Live Countdown
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[var(--color-primary)]">
              December 5-7
            </span>
          </div>
          <CountdownTimer targetDate={new Date("2026-12-05T09:00:00+05:00")} />
        </motion.div>
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 cursor-pointer bg-transparent border-0"
        aria-label="Scroll to conference highlights"
        onClick={scrollToHighlights}
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.5em] text-[var(--color-fg-muted)] group-hover:text-[var(--color-primary)] transition-colors duration-[var(--dur-fast)]">
          Discover
        </span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={20} className="text-[var(--color-primary)] opacity-60" strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </section>
  );
}
