"use client";

import { useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import AnimateReveal from "@/components/ui/AnimateReveal";
import Magnetic from "@/components/ui/Magnetic";

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

// ─── Particle generation ─────────────────────────────────────────────────────
// Particles are generated ONCE at module load — Math.random() must never be
// called inside a render function because it violates component purity.

const PARTICLE_COUNT = 15;

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animateY: -(100 + Math.random() * 100),
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 5,
  }));
}

// Stable reference — created once, never re-created during render.
const PARTICLES: Particle[] = generateParticles();

const PARTICLE_BACKGROUND =
  "radial-gradient(circle, rgba(212,175,55,0.8) 0%, transparent 100%)";

const HERO_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Component ───────────────────────────────────────────────────────────────

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.15]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  // Word-reveal variants — defined inside component is fine because they only
  // depend on static data (no Math.random, no impure calls).
  const wordContainerVariants = useMemo(
    () => ({
      visible: {
        transition: { staggerChildren: 0.15, delayChildren: 0.25 },
      },
    }),
    []
  );

  const wordVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 40, rotateX: -20 },
      visible: { opacity: 1, y: 0, rotateX: 0 },
    }),
    []
  );

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* ── Background Image — Cinematic Depth ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: springY, scale, opacity }}
      >
        <Image
          src="/giki-hero.png"
          alt="GIKI Campus"
          fill
          className="object-cover grayscale brightness-[0.7]"
          priority
          quality={100}
        />
        {/* Deep Atmospheric Overlays */}
        <div className="absolute inset-0 z-[1] bg-[rgba(5,2,10,0.7)] mix-blend-multiply" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-transparent via-black/40 to-black" />
      </motion.div>

      {/* ── Grain / Noise Overlay removed for performance as it is handled globally ── */}

      {/* ── Volumetric Glow Orb ── */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] z-[4] pointer-events-none opacity-20 blur-[120px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
        }}
      />

      {/* ── Gold Particles ── */}
      <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: p.width,
              height: p.height,
              background: PARTICLE_BACKGROUND,
              left: p.left,
              top: p.top,
            }}
            animate={{ y: [0, p.animateY], opacity: [0, 0.8, 0] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 container-sophep flex flex-col items-center text-center pt-20">

        {/* Main Headline */}
        <div className="mb-6 w-full flex flex-col items-center justify-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.4em", y: 10 }}
            animate={{ opacity: 1, letterSpacing: "0.2em", y: 0 }}
            transition={{ delay: 0.1, duration: 1.2, ease: HERO_EASE }}
            className="font-serif text-sm md:text-base uppercase tracking-[0.2em] mb-6 opacity-80"
            style={{ color: "var(--color-primary)" }}
          >
            SOPHEP presents
          </motion.p>

          {/* Staggered Word Reveal */}
          <motion.div
            className="flex flex-row items-center justify-center gap-3 md:gap-6 flex-wrap font-display text-white"
            style={{ fontSize: "clamp(3rem, 9vw, 8rem)", lineHeight: 1 }}
            initial="hidden"
            animate="visible"
            variants={wordContainerVariants}
          >
            {["GIMUN", "&", "GMC", "25"].map((word, idx) => (
              <motion.span
                key={idx}
                variants={wordVariants}
                transition={{ duration: 1, ease: HERO_EASE }}
                className={
                  word === "&"
                    ? "font-script italic opacity-60 font-light text-[clamp(2.5rem,7vw,6rem)]"
                    : "font-display uppercase font-bold"
                }
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Thin rule accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.1, duration: 1.0, ease: HERO_EASE }}
            style={{ transformOrigin: "center" }}
            className="mt-6 h-px w-48 md:w-72 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>

        {/* Sub-headline */}
        <AnimateReveal delay={1.2} variant="none">
          <p
            className="font-sans font-medium tracking-[0.5em] uppercase mb-12"
            style={{
              fontSize: "clamp(0.8rem, 2vw, 1.2rem)",
              color: "var(--color-primary)",
            }}
          >
            GIKI Model United Nations &amp; Moot Cup
          </p>
        </AnimateReveal>

        {/* Tagline */}
        <AnimateReveal
          delay={1.4}
          staggerChildren={0.1}
          className="max-w-3xl mx-auto mb-16"
        >
          <p
            className="font-sans font-light leading-relaxed opacity-70"
            style={{
              fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
              color: "#F5F5F0",
            }}
          >
            Join Pakistan&apos;s foremost diplomatic and legal simulation.
            <br className="hidden md:block" />
            Empowering the next generation of global leaders and legal minds.
          </p>
        </AnimateReveal>

        {/* Stats Row */}
        <AnimateReveal
          delay={1.6}
          staggerChildren={0.2}
          className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-24 mb-24"
        >
          <div className="flex flex-col items-center group">
            <span
              className="font-sans font-bold text-3xl md:text-4xl"
              style={{ color: "#FFFFFF" }}
            >
              05-07 DEC
            </span>
            <span
              className="font-sans text-[10px] uppercase tracking-[0.4em] mt-4 opacity-40 font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              CONFERENCE DATES
            </span>
          </div>

          <div className="hidden md:block w-px h-16 bg-white/10" />

          <div className="flex flex-col items-center group">
            <span
              className="font-sans font-bold text-3xl md:text-4xl flex items-center"
              style={{ color: "#FFFFFF" }}
            >
              <AnimatedCounter value={1500} />+
            </span>
            <span
              className="font-sans text-[10px] uppercase tracking-[0.4em] mt-4 opacity-40 font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              ACTIVE DELEGATES
            </span>
          </div>

          <div className="hidden md:block w-px h-16 bg-white/10" />

          <div className="flex flex-col items-center group">
            <span
              className="font-sans font-bold text-3xl md:text-4xl flex items-center"
              style={{ color: "#FFFFFF" }}
            >
              <AnimatedCounter value={200} />+
            </span>
            <span
              className="font-sans text-[10px] uppercase tracking-[0.4em] mt-4 opacity-40 font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              INSTITUTIONS
            </span>
          </div>
        </AnimateReveal>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 1, ease: HERO_EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <Magnetic strength={0.15}>
            <Link href="/register" className="btn btn-primary btn-lg min-w-[280px]">
              Register Now
            </Link>
          </Magnetic>

          <Magnetic strength={0.15}>
            <Link href="/committees" className="btn btn-outline btn-lg min-w-[280px]">
              Committees
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
