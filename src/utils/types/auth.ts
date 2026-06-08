export const ONBOARDING_VIEWS = [
  "onboarding-step1",
  "onboarding-step2",
  "login",
] as const;

export const RESET_PASSWORD_VIEWS = ["view_otp", "reset_password"] as const;

export type OnboardingView = (typeof ONBOARDING_VIEWS)[number];

export interface OnboardingIntentData {
  intentId: string;
  email: string;
  companyName: string;
  adminName: string;
  planId: string;
  status: "PENDING" | "PAID" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export type BillingCycle = "WEEKLY" | "MONTHLY" | "YEARLY";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  discountPrice?: number;
  currency: string;
  billingCycle: BillingCycle;
  features: string[];
  isPopular?: boolean;
}
