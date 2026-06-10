"use client";

import { Users, Building2, Globe, Award } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import AnimateReveal from "@/components/ui/AnimateReveal";
import Magnetic from "@/components/ui/Magnetic";

const highlights = [
  { value: 1500, label: "Delegates", suffix: "+", icon: Users, color: "var(--color-primary)" },
  { value: 15, label: "Committees", suffix: "+", icon: Building2, color: "var(--color-neo-cyan)" },
  { value: 10, label: "Countries", suffix: "+", icon: Globe, color: "var(--color-gold)" },
  { value: 12, label: "Past Editions", suffix: "", icon: Award, color: "var(--color-neo-pink)" },
];

function StatCard({ item }: { item: typeof highlights[0] }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const rotateX = useTransform(mouseY, [-200, 200], [5, -5]);
  const rotateY = useTransform(mouseX, [-200, 200], [-5, 5]);
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

  const Icon = item.icon;

  return (
    <Magnetic strength={0.08}>
      <motion.div
        style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card group p-6 md:p-8 flex flex-col items-center justify-center text-center relative cursor-pointer"
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Glow effect that follows cursor */}
        <motion.div
          className="absolute inset-0 rounded-[var(--radius-xl)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${item.color}15, transparent 70%)`,
          }}
        />
        
        {/* Icon */}
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-500"
          style={{
            backgroundColor: `${item.color}12`,
            border: `1px solid ${item.color}25`,
          }}
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="icon-float">
            <Icon size={20} style={{ color: item.color }} strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Value */}
        <motion.span
          className="font-display font-bold flex items-end mb-2"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            lineHeight: 1,
            color: "var(--color-fg)",
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatedCounter value={item.value} />
          <span style={{ color: item.color }}>{item.suffix}</span>
        </motion.span>

        {/* Label */}
        <span
          className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-medium"
          style={{ color: "var(--color-fg-muted)" }}
        >
          {item.label}
        </span>

        {/* Bottom gradient line on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 origin-center"
          style={{
            background: `linear-gradient(to right, transparent, ${item.color}, transparent)`,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Border glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-[var(--radius-xl)] opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{ boxShadow: `0 0 20px ${item.color}30` }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </Magnetic>
  );
}

export default function ConferenceHighlights() {
  return (
    <section
      id="highlights"
      className="relative overflow-hidden scroll-mt-24 section-stack"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="glow-orb glow-orb-lg"
          style={{
            background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.06,
          }}
        />
      </div>

      <div className="container-sophep relative z-10">
        {/* Section Header */}
        <AnimateReveal className="text-center mb-16">
          <span className="section-eyebrow">By The Numbers</span>
          <h2 className="section-title">
            The Scale of <span className="text-[var(--color-primary)]">Impact</span>
          </h2>
        </AnimateReveal>

        {/* Stat Cards */}
        <AnimateReveal
          staggerChildren={0.12}
          className="responsive-grid-tight"
        >
          {highlights.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </AnimateReveal>
      </div>
    </section>
  );
}
