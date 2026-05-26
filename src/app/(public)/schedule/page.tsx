import { Metadata } from 'next';
import Link from 'next/link';
import GlitchHeading from '@/components/ui/GlitchHeading';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import AnimatePage from '@/components/layout/AnimatePage';
import AnimateReveal from '@/components/ui/AnimateReveal';

export const metadata: Metadata = {
  title: 'Event Schedule | SOPHEP',
  description: 'The official schedule for the SOPHEP conference.',
};

export default function SchedulePage() {
  return (
    <AnimatePage>
      <div className="min-h-screen bg-[var(--color-bg)] pt-32 pb-24">
        <div className="container-sophep">
          {/* ... existing content ... */}
          <AnimateReveal className="mb-12" staggerChildren={0.1}>
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-fg-muted)] hover:text-[var(--color-primary)] transition-colors mb-8">
              <ArrowLeft size={16} />
              <span className="font-sans text-xs uppercase tracking-widest">Return Home</span>
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">Official Agenda</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 leading-tight">
              Event <span className="text-[var(--color-primary)]"><GlitchHeading text="Schedule" /></span>
            </h1>
            <p className="font-sans text-lg text-[var(--color-fg-muted)] max-w-2xl leading-relaxed">
              A comprehensive breakdown of the three-day SOPHEP conference, featuring keynote addresses, technical sessions, and networking galas.
            </p>
          </AnimateReveal>

          <div className="space-y-16">
            {/* Day 1 */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display font-bold text-2xl uppercase tracking-widest">Day 1: Inauguration</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--color-primary)]/30 to-transparent" />
              </div>
              <div className="grid gap-6">
                <AnimateReveal className="grid gap-6" staggerChildren={0.1}>
                  {[
                    { time: '09:00 AM', title: 'Delegate Registration & Welcome Breakfast', loc: 'Main Auditorium Foyer' },
                    { time: '10:30 AM', title: 'Opening Ceremony & Secretary-General Address', loc: 'Main Auditorium' },
                    { time: '01:00 PM', title: 'Networking Lunch', loc: 'Central Courtyard' },
                    { time: '02:30 PM', title: 'Committee Session 1', loc: 'Designated Committee Rooms' },
                  ].map((event, i) => (
                    <div key={i} className="glass-overlay p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-10 hover:border-[var(--color-primary)]/50 transition-all duration-500 group">
                      <div className="flex items-center gap-2 min-w-[140px] text-[var(--color-primary)]">
                        <Clock size={16} strokeWidth={1.5} />
                        <span className="font-sans font-medium tracking-wider">{event.time}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-sans text-lg font-medium mb-1 group-hover:text-[var(--color-fg)] transition-colors">{event.title}</h3>
                        <div className="flex items-center gap-2 text-[var(--color-fg-muted)] text-sm opacity-60">
                          <MapPin size={14} strokeWidth={1.5} />
                          <span>{event.loc}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </AnimateReveal>
              </div>
            </div>

            {/* Day 2 */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display font-bold text-2xl uppercase tracking-widest">Day 2: The Deep Dive</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--color-primary)]/30 to-transparent" />
              </div>
              <div className="grid gap-6">
                <AnimateReveal className="grid gap-6" staggerChildren={0.1}>
                  {[
                    { time: '09:00 AM', title: 'Committee Session 2', loc: 'Designated Committee Rooms' },
                    { time: '01:00 PM', title: 'Lunch & Networking', loc: 'Central Courtyard' },
                    { time: '02:30 PM', title: 'Committee Session 3', loc: 'Designated Committee Rooms' },
                    { time: '06:00 PM', title: 'Social Night & Cultural Showcase', loc: 'GIKI Lawn' },
                  ].map((event, i) => (
                    <div key={i} className="glass-overlay p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-10 hover:border-[var(--color-primary)]/50 transition-all duration-500 group">
                      <div className="flex items-center gap-2 min-w-[140px] text-[var(--color-primary)]">
                        <Clock size={16} strokeWidth={1.5} />
                        <span className="font-sans font-medium tracking-wider">{event.time}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-sans text-lg font-medium mb-1 group-hover:text-[var(--color-fg)] transition-colors">{event.title}</h3>
                        <div className="flex items-center gap-2 text-[var(--color-fg-muted)] text-sm opacity-60">
                          <MapPin size={14} strokeWidth={1.5} />
                          <span>{event.loc}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </AnimateReveal>
              </div>
            </div>

            {/* Day 3 */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display font-bold text-2xl uppercase tracking-widest">Day 3: Resolutions</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--color-primary)]/30 to-transparent" />
              </div>
              <div className="grid gap-6">
                <AnimateReveal className="grid gap-6" staggerChildren={0.1}>
                  {[
                    { time: '09:00 AM', title: 'Committee Session 4', loc: 'Designated Committee Rooms' },
                    { time: '12:00 PM', title: 'Final Resolution Voting', loc: 'Designated Committee Rooms' },
                    { time: '01:30 PM', title: 'Grand Finale & Awards Ceremony', loc: 'Main Auditorium' },
                  ].map((event, i) => (
                    <div key={i} className="glass-overlay p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-10 hover:border-[var(--color-primary)]/50 transition-all duration-500 group">
                      <div className="flex items-center gap-2 min-w-[140px] text-[var(--color-primary)]">
                        <Clock size={16} strokeWidth={1.5} />
                        <span className="font-sans font-medium tracking-wider">{event.time}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-sans text-lg font-medium mb-1 group-hover:text-[var(--color-fg)] transition-colors">{event.title}</h3>
                        <div className="flex items-center gap-2 text-[var(--color-fg-muted)] text-sm opacity-60">
                          <MapPin size={14} strokeWidth={1.5} />
                          <span>{event.loc}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </AnimateReveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePage>
  );
}
