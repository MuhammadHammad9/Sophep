"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, PersonalInfo } from "@/lib/validations/registration";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

// ─── Sub-components (defined at module scope) ────────────────────────────────
// React requires component definitions to be stable between renders.
// Declaring them inside another component causes unmount/remount on every render.

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)]">
        {children}
      </span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Step1Personal() {
  const { personalInfo, updatePersonalInfo, nextStep } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo || {
      fullName: "",
      email: "",
      phone: "",
      cnicOrPassport: "",
      institution: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  });

  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    toast.success("Personal details saved.");
    nextStep();
  };

  const currentEvent  = useWatch({ control, name: "event" });
  const delegateType  = useWatch({ control, name: "delegateType" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* ── Step heading ── */}
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-light mb-1">
          Personal Information
        </h2>
        <p className="font-sans text-sm text-[var(--color-fg-muted)]">
          Please provide your exact details as they appear on official documents.
        </p>
      </div>

      {/* ── Section 1: Event & Participation ── */}
      <div>
        <SectionLabel>Event Selection</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {(["GIMUN", "GMC"] as const).map((ev) => (
            <label
              key={ev}
              className={`flex items-center gap-3 cursor-pointer rounded-xl p-5 transition-all duration-300 border ${
                currentEvent === ev
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/8 shadow-[0_0_20px_var(--color-primary-glow)]"
                  : "border-[var(--color-border-hover)] bg-[rgba(20,11,42,0.4)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              <input
                type="radio"
                value={ev}
                {...register("event")}
                className="hidden"
              />
              {/* Radio dot */}
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  currentEvent === ev
                    ? "border-[var(--color-primary)]"
                    : "border-[var(--color-fg-subtle)]"
                }`}
              >
                {currentEvent === ev && (
                  <motion.div
                    layoutId="event-dot"
                    className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
                  />
                )}
              </div>
              <div>
                <div className="font-sans text-sm font-semibold text-[var(--color-fg)]">
                  {ev === "GIMUN" ? "GIMUN" : "GMC"}
                </div>
                <div className="font-sans text-[11px] text-[var(--color-fg-muted)]">
                  {ev === "GIMUN" ? "Model United Nations" : "GIKI Moot Cup"}
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.event && <p className="form-error">⚠ {errors.event.message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Participation Type</label>
            <select {...register("delegateType")} className="form-input form-select">
              <option value="Single">Single Delegate</option>
              <option value="Delegation">
                {currentEvent === "GMC" ? "Team" : "Delegation"}
              </option>
            </select>
            {errors.delegateType && (
              <p className="form-error">⚠ {errors.delegateType.message}</p>
            )}
          </div>

          {delegateType === "Delegation" && (
            <div className="form-group">
              <label className="form-label">
                {currentEvent === "GMC"
                  ? "Number of Team Members"
                  : "Number of Delegates"}
              </label>
              <input
                type="number"
                {...register("delegationSize", { valueAsNumber: true })}
                className="form-input"
                placeholder="e.g. 5"
                min={1}
              />
              {errors.delegationSize && (
                <p className="form-error">{errors.delegationSize.message}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 2: Personal Details ── */}
      <div>
        <SectionLabel>Personal Details</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              {...register("fullName")}
              className="form-input"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="form-error">⚠ {errors.fullName.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              {...register("email")}
              type="email"
              className="form-input"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="form-error">⚠ {errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              {...register("phone")}
              className="form-input"
              placeholder="+92 300 0000000"
            />
            {errors.phone && (
              <p className="form-error">⚠ {errors.phone.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">CNIC / Passport</label>
            <input
              {...register("cnicOrPassport")}
              className="form-input"
              placeholder="00000-0000000-0"
            />
            {errors.cnicOrPassport && (
              <p className="form-error">⚠ {errors.cnicOrPassport.message}</p>
            )}
          </div>

          <div className="form-group md:col-span-2">
            <label className="form-label">Institution / University</label>
            <input
              {...register("institution")}
              className="form-input"
              placeholder="GIKI University"
            />
            {errors.institution && (
              <p className="form-error">⚠ {errors.institution.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 3: Emergency Contact ── */}
      <div>
        <SectionLabel>Emergency Contact</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">Contact Name</label>
            <input
              {...register("emergencyContactName")}
              className="form-input"
              placeholder="Jane Doe"
            />
            {errors.emergencyContactName && (
              <p className="form-error">
                ⚠ {errors.emergencyContactName.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              {...register("emergencyContactPhone")}
              className="form-input"
              placeholder="+92 300 0000000"
            />
            {errors.emergencyContactPhone && (
              <p className="form-error">
                ⚠ {errors.emergencyContactPhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex justify-end pt-2">
        <button type="submit" className="btn btn-primary group">
          Continue
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </form>
  );
}
