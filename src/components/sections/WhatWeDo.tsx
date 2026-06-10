"use client";

import { motion } from "framer-motion";
import { Globe, Scale, Briefcase } from "lucide-react";
import AnimateReveal from "@/components/ui/AnimateReveal";
import LuxuryCard from "@/components/ui/LuxuryCard";

const PILLARS = [
  {
    icon: Globe,
    eyebrow: "Flagship Event",
    title: "Model United Nations",
    shortTitle: "GIMUN",
    description:
      "Pakistan's most rigorous academic diplomacy simulation. Delegates represent nations, craft resolutions, and debate the world's most pressing challenges across 8+ specialized committees.",
    stats: [
      { label: "Committees", value: "8+" },
      { label: "Seats", value: "300+" },
      { label: "Nations", value: "60+" },
    ],
    accentColor: "var(--color-primary)",
    tag: "Dec 2025",
  },
  {
    icon: Scale,
    eyebrow: "Legal Simulation",
    title: "Moot Court Competition",
    shortTitle: "GMC",
    description:
      "An elite courtroom simulation modeled on Pakistan's Supreme Court and International Tribunal proceedings. Prepare your oral arguments, challenge opposing counsel, and persuade a panel of real judges.",
    stats: [
      { label: "Rounds", value: "3" },
      { label: "Teams", value: "24" },
      { label: "Judges", value: "12" },
    ],
    accentColor: "var(--color-gold)",
    tag: "Dec 2025",
  },
  {
    icon: Briefcase,
    eyebrow: "Career Development",
    title: "Corporate Career Fair",
    shortTitle: "CCF",
    description:
      "Exclusive corporate recruitment gateway connecting Pakistan's top employers with GIK Institute's high-achieving student body. Network, apply, and secure your professional future.",
    stats: [
      { label: "Employers", value: "30+" },
      { label: "Opportunities", value: "100+" },
      { label: "Industries", value: "8" },
    ],
    accentColor: "var(--color-neo-cyan)",
    tag: "Coming Soon",
  },
];

export default function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      className="relative overflow-hidden"
      style={{
        paddingTop: "var(--section-py-lg)",
        paddingBottom: "var(--section-py-lg)",
        backgroundColor: "var(--color-bg-overlay)",
      }}
    >
      {/* Background accents */}
      <div
        className="glow-orb glow-orb-lg absolute"
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          top: "30%",
          right: "-10%",
          opacity: 0.05,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border-hover)] to-transparent" />

      <div className="container-sophep relative z-10">
        {/* Header */}
        <AnimateReveal className="text-center mb-20">
          <span className="section-eyebrow">Our Programmes</span>
          <h2 className="section-title mb-6">
            What We <span className="text-[var(--color-primary)]">Do</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Three world-class pillars of student development, each designed to challenge and elevate Pakistan&apos;s brightest young minds.
          </p>
        </AnimateReveal>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <AnimateReveal key={pillar.shortTitle} delay={0.1 * index} className="h-full">
                <LuxuryCard className="h-full" rotationStrength={4} zDepth={15}>
                  <div className="relative flex flex-col h-full p-8 md:p-10">
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                      style={{
                        background: `linear-gradient(to right, ${pillar.accentColor}, transparent)`,
                      }}
                    />

                    {/* Tag */}
                    <div className="flex items-center justify-between mb-8">
                      <span
                        className="font-sans text-[9px] uppercase tracking-[0.35em] font-semibold"
                        style={{ color: pillar.accentColor }}
                      >
                        {pillar.eyebrow}
                      </span>
                      <span
                        className="font-sans text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border font-semibold"
                        style={{
                          color: pillar.accentColor,
                          borderColor: `${pillar.accentColor}35`,
                          backgroundColor: `${pillar.accentColor}0A`,
                        }}
                      >
                        {pillar.tag}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500"
                      style={{
                        backgroundColor: `${pillar.accentColor}12`,
                        border: `1px solid ${pillar.accentColor}25`,
                      }}
                    >
                      <Icon size={28} style={{ color: pillar.accentColor }} strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-2xl md:text-3xl uppercase mb-2 text-[var(--color-fg)]">
                      {pillar.shortTitle}
                    </h3>
                    <p className="font-sans text-sm font-medium text-[var(--color-fg-muted)] uppercase tracking-widest mb-5">
                      {pillar.title}
                    </p>

                    {/* Description */}
                    <p className="font-sans text-sm leading-relaxed text-[var(--color-fg-muted)] mb-8 flex-grow">
                      {pillar.description}
                    </p>

                    {/* Stats Row */}
                    <div
                      className="flex items-center gap-0 pt-6 border-t mt-auto"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      {pillar.stats.map((stat, i) => (
                        <div
                          key={stat.label}
                          className={`flex-1 flex flex-col items-center text-center ${
                            i > 0 ? "border-l" : ""
                          }`}
                          style={{ borderColor: "var(--color-border)" }}
                        >
                          <span
                            className="font-display font-bold text-xl mb-0.5"
                            style={{ color: pillar.accentColor }}
                          >
                            {stat.value}
                          </span>
                          <span className="font-sans text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </LuxuryCard>
              </AnimateReveal>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <AnimateReveal delay={0.4} className="mt-16 text-center">
          <motion.div
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full border"
            style={{
              borderColor: "var(--color-border-hover)",
              background: "var(--surface)",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              All events take place
            </span>
            <span
              className="font-display font-bold text-sm uppercase tracking-wider"
              style={{ color: "var(--color-primary)" }}
            >
              December 5–7, 2026 · GIK Institute
            </span>
          </motion.div>
        </AnimateReveal>
      </div>
    </section>
  );
}
