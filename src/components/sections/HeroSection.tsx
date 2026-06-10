"use client";

import { useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ChevronDown } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Magnetic from "@/components/ui/Magnetic";
import CountdownTimer from "@/components/ui/CountdownTimer";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Particle {
  width: string;
  height: string;
  left: string;
  top: string;
  animateY: number;
  duration: number;
  delay: number;
}

// ─── Particles — fewer and subtler ───────────────────────────────────────────

const PARTICLE_COUNT = 4;

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    width: `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animateY: -(80 + Math.random() * 80),
    duration: Math.random() * 6 + 6,
    delay: Math.random() * 5,
  }));
}

const PARTICLE_BG = "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 100%)";
const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Component ───────────────────────────────────────────────────────────────

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 80 : 220]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, prefersReducedMotion ? 1.02 : 1.08]);
  const springY = useSpring(y, { stiffness: prefersReducedMotion ? 60 : 90, damping: 28 });

  const particles = useMemo(
    () => (prefersReducedMotion ? [] : generateParticles()),
    [prefersReducedMotion]
  );

  const wordContainerVariants = useMemo(
    () => ({
      visible: {
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
      },
    }),
    []
  );

  const wordVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 70, rotateX: -30, scale: 0.95 },
      visible: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
    }),
    []
  );

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center overflow-hidden bg-black"
    >
      {/* ── Background Image ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: springY, scale, opacity }}
      >
        <Image
          src="/giki-hero.png"
          alt="GIKI Campus — venue for GIMUN 25"
          fill
          className="object-cover brightness-[0.75] contrast-[1.05]"
          priority
          quality={82}
        />
        <div className="absolute inset-0 z-[1] bg-[rgba(6,1,15,0.35)] mix-blend-multiply" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 z-[3] bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      </motion.div>

      {/* ── Ambient Glow Orbs ── */}
      <div
        className="glow-orb glow-orb-lg z-[3]"
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          top: "10%",
          left: "5%",
          opacity: 0.12,
        }}
      />
      <div
        className="glow-orb glow-orb-md z-[3]"
        style={{
          background: "radial-gradient(circle, var(--color-neo-cyan) 0%, transparent 70%)",
          bottom: "20%",
          right: "10%",
          opacity: 0.06,
        }}
      />

      {/* ── Particles ── */}
      <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: p.width,
                height: p.height,
                background: PARTICLE_BG,
                left: p.left,
                top: p.top,
              }}
              animate={{ y: [0, p.animateY], opacity: [0, 0.45, 0] }}
              transition={{
                duration: p.duration * 1.15,
                repeat: Infinity,
                ease: "linear",
                delay: p.delay,
              }}
            />
          ))}
      </div>

      {/* ── Main Content — Split Layout ── */}
      <div className="relative z-10 container-sophep w-full pt-32 pb-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80dvh] lg:min-h-dvh">
          
          {/* LEFT — Typography Block */}
          <div className="flex flex-col items-start text-left">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1, ease: HERO_EASE }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-[1px] bg-[var(--color-primary)]" />
              <span
                className="font-sans text-[11px] uppercase tracking-[0.4em] font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                SOPHEP presents
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="flex flex-col font-display text-white mb-6"
              style={{ fontSize: "clamp(3rem, 10vw, 8.5rem)", lineHeight: 0.90, perspective: 1000 }}
              initial="hidden"
              animate="visible"
              variants={wordContainerVariants}
            >
              <div className="flex items-baseline gap-3 md:gap-5 flex-wrap">
                {["GIMUN"].map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={wordVariants}
                    transition={{ duration: 0.9, ease: HERO_EASE }}
                    className="font-display uppercase font-bold"
                  >
                    {word}
                  </motion.span>
                ))}
                <motion.span
                  variants={wordVariants}
                  transition={{ duration: 0.9, ease: HERO_EASE }}
                  className="font-script italic opacity-50 font-light text-[clamp(2.5rem,6vw,5rem)] ml-1"
                >
                  &
                </motion.span>
              </div>
              <div className="flex items-baseline gap-3 md:gap-5">
                {["GMC", "25"].map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={wordVariants}
                    transition={{ duration: 0.9, ease: HERO_EASE }}
                    className={
                      word === "25"
                        ? "font-display uppercase font-bold text-transparent bg-clip-text"
                        : "font-display uppercase font-bold"
                    }
                    style={
                      word === "25"
                        ? {
                            backgroundImage:
                              "linear-gradient(135deg, var(--color-primary), var(--color-neo-cyan))",
                          }
                        : undefined
                    }
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.h1>

            {/* Accent Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.8, ease: HERO_EASE }}
              style={{ transformOrigin: "left" }}
              className="h-[2px] w-24 md:w-32 bg-gradient-to-r from-[var(--color-primary)] to-transparent mb-8"
            />

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: HERO_EASE }}
              className="font-sans text-[11px] md:text-[13px] uppercase tracking-[0.4em] font-medium mb-6"
              style={{ color: "var(--color-primary)" }}
            >
              GIKI Model United Nations & Moot Cup
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: HERO_EASE }}
              className="font-sans font-light text-base md:text-lg leading-relaxed max-w-lg mb-10"
              style={{ color: "rgba(245,245,240,0.7)" }}
            >
              Join Pakistan&apos;s foremost diplomatic and legal simulation.
              Empowering the next generation of global leaders and legal minds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8, ease: HERO_EASE }}
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

          {/* RIGHT — Glass Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.0, duration: 1.2, ease: HERO_EASE }}
            className="hidden lg:block"
          >
            <div className="glass-card-elevated p-8 xl:p-10 relative overflow-hidden">
              {/* Animated gradient border glow */}
              <div
                className="absolute inset-0 rounded-[var(--radius-2xl)] pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, transparent 40%, rgba(0,240,255,0.08) 100%)",
                }}
              />

              {/* Event Date & Venue */}
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                  <span className="font-sans text-[11px] uppercase tracking-[0.3em] font-semibold text-[var(--color-fg-muted)]">
                    Conference Details
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-medium text-[var(--color-fg-subtle)]">Date</span>
                    <p className="font-display text-2xl font-bold text-[var(--color-fg)] uppercase">Dec 05–07</p>
                    <p className="font-sans text-[11px] text-[var(--color-fg-muted)]">2026</p>
                  </div>
                  <div className="space-y-2">
                    <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-medium text-[var(--color-fg-subtle)]">Venue</span>
                    <p className="font-display text-2xl font-bold text-[var(--color-fg)] uppercase">GIK Institute</p>
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-[var(--color-primary)]" />
                      <p className="font-sans text-[11px] text-[var(--color-fg-muted)]">Topi, KPK</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-gradient-to-r from-[var(--color-border-hover)] via-[var(--color-border)] to-transparent" />

                {/* Countdown */}
                <div>
                  <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-medium text-[var(--color-fg-subtle)] block mb-4">
                    Countdown
                  </span>
                  <CountdownTimer />
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-gradient-to-r from-[var(--color-border-hover)] via-[var(--color-border)] to-transparent" />

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 1500, suffix: "+", label: "Delegates" },
                    { value: 15, suffix: "+", label: "Committees" },
                    { value: 12, suffix: "", label: "Editions" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <span className="font-display font-bold text-xl text-[var(--color-fg)] flex items-center justify-center">
                        <AnimatedCounter value={stat.value} />
                        <span className="text-[var(--color-primary)]">{stat.suffix}</span>
                      </span>
                      <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Countdown — shown only on mobile/tablet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: HERO_EASE }}
          className="lg:hidden mt-8 sm:mt-12 glass-card p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Calendar size={14} className="text-[var(--color-primary)]" />
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-semibold text-[var(--color-fg-muted)]">
                Dec 05–07, 2026
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-[var(--color-primary)]" />
              <span className="font-sans text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
                GIK Institute
              </span>
            </div>
          </div>
          <CountdownTimer />
        </motion.div>
      </div>

      {/* Scroll Down Cue */}
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 cursor-pointer group bg-transparent border-0"
        aria-label="Scroll to conference highlights"
        onClick={() => {
          document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.5em] text-[var(--color-fg-muted)] group-hover:text-[var(--color-primary)] transition-colors duration-300">
          Discover
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-[var(--color-primary)] opacity-60" strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </section>
  );
}
