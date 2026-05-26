"use client";

import { useRegistrationStore } from "@/store/useRegistrationStore";
import { motion, AnimatePresence } from "framer-motion";

const BASE_FEE      = 3500;
const ACCO_FEE      = 2000;
const TRANSPORT_FEE = 1500;

function FeeRow({
  label,
  size,
  unit,
  total,
}: {
  label: string;
  size: number;
  unit: number;
  total: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between items-start py-3 border-b border-[var(--color-border)]"
    >
      <div>
        <div className="font-sans text-sm text-[var(--color-fg)] font-medium">
          {label}
        </div>
        <div className="font-sans text-[10px] text-[var(--color-fg-subtle)] mt-0.5 tracking-wide">
          {size} × {unit.toLocaleString()} PKR
        </div>
      </div>
      <span className="font-sans text-sm text-[var(--color-fg)] font-semibold tabular-nums">
        {total.toLocaleString()}
        <span className="text-[10px] text-[var(--color-fg-muted)] ml-1 font-normal">PKR</span>
      </span>
    </motion.div>
  );
}

export default function FeeSummaryPanel() {
  const { personalInfo, logistics, currentStep } = useRegistrationStore();

  const size           = personalInfo?.delegateType === "Delegation"
    ? (personalInfo.delegationSize || 1)
    : 1;
  const totalBase      = size * BASE_FEE;
  const totalAcco      = logistics?.needsAccommodation ? size * ACCO_FEE : 0;
  const totalTransport = logistics?.needsTransportation ? size * TRANSPORT_FEE : 0;
  const totalAmount    = totalBase + totalAcco + totalTransport;

  const progressPct = Math.round(((currentStep - 1) / 3) * 100);

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden border-l border-[var(--color-border)]"
         style={{ background: "rgba(10,4,21,0.92)", backdropFilter: "blur(32px)" }}>

      {/* Top glow accent */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
          opacity: 0.5,
        }}
      />

      {/* Top decorative orb */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--color-primary), transparent 70%)",
          filter: "blur(60px)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="flex flex-col h-full p-6 xl:p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
              Live Fee Summary
            </span>
            <span className="badge">{personalInfo?.event || "No Event"}</span>
          </div>
          <div className="h-px bg-[var(--color-border)] mt-4" />
        </div>

        {/* Fee Rows */}
        <div className="flex-1 space-y-0">
          <AnimatePresence>
            <FeeRow
              key="base"
              label="Delegate Fee"
              size={size}
              unit={BASE_FEE}
              total={totalBase}
            />
          </AnimatePresence>

          <AnimatePresence>
            {logistics?.needsAccommodation && (
              <FeeRow
                key="acco"
                label="Accommodation"
                size={size}
                unit={ACCO_FEE}
                total={totalAcco}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {logistics?.needsTransportation && (
              <FeeRow
                key="transport"
                label="Transportation"
                size={size}
                unit={TRANSPORT_FEE}
                total={totalTransport}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Progress section */}
        <div className="mt-8 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              Registration Progress
            </span>
            <span className="font-sans text-[10px] text-[var(--color-primary)]">
              {progressPct}%
            </span>
          </div>
          <div className="w-full h-1 rounded-full bg-[var(--color-border)] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-primary), #C4A5F0)",
                boxShadow: "0 0 10px var(--color-primary-glow)",
              }}
              initial={false}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: [0.87, 0, 0.13, 1] }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="font-sans text-[9px] text-[var(--color-fg-subtle)]">
              Step {currentStep} of 4
            </span>
            <span className="font-sans text-[9px] text-[var(--color-fg-subtle)]">
              {currentStep < 4 ? "Almost there!" : "Final step"}
            </span>
          </div>
        </div>

        {/* Total */}
        <div
          className="rounded-xl border border-[var(--color-border-hover)] p-5 relative overflow-hidden"
          style={{ background: "rgba(139,92,246,0.06)" }}
        >
          {/* inner glow */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, var(--color-primary), transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mb-3">
              Total Due
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={totalAmount}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex items-end gap-2"
              >
                <span
                  className="font-display font-light tabular-nums"
                  style={{
                    fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                    color: "var(--color-primary)",
                    lineHeight: 1,
                  }}
                >
                  {totalAmount.toLocaleString()}
                </span>
                <span className="font-sans text-sm text-[var(--color-fg-muted)] mb-1">
                  PKR
                </span>
              </motion.div>
            </AnimatePresence>
            <p className="font-sans text-[10px] text-[var(--color-fg-subtle)] mt-2">
              {size > 1 ? `${size} delegates · ` : ""}Inclusive of all selected add-ons
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-2 opacity-40">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            Secure · Encrypted · SOPHEP 2025
          </span>
        </div>
      </div>
    </div>
  );
}
