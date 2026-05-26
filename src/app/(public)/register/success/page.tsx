"use client";

import Link from "next/link";
import { ChevronRight, Download } from "lucide-react";
import GlitchHeading from "@/components/ui/GlitchHeading";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-4 overflow-hidden">
      <AnimatedBackground />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent blur-3xl -z-10 rounded-full opacity-50" />
        
        <div className="bg-[var(--color-bg)]/80 border border-[var(--color-border-hover)] rounded-xl p-10 md:p-16 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          <div className="mx-auto w-28 h-28 flex items-center justify-center mb-8 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
              className="relative flex items-center justify-center w-full h-full"
            >
              <motion.svg
                viewBox="0 0 50 50"
                className="w-24 h-24"
                initial="hidden"
                animate="visible"
              >
                {/* Background Track Circle */}
                <circle
                  cx="25"
                  cy="25"
                  r="23"
                  fill="transparent"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  strokeOpacity="0.2"
                />
                {/* Animated Circle Drawing */}
                <motion.circle
                  cx="25"
                  cy="25"
                  r="23"
                  fill="transparent"
                  stroke="var(--color-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  variants={{
                    hidden: { pathLength: 0, rotate: -90 },
                    visible: {
                      pathLength: 1,
                      rotate: -90,
                      transition: { duration: 0.6, ease: "easeInOut", delay: 0.2 }
                    }
                  }}
                  style={{ originX: "50%", originY: "50%" }}
                />
                {/* Animated Checkmark Drawing */}
                <motion.path
                  d="M15 25.5 L21.5 32 L36 17"
                  fill="transparent"
                  stroke="var(--color-primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={{
                    hidden: { pathLength: 0 },
                    visible: {
                      pathLength: 1,
                      transition: { duration: 0.4, ease: "easeOut", delay: 0.6 }
                    }
                  }}
                />
              </motion.svg>
            </motion.div>

            {/* Ripple Pop Effect */}
            <motion.div
              className="absolute rounded-full border border-[var(--color-primary)] pointer-events-none"
              style={{ width: "90px", height: "90px" }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">Secured & Verified</span>
            </div>

            <h1 className="font-heading text-3xl md:text-5xl uppercase tracking-wider mb-6 leading-tight">
              Application <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"><GlitchHeading text="Received" /></span>
            </h1>
            
            <p className="font-sans text-[15px] text-[var(--color-fg-muted)] mb-10 leading-relaxed max-w-lg mx-auto">
              Your delegate registration has been securely encrypted and submitted to the SOPHEP council. Our administration is currently verifying your payment credentials. 
              <br /><br />
              An official delegate packet will be dispatched to your email within 24-48 hours.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/"
              className="group relative font-sans text-[11px] uppercase tracking-[0.25em] font-medium px-8 py-4 transition-all duration-300 w-full sm:w-auto"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-bg)",
                borderRadius: "8px",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Return to Portal
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <button 
              className="group relative font-sans text-[11px] uppercase tracking-[0.25em] font-medium px-8 py-4 transition-all duration-300 w-full sm:w-auto"
              style={{
                color: "var(--color-fg-muted)",
                border: "1px solid var(--color-border-hover)",
                borderRadius: "8px",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-[var(--color-primary)] transition-colors">
                <Download size={14} />
                Save Receipt
              </span>
            </button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
