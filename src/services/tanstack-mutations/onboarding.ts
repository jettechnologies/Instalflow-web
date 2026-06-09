import { useMutation } from "@tanstack/react-query";
import { useToastContext } from "@hooks/context";
import {
  initializeOnboardingSubscription,
  onboardCompany,
} from "@services/mutations/onboarding";
import {
  clearSession,
  writeSession,
} from "@store/session-store/onboarding-session";

export const useStartOnboarding = () => {
  const { openToast } = useToastContext();
  return useMutation({
    mutationFn: onboardCompany,
    onSuccess: (data, { companyName, email }) => {
      const message =
        data?.message || "Company workspace profile provisioned successfully";

      const intentId = data?.data?.onboardingIntent.intentId;

      writeSession({ intentId, companyName, email });
      openToast(message, "success");
    },
    meta: {
      errorMessage: "Company validation rejected corporate parameters.",
    },
  });
};

export const useInitializeSubscriptionOnboarding = () => {
  const { openToast } = useToastContext();

  return useMutation({
    mutationFn: initializeOnboardingSubscription,
    onSuccess: () => {
      clearSession();
      openToast(
        "Plan initialization successful, Redirecting to payment...",
        "success"
      );
    },
    meta: {
      errorMessage: "Gateway initialization failed.",
    },
  });
};
