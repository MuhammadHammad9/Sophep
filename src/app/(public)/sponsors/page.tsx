import { Metadata } from 'next';
import Link from 'next/link';
import GlitchHeading from '@/components/ui/GlitchHeading';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AnimatePage from '@/components/layout/AnimatePage';
import AnimateReveal from '@/components/ui/AnimateReveal';

export const metadata: Metadata = {
  title: 'Our Sponsors | SOPHEP',
  description: 'The esteemed corporate partners and sponsors making SOPHEP possible.',
};

export default function SponsorsPage() {
  const tiers = [
    { name: 'Platinum', color: 'from-slate-300 to-slate-400', count: 2 },
    { name: 'Gold', color: 'from-yellow-400 to-yellow-600', count: 4 },
    { name: 'Silver', color: 'from-zinc-300 to-zinc-400', count: 6 },
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
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">Corporate Partners</span>
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 leading-tight">
              Our <span className="text-[var(--color-primary)]"><GlitchHeading text="Sponsors" /></span>
            </h1>
            <p className="font-sans text-lg text-[var(--color-fg-muted)] max-w-2xl mx-auto leading-relaxed">
              We extend our deepest gratitude to the visionary organizations whose support empowers the next generation of global leaders.
            </p>
          </AnimateReveal>

          <div className="space-y-24">
            {tiers.map((tier, i) => (
              <div key={i}>
                <div className="flex items-center gap-4 mb-10 justify-center">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]/30" />
                  <h2 className={`font-display font-bold text-2xl uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r ${tier.color}`}>
                    {tier.name}
                  </h2>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-primary)]/30" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                  <AnimateReveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10" staggerChildren={0.1}>
                    {Array.from({ length: tier.count }).map((_, j) => (
                      <div key={j} className="aspect-[3/2] card-luxury flex items-center justify-center p-8 bg-[var(--color-nav-bg)] group cursor-pointer hover:border-[var(--color-primary)]/50 transition-all duration-500 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="opacity-40 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110 font-display font-bold text-xl text-[var(--color-fg)] uppercase tracking-tighter relative z-10">
                          Sponsor
                        </div>
                      </div>
                    ))}
                  </AnimateReveal>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 p-10 md:p-16 rounded-3xl bg-gradient-to-br from-[#0A0415] to-[#1a0e2e] text-center border border-[var(--color-primary)]/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
            <h3 className="font-display font-bold text-3xl text-white mb-4 relative z-10 uppercase tracking-widest">Become a Partner</h3>
            <p className="font-sans text-[var(--color-fg-muted)] mb-10 max-w-xl mx-auto relative z-10 opacity-70">
              Align your brand with excellence. Reach thousands of elite students and professionals across the country.
            </p>
            <button className="btn btn-primary btn-lg relative z-10">
              Download Prospectus
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform ml-2" />
            </button>
          </div>
        </div>
      </div>
    </AnimatePage>
  );
}
