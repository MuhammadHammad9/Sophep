"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Award, Globe, Users, BookOpen } from "lucide-react";
import Image from "next/image";
import AnimateReveal from "@/components/ui/AnimateReveal";
import LuxuryCard from "@/components/ui/LuxuryCard";
import ImageReveal from "@/components/ui/ImageReveal";
import GlitchHeading from "@/components/ui/GlitchHeading";

export default function AboutSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="py-32 lg:py-56 overflow-hidden" 
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="container-sophep">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-7 pt-4">
            <AnimateReveal className="mb-16">
              <span
                className="font-sans text-[12px] uppercase tracking-[0.5em] font-medium block mb-8 opacity-80"
                style={{ color: "var(--color-fg-muted)" }}
              >
                Institutional Legacy
              </span>
                <h2
                  className="mb-10 font-display font-bold uppercase"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                    lineHeight: 1.1,
                    color: "var(--color-fg)",
                  }}
                >
                Experience
                <br />
                <span className="text-[var(--color-primary)]"><GlitchHeading text="Excellence" intervalMs={8000} /></span>
              </h2>
              <div className="w-16 h-[1px] bg-primary mb-12" />
            </AnimateReveal>

            <AnimateReveal staggerChildren={0.1}>
              <div className="space-y-8 max-w-2xl">
                <p
                  className="font-sans font-light text-lg md:text-xl leading-[1.8]"
                  style={{ color: "var(--color-fg)" }}
                >
                  SOPHEP is one of Pakistan&apos;s most prestigious university conference ecosystems,
                  promoting diplomacy, leadership, and global awareness.
                </p>
                <p
                  className="font-sans font-light text-base md:text-lg leading-[2] opacity-70"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  For over fifteen years, we have been at the forefront of student leadership. Our conferences bring together brilliant minds from across the country to engage in meaningful dialogue on global issues — from the UN committee floor to the courtroom.
                </p>
              </div>

              {/* Feature list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 mt-20">
                {[
                  { icon: Award, text: "High-quality committee sessions" },
                  { icon: Users, text: "Expert chairs & crisis directors" },
                  { icon: Globe, text: "Networking with future leaders" },
                  { icon: BookOpen, text: "Professional development" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-6 group">
                      <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-primary/50 transition-all duration-500">
                        <Icon size={20} strokeWidth={1} style={{ color: "var(--color-primary)" }} />
                      </div>
                      <span
                        className="font-sans text-[13px] font-medium tracking-wider uppercase opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--color-fg)" }}
                      >
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </AnimateReveal>
          </div>

          {/* Right Side: Image & Stats */}
          <div className="lg:col-span-5 space-y-12">
            <ImageReveal direction="up" delay={0.3}>
              <motion.div 
                style={{ y: parallaxY }} 
                className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-2xl group"
              >
                <Image 
                  src="/media-1.png" 
                  alt="SOPHEP Legacy" 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 brightness-75 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8">
                  <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/50">Establishment</span>
                  <div className="font-display text-4xl text-white mt-2">2009</div>
                </div>
              </motion.div>
            </ImageReveal>

            {/* Floating Stats Row */}
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {[
                { value: "15+", label: "Years", icon: Award },
                { value: "3K+", label: "Delegates", icon: Users },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <LuxuryCard key={stat.label} className="p-8 text-center" rotationStrength={10}>
                    <div className="flex flex-col items-center gap-4">
                      <Icon size={24} strokeWidth={1} style={{ color: "var(--color-primary)" }} />
                      <div>
                        <div className="font-sans font-bold text-3xl mb-1" style={{ color: "var(--color-fg)" }}>{stat.value}</div>
                        <div className="font-sans text-[10px] uppercase tracking-[0.3em] opacity-40" style={{ color: "var(--color-fg-muted)" }}>{stat.label}</div>
                      </div>
                    </div>
                  </LuxuryCard>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
