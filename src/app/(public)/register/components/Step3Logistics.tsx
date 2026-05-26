"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logisticsSchema, Logistics } from "@/lib/validations/registration";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Step3Logistics() {
  const { logistics, updateLogistics, nextStep, prevStep } = useRegistrationStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Logistics>({
    resolver: zodResolver(logisticsSchema),
    defaultValues: logistics || {
      needsAccommodation: false,
      needsTransportation: false,
      transportationCity: "",
    },
  });

  const needsAcc = useWatch({ control, name: "needsAccommodation" });
  const needsTrans = useWatch({ control, name: "needsTransportation" });
  const transportationCity = useWatch({ control, name: "transportationCity" });

  useEffect(() => {
    updateLogistics({
      needsAccommodation: needsAcc,
      needsTransportation: needsTrans,
      transportationCity: transportationCity || "",
    });
  }, [needsAcc, needsTrans, transportationCity, updateLogistics]);

  const onSubmit = (data: Logistics) => {
    if (!data.needsTransportation) data.transportationCity = "";
    updateLogistics(data);
    toast.success("Logistics preferences saved.");
    nextStep();
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-light mb-2">Logistics & Accommodation</h2>
        <p className="font-sans text-sm text-[var(--color-fg-muted)] mb-8">
          Configure your stay at GIKI. Accommodation on campus is limited and provided on a first-come, first-serve basis.
        </p>
      </div>

      <div className="space-y-8">
        {/* Accommodation Toggle */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 rounded-xl border transition-all duration-500 ${needsAcc ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5" : "border-[var(--color-border)] bg-black/20 hover:border-[var(--color-border-hover)]"}`}>
          <div className="mb-4 sm:mb-0 pr-4">
            <div className="font-sans text-base font-medium" style={{ color: "var(--color-fg)" }}>On-Campus Accommodation</div>
            <p className="font-sans text-sm text-[var(--color-fg-muted)] mt-1">Do you require a hostel room during the event?</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 group">
            <input type="checkbox" {...register("needsAccommodation")} className="sr-only peer" />
            <div className="w-12 h-6.5 bg-[var(--color-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-[var(--color-primary)]"></div>
          </label>
        </div>

        {needsAcc && (
          <div className="p-4 border border-[var(--color-primary)]/20 rounded-lg bg-[var(--color-primary)]/5">
            <p className="font-sans text-xs text-[var(--color-primary)] flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              Accommodation covers the entire duration of the event (3 Days, 2 Nights).
            </p>
          </div>
        )}

        {/* Transportation Toggle */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 rounded-xl border transition-all duration-500 ${needsTrans ? "border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5" : "border-[var(--color-border)] bg-black/20 hover:border-[var(--color-border-hover)]"}`}>
          <div className="mb-4 sm:mb-0 pr-4">
            <div className="font-sans text-base font-medium" style={{ color: "var(--color-fg)" }}>University Transportation</div>
            <p className="font-sans text-sm text-[var(--color-fg-muted)] mt-1">Do you need shuttle service from your city?</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 group">
            <input type="checkbox" {...register("needsTransportation")} className="sr-only peer" />
            <div className="w-12 h-6.5 bg-[var(--color-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-[var(--color-primary)]"></div>
          </label>
        </div>

        {needsTrans && (
          <div className="form-group glass-overlay p-6 md:p-8 rounded-xl">
            <label className="form-label">
              From Where? (City)
            </label>
            <select
              {...register("transportationCity")}
              className="form-input form-select"
            >
              <option value="" disabled>Select a city...</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Rawalpindi">Rawalpindi</option>
              <option value="Peshawar">Peshawar</option>
              <option value="Lahore">Lahore</option>
              <option value="Other">Other</option>
            </select>
            {errors.transportationCity && <p className="form-error">⚠ {errors.transportationCity.message}</p>}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-8">
        <button
          type="button"
          onClick={prevStep}
          className="btn btn-secondary group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>

        <button
          type="submit"
          className="btn btn-primary group"
        >
          Continue
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
