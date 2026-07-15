import { apiService, type StandardResponse } from "@services/api-service";

export interface KYCRegisterParams {
  name: string;
  email: string;
  password: string;
  referredByCode: string;
}

export interface KYCSubmitParams {
  productId: string;
  variantId: string;
  installmentPlanId: string;
  idType: "BVN" | "NIN" | "PASSPORT";
  idNumber: string;
  bankStatement: File;
}

export interface KYCSubmissionResponse {
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface ReferralLinkParams {
  productSlug: string;
  variantId?: string;
  planId?: string;
}

export const registerConsumer = async (
  data: KYCRegisterParams
): Promise<StandardResponse<{ onboardingToken: string }>> => {
  return apiService.post<{ onboardingToken: string }>("/kyc/register", data);
};

export const submitKYCDocument = async (
  onboardingToken: string,
  params: KYCSubmitParams
): Promise<StandardResponse<KYCSubmissionResponse>> => {
  const form = new FormData();
  form.append("productId", params.productId);
  form.append("variantId", params.variantId);
  form.append("installmentPlanId", params.installmentPlanId);
  form.append("idType", params.idType);
  form.append("idNumber", params.idNumber);
  form.append("bankStatement", params.bankStatement);

  return apiService.post<KYCSubmissionResponse>("/kyc/submit", form, {
    headers: { Authorization: `Bearer ${onboardingToken}` },
  });
};

export const generateReferralLink = async (
  data: ReferralLinkParams
): Promise<
  StandardResponse<{ referralLink: string; referralCode: string }>
> => {
  return apiService.post<{ referralLink: string; referralCode: string }>(
    "/kyc/referral-link",
    data
  );
};
