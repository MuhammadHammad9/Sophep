"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import TiltCard from "@/components/ui/TiltCard";
import TextScramble from "@/components/ui/TextScramble";
import GlitchHeading from "@/components/ui/GlitchHeading";

export default function AsymmetricContent() {
  return (
    <section className="py-32 relative overflow-hidden bg-[var(--color-bg)]">
      <div className="container-sophep">
        <div className="grid grid-cols-12 gap-8 md:gap-16">
          {/* Large Editorial Quote */}
          <div className="col-span-12 lg:col-span-10 mb-24 md:mb-32">
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.87, 0, 0.13, 1] }}
              className="text-6xl md:text-8xl xl:text-9xl font-display font-black leading-[0.85] tracking-tighter"
            >
              <TextScramble text="WE DON'T JUST" /> <br />
              <TextScramble text="HOST EVENTS." delay={0.2} /> <br />
              <span className="text-[var(--color-primary)]">
                <GlitchHeading text="WE ARCHITECT" intervalMs={7000} /> <br />
                <GlitchHeading text="EXPERIENCES." intervalMs={7000} glitchDurationMs={1500} />
              </span>
            </motion.h2>
          </div>

          {/* Asymmetrical Content Block 1 */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 relative z-10">
            <TiltCard>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-1 border-2 border-[var(--color-fg)] bg-[var(--color-bg-raised)] mb-12 shadow-brutal"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-[var(--color-bg-overlay)]">
                  <Image 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80" 
                    alt="Academic Prestige"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-6xl font-display font-black opacity-20 uppercase -rotate-45 select-none text-[var(--color-neo-cyan)]">
                      INTELLIGENCE
                    </div>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
            
            <div className="pl-4 md:pl-12 border-l-4 border-[var(--color-neo-cyan)] mt-6 md:mt-0">
              <h3 className="text-3xl font-display font-black uppercase mb-6 italic">
                <TextScramble text="The Academic Prestige" />
              </h3>
              <p className="text-lg text-[var(--color-fg-muted)] font-body leading-relaxed">
                Rooted in the prestigious GIK Institute, SOPHEP has been the cornerstone of student leadership 
                for over two decades. Our commitment to intellectual rigor and professional excellence 
                is reflected in every conference, fair, and workshop we curate.
              </p>
            </div>
          </div>

          {/* Asymmetrical Content Block 2 - Shifted down for visual rhythm */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-8 mt-12 md:mt-48 relative">
            <TiltCard>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-1 border-2 border-[var(--color-fg)] bg-[var(--color-bg-raised)] mb-12 shadow-brutal-hover"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-[var(--color-bg-overlay)]">
                  <Image 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80" 
                    alt="Global Vision"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-6xl font-display font-black opacity-20 uppercase rotate-12 select-none text-[var(--color-neo-pink)]">
                      LEADERSHIP
                    </div>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
            
            <div className="pr-4 md:pr-12 md:text-right border-r-4 border-[var(--color-neo-pink)] mt-6 md:mt-0 text-right md:text-right">
              <h3 className="text-3xl font-display font-black uppercase mb-6 italic">
                <TextScramble text="Global Vision" />
              </h3>
              <p className="text-lg text-[var(--color-fg-muted)] font-body leading-relaxed">
                From the halls of GIKI to the global stage. We provide the platform for the next 
                generation of diplomats, engineers, and entrepreneurs to find their voice and 
                challenge the status quo.
              </p>
            </div>
          </div>

          {/* Floating Grid Elements */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden xl:block absolute right-[10%] top-[40%] w-32 h-32 border-2 border-[var(--color-neo-cyan)] rotate-45 pointer-events-none"
          />
          <motion.div 
            initial={{ opacity: 0, rotate: -45 }}
            whileInView={{ opacity: 0.1, rotate: 0 }}
            viewport={{ once: true }}
            className="hidden xl:block absolute left-[-5%] bottom-[10%] text-[20rem] font-display font-black text-[var(--color-fg)] pointer-events-none select-none"
          >
            01
          </motion.div>
        </div>
      </div>
    </section>
  );
}
