"use client";

import { useEffect, useState } from "react";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function AutoSaveIndicator() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Subscribe to Zustand store changes
    const unsubscribe = useRegistrationStore.subscribe((state, prevState) => {
      // Don't show on step change, only on data changes
      if (
        state.personalInfo !== prevState.personalInfo ||
        state.step2Details !== prevState.step2Details ||
        state.logistics !== prevState.logistics
      ) {
        setShow(true);
        const timer = setTimeout(() => setShow(false), 2000);
        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-strong border border-[var(--color-border)] px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">Draft Saved</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
