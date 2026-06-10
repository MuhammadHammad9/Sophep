"use client";


import { useState, useRef } from "react";
import Link from "next/link";
import { Scale, Briefcase, GraduationCap, ArrowUpRight } from "lucide-react";
import AnimateReveal from "@/components/ui/AnimateReveal";
import LuxuryCard from "@/components/ui/LuxuryCard";
import GlitchHeading from "@/components/ui/GlitchHeading";

const committees = [
  {
    icon: Scale,
    tag: "GIMUN 25 · ADVANCED",
    title: "UNSC",
    topic: "Militarization of Artificial Intelligence & Autonomous Weapons",
    delegates: 15,
    capacityRemaining: 3,
    href: "/committees/unsc",
  },
  {
    icon: Briefcase,
    tag: "GIMUN 25 · CRISIS",
    title: "JCC",
    topic: "The 1971 Indo-Pakistani War: Historical Revision",
    delegates: 40,
    capacityRemaining: 8,
    href: "/committees/jcc",
  },
  {
    icon: GraduationCap,
    tag: "MOOT COURT · LEGAL",
    title: "PNA",
    topic: "Constitutional Amendments & Judicial Independence",
    delegates: 60,
    capacityRemaining: 12,
    href: "/committees/pna",
  },
];

export default function CorePillarsSection() {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);

  function onMouseDown(e: React.MouseEvent) {
    if (!outer.current) return;
    e.preventDefault();
    setDragging(true);
    startX.current = e.pageX - outer.current.offsetLeft;
    scrollLeft.current = outer.current.scrollLeft;
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging || !outer.current) return;
    e.preventDefault();
    const x = e.pageX - outer.current.offsetLeft;
    velocity.current = x - lastX.current;
    lastX.current = x;
    outer.current.scrollLeft = scrollLeft.current - (x - startX.current);
  }

  function onMouseUp() {
    setDragging(false);
    if (!outer.current) return;
    let vel = velocity.current * 2;
    function decay() {
      if (!outer.current || Math.abs(vel) < 0.5) return;
      outer.current.scrollLeft -= vel;
      vel *= 0.92;
      requestAnimationFrame(decay);
    }
    requestAnimationFrame(decay);
  }

  return (
    <section
      id="events-showcase"
      className="py-32 lg:py-48"
      style={{
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div className="container-sophep">
        {/* Section header */}
        <AnimateReveal className="text-center mb-24">
          <span
            className="font-serif text-sm uppercase tracking-[0.2em] block mb-6 opacity-80"
            style={{ color: "var(--color-primary)" }}
          >
            Featured Events
          </span>
          <h2
            className="mb-8 font-display font-bold uppercase"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1,
              color: "var(--color-fg)",
            }}
          >
            <GlitchHeading text="The Committees" intervalMs={9000} />
          </h2>
          <div className="section-divider" />
          <p
            className="font-sans font-light max-w-lg mx-auto mt-10 leading-[2] text-sm md:text-base opacity-70"
            style={{ color: "var(--color-fg-muted)" }}
          >
            Engage in rigorous debate across our most prestigious simulation platforms. Spaces are highly competitive.
          </p>
        </AnimateReveal>



        {/* Interactive Drag Carousel */}
        <div 
          ref={outer}
          className="overflow-x-auto cursor-grab select-none scrollbar-none pb-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={(e) => {
            if (!outer.current) return;
            setDragging(true);
            startX.current = e.touches[0].pageX - outer.current.offsetLeft;
            scrollLeft.current = outer.current.scrollLeft;
          }}
          onTouchMove={(e) => {
            if (!isDragging || !outer.current) return;
            const x = e.touches[0].pageX - outer.current.offsetLeft;
            velocity.current = x - lastX.current;
            lastX.current = x;
            outer.current.scrollLeft = scrollLeft.current - (x - startX.current);
          }}
          onTouchEnd={onMouseUp}
        >
          <div ref={inner} className="flex gap-6 w-max px-4">
            {committees.map((committee) => {
              const Icon = committee.icon;
              return (
                <div key={committee.title} className="w-[85vw] max-w-[340px] md:w-[380px] flex-shrink-0">
                  <LuxuryCard className="h-full glass-overlay">
                    <div className="p-8 flex flex-col h-full">
                      
                      {/* Top Row */}
                      <div className="flex justify-between items-start mb-10">
                        <span
                          className="font-sans text-[9px] tracking-[0.3em] uppercase font-medium opacity-60"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {committee.tag}
                        </span>
                        <div className="px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-overlay)] font-sans text-[10px] tracking-widest text-[var(--color-fg)] opacity-70">
                          {committee.delegates} DELEGATES
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className="mb-4 font-display font-bold"
                        style={{
                          fontSize: "clamp(1.8rem, 2vw, 2.2rem)",
                          color: "var(--color-fg)",
                          lineHeight: 1.1,
                        }}
                      >
                        {committee.title}
                      </h3>

                      {/* Topic Preview */}
                      <p
                        className="font-sans font-light text-[13px] leading-[1.8] mb-12 opacity-80"
                        style={{ color: "var(--color-fg-muted)" }}
                      >
                        <span className="font-medium text-[var(--color-fg)] opacity-50 block mb-1 uppercase text-[9px] tracking-widest">Agenda</span>
                        {committee.topic}
                      </p>

                      {/* Bottom Row */}
                      <div className="mt-auto pt-6 border-t border-[var(--color-border)] flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="font-sans text-[11px] uppercase tracking-widest font-medium opacity-80">
                            {committee.capacityRemaining} spots left
                          </span>
                        </div>
                        
                        <a href={committee.href} className="inline-flex items-center gap-2">
                          <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium opacity-60" style={{ color: "var(--color-fg-muted)" }}>Details</span>
                          <ArrowUpRight size={14} strokeWidth={1.5} style={{ color: "var(--color-primary)" }} />
                        </a>
                      </div>
                    </div>
                  </LuxuryCard>
                </div>
              );
            })}
          </div>
          <div className="text-center font-sans text-[10px] uppercase tracking-widest text-[var(--color-fg-muted)]/30 mt-6">
            ← Swipe to explore →
          </div>
        </div>

        {/* View All Committees CTA */}
        <AnimateReveal delay={0.3} className="mt-16 text-center">
          <Link href="/committees">
            <button className="btn btn-primary">
              View All Committees
            </button>
          </Link>
        </AnimateReveal>
      </div>
    </section>
  );
}
