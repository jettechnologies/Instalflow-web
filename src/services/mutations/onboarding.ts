import { apiService, type StandardResponse } from "@services/api-service";

export interface CompanyOnboardingParams {
  companyName: string;
  adminName: string;
  email: string;
  password: string;
  planId?: string;
}

export interface SubscriptionInitPayload {
  intentId: string;
  planId: string;
}

export interface PaystackGatewayResponse {
  authorization_url: string;
  reference: string;
}

export const onboardCompany = async (
  data: CompanyOnboardingParams
): Promise<StandardResponse<{ intentId: string }>> => {
  return apiService.post<{ intentId: string }>("/auth/start-onboarding", data);
};

export const initializeOnboardingSubscription = async (
  data: SubscriptionInitPayload
): Promise<StandardResponse<PaystackGatewayResponse>> => {
  return apiService.post<PaystackGatewayResponse>(
    "/subscriptions/onboarding/initialize",
    data
  );
};

export const initializeSubscription = async (
  data: SubscriptionInitPayload
): Promise<StandardResponse<PaystackGatewayResponse>> => {
  return apiService.post<PaystackGatewayResponse>(
    "/subscriptions/initialize",
    data
  );
};
