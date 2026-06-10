"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, PaymentInfo } from "@/lib/validations/registration";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import { toast } from "sonner";
import { useState } from "react";
import { UploadCloud, CheckCircle2, FileText, X, Lock, ChevronRight, Download, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { submitRegistration } from "@/app/actions/registration";
import { supabase } from "@/lib/supabase";

export default function Step4Checkout() {
  const { personalInfo, step2Details, logistics, updatePayment, prevStep, resetRegistration } = useRegistrationStore();
  const router = useRouter();

  const BASE_FEE = 3500;
  const ACCO_FEE = 2000;
  const TRANSPORT_FEE = 1500;

  const size = personalInfo?.delegateType === "Delegation" ? (personalInfo.delegationSize || 1) : 1;
  const totalBase = size * BASE_FEE;
  const totalAcco = logistics?.needsAccommodation ? (size * ACCO_FEE) : 0;
  const totalTransport = logistics?.needsTransportation ? (size * TRANSPORT_FEE) : 0;
  const totalAmount = totalBase + totalAcco + totalTransport;

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loadingText, setLoadingText] = useState("ENCRYPTING DATA...");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentInfo>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "bank_transfer",
      receiptUploaded: false,
    },
  });

  const paymentMethod = watch("paymentMethod");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setValue("receiptUploaded", true, { shouldValidate: true });
    }
  };

  const removeFile = () => {
    setFile(null);
    setValue("receiptUploaded", false, { shouldValidate: true });
  };

  const onSubmit = async (data: PaymentInfo) => {
    setIsSubmitting(true);
    updatePayment(data);

    try {
      let receiptUrl: string | null = null;

      // --- Step 1: Upload receipt file directly to storage ---
      if (file) {
        setLoadingText("UPLOADING RECEIPT...");
        try {
          const initRes = await fetch("/api/upload/init", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
            }),
          });
          
          if (!initRes.ok) {
            const errorData = await initRes.json().catch(() => ({}));
            throw new Error(errorData.error || `Upload init failed with status ${initRes.status}`);
          }
          
          const uploadData = await initRes.json();
          const { error: uploadError } = await supabase.storage
            .from("receipts")
            .uploadToSignedUrl(uploadData.path, uploadData.token, file, {
              contentType: file.type,
              upsert: false,
            });

          if (uploadError) {
            throw new Error(uploadError.message);
          }

          receiptUrl = uploadData.path;
        } catch (err) {
          console.error("[Checkout] Upload Fetch Error:", err);
          throw new Error("Failed to upload receipt. Please check your connection.");
        }
      }

      // --- Step 2: Save registration & Send Email (Server Side) ---
      setLoadingText("SECURING DELEGATE PROFILE...");
      const store = useRegistrationStore.getState();
      
      const result = await submitRegistration({
        personalInfo: store.personalInfo,
        step2Details: store.step2Details,
        logistics: store.logistics,
        payment: data,
        receiptUrl,
        totalAmount,
      });

      if (!result.success) {
        throw new Error(result.error || "Registration failed on server");
      }

      setLoadingText("FINALIZING...");
      await new Promise((r) => setTimeout(r, 800));

      // Clear persisted PII from sessionStorage
      try {
        sessionStorage.removeItem('sophep-registration-storage');
      } catch { /* ignore */ }

      // IMPORTANT: setIsSuccessModalOpen BEFORE resetRegistration.
      // resetRegistration() resets the Zustand step which unmounts this
      // component — so the modal must be shown first.
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
      // resetRegistration() is called by the modal close/return buttons below

    } catch (error: unknown) {
      setIsSubmitting(false);
      setLoadingText("ENCRYPTING DATA...");
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      
      toast.error("Submission Failed", {
        description: message,
        duration: 8000,
      });
    }
  };



  return (
    <>
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-xl p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[min(92vw,42rem)] glass-strong border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 md:p-10 lg:p-14 text-center shadow-2xl relative overflow-hidden my-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="success-modal-title"
            >
              {/* Close Button */}
              <button 
                onClick={() => { 
                  try { sessionStorage.removeItem('sophep-registration-storage'); } catch { /* ignore */ }
                  resetRegistration(); 
                  router.push("/"); 
                }}
                className="absolute top-6 right-6 text-[var(--color-fg-muted)] hover:text-white transition-colors z-20"
                aria-label="Close success modal"
              >
                <X size={24} />
              </button>

              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent blur-3xl -z-10 rounded-full opacity-50" />
              
              {/* Apple Pay Checkmark */}
              <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center mb-6 sm:mb-8 relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                  className="relative flex items-center justify-center w-full h-full"
                >
                  <motion.svg viewBox="0 0 50 50" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" initial="hidden" animate="visible">
                    <circle cx="25" cy="25" r="23" fill="transparent" stroke="var(--color-primary)" strokeWidth="2" strokeOpacity="0.2" />
                    <motion.circle cx="25" cy="25" r="23" fill="transparent" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" variants={{ hidden: { pathLength: 0, rotate: -90 }, visible: { pathLength: 1, rotate: -90, transition: { duration: 0.6, ease: "easeInOut", delay: 0.2 } } }} style={{ originX: "50%", originY: "50%" }} />
                    <motion.path d="M15 25.5 L21.5 32 L36 17" fill="transparent" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 0.4, ease: "easeOut", delay: 0.6 } } }} />
                  </motion.svg>
                </motion.div>
                <motion.div className="absolute rounded-full border border-[var(--color-primary)] pointer-events-none" style={{ width: "90px", height: "90px" }} initial={{ scale: 1, opacity: 0 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }} />
              </div>
              
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-6">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)]">Secured & Verified</span>
                </div>
                <h1
                  id="success-modal-title"
                  className="font-display uppercase tracking-wider mb-5 sm:mb-6 leading-[0.92] text-[clamp(2rem,8vw,4rem)] md:text-[clamp(2.75rem,6vw,5.5rem)]"
                >
                  <span className="block text-[var(--color-fg)]">Application</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
                    Received
                  </span>
                </h1>
                <p className="font-sans text-[13px] sm:text-[14px] md:text-[15px] text-[var(--color-fg-muted)] mb-8 sm:mb-10 leading-relaxed max-w-lg mx-auto">
                  Your delegate registration has been securely encrypted and submitted to the SOPHEP council. Our administration is currently verifying your payment credentials. 
                  <br /><br />
                  An official delegate packet will be dispatched to your email within 24-48 hours.
                </p>
              </motion.div>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                <button onClick={() => { 
                  try { sessionStorage.removeItem('sophep-registration-storage'); } catch { /* ignore */ }
                  resetRegistration(); 
                  router.push("/"); 
                }} className="btn btn-primary w-full sm:w-auto px-5 sm:px-6 md:px-8">
                  Return to Portal <ChevronRight size={14} />
                </button>
                <button className="btn btn-secondary w-full sm:w-auto px-5 sm:px-6 md:px-8">
                  <Download size={14} /> Save Receipt
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {isSubmitting && !isSuccessModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center justify-center text-center px-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                className="w-24 h-24 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)] border-r-[var(--color-accent)] mb-8"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-2 text-[var(--color-primary)]"
              >
                <Lock size={16} />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-medium">Secure SSL Connection</span>
              </motion.div>
              <motion.h2 
                key={loadingText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-heading text-xl md:text-2xl uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
              >
                {loadingText}
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">
      <div>
        <h2 className="font-display text-3xl font-light mb-2">Checkout & Final Review</h2>
        <p className="font-sans text-sm text-[var(--color-fg-muted)] mb-8">
          Please review your details and confirm your payment.
        </p>
      </div>

      <div className="glass-overlay p-6 md:p-8 rounded-xl shadow-sm space-y-6">
        <div>
          <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mb-2">Applicant</div>
          <p className="font-sans text-sm">{personalInfo?.fullName} — {personalInfo?.institution}</p>
          <p className="font-sans text-sm mt-1 text-[var(--color-fg-muted)]">
            Event: {personalInfo?.event} | Type: {personalInfo?.delegateType} {personalInfo?.delegateType === "Delegation" ? `(${personalInfo.delegationSize} Persons)` : ""}
          </p>
        </div>
        
        <div>
          <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mb-3">
            {personalInfo?.event === "GMC" ? "Team Details" : "Delegate Profiles"}
          </div>
          <div className="space-y-4">
            {step2Details?.members?.map((member, index) => (
              <div key={index} className="pl-4 py-1 border-l-2 border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 rounded-r-md">
                <p className="font-sans text-sm font-medium">{member.fullName} <span className="text-[10px] text-[var(--color-fg-muted)] font-normal ml-2">({member.cnicOrPassport})</span></p>
                {!personalInfo?.event || personalInfo.event === "GIMUN" ? (
                  <p className="font-sans text-[11px] text-[var(--color-fg-muted)] mt-1">
                    Prefs: {member.preference1}, {member.preference2}, {member.preference3}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mb-2">Logistics</div>
          <p className="font-sans text-sm">
            Accommodation: {logistics?.needsAccommodation ? "Yes (3 Days, 2 Nights)" : "No"}
          </p>
          <p className="font-sans text-sm">
            Transport: {logistics?.needsTransportation ? `Yes (From ${logistics.transportationCity})` : "No"}
          </p>
        </div>

        <div className="pt-6 border-t border-[var(--color-border)] space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--color-fg-muted)]">Delegate Fee ({size} x {BASE_FEE})</span>
            <span>{totalBase} PKR</span>
          </div>
          {logistics?.needsAccommodation && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-fg-muted)]">Accommodation ({size} x {ACCO_FEE})</span>
              <span>{totalAcco} PKR</span>
            </div>
          )}
          {logistics?.needsTransportation && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--color-fg-muted)]">Transportation ({size} x {TRANSPORT_FEE})</span>
              <span>{totalTransport} PKR</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-5 border-t border-[var(--color-border)]">
            <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">Total Amount Due</div>
            <span className="font-display text-3xl font-light text-[var(--color-primary)]">{totalAmount} <span className="text-sm">PKR</span></span>
          </div>
        </div>
      </div>

      <div className="form-group pt-4">
        <label className="form-label">Payment Method</label>
        <select
          {...register("paymentMethod")}
          className="form-input form-select"
        >
          <option value="bank_transfer">Bank Transfer</option>
          <option value="easypaisa">Easypaisa / JazzCash</option>
          <option value="cash">Cash on Campus</option>
        </select>
        {errors.paymentMethod && <p className="form-error">⚠ {errors.paymentMethod.message}</p>}

        <AnimatePresence mode="wait">
          {paymentMethod === "bank_transfer" && (
            <motion.div
              key="bank"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 p-4 rounded-lg overflow-hidden"
            >
              <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">Bank Transfer Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center"><span className="text-[var(--color-fg-muted)]">Bank Name:</span> <span>Bank Alfalah</span></div>
                <div className="flex justify-between items-center"><span className="text-[var(--color-fg-muted)]">Account Title:</span> <span>SOPHEP Official</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-fg-muted)]">Account Number:</span> 
                  <div className="flex items-center gap-2">
                    <span className="font-mono">0000123456789</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        navigator.clipboard.writeText("0000123456789");
                        toast.success("Account number copied!");
                      }}
                      className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors p-1"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {paymentMethod === "easypaisa" && (
            <motion.div
              key="easypaisa"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-[#00B853]/5 border border-[#00B853]/20 p-4 rounded-lg overflow-hidden"
            >
              <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#00B853] mb-3">Easypaisa Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center"><span className="text-[var(--color-fg-muted)]">Account Title:</span> <span>SOPHEP Collection</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-fg-muted)]">Mobile Number:</span> 
                  <div className="flex items-center gap-2">
                    <span className="font-mono">0300 1234567</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        navigator.clipboard.writeText("03001234567");
                        toast.success("Mobile number copied!");
                      }}
                      className="text-[#00B853] hover:text-green-400 transition-colors p-1"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {paymentMethod === "cash" && (
            <motion.div
              key="cash"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-[var(--color-fg-muted)]/5 border border-[var(--color-border-hover)] p-4 rounded-lg overflow-hidden text-sm text-[var(--color-fg-muted)]"
            >
              Please submit cash directly to the SOPHEP registration desk on campus. You must still upload a picture of your physical receipt below once provided by the desk.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] mb-2">Upload Payment Receipt</label>
        
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center ${
            isDragging 
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10" 
              : "border-[var(--color-border-hover)] bg-[var(--surface)] hover:border-[var(--color-fg-muted)]"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              setFile(e.dataTransfer.files[0]);
              setValue("receiptUploaded", true, { shouldValidate: true });
            }
          }}
        >
          <input
            type="file"
            accept="image/*,.pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileChange}
          />
          
          {!file ? (
            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-2">
                <UploadCloud size={24} />
              </div>
              <p className="font-sans text-sm font-medium">Click or drag receipt here</p>
              <p className="font-sans text-xs text-[var(--color-fg-muted)]">PNG, JPG or PDF (max. 5MB)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none relative z-20">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
                <CheckCircle2 size={24} />
              </div>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-[var(--color-fg-muted)]" />
                <p className="font-sans text-sm font-medium truncate max-w-[200px]">{file.name}</p>
              </div>
              <button 
                type="button" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFile(); }}
                className="mt-2 text-xs text-red-400 hover:text-red-300 pointer-events-auto"
              >
                Remove File
              </button>
            </div>
          )}
        </div>
        {errors.receiptUploaded && <p className="form-error">⚠ {errors.receiptUploaded.message}</p>}
        
        <p className="font-sans text-xs text-[var(--color-fg-muted)] px-1">
          Supported formats: PNG, JPG, PDF (max 5MB). Your receipt will be reviewed by the admin team.
        </p>
      </div>

      <div className="flex justify-between pt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="btn btn-secondary"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          <span className="flex items-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Registration"
            )}
          </span>
        </button>
      </div>

    </form>
    </>
  );
}
