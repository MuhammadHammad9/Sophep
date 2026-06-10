"use client";

import { BookOpen, Mic2, GraduationCap, Lightbulb } from "lucide-react";
import AnimateReveal from "@/components/ui/AnimateReveal";

const INITIATIVES = [
  {
    icon: BookOpen,
    title: "Delegate Training Workshops",
    description:
      "Intensive preparation sessions covering parliamentary procedure, resolution drafting, lobbying techniques, and public speaking fundamentals.",
    tags: ["Pre-Conference", "All Levels"],
    accentColor: "var(--color-primary)",
  },
  {
    icon: Mic2,
    title: "Distinguished Speaker Series",
    description:
      "Exclusive keynotes from ambassadors, policy-makers, legal scholars, and corporate leaders shaping Pakistan's future on the world stage.",
    tags: ["During Conference", "Keynotes"],
    accentColor: "var(--color-gold)",
  },
  {
    icon: GraduationCap,
    title: "National Educational Expo",
    description:
      "A curated exhibition connecting students with top universities, scholarship programmes, and postgraduate pathways — both domestic and international.",
    tags: ["Career Growth", "Universities"],
    accentColor: "var(--color-neo-cyan)",
  },
  {
    icon: Lightbulb,
    title: "Research & Policy Lab",
    description:
      "Guided research workshops where delegates produce policy papers on real-world issues, mentored by faculty advisors and domain experts.",
    tags: ["Academic", "Publication"],
    accentColor: "var(--color-neo-pink)",
  },
];

export default function EducationalInitiatives() {
  return (
    <section
      id="educational-initiatives"
      className="relative overflow-hidden"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Background */}
      <div
        className="glow-orb glow-orb-lg absolute"
        style={{
          background: "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)",
          bottom: "-15%",
          left: "-10%",
          opacity: 0.04,
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border-hover)] to-transparent" />

      <div className="container-sophep relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-16">
          <AnimateReveal>
            <span className="section-eyebrow">Beyond The Simulation</span>
            <h2 className="section-title">
              Educational{" "}
              <span className="text-[var(--color-primary)]">Initiatives</span>
            </h2>
          </AnimateReveal>
          <AnimateReveal delay={0.15}>
            <p className="font-sans text-sm text-[var(--color-fg-muted)] leading-relaxed max-w-md lg:ml-auto">
              SOPHEP extends well beyond the committee room. Our educational
              programmes build skills that last a lifetime — from public speaking
              to policy research and career planning.
            </p>
          </AnimateReveal>
        </div>

        {/* Grid */}
        <AnimateReveal staggerChildren={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIATIVES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="glass-card group p-8 md:p-10 relative overflow-hidden cursor-pointer"
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute top-0 left-0 w-[3px] h-full transition-all duration-500 group-hover:w-[5px]"
                    style={{
                      background: `linear-gradient(to bottom, ${item.accentColor}, transparent)`,
                    }}
                  />

                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundColor: `${item.accentColor}12`,
                        border: `1px solid ${item.accentColor}25`,
                      }}
                    >
                      <Icon
                        size={24}
                        style={{ color: item.accentColor }}
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg uppercase tracking-wide text-[var(--color-fg)] mb-2">
                        {item.title}
                      </h3>
                      <p className="font-sans text-sm leading-relaxed text-[var(--color-fg-muted)] mb-4">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-sans text-[9px] uppercase tracking-wider px-3 py-1 rounded-full border font-medium"
                            style={{
                              color: item.accentColor,
                              borderColor: `${item.accentColor}30`,
                              backgroundColor: `${item.accentColor}08`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimateReveal>
      </div>
    </section>
  );
}
