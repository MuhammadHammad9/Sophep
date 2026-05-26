"use client";

import { motion } from "framer-motion";
import { Users, Mail } from "lucide-react";
import Link from "next/link";
import CountdownTimer from "@/components/ui/CountdownTimer";
import GlitchHeading from "@/components/ui/GlitchHeading";

export default function FinalPushSection() {
  return (
    <section id="cta" className="relative py-32 lg:py-44 overflow-hidden" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Delicate grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,245,240,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,240,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      {/* Subtle spotlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(124,58,237,0.03) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container-sophep text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <span
            className="font-sans text-[10px] uppercase tracking-[0.4em] font-light"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Early Bird Registration
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8 font-display font-bold uppercase"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "0.08em",
            color: "var(--color-fg)",
            lineHeight: 1.1,
          }}
        >
          <GlitchHeading text="Secure Your Place" intervalMs={7000} />
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-sans font-light max-w-lg mx-auto mb-20 leading-[1.9] text-[14px]"
          style={{ color: "var(--color-fg-muted)" }}
        >
          Join delegates in shaping tomorrow&apos;s world through diplomacy and dialogue.
          Applications for GIMUN 25 are now open.
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-20"
        >
          <CountdownTimer />
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-px max-w-[120px] mx-auto mb-16"
          style={{ backgroundColor: "rgba(245,245,240,0.08)" }}
        />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link
            href="/register"
            className="btn btn-primary btn-lg min-w-[260px]"
          >
            <Users size={14} strokeWidth={1.5} />
            Start Application
          </Link>
          <a
            href="mailto:sophep@giki.edu.pk"
            className="btn btn-outline btn-lg min-w-[260px]"
          >
            <Mail size={14} strokeWidth={1.5} />
            Contact Team
          </a>
        </motion.div>

        {/* Location Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-sans text-[10px] uppercase tracking-[0.2em] font-light mt-12"
          style={{ color: "var(--color-fg-muted)" }}
        >
          Hosted at GIKI, Topi · Khyber Pakhtunkhwa
        </motion.p>
      </div>
    </section>
  );
}
