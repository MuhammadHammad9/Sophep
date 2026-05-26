"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import GlitchHeading from "@/components/ui/GlitchHeading";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Ahmed",
    role: "Best Delegate, GIMUN '24",
    quote: "The level of debate and the quality of the crisis committees at GIMUN are unparalleled. It truly pushed me to think on my feet.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Ali Hassan",
    role: "Winning Counsel, MOOT '23",
    quote: "SOPHEP’s Moot Court provided the most realistic simulation of Supreme Court proceedings I've ever experienced. An absolute masterclass.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Zainab Raza",
    role: "Chairperson, UNSC '24",
    quote: "As a chair, the organizational excellence of the SOPHEP Secretariat made my job seamless. The standard of delegates was exceptionally high.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
  },
];

export default function TestimonialsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--color-bg)]">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-sophep relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] uppercase tracking-[0.3em] text-[var(--color-primary)] font-semibold block mb-4"
          >
            The Delegate Experience
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-[var(--color-fg)] mb-6 uppercase tracking-wider"
          >
            Words from the <br className="hidden md:block" />
              <span className="text-[var(--color-primary)]">
                <GlitchHeading text="Best & Brightest" intervalMs={6000} />
              </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onMouseEnter={() => setHoveredId(testimonial.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="card-luxury overflow-hidden group relative"
            >
              {/* Image/Video Container */}
              <div className="relative h-64 w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${testimonial.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/40 to-transparent" />
                
                {/* Play Button Overlay (Simulating Video) */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                    hoveredId === testimonial.id ? "opacity-100 bg-black/20 backdrop-blur-sm" : "opacity-0"
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white transform transition-transform duration-500 hover:scale-110 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    <Play fill="currentColor" size={24} className="ml-1" />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="p-8 relative bg-[var(--color-bg)] -mt-20">
                <div className="mb-6 relative">
                  <span className="absolute -top-6 -left-2 text-6xl text-[var(--color-primary)]/20 font-serif leading-none">&quot;</span>
                  <p className="font-sans text-sm md:text-base text-[var(--color-fg-muted)] italic relative z-10 leading-relaxed">
                    {testimonial.quote}
                  </p>
                </div>
                
                <div className="border-t border-[var(--color-border-hover)] pt-4">
                  <h4 className="font-sans font-bold text-[var(--color-fg)] text-sm tracking-wide uppercase">
                    {testimonial.name}
                  </h4>
                  <p className="font-sans text-[11px] uppercase tracking-wider text-[var(--color-primary)] mt-1">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
