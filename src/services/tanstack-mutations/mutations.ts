import { useMutation } from "@tanstack/react-query";
import { useToastContext } from "@hooks/context";
import { apiService } from "@services/api-service";
import { QUERY_KEYS } from "../query-keys";

// Phase 1: Start company onboarding
// export const useStartOnboarding = () => {
//   const { openToast } = useToastContext();
//   return useMutation({
//     mutationFn: async (payload: any) => {
//       const response = await apiService.post<{ intentId: string }>(
//         "/auth/start-onboarding",
//         payload
//       );
//       return response.data;
//     },
//     onSuccess: () => {
//       openToast(
//         "Company workspace profile provisioned successfully",
//         "success"
//       );
//     },
//     meta: {
//       errorMessage: "Company validation rejected corporate parameters.",
//     },
//   });
// };

// // Phase 1: Initialize SaaS subscription Paystack gateway checkout
// export const useInitializeSubscriptionOnboarding = () => {
//   return useMutation({
//     mutationFn: async (payload: { intentId: string; planId: string }) => {
//       const response = await apiService.post<{ authorization_url: string }>(
//         "/subscriptions/initialize",
//         payload
//       );
//       return response.data;
//     },
//     meta: {
//       errorMessage: "Gateway initialization failed.",
//     },
//   });
// };

// Phase 2: Register consumer tied to referral marketing code
export const useRegisterConsumer = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await apiService.post<{ onboardingToken: string }>(
        "/kyc/register",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      openToast("Consumer account created successfully", "success");
    },
    meta: {
      errorMessage: "Consumer registration rejected.",
    },
  });
};

// Phase 2: Submit KYC PDF binary files
export const useSubmitKYCDocument = (token: string) => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const response = await apiService.post<any>("/kyc/submit", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      openToast("Identity document uploaded to verification vault", "success");
    },
    meta: {
      errorMessage: "Identity upload failed validation checks.",
    },
  });
};

// Phase 3: Marketer custom link configuration
export const useGenerateReferralLink = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: async (payload: { productSlug: string; variantId: string }) => {
      const response = await apiService.post<{ referralLink: string }>(
        "/kyc/referral-link",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.referralLink) {
        navigator.clipboard.writeText(data.referralLink);
        openToast("Attribution route copied to clipboard", "success");
      }
    },
    meta: {
      errorMessage: "Link configuration generator failed.",
    },
  });
};

// Phase 4: Settle installment billing term
export const useSettleInstallment = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: async (installmentId: string) => {
      const response = await apiService.post<{ authorization_url: string }>(
        `/installments/${installmentId}/pay`
      );
      return response.data;
    },
    onSuccess: (data) => {
      openToast("Repayment gateway context loaded", "success");
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      }
    },
    meta: {
      invalidatesQuery: QUERY_KEYS.installments.customer(),
      errorMessage: "Installment payment routing failed.",
    },
  });
};

// Phase 5: Maker-checker approve payout allocation
export const useCompanyApprovePayout = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiService.post(
        `/commissions/payouts/${id}/company-approve`
      );
      return response.data;
    },
    onSuccess: () => {
      openToast("Disbursement clearance verified", "success");
    },
    meta: {
      invalidatesQuery: QUERY_KEYS.commissions.pending(),
      errorMessage: "Failed to dispatch approved payout.",
    },
  });
};
