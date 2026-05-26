"use client";

import { useForm, useFieldArray, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, Step2Details } from "@/lib/validations/registration";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";

const COMMITTEES = [
  "UNSC (United Nations Security Council)",
  "DISEC (Disarmament and International Security)",
  "UNHRC (Human Rights Council)",
  "PNA (Pakistan National Assembly)",
  "Crisis Cabinet",
  "OIC (Organization of Islamic Cooperation)"
];



export default function Step2Committees() {
  const { personalInfo, step2Details, updateStep2Details, nextStep, prevStep } = useRegistrationStore();
  const isGMC = personalInfo?.event === "GMC";
  const size = personalInfo?.delegateType === "Delegation" ? (personalInfo.delegationSize || 1) : 1;

  // Initialize members based on size
  const defaultMembers = Array.from({ length: size }).map((_, i) => ({
    fullName: i === 0 ? (personalInfo?.fullName || "") : "",
    email: i === 0 ? (personalInfo?.email || "") : "",
    phone: i === 0 ? (personalInfo?.phone || "") : "",
    cnicOrPassport: i === 0 ? (personalInfo?.cnicOrPassport || "") : "",
    preference1: "",
    preference2: "",
    preference3: "",
  }));

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step2Details>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: step2Details || {
      members: defaultMembers,
    },
  });

  const watchedMembers = watch("members");

  const { fields } = useFieldArray({
    control,
    name: "members",
  });

  const onSubmit = (data: Step2Details) => {
    updateStep2Details(data);
    toast.success("Delegate profiles saved successfully.");
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
      <div>
        <h2 className="font-display text-3xl font-light mb-2">
          {isGMC ? "Team Member Details" : "Delegate Details & Preferences"}
        </h2>
        <p className="font-sans text-sm text-[var(--color-fg-muted)] mb-8">
          {isGMC 
            ? "Please provide information for each member of your Moot Cup team."
            : "Please provide the information and unique committee preferences for each delegate."}
        </p>
      </div>
      </div>

      <div className="space-y-12">
        {fields.map((field, index) => (
          <div key={field.id} className="glass-overlay p-6 md:p-8 rounded-xl relative shadow-sm">
            <div className="absolute -top-3 left-6 badge bg-[var(--color-bg-raised)] shadow-sm">
              {isGMC ? `Team Member ${index + 1}` : `Delegate ${index + 1}`}
              {index === 0 ? " (Primary)" : ""}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  {...register(`members.${index}.fullName`)}
                  className="form-input"
                  placeholder="John Doe"
                />
                {errors.members?.[index]?.fullName && <p className="form-error">{errors.members[index]?.fullName?.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email"
                  {...register(`members.${index}.email`)}
                  className="form-input"
                  placeholder="john@example.com"
                />
                {errors.members?.[index]?.email && <p className="form-error">{errors.members[index]?.email?.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  {...register(`members.${index}.phone`)}
                  className="form-input"
                  placeholder="+92 300 0000000"
                />
                {errors.members?.[index]?.phone && <p className="form-error">{errors.members[index]?.phone?.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">CNIC / Passport</label>
                <input 
                  {...register(`members.${index}.cnicOrPassport`)}
                  className="form-input"
                  placeholder="00000-0000000-0"
                />
                {errors.members?.[index]?.cnicOrPassport && <p className="form-error">{errors.members[index]?.cnicOrPassport?.message}</p>}
              </div>
            </div>

            {!isGMC && (() => {
              const currentMember = watchedMembers?.[index];
              const prefs = [
                currentMember?.preference1,
                currentMember?.preference2,
                currentMember?.preference3
              ].filter(Boolean);
              
              const uniquePrefs = new Set(prefs);
              const hasConflict = prefs.length > 0 && uniquePrefs.size !== prefs.length;

              return (
                <div className="mt-8 pt-6 border-t border-[var(--color-border)] space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="font-sans text-sm font-medium">Committee Preferences</div>
                    {hasConflict && (
                      <span className="badge badge-error">
                        Conflict Detected
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((prefNum) => (
                      <div key={prefNum} className="form-group">
                        <label className="form-label">Pref {prefNum}</label>
                        <select
                          {...register(`members.${index}.preference${prefNum}` as Parameters<typeof register>[0])}
                          className={`form-input form-select ${hasConflict ? 'border-red-500/50' : ''}`}
                        >
                          <option value="" disabled>Select...</option>
                          {COMMITTEES.map((com) => (
                            <option key={com} value={com}>
                              {com}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  
                  {hasConflict && (
                    <p className="form-error">
                      ⚠ Please select 3 unique committee preferences. Duplicate selections are not allowed.
                    </p>
                  )}
                  
                  {(errors.members?.[index]?.root?.message || errors.members?.[index]?.preference3?.message) && !hasConflict && (
                    <p className="form-error">
                      ⚠ {errors.members?.[index]?.root?.message || errors.members?.[index]?.preference3?.message}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        ))}
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
