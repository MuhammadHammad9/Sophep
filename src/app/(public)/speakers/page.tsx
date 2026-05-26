import { Metadata } from 'next';
import Link from 'next/link';
import GlitchHeading from '@/components/ui/GlitchHeading';
import { ArrowLeft, X } from 'lucide-react';

// LinkedIn icon removed from lucide-react v1.x — using inline SVG
const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import Image from 'next/image';
import AnimatePage from '@/components/layout/AnimatePage';
import AnimateReveal from '@/components/ui/AnimateReveal';

export const metadata: Metadata = {
  title: 'Distinguished Speakers | SOPHEP',
  description: 'Meet the keynote speakers and chairs of SOPHEP.',
};

export default function SpeakersPage() {
  const speakers = [
    { name: 'Dr. Jane Doe', role: 'Secretary-General', org: 'SOPHEP Council', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop' },
    { name: 'John Smith', role: 'Keynote Speaker', org: 'Global Tech Initiative', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop' },
    { name: 'Sarah Ahmed', role: 'Chairperson', org: 'Innovation Committee', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop' },
    { name: 'Michael Chen', role: 'Panelist', org: 'TechForward', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop' },
  ];

  return (
    <AnimatePage>
      <div className="min-h-screen bg-[var(--color-bg)] pt-32 pb-24">
        <div className="container-sophep">
          {/* ... existing content ... */}
          <AnimateReveal className="mb-16 text-center" staggerChildren={0.1}>
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-colors mb-8">
              <ArrowLeft size={16} />
              <span className="font-sans text-xs uppercase tracking-widest">Return Home</span>
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">Thought Leaders</span>
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 leading-tight">
              Distinguished <span className="text-[var(--color-primary)]"><GlitchHeading text="Speakers" /></span>
            </h1>
            <p className="font-sans text-lg text-[var(--color-fg-muted)] max-w-2xl mx-auto leading-relaxed">
              Gain insights from industry pioneers, academic leaders, and visionary entrepreneurs shaping the future.
            </p>
          </AnimateReveal>

          <AnimateReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerChildren={0.15}>
            {speakers.map((speaker, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 border border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors">
                  <Image 
                    src={speaker.img} 
                    alt={speaker.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0415]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <div className="flex gap-4">
                      <button className="text-white hover:text-[var(--color-primary)] transition-colors"><LinkedinIcon size={20} /></button>
                      <button className="text-white hover:text-[var(--color-primary)] transition-colors"><X size={20} /></button>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-display font-bold text-xl mb-1 uppercase tracking-wider">{speaker.name}</h3>
                  <p className="font-sans text-sm text-[var(--color-primary)] mb-1 font-medium tracking-wide">{speaker.role}</p>
                  <p className="font-sans text-[10px] text-[var(--color-fg-muted)] uppercase tracking-[0.2em] opacity-60">{speaker.org}</p>
                </div>
              </div>
            ))}
          </AnimateReveal>
        </div>
      </div>
    </AnimatePage>
  );
}
