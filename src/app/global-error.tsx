'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AlertCircle } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[var(--color-bg)] text-[var(--color-fg)] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#1a0e2e] border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <AlertCircle size={32} />
          </div>
          
          <h1 className="font-heading text-2xl uppercase tracking-wider mb-2">System Error</h1>
          <p className="text-[var(--color-fg-muted)] mb-8 font-sans text-sm">
            A critical system error occurred. Our engineers have been notified.
            {error.digest && <span className="block mt-2 text-xs opacity-50">Ref: {error.digest}</span>}
          </p>
          
          <button
            onClick={() => reset()}
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg font-sans text-xs uppercase tracking-widest hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Attempt Recovery
          </button>
        </div>
      </body>
    </html>
  );
}
