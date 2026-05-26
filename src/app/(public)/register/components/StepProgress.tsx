"use client";

import { useRegistrationStore } from "@/store/useRegistrationStore";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const STEPS = [
  { label: "Personal Data",  icon: "01" },
  { label: "Committees",     icon: "02" },
  { label: "Logistics",      icon: "03" },
  { label: "Checkout",       icon: "04" },
];

export default function StepProgress() {
  const currentStep = useRegistrationStore((state) => state.currentStep);
  const event       = useRegistrationStore((state) => state.personalInfo?.event);

  const steps = STEPS.map((s, i) =>
    i === 1 && event === "GMC" ? { ...s, label: "Team Details" } : s
  );

  return (
    <div className="w-full mb-14">
      {/* ---- Progress Track ---- */}
      <div className="flex items-start w-full">
        {steps.map((step, index) => {
          const stepNum  = index + 1;
          const isActive = stepNum === currentStep;
          const isDone   = stepNum < currentStep;
          const isLast   = index === steps.length - 1;

          return (
            <div key={step.label} className={`step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
              {/* Circle + Label column */}
              <div className="step-inner">
                {/* Circle */}
                <motion.div
                  className="step-circle"
                  initial={false}
                  animate={
                    isDone
                      ? { scale: 1, opacity: 1 }
                      : isActive
                      ? { scale: 1.08, opacity: 1 }
                      : { scale: 1, opacity: 0.6 }
                  }
                  transition={{ duration: 0.35, ease: [0.87, 0, 0.13, 1] }}
                >
                  <AnimatePresence mode="wait">
                    {isDone ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="num"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {stepNum}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Label */}
                <motion.div
                  className="step-label hidden sm:block"
                  animate={{ opacity: isActive ? 1 : isDone ? 0.7 : 0.4 }}
                  transition={{ duration: 0.3 }}
                >
                  {step.label}
                </motion.div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="step-line">
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "var(--color-primary)",
                      borderRadius: "inherit",
                      originX: 0,
                    }}
                    initial={false}
                    animate={{ scaleX: isDone ? 1 : 0 }}
                    transition={{ duration: 0.55, ease: [0.87, 0, 0.13, 1] }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---- Overall Progress Bar ---- */}
      <div className="mt-6 w-full h-px bg-[var(--color-border)] relative overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-primary) 0%, #C4A5F0 100%)",
            boxShadow: "0 0 12px var(--color-primary-glow)",
          }}
          initial={false}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
        />
      </div>

      {/* ---- Step counter chip ---- */}
      <div className="flex justify-between items-center mt-3">
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          Step {currentStep} of {steps.length}
        </span>
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">
          {Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}% Complete
        </span>
      </div>
    </div>
  );
}
