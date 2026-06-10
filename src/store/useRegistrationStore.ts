import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PersonalInfo, Step2Details, Logistics, PaymentInfo } from '@/lib/validations/registration';

interface RegistrationState {
  currentStep: number;
  personalInfo: PersonalInfo | null;
  step2Details: Step2Details | null;
  logistics: Logistics | null;
  payment: PaymentInfo | null;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updatePersonalInfo: (data: PersonalInfo) => void;
  updateStep2Details: (data: Step2Details) => void;
  updateLogistics: (data: Logistics) => void;
  updatePayment: (data: PaymentInfo) => void;
  resetRegistration: () => void;
}

const initialState = {
  currentStep: 1,
  personalInfo: null,
  step2Details: null,
  logistics: null,
  payment: null,
};

// Security: Only persist currentStep to avoid storing PII in client-side storage.
// Sensitive data (personalInfo, step2Details, logistics, payment) remains in memory only.
export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
      
      updatePersonalInfo: (data) => set({ personalInfo: data }),
      updateStep2Details: (data) => set({ step2Details: data }),
      updateLogistics: (data) => set({ logistics: data }),
      updatePayment: (data) => set({ payment: data }),
      
      resetRegistration: () => set(initialState),
    }),
    {
      name: 'sophep-registration-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ currentStep: state.currentStep }), // Only persist currentStep
    }
  )
);
