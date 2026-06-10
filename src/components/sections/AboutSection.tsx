"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScroll, useTransform, motion, useMotionValue, useSpring } from "framer-motion";
import AnimateReveal from "@/components/ui/AnimateReveal";
import Magnetic from "@/components/ui/Magnetic";

const PILLARS = [
  { label: "Diplomacy", color: "var(--color-primary)", desc: "Engage in meaningful discourse on global issues" },
  { label: "Leadership", color: "var(--color-gold)", desc: "Develop skills for the world stage" },
  { label: "Debate", color: "var(--color-neo-cyan)", desc: "Master argumentation and persuasion" },
];

const MILESTONES = [
  { year: "2012", label: "Founded" },
  { year: "2016", label: "International" },
  { year: "2020", label: "Virtual Pivot" },
  { year: "2024", label: "1500 Delegates" },
  { year: "2025", label: "GIMUN 25" },
];

function PillarTag({ pillar }: { pillar: (typeof PILLARS)[number] }) {
  return (
    <Magnetic strength={0.12}>
      <motion.div
        className="group relative font-sans text-[10px] uppercase tracking-[0.25em] font-semibold px-4 py-2.5 rounded-full border cursor-default transition-all duration-300"
        style={{
          color: pillar.color,
          borderColor: `${pillar.color}35`,
          backgroundColor: `${pillar.color}08`,
        }}
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        title={pillar.desc}
      >
        {pillar.label}
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-[var(--color-bg-overlay)] border border-[var(--color-border)] text-[9px] normal-case tracking-normal font-normal text-[var(--color-fg-muted)] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
          role="tooltip"
        >
          {pillar.desc}
        </span>
      </motion.div>
    </Magnetic>
  );
}

function TimelineItem({ milestone, index, total }: { milestone: typeof MILESTONES[0]; index: number; total: number }) {
  const isLast = index === total - 1;
  const isActive = isLast;

  return (
    <motion.div
      key={milestone.year}
      className="flex items-center gap-4 md:gap-8 shrink-0"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-1.5 group cursor-default">
        <motion.span
          className="font-display font-bold text-sm md:text-base"
          style={{
            color: isActive ? "var(--color-primary)" : "var(--color-fg)",
          }}
          whileHover={{ scale: 1.1, color: "var(--color-primary)" }}
          transition={{ duration: 0.2 }}
        >
          {milestone.year}
        </motion.span>
        <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] whitespace-nowrap">
          {milestone.label}
        </span>
      </div>
      {!isLast && (
        <motion.div
          className="w-8 md:w-12 h-[1px] bg-[var(--color-border)] origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </motion.div>
  );
}

export default function AboutSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const imageYSecondary = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="overflow-hidden relative scroll-mt-24"
      style={{
        paddingTop: "var(--section-py-lg)",
        paddingBottom: "var(--section-py-lg)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Background glow */}
      <div
        className="glow-orb glow-orb-lg"
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          top: "-10%",
          right: "-10%",
          opacity: 0.08,
        }}
      />

      <div className="container-sophep relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Content */}
          <div>
            <AnimateReveal className="mb-10">
              <span className="section-eyebrow">About The Conference</span>
              <h2 className="section-title mb-6">
                A Legacy of
                <br />
                <span className="text-[var(--color-primary)]">Leadership</span>
              </h2>
              <div className="w-16 h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
            </AnimateReveal>

            <AnimateReveal staggerChildren={0.12}>
              <div className="space-y-6 max-w-xl mb-10">
                <p
                  className="font-sans font-light text-lg md:text-xl leading-[1.85] drop-cap"
                  style={{ color: "var(--color-fg)" }}
                >
                  SOPHEP is one of Pakistan&apos;s most prestigious university
                  conference ecosystems, promoting diplomacy, leadership, and
                  global awareness through immersive simulations.
                </p>
                <p
                  className="font-sans font-light text-base md:text-lg leading-[1.85]"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  Our mission is to empower the next generation of global leaders.
                  We bring together brilliant minds from across the country to
                  engage in meaningful dialogue on critical global issues.
                </p>
              </div>

              {/* Pillar Tags */}
              <div className="flex flex-wrap gap-3 mb-10">
                {PILLARS.map((p) => (
                  <PillarTag key={p.label} pillar={p} />
                ))}
              </div>

              <Magnetic strength={0.15}>
                <Link href="/about" className="btn btn-outline btn-lg inline-flex">
                  Learn More About SOPHEP
                </Link>
              </Magnetic>
            </AnimateReveal>
          </div>

          {/* Mobile — single featured image */}
          <div className="relative h-[280px] sm:h-[360px] w-full rounded-2xl overflow-hidden border border-[var(--color-border)] lg:hidden">
            <Image
              src="/media-3.png"
              alt="SOPHEP Conference — delegates in session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 font-sans text-[9px] uppercase tracking-[0.3em] text-white/80 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              15 Years of Excellence
            </span>
          </div>

          {/* Right — Stacked Image Layout (desktop) */}
          <div className="relative h-[500px] lg:h-[640px] w-full hidden lg:block">
            {/* Primary Image */}
            <motion.div
              style={{ y: imageY, rotate: imageRotate }}
              className="absolute top-0 right-0 w-[85%] h-[65%] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
            >
              <AnimateReveal variant="scaleUp" className="w-full h-full">
                <Image
                  src="/media-3.png"
                  alt="SOPHEP Conference — delegates in session"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  style={{ filter: "grayscale(20%)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </AnimateReveal>
            </motion.div>

            {/* Secondary Image — offset */}
            <motion.div
              style={{ y: imageYSecondary }}
              className="absolute bottom-0 left-0 w-[60%] h-[50%] rounded-2xl overflow-hidden border border-[var(--color-border-hover)] shadow-[0_16px_40px_rgba(0,0,0,0.3)] z-10"
            >
              <AnimateReveal variant="scaleUp" delay={0.2} className="w-full h-full">
                <Image
                  src="/academic-prestige.png"
                  alt="SOPHEP — academic excellence"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  style={{ filter: "grayscale(15%)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/80 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                    15 Years of Excellence
                  </span>
                </div>
              </AnimateReveal>
            </motion.div>

            {/* Decorative corner dots */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--color-primary)] opacity-40" />
            <div className="absolute bottom-4 left-[62%] w-2 h-2 rounded-full bg-[var(--color-gold)] opacity-40" />
          </div>
        </div>

        {/* Timeline Strip */}
        <AnimateReveal delay={0.3} className="mt-20">
          <div className="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto pb-2 no-scrollbar">
            {MILESTONES.map((m, i) => (
              <TimelineItem key={m.year} milestone={m} index={i} total={MILESTONES.length} />
            ))}
          </div>
        </AnimateReveal>
      </div>
    </section>
  );
}
