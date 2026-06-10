"use client";

import { motion } from "framer-motion";
import { Mail, Handshake, Users, Megaphone } from "lucide-react";
import AnimateReveal from "@/components/ui/AnimateReveal";
import Magnetic from "@/components/ui/Magnetic";

const PLATINUM = ["Engro Corporation", "Systems Limited", "Habib Bank Limited"];
const GOLD = ["Telenor Pakistan", "Nestle Pakistan", "Atlas Honda", "McKinsey & Company"];
const SILVER = [
  "Deloitte Pakistan", "Shell Pakistan", "Procter & Gamble",
  "Unilever Pakistan", "KPMG", "National Bank", "PwC Pakistan",
];

const BENEFITS = [
  {
    icon: Users,
    title: "1500+ Delegates",
    desc: "Direct access to Pakistan's brightest young minds and future leaders.",
  },
  {
    icon: Megaphone,
    title: "Brand Visibility",
    desc: "Premium placement across digital, print, and event branding.",
  },
  {
    icon: Handshake,
    title: "Talent Pipeline",
    desc: "Connect with top university talent for recruitment and internships.",
  },
];

function SponsorMarquee() {
  const allSponsors = [...PLATINUM, ...GOLD, ...SILVER];
  const doubled = [...allSponsors, ...allSponsors, ...allSponsors];

  return (
    <div
      className="overflow-hidden py-10 marquee-container"
      aria-label="Our sponsors and partners"
    >
      <div
        className="flex gap-16 items-center marquee-track-slow hover-pause"
        style={{ width: "max-content" }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            className="font-display font-bold text-xl md:text-3xl tracking-wider uppercase whitespace-nowrap cursor-default transition-all duration-300 hover:text-[var(--color-primary)] hover:scale-105"
            style={{ color: "var(--color-fg-muted)" }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function TierSection({
  title,
  sponsors,
  accentColor,
}: {
  title: string;
  sponsors: string[];
  accentColor: string;
}) {
  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-3 h-3 rounded-full sponsor-dot-pulse"
          style={{ backgroundColor: accentColor }}
        />
        <span
          className="font-sans text-[10px] uppercase tracking-[0.4em] font-semibold"
          style={{ color: accentColor }}
        >
          {title} Partners
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        {sponsors.map((name, i) => (
          <motion.div
            key={name}
            className="glass-card px-5 py-3 text-center cursor-default group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ 
              y: -3,
              borderColor: accentColor,
              boxShadow: `0 4px 20px ${accentColor}20`
            }}
          >
            <span className="font-display font-bold text-sm md:text-base uppercase tracking-wider text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)] transition-colors duration-300">
              {name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SponsorsPreview() {
  return (
    <section
      id="sponsors"
      className="overflow-hidden relative scroll-mt-24"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border-hover)] to-transparent" />

      {/* Grid background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sponsor-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--color-fg)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sponsor-grid)" />
        </svg>
      </div>

      <div className="container-sophep relative z-10">
        {/* Header */}
        <AnimateReveal className="text-center mb-12">
          <span className="section-eyebrow">Corporate Partners</span>
          <h2 className="section-title mb-4">
            Trusted by <span className="text-[var(--color-primary)]">Industry Leaders</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            SOPHEP brings together Pakistan&apos;s leading corporations and
            institutions to invest in the next generation.
          </p>
        </AnimateReveal>

        {/* Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mb-16"
        >
          <div
            className="relative"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <SponsorMarquee />
          </div>
        </motion.div>

        {/* Tiered Layout */}
        <AnimateReveal staggerChildren={0.1} className="mb-16">
          <TierSection title="Platinum" sponsors={PLATINUM} accentColor="var(--color-gold)" />
          <TierSection title="Gold" sponsors={GOLD} accentColor="var(--color-primary)" />
          <TierSection title="Silver" sponsors={SILVER} accentColor="var(--color-fg-subtle)" />
        </AnimateReveal>

        {/* Benefits Section */}
        <AnimateReveal delay={0.2}>
          <motion.div
            className="glass-card-elevated p-8 md:p-12"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-10">
              <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-semibold text-[var(--color-primary)]">
                Why Partner With SOPHEP?
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BENEFITS.map((b, i) => {
                const Icon = b.icon;
                return (
                  <Magnetic key={b.title} strength={0.08}>
                    <motion.div
                      className="flex flex-col items-center text-center group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -5 }}
                    >
                      <motion.div
                        className="w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mb-4"
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: 5,
                          borderColor: "var(--color-primary)",
                          backgroundColor: "rgba(139, 92, 246, 0.2)"
                        }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="icon-float">
                          <Icon size={22} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                        </div>
                      </motion.div>
                      <h4 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--color-fg)] mb-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                        {b.title}
                      </h4>
                      <p className="font-sans text-[13px] text-[var(--color-fg-muted)] leading-relaxed max-w-xs">
                        {b.desc}
                      </p>
                    </motion.div>
                  </Magnetic>
                );
              })}
            </div>
          </motion.div>
        </AnimateReveal>

        {/* CTA */}
        <AnimateReveal delay={0.3} className="flex flex-col items-center gap-5 mt-14">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] opacity-50">
            Interested in sponsoring GIMUN & GMC 25?
          </p>
          <Magnetic strength={0.1}>
            <a
              href="mailto:sophep@giki.edu.pk?subject=Partnership%20Enquiry%20—%20GIMUN%2025"
              className="btn btn-outline btn-lg group flex items-center gap-3"
            >
              <Mail size={14} className="transition-colors text-[var(--color-fg-muted)] group-hover:text-[var(--color-primary)]" />
              Partnership Enquiries
            </a>
          </Magnetic>
        </AnimateReveal>
      </div>
    </section>
  );
}
