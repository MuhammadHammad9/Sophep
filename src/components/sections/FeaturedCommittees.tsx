"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import AnimateReveal from "@/components/ui/AnimateReveal";
import LuxuryCard from "@/components/ui/LuxuryCard";

const committees = [
  {
    id: "disec",
    num: "01",
    name: "DISEC",
    fullName: "Disarmament & International Security",
    agenda: "Addressing the Proliferation of Lethal Autonomous Weapons Systems in Modern Warfare",
    difficulty: "Beginner",
    color: "var(--color-neo-cyan)",
    seats: 50,
    filled: 0,
  },
  {
    id: "unsc",
    num: "02",
    name: "UNSC",
    fullName: "UN Security Council",
    agenda: "The Situation in the South China Sea: Navigating Territorial Disputes and Maritime Law",
    difficulty: "Advanced",
    color: "var(--color-neo-pink)",
    seats: 15,
    filled: 0,
  },
  {
    id: "pna",
    num: "03",
    name: "PNA",
    fullName: "Pakistan National Assembly",
    agenda: "Economic Reforms and Privatization of State Enterprises in the Global Context",
    difficulty: "Intermediate",
    color: "var(--color-gold)",
    seats: 40,
    filled: 0,
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "var(--color-neo-cyan)",
  Intermediate: "var(--color-gold)",
  Advanced: "var(--color-neo-pink)",
};

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];

function CommitteeCard({ committee, index }: { committee: typeof committees[0]; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200 };
  const rotateX = useTransform(mouseY, [-200, 200], [3, -3]);
  const rotateY = useTransform(mouseX, [-200, 200], [-3, 3]);
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    mouseX.set(x - centerX);
    mouseY.set(y - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <motion.div
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <LuxuryCard className="h-full" rotationStrength={5} zDepth={20}>
          <div className="relative h-full flex flex-col p-8 md:p-10 group">
            {/* Glow effect that follows cursor */}
            <motion.div
              className="absolute inset-0 rounded-[var(--radius-2xl)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${committee.color}10, transparent 70%)`,
              }}
            />
            
            {/* Large faded number */}
            <motion.span
              className="absolute top-4 right-6 font-display text-[6.5rem] font-bold leading-none select-none pointer-events-none"
              style={{ color: committee.color, opacity: 0.05 }}
              whileHover={{ opacity: 0.08, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {committee.num}
            </motion.span>

            {/* Colored left border */}
            <motion.div
              className="absolute top-0 left-0 w-[3px] h-full rounded-l-xl"
              style={{ background: `linear-gradient(to bottom, ${committee.color}, transparent)` }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Header */}
            <div className="flex justify-between items-start mb-3 gap-4 relative z-10">
              <div>
                <h3 className="font-display text-2xl font-bold uppercase tracking-wide mb-1">
                  {committee.name}
                </h3>
                <p
                  className="font-sans text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  {committee.fullName}
                </p>
              </div>
              <motion.div
                className="px-3 py-1.5 text-[9px] font-sans uppercase tracking-widest border rounded-full shrink-0 font-semibold"
                style={{
                  color: DIFFICULTY_COLOR[committee.difficulty],
                  borderColor: `${DIFFICULTY_COLOR[committee.difficulty]}35`,
                  backgroundColor: `${DIFFICULTY_COLOR[committee.difficulty]}10`,
                }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ duration: 0.2 }}
              >
                {committee.difficulty}
              </motion.div>
            </div>

            {/* Agenda */}
            <p className="font-sans text-sm leading-relaxed text-[var(--color-fg-muted)] mb-8 flex-grow mt-4 relative z-10">
              {committee.agenda}
            </p>

            {/* Capacity Bar */}
            <div className="mb-8 relative z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-[9px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                  Capacity
                </span>
                <span className="font-sans text-[9px] uppercase tracking-widest text-[var(--color-fg-muted)]">
                  {committee.seats} seats
                </span>
              </div>
              <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max((committee.filled / committee.seats) * 100, 8)}%`,
                    background: `linear-gradient(to right, ${committee.color}aa, ${committee.color})`,
                    boxShadow: `0 0 8px ${committee.color}80`,
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max((committee.filled / committee.seats) * 100, 8)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10 mt-auto">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                Registration opens soon
              </span>
              <Link
                href="/register"
                className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest font-bold text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                Register
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Border glow on hover */}
            <motion.div
              className="absolute inset-0 rounded-[var(--radius-2xl)] opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{ boxShadow: `0 0 30px ${committee.color}20` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </LuxuryCard>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturedCommittees() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredCommittees = committees.filter(
    (c) => activeFilter === "All" || c.difficulty === activeFilter
  );

  return (
    <section
      id="committees"
      className="relative overflow-hidden scroll-mt-24"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="glow-orb glow-orb-lg"
          style={{
            background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.06,
          }}
        />
      </div>

      <div className="container-sophep relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <AnimateReveal>
            <span className="section-eyebrow">Academic Excellence</span>
            <h2 className="section-title">
              Featured <span className="text-[var(--color-primary)]">Committees</span>
            </h2>
          </AnimateReveal>

          <AnimateReveal delay={0.2}>
            <p className="font-sans text-sm text-[var(--color-fg-muted)] max-w-sm leading-relaxed">
              Choose your arena. From first-timers to seasoned delegates, there&apos;s
              a committee for every level.
            </p>
          </AnimateReveal>
        </div>

        {/* Filter Pills */}
        <AnimateReveal delay={0.1} className="flex flex-wrap gap-2.5 mb-10">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="font-sans text-[10px] uppercase tracking-widest px-4 py-2 border rounded-full font-semibold transition-all duration-300 cursor-pointer"
              style={{
                borderColor: activeFilter === filter ? "var(--color-primary)" : "var(--color-border)",
                backgroundColor: activeFilter === filter ? "var(--color-primary)" : "transparent",
                color: activeFilter === filter ? "#fff" : "var(--color-fg-muted)",
                boxShadow: activeFilter === filter ? "0 0 15px rgba(139,92,246,0.3)" : "none",
              }}
            >
              {filter}
            </button>
          ))}
        </AnimateReveal>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredCommittees.map((committee, index) => (
              <CommitteeCard key={committee.id} committee={committee} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Note */}
        <AnimateReveal delay={0.4}>
          <div className="mt-14 text-center">
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[var(--color-fg-muted)] opacity-50">
              Full committee roster, agendas & study guides publishing soon
            </p>
          </div>
        </AnimateReveal>
      </div>
    </section>
  );
}
