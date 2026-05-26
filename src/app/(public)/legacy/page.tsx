import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import GlitchHeading from '@/components/ui/GlitchHeading';
import Image from 'next/image';
import AnimatePage from '@/components/layout/AnimatePage';
import AnimateReveal from '@/components/ui/AnimateReveal';

export const metadata: Metadata = {
  title: 'Our Legacy | SOPHEP',
  description: 'Explore the rich history and past events of SOPHEP.',
};

export default function LegacyPage() {
  const years = [
    { year: '2023', title: 'The Resurgence', desc: 'Post-pandemic revival featuring over 500 delegates from 40 institutions.', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop' },
    { year: '2022', title: 'Digital Frontiers', desc: 'Our first hybrid conference pushing the boundaries of digital diplomacy.', img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1200&auto=format&fit=crop' },
    { year: '2019', title: 'Global Horizons', desc: 'The landmark event that established SOPHEP as a premier international platform.', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop' },
  ];

  return (
    <AnimatePage>
      <div className="min-h-screen bg-[var(--color-bg)] pt-32 pb-24">
        <div className="container-sophep">
          {/* ... existing content ... */}
          <AnimateReveal className="mb-16" staggerChildren={0.1}>
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-colors mb-8">
              <ArrowLeft size={16} />
              <span className="font-sans text-xs uppercase tracking-widest">Return Home</span>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-6">
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">Hall of Fame</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 leading-tight">
              Our <span className="text-[var(--color-primary)]"><GlitchHeading text="Legacy" /></span>
            </h1>
            <p className="font-sans text-lg text-[var(--color-fg-muted)] max-w-2xl leading-relaxed">
              A journey through our past summits, celebrating the milestones and memories that forged the SOPHEP tradition.
            </p>
          </AnimateReveal>

          <AnimateReveal className="space-y-24" staggerChildren={0.2}>
            {years.map((item, i) => (
              <div key={i} className={`flex flex-col ${i % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 md:gap-16 items-center`}>
                <div className="w-full md:w-1/2 relative">
                  <div className="aspect-video rounded-2xl overflow-hidden border border-[var(--color-border)] group cursor-pointer relative">
                    <Image 
                      src={item.img} 
                      alt={`SOPHEP ${item.year}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[var(--color-primary)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md text-white border border-white/40">
                        <Play fill="currentColor" size={24} className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 font-display font-bold text-8xl text-[var(--color-fg)]/5 select-none pointer-events-none">
                    {item.year}
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--color-border)] rounded-full text-xs font-medium text-[var(--color-fg-muted)]">
                    Chapter {years.length - i}
                  </div>
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-fg)] uppercase tracking-wide">
                    {item.year} <span className="text-[var(--color-primary)] font-light">&mdash;</span> {item.title}
                  </h2>
                  <p className="font-sans text-lg text-[var(--color-fg-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="pt-6">
                    <Link href="#" className="font-sans text-xs uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors border-b border-[var(--color-primary)]/30 pb-1 hover:border-[var(--color-primary)]">
                      View Gallery
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </AnimateReveal>
        </div>
      </div>
    </AnimatePage>
  );
}
