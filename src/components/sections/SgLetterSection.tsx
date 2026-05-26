"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import GlitchHeading from "@/components/ui/GlitchHeading";

export default function SgLetterSection() {
  const brutalEase = [0.87, 0, 0.13, 1] as const;

  return (
    <section className="py-32 relative overflow-hidden noise-grain bg-[var(--color-bg)]">
      <div className="container-sophep relative z-10">
        <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Header - Editorial Style */}
          <div className="col-span-12 mb-16">
            <span className="text-xs font-body font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-4 block">
              MESSAGES — 01
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-black uppercase leading-none">
              <GlitchHeading text="The Secretary-General" />
            </h2>
          </div>

          {/* SG Headshot with Brutal Border */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: brutalEase }}
            className="col-span-12 md:col-span-5"
          >
            <div className="p-1 border-2 border-[var(--color-fg)] bg-[var(--color-bg-raised)] shadow-brutal">
              <div className="relative aspect-[4/5] w-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-in-out group">
                <Image
                  src="/sg-headshot.png"
                  alt="Secretary-General"
                  fill
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
              </div>
            </div>
            
            <div className="mt-8 flex flex-col gap-1">
              <h4 className="text-2xl font-display font-black uppercase">Hassaan Ahmad</h4>
              <p className="text-xs font-body font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Secretary-General — GIMUN 25</p>
            </div>
          </motion.div>

          {/* Letter Content */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: brutalEase }}
            className="col-span-12 md:col-span-7 lg:col-span-6 lg:col-start-7"
          >
            <blockquote className="text-3xl md:text-4xl lg:text-5xl font-display font-black leading-tight mb-12 italic text-[var(--color-fg)]">
              &quot;We envision a platform where the leaders of tomorrow can debate, negotiate, and resolve the most pressing issues of our time.&quot;
            </blockquote>
            
            <div className="space-y-8 text-lg font-body text-[var(--color-fg-muted)] leading-relaxed">
              <p>
                It is my distinct honor to welcome you to the 15th iteration of the GIKI Model United Nations & Moot Court. Our team has worked tirelessly to construct an ecosystem that challenges your intellect, sharpens your rhetoric, and elevates your perspective.
              </p>
              <p>
                In an era of unprecedented global shifts, the importance of diplomacy and critical thinking has never been higher. At SOPHEP, we don&apos;t just simulate international relations; we cultivate the mindset required to lead in the real world.
              </p>
            </div>

            <div className="mt-16 pt-8 border-t-2 border-[var(--color-fg)]">
              <div className="text-6xl md:text-8xl opacity-80 select-none font-script text-[var(--color-fg)] -rotate-3 origin-left">
                H Ahmad
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
