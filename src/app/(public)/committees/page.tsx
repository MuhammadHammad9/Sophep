import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Scale, Briefcase, GraduationCap, Shield, Users, Heart, Globe } from 'lucide-react';
import GlitchHeading from '@/components/ui/GlitchHeading';
import AnimatePage from '@/components/layout/AnimatePage';
import AnimateReveal from '@/components/ui/AnimateReveal';
import LuxuryCard from '@/components/ui/LuxuryCard';

export const metadata: Metadata = {
  title: 'Committees | SOPHEP',
  description: 'Explore the comprehensive list of committees and debate topics for SOPHEP.',
};

const allCommittees = [
  {
    icon: Scale,
    title: "UNSC",
    tag: "GIMUN 25 · ADVANCED",
    topic: "Militarization of Artificial Intelligence & Autonomous Weapons",
    delegates: 15,
    capacityRemaining: 3,
    href: "/register",
    featured: true
  },
  {
    icon: Briefcase,
    title: "JCC",
    tag: "GIMUN 25 · CRISIS",
    topic: "The 1971 Indo-Pakistani War: Historical Revision",
    delegates: 40,
    capacityRemaining: 8,
    href: "/register",
    featured: true
  },
  {
    icon: GraduationCap,
    title: "PNA",
    tag: "MOOT COURT · LEGAL",
    topic: "Constitutional Amendments & Judicial Independence",
    delegates: 60,
    capacityRemaining: 12,
    href: "/register",
    featured: true
  },
  {
    icon: Shield,
    title: "DISEC",
    tag: "GIMUN 25 · GENERAL",
    topic: "Cyber Warfare & International Security Frameworks",
    delegates: 50,
    capacityRemaining: 15,
    href: "/register",
    featured: false
  },
  {
    icon: Users,
    title: "SOCHUM",
    tag: "GIMUN 25 · GENERAL",
    topic: "Protecting the Rights of Climate Refugees",
    delegates: 80,
    capacityRemaining: 25,
    href: "/register",
    featured: false
  },
  {
    icon: Heart,
    title: "UN Women",
    tag: "GIMUN 25 · SPECIALIZED",
    topic: "Economic Empowerment of Women in Conflict Zones",
    delegates: 30,
    capacityRemaining: 10,
    href: "/register",
    featured: false
  },
  {
    icon: Globe,
    title: "SPECPOL",
    tag: "GIMUN 25 · GENERAL",
    topic: "The Question of Outer Space Militarization",
    delegates: 70,
    capacityRemaining: 18,
    href: "/register",
    featured: false
  }
];

export default function CommitteesPage() {
  return (
    <AnimatePage>
      <div className="min-h-screen bg-[var(--color-bg)] pt-32 pb-24">
        <div className="container-sophep">
          <AnimateReveal className="mb-16 text-center" staggerChildren={0.1}>
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-colors mb-8">
              <ArrowLeft size={16} />
              <span className="font-sans text-xs uppercase tracking-widest">Return Home</span>
            </Link>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">Full Lineup</span>
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 leading-tight">
              Debate <span className="text-[var(--color-primary)]"><GlitchHeading text="Chambers" /></span>
            </h1>
            <p className="font-sans text-lg text-[var(--color-fg-muted)] max-w-2xl mx-auto leading-relaxed">
              Find your arena. Delve into rigorous research and prepare to address world challenges.
            </p>
          </AnimateReveal>

          <AnimateReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerChildren={0.15}>
            {allCommittees.map((committee, i) => {
              const Icon = committee.icon;
              return (
                <LuxuryCard key={i} className="glass-overlay relative overflow-hidden">
                  {committee.featured && (
                    <div className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-[9px] font-sans font-bold tracking-widest px-3 py-1 rounded-bl-lg uppercase z-20">
                      Featured
                    </div>
                  )}
                  <div className="p-8 flex flex-col h-full">
                    {/* Top Row */}
                    <div className="flex justify-between items-start mb-10">
                      <span
                        className="font-sans text-[9px] tracking-[0.3em] uppercase font-medium opacity-60"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {committee.tag}
                      </span>
                      <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 font-sans text-[10px] tracking-widest text-white/70 flex items-center gap-2">
                        <Icon size={12} className="opacity-60" />
                        <span>{committee.delegates} DELEGATES</span>
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
                      className="font-sans font-light text-[13px] leading-[1.8] mb-12 opacity-80 flex-grow"
                      style={{ color: "var(--color-fg-muted)" }}
                    >
                      <span className="font-medium text-white/50 block mb-1 uppercase text-[9px] tracking-widest">Agenda</span>
                      {committee.topic}
                    </p>

                    {/* Bottom Row */}
                    <div className="mt-auto pt-6 border-t border-white/10 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${committee.capacityRemaining <= 5 ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="font-sans text-[11px] uppercase tracking-widest font-medium opacity-80">
                          {committee.capacityRemaining} spots left
                        </span>
                      </div>
                      
                      <Link href={committee.href} className="inline-flex items-center gap-2 group/btn">
                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium opacity-60 text-[var(--color-fg-muted)] group-hover/btn:opacity-100 transition-opacity">Register</span>
                        <ArrowUpRight size={14} strokeWidth={1.5} className="text-[var(--color-primary)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </LuxuryCard>
              );
            })}
          </AnimateReveal>
        </div>
      </div>
    </AnimatePage>
  );
}
