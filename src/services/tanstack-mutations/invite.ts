import { useMutation } from "@tanstack/react-query";
import { useToastContext } from "@hooks/context";
import type {
  RegisterPayload,
  RegisterResponse,
  KycSubmitPayload,
  KycSubmitResponse,
} from "@utils/types/invite";
import {
  registerReferral,
  submitApplication,
} from "@services/mutations/invite";

export const useInviteRegistration = () => {
  const { openToast } = useToastContext();

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (payload) => registerReferral(payload),
    onSuccess: () => {
      openToast("Account created successfully", "success");
    },
    onError: (error) => {
      openToast(error.message || "Registration failed", "error");
    },
  });
};

export const useSubmitApplication = (onboardingToken: string) => {
  const { openToast } = useToastContext();

  return useMutation<KycSubmitResponse, Error, KycSubmitPayload>({
    mutationFn: (payload) => submitApplication(onboardingToken, payload),
    onSuccess: (data) => {
      openToast(data.message || "Application submitted for review", "success");
    },
    onError: (error) => {
      openToast(
        error.message || "Submission failed validation checks",
        "error"
      );
    },
  });
};
