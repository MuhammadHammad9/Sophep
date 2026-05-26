"use client";

import { motion } from "framer-motion";

export default function AnimatedDivider() {
  return (
    <div className="w-full flex justify-center py-8" style={{ backgroundColor: "var(--color-bg)" }}>
      <svg width="100%" height="2" className="max-w-[800px] opacity-40">
        <motion.line
          x1="0"
          y1="1"
          x2="100%"
          y2="1"
          stroke="var(--color-primary)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}
