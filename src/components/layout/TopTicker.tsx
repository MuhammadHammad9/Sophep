"use client";

import { motion } from "framer-motion";

export default function TopTicker() {
  // We use static text segments to match the prestige look

  return (
    <div
      className="w-full overflow-hidden py-2 relative z-[40]"
      style={{ 
        background: "linear-gradient(90deg, rgba(139,92,246,0.15), rgba(196,165,240,0.1), rgba(139,92,246,0.15))",
        borderBottom: "1px solid var(--color-border)"
      }}
    >
      <motion.div 
        className="flex" 
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 35,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ width: "max-content" }}
      >
        <div className="flex items-center gap-16 font-sans text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
          {/* We duplicate the set twice to ensure smooth looping just like before */}
          {[1, 2].map((loop) => (
            <div key={loop} className="flex items-center gap-16">
              <span style={{ color: "var(--color-gold)" }}>★ GIMUN 25 Registration Open</span>
              <span style={{ color: "var(--color-fg-muted)" }}>●</span>
              <span style={{ color: "var(--color-accent)" }}>Early Bird Deadline: Dec 1</span>
              <span style={{ color: "var(--color-fg-muted)" }}>●</span>
              <span style={{ color: "var(--color-gold)" }}>★ 400+ Delegates Expected</span>
              <span style={{ color: "var(--color-fg-muted)" }}>●</span>
              <span style={{ color: "var(--color-accent)" }}>MOOT Court Applications Now Open</span>
              <span style={{ color: "var(--color-fg-muted)" }}>●</span>
              <span style={{ color: "var(--color-gold)" }}>★ GIKI, TOPI</span>
              <span style={{ color: "var(--color-fg-muted)" }}>●</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
