"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegistrationStore } from "@/store/useRegistrationStore";

import StepProgress from "./components/StepProgress";
import Step1Personal from "./components/Step1Personal";
import GlitchHeading from "@/components/ui/GlitchHeading";
import Step2Committees from "./components/Step2Committees";
import Step3Logistics from "./components/Step3Logistics";
import Step4Checkout from "./components/Step4Checkout";
import FeeSummaryPanel from "./components/FeeSummaryPanel";
import AutoSaveIndicator from "./components/AutoSaveIndicator";

// ─── Constants ───────────────────────────────────────────────────────────────

const STEP_META = [
  { title: "Personal Information",  sub: "Your identity & contact details" },
  { title: "Committee Selection",   sub: "Choose your preferred committees" },
  { title: "Logistics & Stay",      sub: "Accommodation & transport preferences" },
  { title: "Review & Checkout",     sub: "Confirm your registration details" },
];

// Typed as a const tuple so Framer Motion accepts it as a cubic-bezier ease.
const STEP_EASE = [0.87, 0, 0.13, 1] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderStep(step: number) {
  switch (step) {
    case 1:  return <Step1Personal />;
    case 2:  return <Step2Committees />;
    case 3:  return <Step3Logistics />;
    case 4:  return <Step4Checkout />;
    default: return <Step1Personal />;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RegistrationEngine() {
  const currentStep  = useRegistrationStore((state) => state.currentStep);
  const personalInfo = useRegistrationStore((state) => state.personalInfo);

  // ── Track the previous step via a ref so we can compute slide direction
  //    without triggering an extra render cycle.
  //    (Using state here would violate react-hooks/set-state-in-effect rule.)
  const prevStepRef = useRef(currentStep);
  const isForward   = currentStep >= prevStepRef.current;
  // Update synchronously BEFORE paint — this is intentional, not a setState call.
  prevStepRef.current = currentStep;

  // ── Prevent accidental navigation mid-form ────────────────────────────────
  
  useEffect(() => {
    if (currentStep > 1 && currentStep < 4 && personalInfo) {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handler);
      return () => {
        window.removeEventListener("beforeunload", handler);
      };
    }
  }, [currentStep, personalInfo]);

  const slideVariants = {
    initial: { x: isForward ? 40 : -40, opacity: 0, filter: "blur(4px)" },
    animate: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit:    { x: isForward ? -40 : 40, opacity: 0, filter: "blur(4px)" },
  };

  const meta = STEP_META[currentStep - 1] ?? STEP_META[0];

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[calc(100dvh-80px)] relative">
      <AutoSaveIndicator />

      {/* ── Atmospheric Glow Orbs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-[15%] w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--color-primary), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[20%] w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]"
        style={{
          background: "radial-gradient(circle, var(--color-neo-cyan), transparent 70%)",
        }}
      />

      {/* ══ MAIN FORM AREA ══ */}
      <div className="flex-1 relative px-6 sm:px-10 md:px-16 lg:px-20 xl:px-28 py-12 flex flex-col max-w-4xl mx-auto lg:mx-0 lg:max-w-none">

        {/* ── Page Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-8 h-px bg-[var(--color-primary)] opacity-60" />
            <span
              className="font-sans text-[10px] uppercase tracking-[0.35em] font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              Delegate Portal
            </span>
          </div>

          <h1
            className="font-display"
            style={{
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "0.06em",
              color: "var(--color-fg)",
              textTransform: "uppercase",
              lineHeight: 1.05,
            }}
          >
            <GlitchHeading text="Registration" />
          </h1>

          {/* Animated step subtitle */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="mt-2 flex items-center gap-2"
            >
              <span className="font-sans text-sm text-[var(--color-fg-muted)]">
                {meta.sub}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Step Progress ── */}
        <StepProgress />

        {/* ── Step Content ── */}
        <div className="relative flex-1">
          <AnimatePresence mode="wait" custom={isForward}>
            <motion.div
              key={currentStep}
              custom={isForward}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: STEP_EASE }}
              className="w-full"
            >
              {/* Step Card Shell */}
              <div className="relative rounded-2xl border border-[var(--color-border)] overflow-hidden">
                {/* glass bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,11,42,0.7)] via-[rgba(15,8,32,0.5)] to-transparent backdrop-blur-xl pointer-events-none" />
                {/* top glow line */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent pointer-events-none" />

                <div className="relative z-10 p-6 sm:p-8 md:p-10">
                  {renderStep(currentStep)}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ══ LIVE FEE SUMMARY PANEL ══ */}
      <div className="lg:w-[360px] xl:w-[420px] flex-shrink-0 relative z-40 order-last">
        <div className="sticky top-0 lg:h-[calc(100dvh-80px)]">
          <FeeSummaryPanel />
        </div>
      </div>
    </div>
  );
}
