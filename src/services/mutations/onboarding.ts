import { apiService, type StandardResponse } from "@services/api-service";
import type { OnboardingIntentData } from "@utils/types";

export interface CompanyOnboardingParams {
  companyName: string;
  adminName: string;
  email: string;
  password: string;
  planId?: string;
}

export interface SubscriptionInitPayload {
  intentId: string;
}

export interface PaystackGatewayResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export const onboardCompany = async (
  data: CompanyOnboardingParams
): Promise<StandardResponse<{ onboardingIntent: OnboardingIntentData }>> => {
  return apiService.post<{ onboardingIntent: OnboardingIntentData }>(
    "/auth/start-onboarding",
    data
  );
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
