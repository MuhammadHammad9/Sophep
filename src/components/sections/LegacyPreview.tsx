"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimateReveal from "@/components/ui/AnimateReveal";
import ImageReveal from "@/components/ui/ImageReveal";
import Magnetic from "@/components/ui/Magnetic";

const mediaItems = [
  { id: 1, src: "/media-1.png", alt: "Award Ceremonies & Highlights", label: "Award Moments" },
  { id: 2, src: "/media-2.png", alt: "Delegate speaking at podium", label: "In Session" },
  { id: 3, src: "/media-3.png", alt: "Conference delegates networking", label: "Networking" },
];

const TIMELINE = [
  { year: "2012", label: "Inaugural edition", desc: "SOPHEP was founded at GIK Institute" },
  { year: "2016", label: "International expansion", desc: "Delegates from 10+ countries" },
  { year: "2020", label: "Virtual pivot", desc: "Adapted to online conferencing" },
  { year: "2024", label: "Record attendance", desc: "1500+ delegates participated" },
  { year: "2025", label: "GIMUN & GMC 25", desc: "The legacy continues" },
];

function TimelineDot({
  item,
  index,
  total,
  isActive,
  onHover,
  onLeave,
}: {
  item: (typeof TIMELINE)[number];
  index: number;
  total: number;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      key={item.year}
      className="relative flex flex-col items-center text-center group cursor-default"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Dot */}
      <motion.div
        className="w-[10px] h-[10px] rounded-full border-2 mb-4 relative z-10"
        style={{
          borderColor: isActive ? "var(--color-primary)" : "var(--color-border-hover)",
          backgroundColor: isActive ? "var(--color-primary)" : "var(--color-bg)",
          boxShadow: isActive ? "0 0 12px var(--color-primary-glow)" : "none",
        }}
        animate={{ scale: isActive ? 1.4 : 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Year */}
      <motion.span
        className="font-display font-bold text-lg md:text-xl mb-1"
        animate={{
          color: isActive ? "var(--color-primary)" : "var(--color-fg)",
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ duration: 0.25 }}
      >
        {item.year}
      </motion.span>

      {/* Label */}
      <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] leading-tight">
        {item.label}
      </span>

      {/* Description — always in layout, opacity-controlled */}
      <motion.span
        className="font-sans text-[10px] text-[var(--color-fg-subtle)] mt-1 max-w-[120px] leading-relaxed"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {item.desc}
      </motion.span>
    </motion.div>
  );
}

export default function LegacyPreview() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"],
  });

  const timelineProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="legacy"
      className="overflow-hidden relative scroll-mt-24"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border-hover)] to-transparent" />

      <div className="container-sophep">
        {/* Header */}
        <AnimateReveal className="mb-16">
          <span className="section-eyebrow">Our History</span>
          <h2 className="section-title mb-4">
            The SOPHEP <span className="text-[var(--color-primary)]">Legacy</span>
          </h2>
          <p className="section-subtitle">
            From a small university conference to Pakistan&apos;s most anticipated
            diplomatic simulation — a journey of excellence.
          </p>
        </AnimateReveal>

        {/* Triptych Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-20 min-h-[500px]">
          {/* Main Large Image */}
          <div className="md:col-span-7 relative rounded-2xl overflow-hidden group min-h-[350px] md:min-h-[500px]">
            <ImageReveal direction="right" delay={0.1} className="w-full h-full">
              <div className="relative w-full h-full min-h-[350px] md:min-h-[500px]">
                <Image
                  src={mediaItems[0].src}
                  alt={mediaItems[0].alt}
                  fill
                  className="object-cover transition-all duration-1000 group-hover:scale-105"
                  style={{ filter: "grayscale(25%)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Overlay content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-block mb-3 px-3 py-1 border border-white/20 rounded-full backdrop-blur-sm">
                    <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/80">
                      15 Years of Excellence
                    </span>
                  </div>
                  <h3 className="text-white font-display text-2xl md:text-3xl uppercase mb-2 font-bold">
                    A Decade of Impact
                  </h3>
                  <p className="text-white/55 font-sans text-sm max-w-md leading-relaxed">
                    From a small university conference to Pakistan&apos;s most
                    anticipated diplomatic simulation.
                  </p>
                </div>
              </div>
            </ImageReveal>
          </div>

          {/* Right Column — Two stacked images */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            {/* Top Image */}
            <div className="flex-1 rounded-2xl overflow-hidden relative group min-h-[200px] cursor-pointer">
              <ImageReveal direction="up" delay={0.2} className="w-full h-full">
                <div className="relative w-full h-full min-h-[200px]">
                  <Image
                    src={mediaItems[1].src}
                    alt={mediaItems[1].alt}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    style={{ filter: "grayscale(15%)" }}
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/80 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:border-[var(--color-primary)]">
                      {mediaItems[1].label}
                    </span>
                  </div>
                </div>
              </ImageReveal>
            </div>

            {/* Bottom Image */}
            <div className="flex-1 rounded-2xl overflow-hidden relative group min-h-[200px] cursor-pointer">
              <ImageReveal direction="up" delay={0.35} className="w-full h-full">
                <div className="relative w-full h-full min-h-[200px]">
                  <Image
                    src={mediaItems[2].src}
                    alt={mediaItems[2].alt}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    style={{ filter: "grayscale(15%)" }}
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/80 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:border-[var(--color-primary)]">
                      {mediaItems[2].label}
                    </span>
                  </div>
                </div>
              </ImageReveal>
            </div>
          </div>
        </div>

        {/* Visual Timeline */}
        <AnimateReveal delay={0.2}>
          <div className="relative pb-16" ref={timelineRef}>
            {/* Horizontal line with progress */}
            <div className="absolute top-[18px] left-0 right-0 h-[1px] bg-[var(--color-border)] hidden md:block overflow-hidden">
              <motion.div
                className="h-full w-full bg-[var(--color-primary)] origin-left"
                style={{ scaleX: timelineProgress }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
              {TIMELINE.map((t, i) => {
                const isActive =
                  hoveredIndex !== null
                    ? i === hoveredIndex
                    : i === TIMELINE.length - 1;
                return (
                  <TimelineDot
                    key={t.year}
                    item={t}
                    index={i}
                    total={TIMELINE.length}
                    isActive={isActive}
                    onHover={() => setHoveredIndex(i)}
                    onLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </div>
          </div>
        </AnimateReveal>
      </div>
    </section>
  );
}
