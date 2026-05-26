import { z } from "zod";

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  event: z.enum(["GIMUN", "GMC"], { message: "Please select an event" }),
  delegateType: z.enum(["Single", "Delegation"]),
  delegationSize: z.number().min(1, "Must be at least 1").max(50, "Max 50 delegates allowed").optional(),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  cnicOrPassport: z.string().min(5, "CNIC/Passport must be at least 5 characters").max(20),
  institution: z.string().min(2, "Institution name must be at least 2 characters").max(150),
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

// Step 2: Team/Delegation Details & Preferences
export const step2Schema = z.object({
  members: z.array(
    z.object({
      fullName: z.string().min(2, "Name required"),
      email: z.string().email("Valid email required"),
      phone: z.string().min(10, "Phone required"),
      cnicOrPassport: z.string().min(5, "CNIC/Passport required"),
      preference1: z.string().optional(),
      preference2: z.string().optional(),
      preference3: z.string().optional(),
    }).refine((data) => {
      if (data.preference1 || data.preference2 || data.preference3) {
        const prefs = [data.preference1, data.preference2, data.preference3].filter(Boolean);
        const uniquePrefs = new Set(prefs);
        return uniquePrefs.size === 3 && prefs.length === 3;
      }
      return true;
    }, { message: "Must select 3 unique preferences", path: ["preference3"] })
  ),
});

export type Step2Details = z.infer<typeof step2Schema>;

// Step 3: Logistics & Accommodation
export const logisticsSchema = z.object({
  needsAccommodation: z.boolean(),
  needsTransportation: z.boolean(),
  transportationCity: z.string().optional(),
});

export type Logistics = z.infer<typeof logisticsSchema>;

// Step 4: Checkout & Payment (Frontend Only representation for now)
export const paymentSchema = z.object({
  paymentMethod: z.enum(["bank_transfer", "easypaisa", "cash"]),
  // In a real scenario, this would be a File object. For Zod frontend validation, we'll just check if a file was selected.
  receiptUploaded: z.boolean().refine((val) => val === true, {
    message: "Please upload your payment receipt to complete registration.",
  }),
});

export type PaymentInfo = z.infer<typeof paymentSchema>;
