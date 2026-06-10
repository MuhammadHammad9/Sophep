"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import AnimateReveal from "@/components/ui/AnimateReveal";
import Magnetic from "@/components/ui/Magnetic";

function FormField({ label, index }: { label: string; index: number }) {
  return (
    <motion.div
      className="space-y-1.5"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] font-medium">
        {label}
      </span>
      <div className="w-full h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/40" aria-hidden />
    </motion.div>
  );
}

export default function CallToActionSection() {
  return (
    <section
      id="register-cta"
      className="relative overflow-hidden scroll-mt-24"
      style={{ padding: "var(--section-py-lg) 0" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-overlay) 30%, rgba(139,92,246,0.06) 60%, var(--color-bg) 100%)",
        }}
      />

      <div
        className="glow-orb glow-orb-lg pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.1,
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent" />

      <div className="container-sophep relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <AnimateReveal>
              <span className="section-eyebrow">Don&apos;t Miss Out</span>
              <h2
                className="font-display font-bold uppercase mb-6"
                style={{
                  fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
                  lineHeight: 1.05,
                  color: "var(--color-fg)",
                }}
              >
                Your Seat
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--color-primary), var(--color-neo-cyan))",
                  }}
                >
                  Awaits
                </span>
              </h2>
            </AnimateReveal>

            <AnimateReveal delay={0.15}>
              <p className="font-sans font-light text-base md:text-lg leading-relaxed text-[var(--color-fg-muted)] max-w-lg mb-10">
                Join 1500+ delegates from across Pakistan and beyond for three days
                of diplomacy, debate, and leadership. Early registration is now open
                — secure your place in Pakistan&apos;s premier conference.
              </p>
            </AnimateReveal>

            <AnimateReveal delay={0.25}>
              <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                  <span className="font-sans text-sm font-medium text-[var(--color-fg)]">
                    December 05–07, 2026
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                  <span className="font-sans text-sm font-medium text-[var(--color-fg)]">
                    GIK Institute, Topi
                  </span>
                </div>
              </div>
            </AnimateReveal>

            <AnimateReveal delay={0.35}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
                <Magnetic strength={0.12}>
                  <Link href="/register" className="btn btn-primary btn-lg group min-w-[220px] justify-center">
                    Register Now
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.12}>
                  <Link href="/#committees" className="btn btn-outline btn-lg min-w-[220px] justify-center">
                    View Committees
                  </Link>
                </Magnetic>
              </div>
            </AnimateReveal>
          </div>

          <AnimateReveal delay={0.2} className="hidden lg:block">
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card-elevated p-10 relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 pointer-events-none"
                style={{ background: "var(--color-primary)" }}
              />

              <div className="relative z-10 space-y-8">
                <div>
                  <span className="font-sans text-[9px] uppercase tracking-[0.4em] font-semibold text-[var(--color-primary)] block mb-3">
                    Registration
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-[var(--color-fg)]">
                    GIMUN & GMC 25
                  </h3>
                </div>

                <div className="space-y-4">
                  {["Full Name", "University / Institution", "Select Committee"].map((field, i) => (
                    <FormField key={field} label={field} index={i} />
                  ))}
                </div>

                <div className="pt-4 border-t border-[var(--color-border)]">
                  <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] font-medium block mb-3">
                    Includes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Conference Kit", "Meals", "Certificate", "Networking"].map((item) => (
                      <span
                        key={item}
                        className="font-sans text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)] bg-[var(--color-primary)]/8 border border-[var(--color-primary)]/15 rounded-full px-3 py-1"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Magnetic strength={0.1}>
                  <Link
                    href="/register"
                    className="btn btn-primary w-full justify-center text-center"
                  >
                    Start Registration →
                  </Link>
                </Magnetic>
              </div>
            </motion.div>
          </AnimateReveal>
        </div>
      </div>
    </section>
  );
}
