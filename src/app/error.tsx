'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[Error Boundary Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 text-red-500 mb-8 border border-red-500/20">
          <AlertTriangle size={36} />
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] mb-6 bg-[var(--color-nav-bg)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">Exception Caught</span>
        </div>
        
        <h1 className="font-heading text-3xl md:text-5xl uppercase tracking-wider mb-6 leading-tight">
          Service <span className="text-red-500">Interruption</span>
        </h1>
        
        <p className="font-sans text-[var(--color-fg-muted)] mb-10 leading-relaxed text-sm md:text-base">
          We encountered an unexpected issue while processing your request. 
          Please try again or return to the safety of the homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl font-sans text-xs uppercase tracking-widest hover:bg-[var(--color-primary-hover)] transition-all group shadow-lg shadow-[var(--color-primary)]/20"
          >
            <RefreshCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-nav-bg)] border border-[var(--color-border-hover)] text-[var(--color-fg)] px-8 py-4 rounded-xl font-sans text-xs uppercase tracking-widest hover:border-[var(--color-primary)] transition-all group"
          >
            <Home size={14} className="group-hover:scale-110 transition-transform" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
