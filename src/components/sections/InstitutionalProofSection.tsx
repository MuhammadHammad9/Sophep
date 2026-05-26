"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";
import AnimateReveal from "@/components/ui/AnimateReveal";
import LuxuryCard from "@/components/ui/LuxuryCard";

/* ——— Data ——— */
const SPONSORS = [
  "Engro Corporation", "Systems Limited", "Habib Bank Limited",
  "Telenor Pakistan", "Nestle Pakistan", "Atlas Honda",
  "McKinsey & Company", "Deloitte Pakistan", "Shell Pakistan",
  "Procter & Gamble", "Unilever Pakistan", "KPMG",
  "National Bank", "PwC Pakistan",
];

const STATS = [
  { value: 15, suffix: "+", label: "Years" },
  { value: 3000, suffix: "+", label: "Delegates" },
  { value: 50, suffix: "+", label: "Committees" },
  { value: 35, suffix: "+", label: "Institutions" },
];

const TESTIMONIALS = [
  {
    quote: "GIMUN was the defining experience of my university years. The intellectual rigor and network I gained directly led to my current role.",
    name: "Fatima Malik",
    title: "Associate, McKinsey & Company",
    cohort: "GIMUN XII · 2019",
  },
  {
    quote: "Winning the MOOT Court competition at SOPHEP was the moment I decided to pursue law seriously. The preparation alone was worth an entire semester.",
    name: "Ahmed Hassan",
    title: "Junior Associate, Orr Dignam & Co.",
    cohort: "MOOT 2020 Champion",
  },
  {
    quote: "As a delegate from outside GIKI, I was welcomed into a world-class conference experience. The committee standards rivaled any I've attended internationally.",
    name: "Sara Qureshi",
    title: "Policy Analyst, United Nations ESCAP",
    cohort: "GIMUN XIV · 2021",
  },
];

/* ——— Animated Counter ——— */
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ——— Framer Motion Marquee ——— */
function SponsorMarquee() {
  const doubled = [...SPONSORS, ...SPONSORS, ...SPONSORS];
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        duration: 50,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [controls]);

  return (
    <div 
      className="overflow-hidden py-6" 
      aria-label="Our sponsors and partners"
      onMouseEnter={() => controls.stop()}
      onMouseLeave={() => controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: 50,
          ease: "linear",
          repeat: Infinity,
        },
      })}
    >
      <motion.div 
        className="flex gap-24" 
        animate={controls}
        initial={{ x: "0%" }}
        style={{ width: "max-content" }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            className="font-sans font-light text-[13px] tracking-[0.3em] uppercase whitespace-nowrap select-none transition-colors duration-500 cursor-default hover:text-[var(--color-primary)]"
            style={{ color: "var(--color-fg-faint)" }}
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ——— Main Section ——— */
export default function InstitutionalProofSection() {
  return (
    <section
      id="proof"
      className="py-32 lg:py-48 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="container-sophep">
        {/* Header */}
        <AnimateReveal className="text-center mb-24">
          <span
            className="font-sans text-[10px] uppercase tracking-[0.4em] font-light block mb-6 opacity-60"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Partners & Alumni
          </span>
          <h2
            className="mb-8 font-display font-bold uppercase"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              letterSpacing: "0.1em",
              color: "var(--color-fg)",
            }}
          >
            Trusted at Scale
          </h2>
          <div className="section-divider" />
        </AnimateReveal>

        {/* Sponsor Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mb-32"
        >
          <div
            className="relative"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          >
            <SponsorMarquee />
          </div>
        </motion.div>

        {/* Stats */}
        <AnimateReveal 
          staggerChildren={0.15}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-40"
        >
          {STATS.map((stat) => (
            <LuxuryCard key={stat.label} className="text-center py-12">
              <div
                className="font-sans font-extralight mb-4"
                style={{ color: "var(--color-fg)", fontSize: "clamp(2.5rem, 5vw, 3.8rem)" }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className="font-sans text-[10px] uppercase tracking-[0.4em] font-light opacity-50"
                style={{ color: "var(--color-fg-muted)" }}
              >
                {stat.label}
              </div>
            </LuxuryCard>
          ))}
        </AnimateReveal>

        {/* Testimonials Header */}
        <AnimateReveal className="text-center mb-32">
          <span
            className="font-sans text-[10px] uppercase tracking-[0.4em] font-light block mb-6 opacity-60"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Alumni Voices
          </span>
          <h3
            className="font-display font-bold uppercase"
            style={{
              fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
              letterSpacing: "0.1em",
              color: "var(--color-fg)",
            }}
          >
            Shaping Careers
          </h3>
        </AnimateReveal>

        <AnimateReveal 
          staggerChildren={0.2}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {TESTIMONIALS.map((t) => (
            <LuxuryCard key={t.name} className="p-10 md:p-12 h-full flex flex-col">
              <MessageSquareQuote
                size={24}
                strokeWidth={1.2}
                className="mb-8 opacity-20"
                style={{ color: "var(--color-fg)" }}
              />
              <p
                className="font-sans font-light text-[14px] leading-[2] mb-10 italic"
                style={{ color: "var(--color-fg-muted)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-auto">
                <div
                  className="font-sans text-[14px] font-medium tracking-wide mb-1"
                  style={{ color: "var(--color-fg)" }}
                >
                  {t.name}
                </div>
                <div
                  className="font-sans text-[12px] font-light opacity-70"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  {t.title}
                </div>
                <div
                  className="font-sans text-[10px] uppercase tracking-[0.3em] font-light mt-2 opacity-50 border-t border-white/5 pt-2"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  {t.cohort}
                </div>
              </div>
            </LuxuryCard>
          ))}
        </AnimateReveal>
      </div>
    </section>
  );
}
