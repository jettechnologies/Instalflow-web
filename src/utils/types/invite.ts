import type { Variant, InstallmentPlan } from "@utils/types/response-type";

export type IdType = "NIN" | "BVN" | "PASSPORT";

export type InviteStep = 1 | 2 | 3;

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  referredByCode: string;
}

export interface RegisterResponse {
  success: boolean;
  onboardingToken: string;
  message: string;
}

export interface KycSubmitPayload {
  productId: string;
  variantId: string;
  installmentPlanId: string;
  idType: IdType;
  idNumber: string;
  bankStatement: File;
}

export interface KycSubmitResponse {
  success: boolean;
  applicationId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
}

export interface InviteProductQuery {
  product?: string | null;
}

export interface ResolvedVariant extends Variant {
  label: string;
  price: number;
}

export interface ResolvedPlan extends InstallmentPlan {
  label: string;
}
