"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import GlitchHeading from "@/components/ui/GlitchHeading";

export default function EditorialHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { clipPath: "inset(100% 0 0 0)", y: 60 },
    visible: {
      clipPath: "inset(0% 0 0 0)",
      y: 0,
      transition: { duration: 1, ease: [0.87, 0, 0.13, 1] },
    },
  };

  const glowVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 0.2,
      scale: 1,
      transition: { duration: 2, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-[90dvh] flex flex-col justify-center overflow-hidden noise-grain pt-32 pb-20">
      {/* Background Volumetric Glows */}
      <motion.div 
        variants={glowVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-[10%] -left-[10%] w-[60%] h-[60%] glow-purple rounded-full pointer-events-none" 
      />
      <motion.div 
        variants={glowVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] glow-cyan rounded-full pointer-events-none" 
      />

      <div className="container-sophep relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid-editorial"
        >
          <div className="col-span-12 lg:col-span-11 xl:col-span-10">
            <motion.div variants={itemVariants} className="overflow-hidden mb-6">
              <span className="inline-block text-xs md:text-sm font-body font-bold uppercase tracking-[0.4em] text-[var(--color-primary)]">
                The Society for Promotion of Higher Education in Pakistan
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-[14vw] sm:text-[12vw] lg:text-[10vw] font-display font-black leading-[0.8] tracking-tighter mb-12"
            >
              <GlitchHeading text="GIMUN" /> <br />
              <span className="text-[var(--color-neo-pink)] outline-text">
                <GlitchHeading text="2025" intervalMs={6000} />
              </span>
            </motion.h1>

            <div className="grid grid-cols-12 gap-8 md:gap-12">
              <motion.div variants={itemVariants} className="col-span-12 md:col-span-6 lg:col-span-5">
                <p className="text-xl md:text-2xl font-body text-[var(--color-fg-muted)] leading-tight tracking-tight mb-10">
                  A legacy of excellence. <br />
                  A future of leadership. <br />
                  The premier diplomatic <br />
                  simulation in the region.
                </p>
                
                <div className="flex flex-wrap gap-6">
                  <Button variant="brutal" size="xl">
                    Register Now ↗
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="col-span-12 md:col-start-8 md:col-span-5 lg:col-span-4 flex flex-col justify-end"
              >
                <div className="border-t-2 border-[var(--color-fg)] pt-8 mt-12 md:mt-0">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <h3 className="text-sm font-body font-black uppercase tracking-widest mb-2">Location</h3>
                      <p className="text-lg font-display text-[var(--color-fg-muted)]">GIK Institute, Topi</p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-sm font-body font-black uppercase tracking-widest mb-2">Dates</h3>
                      <p className="text-lg font-display text-[var(--color-fg-muted)]">05—07 Dec 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 py-4 border-y border-[var(--color-border)]">
                    <div className="flex -space-x-3">
                      {[
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
                        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
                        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80"
                      ].map((src, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-bg-raised)] overflow-hidden relative">
                          <Image 
                            src={src} 
                            alt={`Delegate ${i + 1}`} 
                            fill 
                            sizes="32px"
                            className="object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-body font-bold uppercase tracking-tighter">
                      Join 400+ Delegates
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Vertical Decorative Rule */}
      <div className="absolute right-[5%] top-0 bottom-0 w-[1px] bg-[var(--color-border)] hidden xl:block" />
    </section>
  );
}
